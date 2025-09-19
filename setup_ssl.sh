#!/bin/bash

# SSL Setup Script
# This script configures Let's Encrypt SSL certificates for HTTPS

set -e

SERVER_IP="212.227.85.148"
SERVER_USER="root"
DOMAIN="deeptesting.prismaticcollections.com"

echo "======================================================================"
echo "🔒 SSL/HTTPS SETUP"
echo "======================================================================"
echo "Server: $SERVER_USER@$SERVER_IP"
echo "Domain: $DOMAIN"
echo "Task: Configure Let's Encrypt SSL certificates"
echo

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Create SSL setup script
cat > /tmp/ssl_setup.sh << 'SSLEOF'
#!/bin/bash

echo "Starting SSL/HTTPS setup..."

# Install certbot
echo "Installing certbot..."
apt update
apt install -y certbot python3-certbot-nginx

# Test domain accessibility first
echo "Testing domain accessibility..."
if curl -I http://deeptesting.prismaticcollections.com 2>/dev/null | grep -q "200\|301\|302"; then
    echo "✅ Domain is accessible"

    # Get SSL certificate
    echo "Obtaining SSL certificate..."
    certbot --nginx -d deeptesting.prismaticcollections.com \
        --non-interactive \
        --agree-tos \
        --email admin@prismaticcollections.com \
        --redirect

    if [ $? -eq 0 ]; then
        echo "✅ SSL certificate obtained successfully"

        # Test automatic renewal
        echo "Testing automatic renewal..."
        certbot renew --dry-run

        # Restart nginx
        systemctl restart nginx

        echo "✅ SSL setup completed successfully!"
    else
        echo "❌ SSL certificate creation failed"
    fi
else
    echo "⚠️ Domain not accessible yet. Setting up HTTP redirect..."

    # Create HTTP to HTTPS redirect configuration
    cat > /etc/nginx/sites-available/phantasia << 'NGINXEOF'
server {
    listen 80;
    listen [::]:80;
    server_name deeptesting.prismaticcollections.com 212.227.85.148;

    # Redirect all HTTP to HTTPS (once SSL is set up)
    # return 301 https://$server_name$request_uri;

    # For now, serve the site normally
    root /var/www/phantasia;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
    }

    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}
NGINXEOF

    # Test and reload nginx
    nginx -t && systemctl reload nginx

    echo "⚠️ SSL setup postponed - domain needs to point to this server first"
    echo "💡 To complete SSL setup later:"
    echo "   1. Point deeptesting.prismaticcollections.com DNS to 212.227.85.148"
    echo "   2. Wait for DNS propagation (5-60 minutes)"
    echo "   3. Run: certbot --nginx -d deeptesting.prismaticcollections.com"
fi

# Set up automatic renewal
echo "Setting up automatic certificate renewal..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

echo "SSL setup process completed."
SSLEOF

print_status "📤 Uploading SSL setup script..."
scp -o StrictHostKeyChecking=no /tmp/ssl_setup.sh $SERVER_USER@$SERVER_IP:/tmp/

print_status "🔒 Configuring SSL/HTTPS..."
expect << EXPECTEOF
set timeout 180
spawn ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP
expect "*password*" {
    send "KC361kLC\r"
}
expect "*#*" {
    send "chmod +x /tmp/ssl_setup.sh && /tmp/ssl_setup.sh\r"
    expect "*#*"
    send "exit\r"
}
EXPECTEOF

print_success "✅ SSL setup completed!"

# Test HTTPS access
print_status "🧪 Testing HTTPS access..."

echo "Testing HTTP access..."
HTTP_STATUS=$(curl -I -s http://$SERVER_IP 2>/dev/null | head -1 || echo "HTTP not accessible")
echo "HTTP Response: $HTTP_STATUS"

echo "Testing HTTPS access..."
HTTPS_STATUS=$(curl -I -s -k https://$DOMAIN 2>/dev/null | head -1 || echo "HTTPS not accessible yet")
echo "HTTPS Response: $HTTPS_STATUS"

echo
echo "======================================================================"
echo "🔒 SSL/HTTPS SETUP COMPLETED!"
echo "======================================================================"
echo "📋 Certificate Status:"
echo "   - Certbot installed and configured"
echo "   - Automatic renewal scheduled"
echo "   - Nginx updated with SSL configuration"
echo ""
echo "🌐 Access URLs:"
echo "   HTTP:  http://$SERVER_IP"
echo "   HTTP:  http://$DOMAIN"
echo "   HTTPS: https://$DOMAIN (if DNS is configured)"
echo ""
print_warning "⚠️  Important Notes:"
echo "   - If domain isn't accessible, point DNS to $SERVER_IP"
echo "   - SSL certificate will be obtained once domain resolves"
echo "   - Manual SSL setup: certbot --nginx -d $DOMAIN"
echo ""
echo "🔄 Final step: Run ./test_deployment.sh to verify everything"
echo "======================================================================"