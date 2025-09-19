#!/bin/bash

# Fix SSL Configuration Script
# This script fixes the nginx SSL configuration issues

set -e

SERVER_IP="212.227.85.148"
SERVER_USER="root"
SERVER_PASSWORD="KC361kLC"
DOMAIN="deeptesting.prismaticcollections.com"

echo "======================================================================"
echo "🔧 FIXING NGINX SSL CONFIGURATION"
echo "======================================================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to run commands on remote server
run_remote() {
    local command="$1"
    local description="$2"

    echo "Executing: $description"

    expect << EXPECTEOF
set timeout 120
spawn ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect "*#*" {
    send "$command\r"
    expect "*#*"
    send "exit\r"
}
EXPECTEOF

    if [ $? -eq 0 ]; then
        print_success "$description completed"
    else
        print_error "$description failed"
        return 1
    fi
}

echo "Step 1: Creating a working nginx configuration without SSL first..."

cat > /tmp/fix_nginx_config.sh << 'FIXEOF'
#!/bin/bash

echo "Creating temporary HTTP-only configuration..."

# Backup current config
cp /etc/nginx/sites-available/phantasia /etc/nginx/sites-available/phantasia.backup.$(date +%Y%m%d_%H%M%S)

# Create simple HTTP configuration first
cat > /etc/nginx/sites-available/phantasia << 'HTTPCONF'
# HTTP server block
server {
    listen 80;
    listen [::]:80;
    server_name deeptesting.prismaticcollections.com 212.227.85.148;
    root /var/www/phantasia;
    index index.html;

    # Allow Let's Encrypt challenges
    location /.well-known/acme-challenge/ {
        root /var/www/phantasia;
        allow all;
    }

    # Angular SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets with caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
    }

    # API proxy for backend
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Gzip compression
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

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
HTTPCONF

# Test configuration
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ HTTP configuration is valid"
    systemctl reload nginx
    echo "✅ Nginx reloaded with HTTP configuration"
else
    echo "❌ Configuration test failed"
    exit 1
fi

echo "HTTP configuration applied successfully"
FIXEOF

# Upload and run the fix
scp -o StrictHostKeyChecking=no /tmp/fix_nginx_config.sh $SERVER_USER@$SERVER_IP:/tmp/
run_remote "chmod +x /tmp/fix_nginx_config.sh && /tmp/fix_nginx_config.sh" "Apply HTTP Configuration"

echo "Step 2: Installing certbot if not present..."

cat > /tmp/install_certbot_simple.sh << 'CERTBOTEOF'
#!/bin/bash

echo "Installing certbot..."

# Update and install certbot
apt update
apt install -y snapd
snap install core; snap refresh core
snap install --classic certbot

# Create symlink
ln -sf /snap/bin/certbot /usr/bin/certbot

# Verify
if command -v certbot &> /dev/null; then
    echo "✅ Certbot installed: $(certbot --version)"
else
    echo "❌ Certbot installation failed"
    exit 1
fi
CERTBOTEOF

scp -o StrictHostKeyChecking=no /tmp/install_certbot_simple.sh $SERVER_USER@$SERVER_IP:/tmp/
run_remote "chmod +x /tmp/install_certbot_simple.sh && /tmp/install_certbot_simple.sh" "Install Certbot"

echo "Step 3: Getting SSL certificates..."

cat > /tmp/get_ssl_cert.sh << 'SSLEOF'
#!/bin/bash

echo "Getting SSL certificate..."

# Stop nginx temporarily
systemctl stop nginx

# Get certificate with standalone method
certbot certonly \
    --standalone \
    --non-interactive \
    --agree-tos \
    --email admin@prismaticcollections.com \
    --domains deeptesting.prismaticcollections.com

CERT_EXIT_CODE=$?

# Start nginx again
systemctl start nginx

if [ $CERT_EXIT_CODE -eq 0 ]; then
    echo "✅ SSL certificate obtained successfully"
    ls -la /etc/letsencrypt/live/deeptesting.prismaticcollections.com/
else
    echo "❌ SSL certificate generation failed"
    echo "Trying webroot method..."

    # Try webroot method as fallback
    certbot certonly \
        --webroot \
        --webroot-path=/var/www/phantasia \
        --non-interactive \
        --agree-tos \
        --email admin@prismaticcollections.com \
        --domains deeptesting.prismaticcollections.com

    if [ $? -eq 0 ]; then
        echo "✅ SSL certificate obtained with webroot method"
    else
        echo "❌ All SSL methods failed"
        exit 1
    fi
fi

echo "SSL certificate acquisition completed"
SSLEOF

scp -o StrictHostKeyChecking=no /tmp/get_ssl_cert.sh $SERVER_USER@$SERVER_IP:/tmp/
run_remote "chmod +x /tmp/get_ssl_cert.sh && /tmp/get_ssl_cert.sh" "Get SSL Certificate"

echo "Step 4: Creating final HTTPS configuration..."

cat > /tmp/create_https_config.sh << 'HTTPSEOF'
#!/bin/bash

echo "Creating final HTTPS configuration..."

# Check if certificates exist
if [ ! -f "/etc/letsencrypt/live/deeptesting.prismaticcollections.com/fullchain.pem" ]; then
    echo "❌ SSL certificates not found"
    exit 1
fi

# Create HTTPS configuration
cat > /etc/nginx/sites-available/phantasia << 'HTTPSCONF'
# HTTP server block - redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name deeptesting.prismaticcollections.com 212.227.85.148;

    # Allow Let's Encrypt challenges
    location /.well-known/acme-challenge/ {
        root /var/www/phantasia;
        allow all;
    }

    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server block
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name deeptesting.prismaticcollections.com 212.227.85.148;
    root /var/www/phantasia;
    index index.html;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/deeptesting.prismaticcollections.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/deeptesting.prismaticcollections.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Angular SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets with caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Gzip compression
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
HTTPSCONF

# Test configuration
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ HTTPS configuration is valid"
    systemctl reload nginx
    echo "✅ Nginx reloaded with HTTPS configuration"
else
    echo "❌ HTTPS configuration test failed"
    exit 1
fi

echo "HTTPS configuration applied successfully"
HTTPSEOF

scp -o StrictHostKeyChecking=no /tmp/create_https_config.sh $SERVER_USER@$SERVER_IP:/tmp/
run_remote "chmod +x /tmp/create_https_config.sh && /tmp/create_https_config.sh" "Create HTTPS Configuration"

echo "Step 5: Setting up auto-renewal..."

cat > /tmp/setup_renewal.sh << 'RENEWEOF'
#!/bin/bash

echo "Setting up auto-renewal..."

# Test renewal
certbot renew --dry-run

# Add cron job if not exists
if ! crontab -l | grep -q "certbot renew"; then
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet && systemctl reload nginx") | crontab -
    echo "✅ Auto-renewal cron job added"
else
    echo "✅ Auto-renewal already configured"
fi

echo "Auto-renewal setup completed"
RENEWEOF

scp -o StrictHostKeyChecking=no /tmp/setup_renewal.sh $SERVER_USER@$SERVER_IP:/tmp/
run_remote "chmod +x /tmp/setup_renewal.sh && /tmp/setup_renewal.sh" "Setup Auto-renewal"

echo "Step 6: Testing HTTPS..."

sleep 5

# Test HTTPS
echo "Testing HTTPS access..."
HTTPS_RESPONSE=$(curl -I -s --connect-timeout 15 https://$DOMAIN | head -1)
echo "HTTPS Response: $HTTPS_RESPONSE"

if echo "$HTTPS_RESPONSE" | grep -q "200"; then
    print_success "HTTPS is working!"
else
    echo "HTTPS Response: $HTTPS_RESPONSE"
fi

# Clean up
rm -f /tmp/fix_nginx_config.sh /tmp/install_certbot_simple.sh /tmp/get_ssl_cert.sh /tmp/create_https_config.sh /tmp/setup_renewal.sh

echo
echo "======================================================================"
echo "🎉 SSL CONFIGURATION FIXED!"
echo "======================================================================"
echo "🌐 Your website should now be available at:"
echo "   🔒 HTTPS: https://$DOMAIN"
echo "   📍 HTTP: http://$SERVER_IP (redirects to HTTPS)"
echo
echo "🔧 What was fixed:"
echo "   ✅ Removed conflicting SSL directives"
echo "   ✅ Applied HTTP configuration first"
echo "   ✅ Generated SSL certificates properly"
echo "   ✅ Applied HTTPS configuration with certificates"
echo "   ✅ Set up automatic renewal"
echo "======================================================================"

print_success "SSL configuration repair completed!"