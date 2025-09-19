#!/bin/bash

# Install Cloudflare Origin SSL certificates and configure nginx

SERVER_IP="212.227.85.148"
SERVER_USER="root"
SERVER_PASSWORD="KC361kLC"

echo "======================================================================"
echo "🔒 INSTALLING CLOUDFLARE ORIGIN SSL CERTIFICATES"
echo "======================================================================"
echo "This will:"
echo "  ✅ Upload Cloudflare Origin certificates to server"
echo "  ✅ Install certificates in /etc/ssl/cloudflare/"
echo "  ✅ Configure nginx to use Cloudflare certificates"
echo "  ✅ Test subdomain HTTPS access"
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

print_step() {
    echo
    echo -e "${BLUE}======================================================================"
    echo -e "🚀 STEP $1: $2"
    echo -e "======================================================================${NC}"
}

# Step 1: Upload certificates to server
print_step "1" "UPLOADING CLOUDFLARE ORIGIN CERTIFICATES"

echo "📤 Uploading certificate files..."

# Upload certificate
expect << EXPECTEOF
set timeout 60
spawn scp -o StrictHostKeyChecking=no remote_ssh/Cloudflare_Origin_TLScert.txt $SERVER_USER@$SERVER_IP:/tmp/cloudflare_cert.pem
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect eof
EXPECTEOF

# Upload private key
expect << EXPECTEOF
set timeout 60
spawn scp -o StrictHostKeyChecking=no remote_ssh/Cloudflare_Origin_TLScert_privatekey.txt $SERVER_USER@$SERVER_IP:/tmp/cloudflare_key.pem
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect eof
EXPECTEOF

print_success "Certificates uploaded to server"

# Step 2: Install certificates on server
print_step "2" "INSTALLING CERTIFICATES ON SERVER"

cat > /tmp/install_cf_certs.sh << 'CERTEOF'
#!/bin/bash

echo "Installing Cloudflare Origin certificates..."

# Create directory for Cloudflare certificates
mkdir -p /etc/ssl/cloudflare
chmod 755 /etc/ssl/cloudflare

# Move and set permissions for certificates
mv /tmp/cloudflare_cert.pem /etc/ssl/cloudflare/cert.pem
mv /tmp/cloudflare_key.pem /etc/ssl/cloudflare/key.pem

# Set secure permissions
chmod 644 /etc/ssl/cloudflare/cert.pem
chmod 600 /etc/ssl/cloudflare/key.pem
chown root:root /etc/ssl/cloudflare/*

# Verify certificates are installed
if [ -f "/etc/ssl/cloudflare/cert.pem" ] && [ -f "/etc/ssl/cloudflare/key.pem" ]; then
    echo "✅ Cloudflare certificates installed successfully"
    ls -la /etc/ssl/cloudflare/
else
    echo "❌ Certificate installation failed"
    exit 1
fi

echo "Certificate installation completed"
CERTEOF

# Upload and run certificate installation
expect << EXPECTEOF
set timeout 60
spawn scp -o StrictHostKeyChecking=no /tmp/install_cf_certs.sh $SERVER_USER@$SERVER_IP:/tmp/
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect eof
EXPECTEOF

./ssh_auto.sh "chmod +x /tmp/install_cf_certs.sh && /tmp/install_cf_certs.sh"

print_success "Certificates installed on server"

# Step 3: Configure nginx with Cloudflare certificates
print_step "3" "CONFIGURING NGINX WITH CLOUDFLARE CERTIFICATES"

cat > /tmp/configure_cf_nginx.sh << 'NGINXEOF'
#!/bin/bash

echo "Configuring nginx with Cloudflare Origin certificates..."

# Backup current configuration
cp /etc/nginx/sites-available/phantasia /etc/nginx/sites-available/phantasia.backup.$(date +%Y%m%d_%H%M%S)

# Create nginx configuration with Cloudflare certificates
cat > /etc/nginx/sites-available/phantasia << 'CFCONF'
# HTTP server - redirect to HTTPS
server {
    listen 80;
    server_name deeptesting.prismaticcollections.com 212.227.85.148;

    # Allow Let's Encrypt challenges (keep for backup)
    location /.well-known/acme-challenge/ {
        root /var/www/phantasia;
        allow all;
    }

    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server with Cloudflare Origin certificates
server {
    listen 443 ssl http2;
    server_name deeptesting.prismaticcollections.com 212.227.85.148;
    root /var/www/phantasia;
    index index.html;

    # Cloudflare Origin SSL certificates
    ssl_certificate /etc/ssl/cloudflare/cert.pem;
    ssl_certificate_key /etc/ssl/cloudflare/key.pem;

    # SSL configuration optimized for Cloudflare
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers optimized for Cloudflare
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Trust Cloudflare IPs for real IP forwarding
    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 103.22.200.0/22;
    set_real_ip_from 103.31.4.0/22;
    set_real_ip_from 104.16.0.0/13;
    set_real_ip_from 104.24.0.0/14;
    set_real_ip_from 108.162.192.0/18;
    set_real_ip_from 131.0.72.0/22;
    set_real_ip_from 141.101.64.0/18;
    set_real_ip_from 162.158.0.0/15;
    set_real_ip_from 172.64.0.0/13;
    set_real_ip_from 173.245.48.0/20;
    set_real_ip_from 188.114.96.0/20;
    set_real_ip_from 190.93.240.0/20;
    set_real_ip_from 197.234.240.0/22;
    set_real_ip_from 198.41.128.0/17;
    real_ip_header CF-Connecting-IP;

    # Angular SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets with long-term caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp|avif)$ {
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
        proxy_set_header CF-Connecting-IP $http_cf_connecting_ip;
    }

    # Gzip compression (Cloudflare compatible)
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
CFCONF

# Test configuration
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration with Cloudflare certificates is valid"
    systemctl reload nginx
    echo "✅ Nginx reloaded with Cloudflare configuration"
else
    echo "❌ Nginx configuration test failed"
    exit 1
fi

echo "Nginx configuration with Cloudflare certificates completed"
NGINXEOF

# Upload and run nginx configuration
expect << EXPECTEOF
set timeout 60
spawn scp -o StrictHostKeyChecking=no /tmp/configure_cf_nginx.sh $SERVER_USER@$SERVER_IP:/tmp/
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect eof
EXPECTEOF

./ssh_auto.sh "chmod +x /tmp/configure_cf_nginx.sh && /tmp/configure_cf_nginx.sh"

print_success "Nginx configured with Cloudflare certificates"

# Step 4: Test HTTPS access
print_step "4" "TESTING HTTPS ACCESS"

echo "🧪 Testing HTTPS access on both IP and domain..."
sleep 5

echo "Testing direct IP HTTPS..."
HTTPS_IP=$(curl -I -k https://212.227.85.148/ --connect-timeout 15 | head -1)
echo "HTTPS IP Response: $HTTPS_IP"

echo "Testing domain HTTPS..."
HTTPS_DOMAIN=$(curl -I https://deeptesting.prismaticcollections.com/ --connect-timeout 15 | head -1)
echo "HTTPS Domain Response: $HTTPS_DOMAIN"

echo "Testing HTTP redirect..."
HTTP_REDIRECT=$(curl -I http://deeptesting.prismaticcollections.com/ --connect-timeout 15 | head -1)
echo "HTTP Redirect Response: $HTTP_REDIRECT"

# Step 5: Verify SSL certificates
print_step "5" "VERIFYING SSL CERTIFICATE INSTALLATION"

./ssh_auto.sh "openssl x509 -in /etc/ssl/cloudflare/cert.pem -text -noout | grep -E 'Subject:|Issuer:|Not After' | head -3"

# Clean up temporary files
rm -f /tmp/install_cf_certs.sh /tmp/configure_cf_nginx.sh

echo
echo "======================================================================"
echo "🎉 CLOUDFLARE ORIGIN SSL INSTALLATION COMPLETED!"
echo "======================================================================"
echo "🔒 Certificates installed:"
echo "   📜 Certificate: /etc/ssl/cloudflare/cert.pem"
echo "   🔑 Private key: /etc/ssl/cloudflare/key.pem"
echo
echo "🌐 Your website should now be accessible at:"
echo "   🔒 HTTPS Domain: https://deeptesting.prismaticcollections.com/"
echo "   📍 HTTPS IP: https://212.227.85.148/"
echo "   📄 HTTP: http://deeptesting.prismaticcollections.com/ (redirects to HTTPS)"
echo
echo "⚙️ Configuration applied:"
echo "   ✅ Cloudflare Origin SSL certificates"
echo "   ✅ Cloudflare IP whitelist for real IP detection"
echo "   ✅ Optimized SSL settings for Cloudflare"
echo "   ✅ Security headers for HTTPS"
echo "   ✅ Angular SPA routing support"
echo "   ✅ Static asset caching (1 year)"
echo
echo "📝 Note: Make sure Cloudflare SSL mode is set to 'Full (strict)'"
echo "======================================================================"
echo "🔒 HTTPS SHOULD NOW WORK ON THE SUBDOMAIN! 🎉"
echo "======================================================================"

print_success "Cloudflare Origin SSL setup completed successfully!"