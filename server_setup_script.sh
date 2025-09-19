#!/bin/bash
#
# Phantasia Project - Server Setup Script
# Run this script on the server after transferring files
#
# Usage: bash server_setup_script.sh
#

set -e  # Exit on any error

# Configuration
DOMAIN="deeptesting.prismaticcollections.com"
ADMIN_EMAIL="admin@deeptesting.prismaticcollections.com"
WEB_DIR="/var/www/phantasia"
APP_DIR="/opt/phantasia"

echo "=========================================="
echo "PHANTASIA PROJECT - SERVER SETUP"
echo "=========================================="
echo "Domain: $DOMAIN"
echo "Web Directory: $WEB_DIR"
echo "App Directory: $APP_DIR"
echo "=========================================="

# Function to check if command succeeded
check_result() {
    if [ $? -eq 0 ]; then
        echo "✅ SUCCESS: $1"
    else
        echo "❌ FAILED: $1"
        exit 1
    fi
}

# Update system
echo "🔄 Updating system packages..."
apt update && apt upgrade -y
check_result "System update"

# Install basic dependencies
echo "🔄 Installing basic dependencies..."
apt install -y curl wget unzip nginx python3 python3-pip python3-venv git certbot python3-certbot-nginx ufw
check_result "Basic dependencies installation"

# Install Node.js 20
echo "🔄 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
check_result "Node.js installation"

# Install croc
echo "🔄 Installing croc..."
curl -sSL https://getcroc.schollz.com | bash
check_result "Croc installation"

# Verify installations
echo "🔍 Verifying installations..."
echo "Node.js version: $(node --version)"
echo "Python version: $(python3 --version)"
echo "Nginx version: $(nginx -v 2>&1)"

# Set up Angular website
echo "🔄 Setting up Angular website..."
mkdir -p $WEB_DIR
cd $WEB_DIR

if [ -f ~/phantasia-website.tar.gz ]; then
    tar -xzf ~/phantasia-website.tar.gz --strip-components=1
    check_result "Website extraction"

    chown -R www-data:www-data $WEB_DIR
    chmod -R 755 $WEB_DIR
    check_result "Website permissions"

    echo "✅ Website files extracted to $WEB_DIR"
    ls -la $WEB_DIR | head -10
else
    echo "❌ ERROR: phantasia-website.tar.gz not found in home directory"
    exit 1
fi

# Set up Twitter Python fetcher
echo "🔄 Setting up Twitter Python fetcher..."
mkdir -p $APP_DIR
cd $APP_DIR

if [ -f ~/twitter-python-fetcher.tar.gz ]; then
    tar -xzf ~/twitter-python-fetcher.tar.gz
    check_result "Twitter fetcher extraction"

    cd $APP_DIR/twitter-feedback-python
    python3 -m venv venv
    check_result "Python virtual environment creation"

    source venv/bin/activate
    pip install -r requirements.txt
    check_result "Python dependencies installation"

    echo "✅ Twitter fetcher set up in $APP_DIR"
else
    echo "❌ ERROR: twitter-python-fetcher.tar.gz not found in home directory"
    exit 1
fi

# Install GelDB
echo "🔄 Installing GelDB..."
curl https://www.geldata.com/sh --proto "=https" -sSf1 | sh
check_result "GelDB installation"

# Reload shell configuration
source ~/.bashrc

# Create nginx configuration
echo "🔄 Creating nginx configuration..."
cat > /etc/nginx/sites-available/$DOMAIN << 'EOF'
server {
    listen 80;
    server_name deeptesting.prismaticcollections.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name deeptesting.prismaticcollections.com;

    root /var/www/phantasia;
    index index.html;

    # SSL Configuration (will be updated by certbot)
    ssl_certificate /etc/letsencrypt/live/deeptesting.prismaticcollections.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/deeptesting.prismaticcollections.com/privkey.pem;

    # Angular routing support
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|glb|mp3)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # GelDB API proxy
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF

check_result "Nginx configuration creation"

# Enable the site
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Add gzip compression to nginx
cat >> /etc/nginx/nginx.conf << 'EOF'

    # Gzip Settings
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private no_last_modified no_etag auth;
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
EOF

# Test nginx configuration
nginx -t
check_result "Nginx configuration test"

# Start nginx
systemctl enable nginx
systemctl restart nginx
check_result "Nginx start"

# Set up SSL certificate
echo "🔄 Setting up SSL certificate..."
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email $ADMIN_EMAIL
check_result "SSL certificate setup"

# Enable auto-renewal
systemctl enable certbot.timer

# Create GelDB systemd service
echo "🔄 Creating GelDB service..."
cat > /etc/systemd/system/geldb.service << 'EOF'
[Unit]
Description=GelDB Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/phantasia/twitter-feedback-python
ExecStart=/root/.local/bin/geldb serve --port 8080
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Create Twitter fetcher systemd service
echo "🔄 Creating Twitter fetcher service..."
cat > /etc/systemd/system/twitter-fetcher.service << 'EOF'
[Unit]
Description=Twitter Data Fetcher
After=network.target geldb.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/phantasia/twitter-feedback-python
Environment=PATH=/opt/phantasia/twitter-feedback-python/venv/bin
ExecStart=/opt/phantasia/twitter-feedback-python/venv/bin/python simple_fetcher.py
Restart=always
RestartSec=300

[Install]
WantedBy=multi-user.target
EOF

# Enable services
systemctl daemon-reload
systemctl enable geldb
systemctl enable twitter-fetcher

# Start GelDB
systemctl start geldb
check_result "GelDB service start"

# Configure firewall
echo "🔄 Configuring firewall..."
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable
check_result "Firewall configuration"

echo "🔄 Running final verification..."

# Test basic connectivity
echo "Testing HTTP redirect..."
curl -I http://$DOMAIN | head -5

echo "Testing HTTPS access..."
curl -I https://$DOMAIN | head -5

echo "Checking service status..."
systemctl status nginx --no-pager -l
systemctl status geldb --no-pager -l

echo "Checking disk space..."
df -h

echo "Checking memory usage..."
free -h

echo "=========================================="
echo "🎉 SETUP COMPLETE!"
echo "=========================================="
echo "Website: https://$DOMAIN"
echo "Server IP: $(curl -s ifconfig.me)"
echo "=========================================="
echo ""
echo "⚠️  NEXT STEPS:"
echo "1. Configure Twitter API tokens in:"
echo "   $APP_DIR/twitter-feedback-python/.env"
echo ""
echo "2. Start Twitter fetcher service:"
echo "   systemctl start twitter-fetcher"
echo ""
echo "3. Initialize GelDB with your data:"
echo "   cd $APP_DIR/twitter-feedback-python"
echo "   geldb init"
echo ""
echo "4. Test the website thoroughly"
echo "=========================================="