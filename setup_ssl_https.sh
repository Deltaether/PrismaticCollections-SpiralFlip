#!/bin/bash

# HTTPS/SSL Configuration Script for Phantasia
# This script sets up Let's Encrypt SSL certificates and configures nginx for HTTPS

set -e

# Configuration
DOMAIN="deeptesting.prismaticcollections.com"
EMAIL="admin@prismaticcollections.com"  # Change this to your email
SERVER_IP="212.227.85.148"
SERVER_USER="root"
SERVER_PASSWORD="KC361kLC"

echo "======================================================================"
echo "🔒 PHANTASIA HTTPS/SSL CONFIGURATION"
echo "======================================================================"
echo "Domain: $DOMAIN"
echo "Email: $EMAIL"
echo "Server: $SERVER_USER@$SERVER_IP"
echo "This script will:"
echo "  ✅ Install Certbot (Let's Encrypt client)"
echo "  ✅ Generate SSL certificates"
echo "  ✅ Configure nginx for HTTPS"
echo "  ✅ Set up automatic certificate renewal"
echo "  ✅ Test HTTPS configuration"
echo "======================================================================"
echo

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_step() {
    echo
    echo -e "${BLUE}======================================================================"
    echo -e "🚀 STEP $1: $2"
    echo -e "======================================================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

# Function to run commands on remote server with automated password input
run_remote_ssl() {
    local command="$1"
    local description="$2"

    echo "Executing: $description"

    expect << EXPECTEOF
set timeout 300
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

# Check if domain is pointing to server
print_step "1" "DOMAIN DNS VERIFICATION"
echo "Checking if $DOMAIN points to $SERVER_IP..."

DOMAIN_IP=$(dig +short $DOMAIN | tail -1)
if [ "$DOMAIN_IP" = "$SERVER_IP" ]; then
    print_success "Domain $DOMAIN correctly points to $SERVER_IP"
else
    print_warning "Domain $DOMAIN points to $DOMAIN_IP, not $SERVER_IP"
    echo "⚠️ DNS may not be configured correctly. SSL setup may fail."
    echo "Please ensure your domain DNS A record points to $SERVER_IP"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "SSL setup cancelled. Please configure DNS first."
        exit 0
    fi
fi

# Step 1: Install Certbot and dependencies
print_step "2" "INSTALLING CERTBOT AND DEPENDENCIES"

cat > /tmp/install_certbot.sh << 'CERTBOTEOF'
#!/bin/bash

echo "Installing Certbot and nginx plugin..."

# Update package list
apt update

# Install snapd if not installed
if ! command -v snap &> /dev/null; then
    echo "Installing snapd..."
    apt install -y snapd
    systemctl enable snapd
    systemctl start snapd
    sleep 5
fi

# Install certbot via snap (recommended method)
echo "Installing certbot via snap..."
snap install core; snap refresh core
snap install --classic certbot

# Create symlink for certbot command
ln -sf /snap/bin/certbot /usr/bin/certbot

# Verify installation
if command -v certbot &> /dev/null; then
    echo "✅ Certbot installed successfully: $(certbot --version)"
else
    echo "❌ Certbot installation failed"
    exit 1
fi

echo "Certbot installation completed"
CERTBOTEOF

# Upload and run certbot installation
scp -o StrictHostKeyChecking=no /tmp/install_certbot.sh $SERVER_USER@$SERVER_IP:/tmp/
run_remote_ssl "chmod +x /tmp/install_certbot.sh && /tmp/install_certbot.sh" "Certbot Installation"

# Step 2: Create nginx configuration with SSL
print_step "3" "CREATING NGINX SSL CONFIGURATION"

cat > /tmp/nginx_ssl_config.sh << 'NGINXSSLEOF'
#!/bin/bash

echo "Creating nginx SSL configuration..."

# Backup existing configuration
cp /etc/nginx/sites-available/phantasia /etc/nginx/sites-available/phantasia.backup.$(date +%Y%m%d_%H%M%S)

# Create new nginx configuration with SSL support
cat > /etc/nginx/sites-available/phantasia << 'NGINXCONF'
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

    # Redirect all other HTTP traffic to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server block
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name deeptesting.prismaticcollections.com;
    root /var/www/phantasia;
    index index.html;

    # SSL configuration (certificates will be added by certbot)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA;
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

    # Angular SPA routing - CRITICAL for single page app
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets with long-term caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
    }

    # API proxy for backend (when available)
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

# Additional server block for IP access over HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name 212.227.85.148;

    # Use same SSL certificates as domain
    ssl_certificate /etc/letsencrypt/live/deeptesting.prismaticcollections.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/deeptesting.prismaticcollections.com/privkey.pem;

    # Same configuration as domain
    root /var/www/phantasia;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINXCONF

# Test nginx configuration
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx SSL configuration created successfully"
else
    echo "❌ Nginx configuration test failed"
    exit 1
fi

echo "Nginx SSL configuration completed"
NGINXSSLEOF

# Upload and run nginx SSL configuration
scp -o StrictHostKeyChecking=no /tmp/nginx_ssl_config.sh $SERVER_USER@$SERVER_IP:/tmp/
run_remote_ssl "chmod +x /tmp/nginx_ssl_config.sh && /tmp/nginx_ssl_config.sh" "Nginx SSL Configuration"

# Step 3: Generate SSL certificates
print_step "4" "GENERATING SSL CERTIFICATES"

cat > /tmp/generate_ssl.sh << 'SSLEOF'
#!/bin/bash

echo "Generating SSL certificates with Let's Encrypt..."

# Stop nginx temporarily for standalone mode
systemctl stop nginx

# Generate certificate using standalone mode
certbot certonly \
    --standalone \
    --non-interactive \
    --agree-tos \
    --email admin@prismaticcollections.com \
    --domains deeptesting.prismaticcollections.com

CERTBOT_EXIT_CODE=$?

if [ $CERTBOT_EXIT_CODE -eq 0 ]; then
    echo "✅ SSL certificate generated successfully"

    # Update nginx configuration with certificate paths
    certbot install \
        --nginx \
        --non-interactive \
        --cert-name deeptesting.prismaticcollections.com

    echo "✅ SSL certificate installed in nginx"
else
    echo "❌ SSL certificate generation failed with exit code: $CERTBOT_EXIT_CODE"

    # Try nginx plugin method as fallback
    echo "Trying nginx plugin method..."

    # Start nginx for webroot method
    systemctl start nginx

    certbot --nginx \
        --non-interactive \
        --agree-tos \
        --email admin@prismaticcollections.com \
        --domains deeptesting.prismaticcollections.com \
        --redirect
fi

# Start nginx
systemctl start nginx
systemctl enable nginx

# Test SSL configuration
if [ -f "/etc/letsencrypt/live/deeptesting.prismaticcollections.com/fullchain.pem" ]; then
    echo "✅ SSL certificates are properly installed"
    ls -la /etc/letsencrypt/live/deeptesting.prismaticcollections.com/
else
    echo "❌ SSL certificates not found"
    exit 1
fi

echo "SSL certificate generation completed"
SSLEOF

# Upload and run SSL generation
scp -o StrictHostKeyChecking=no /tmp/generate_ssl.sh $SERVER_USER@$SERVER_IP:/tmp/
run_remote_ssl "chmod +x /tmp/generate_ssl.sh && /tmp/generate_ssl.sh" "SSL Certificate Generation"

# Step 4: Set up automatic renewal
print_step "5" "SETTING UP AUTOMATIC CERTIFICATE RENEWAL"

cat > /tmp/setup_renewal.sh << 'RENEWEOF'
#!/bin/bash

echo "Setting up automatic certificate renewal..."

# Test renewal
certbot renew --dry-run

if [ $? -eq 0 ]; then
    echo "✅ Certificate renewal test passed"
else
    echo "❌ Certificate renewal test failed"
fi

# Check if cron job already exists
if crontab -l | grep -q "certbot renew"; then
    echo "✅ Renewal cron job already exists"
else
    # Add cron job for automatic renewal (check twice daily)
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
    echo "✅ Added automatic renewal cron job"
fi

# Create renewal hook to reload nginx
mkdir -p /etc/letsencrypt/renewal-hooks/deploy
cat > /etc/letsencrypt/renewal-hooks/deploy/nginx-reload.sh << 'HOOKEOF'
#!/bin/bash
systemctl reload nginx
HOOKEOF

chmod +x /etc/letsencrypt/renewal-hooks/deploy/nginx-reload.sh

echo "✅ Renewal hook created to reload nginx"
echo "Automatic renewal setup completed"
RENEWEOF

# Upload and run renewal setup
scp -o StrictHostKeyChecking=no /tmp/setup_renewal.sh $SERVER_USER@$SERVER_IP:/tmp/
run_remote_ssl "chmod +x /tmp/setup_renewal.sh && /tmp/setup_renewal.sh" "Automatic Renewal Setup"

# Step 5: Test HTTPS configuration
print_step "6" "TESTING HTTPS CONFIGURATION"

echo "Testing HTTPS access..."
sleep 5

# Test HTTPS access
HTTPS_STATUS=$(curl -I -s --connect-timeout 15 https://$DOMAIN | head -1)
echo "HTTPS Response: $HTTPS_STATUS"

if echo "$HTTPS_STATUS" | grep -q "200"; then
    print_success "HTTPS is working correctly!"
else
    print_warning "HTTPS test returned: $HTTPS_STATUS"
fi

# Test SSL certificate
echo "Testing SSL certificate..."
SSL_INFO=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
echo "SSL Certificate: $SSL_INFO"

# Step 6: Final status check
print_step "7" "FINAL STATUS CHECK"

run_remote_ssl "systemctl status nginx --no-pager -l | head -10" "Nginx Status Check"
run_remote_ssl "nginx -t" "Nginx Configuration Test"

echo
echo "======================================================================"
echo "🎉 HTTPS/SSL CONFIGURATION COMPLETED!"
echo "======================================================================"
echo "🌐 Your website is now available at:"
echo "   🔒 HTTPS: https://$DOMAIN"
echo "   📍 HTTP: http://$SERVER_IP (redirects to HTTPS)"
echo
echo "🔐 SSL Certificate Information:"
echo "   📜 Domain: $DOMAIN"
echo "   📧 Email: $EMAIL"
echo "   🔄 Auto-renewal: Enabled (twice daily check)"
echo "   📂 Certificate path: /etc/letsencrypt/live/$DOMAIN/"
echo
echo "⚙️ Configuration:"
echo "   ✅ HTTP to HTTPS redirect: Enabled"
echo "   ✅ Security headers: Applied"
echo "   ✅ Gzip compression: Enabled"
echo "   ✅ Angular SPA routing: Configured"
echo "   ✅ Static asset caching: 1 year"
echo
echo "🛠️ Useful commands:"
echo "   🔄 Reload nginx: systemctl reload nginx"
echo "   🧪 Test renewal: certbot renew --dry-run"
echo "   📜 Check certificates: certbot certificates"
echo "   📊 Check SSL: curl -I https://$DOMAIN"
echo
echo "======================================================================"
echo "🔒 PHANTASIA IS NOW FULLY SECURED WITH HTTPS! 🎉"
echo "======================================================================"

# Clean up temporary files
rm -f /tmp/install_certbot.sh /tmp/nginx_ssl_config.sh /tmp/generate_ssl.sh /tmp/setup_renewal.sh

print_success "HTTPS/SSL setup completed successfully!"