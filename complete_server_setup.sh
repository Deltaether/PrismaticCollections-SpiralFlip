#!/bin/bash

# Complete Phantasia Server Setup Script
# This script will setup everything from scratch on the remote server

set -e  # Exit on any error

SERVER_IP="212.227.85.148"
SERVER_USER="root"
SERVER_DOMAIN="deeptesting.prismaticcollections.com"

echo "======================================================================"
echo "🚀 COMPLETE PHANTASIA SERVER SETUP"
echo "======================================================================"
echo "Server: $SERVER_USER@$SERVER_IP"
echo "Domain: $SERVER_DOMAIN"
echo "Tasks: System Update, Nginx, Website Deployment, SSL (GelDB skipped)"
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to run commands on remote server
run_remote() {
    local command="$1"
    local description="$2"

    print_status "$description"

    expect << EXPECTEOF
set timeout 120
spawn ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP
expect "*password*" {
    send "KC361kLC\r"
}
expect "*#*" {
    send "$command\r"
    expect "*#*"
    send "exit\r"
}
EXPECTEOF

    if [ $? -eq 0 ]; then
        print_success "$description - Completed"
    else
        print_error "$description - Failed"
        return 1
    fi
}

# 1. System Update and Essential Packages
print_status "🔄 Updating system and installing essential packages..."
run_remote "apt update && apt upgrade -y && apt install -y curl wget git nginx ufw expect sshpass" "System Update and Essential Packages"

# 2. Configure Firewall (NEVER close port 22)
print_status "🔥 Configuring firewall..."
run_remote "ufw allow 22 && ufw allow 80 && ufw allow 443 && ufw --force enable" "Firewall Configuration"

# 3. GelDB Installation (SKIPPED - manually installed)
print_status "⏭️ Skipping GelDB installation (manually installed)..."

# 4. Configure Nginx for Phantasia
print_status "⚙️ Configuring Nginx..."
cat > /tmp/nginx_config.sh << 'NGINXEOF'
#!/bin/bash

# Remove default nginx site
rm -f /etc/nginx/sites-enabled/default

# Create Phantasia nginx configuration
cat > /etc/nginx/sites-available/phantasia << 'CONFEOF'
server {
    listen 80;
    listen [::]:80;
    server_name deeptesting.prismaticcollections.com 212.227.85.148;
    root /var/www/phantasia;
    index index.html;

    # Angular SPA routing - this is crucial!
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets with caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
    }

    # API proxy for GelDB (when we set it up)
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

# HTTPS configuration (will be updated by certbot)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name deeptesting.prismaticcollections.com;
    root /var/www/phantasia;
    index index.html;

    # SSL configuration (certbot will manage these)
    ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;

    # Same configuration as HTTP
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

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
CONFEOF

# Enable the site
ln -sf /etc/nginx/sites-available/phantasia /etc/nginx/sites-enabled/

# Create temporary self-signed certificate for HTTPS
mkdir -p /etc/ssl/private
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/nginx-selfsigned.key \
    -out /etc/ssl/certs/nginx-selfsigned.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=deeptesting.prismaticcollections.com"

# Test nginx configuration
nginx -t

# Start and enable nginx
systemctl enable nginx
systemctl restart nginx

echo "✅ Nginx configured and started"
NGINXEOF

# Upload and run nginx configuration
scp -o StrictHostKeyChecking=no /tmp/nginx_config.sh $SERVER_USER@$SERVER_IP:/tmp/
run_remote "chmod +x /tmp/nginx_config.sh && /tmp/nginx_config.sh" "Nginx Configuration"

print_success "✅ Server setup completed! Ready for website deployment."

echo
echo "======================================================================"
echo "🎯 NEXT STEPS:"
echo "======================================================================"
echo "1. Run: ./deploy_website.sh - to upload and deploy the website"
echo "2. GelDB: Already manually installed - ready to use"
echo "3. Run: ./setup_ssl.sh - to configure Let's Encrypt SSL"
echo "4. Run: ./test_deployment.sh - to verify everything works"
echo "======================================================================"