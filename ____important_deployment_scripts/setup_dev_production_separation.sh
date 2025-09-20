#!/bin/bash

# Dev/Production Separation Setup Script
# Creates separate folders and nginx configs for development vs production

set -e

# Server configuration
SERVER_IP="216.225.206.85"
SERVER_KEY="/home/delta/Projects/PrismaticCollections(SpiralFlip_Site)/id_rsa_prismatic"

echo "======================================================================"
echo "🚀 DEV/PRODUCTION SEPARATION SETUP"
echo "======================================================================"
echo "Development: $SERVER_IP (subdomain/IP access)"
echo "Production: prismaticcollections.com"
echo "Folder Structure:"
echo "  📁 /var/www/phantasia-dev/ (development)"
echo "  📁 /var/www/phantasia-prod/ (production)"
echo ""

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

# 1. Create updated nginx configurations
print_status "🔧 Creating updated nginx configurations..."

# Development nginx config (IP access)
cat > /tmp/phantasia_dev_config << 'DEVEOF'
# Development Configuration (IP Access)
server {
    listen 80;
    server_name 216.225.206.85;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name 216.225.206.85;

    root /var/www/phantasia-dev;
    index index.html;

    # SSL Configuration with Cloudflare Origin Certificates
    ssl_certificate /etc/ssl/certs/Cloudflare_Origin_TLScert.txt;
    ssl_certificate_key /etc/ssl/certs/Cloudflare_Origin_TLScert_privatekey.txt;

    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Development headers
    add_header X-Environment "development" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cloudflare Real IP Headers
    set_real_ip_from 173.245.48.0/20;
    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 103.22.200.0/22;
    set_real_ip_from 103.31.4.0/22;
    set_real_ip_from 141.101.64.0/18;
    set_real_ip_from 108.162.192.0/18;
    set_real_ip_from 190.93.240.0/20;
    set_real_ip_from 188.114.96.0/20;
    set_real_ip_from 197.234.240.0/22;
    set_real_ip_from 198.41.128.0/17;
    set_real_ip_from 162.158.0.0/15;
    set_real_ip_from 104.16.0.0/13;
    set_real_ip_from 104.24.0.0/14;
    set_real_ip_from 172.64.0.0/13;
    set_real_ip_from 131.0.72.0/22;
    real_ip_header CF-Connecting-IP;

    # Angular SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy to GelDB backend
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $server_name;
        proxy_cache_bypass $http_upgrade;
    }

    # Static assets caching (shorter for dev)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1h;
        add_header Cache-Control "public";
        add_header X-Environment "development";
        access_log off;
    }

    # 3D and audio files
    location ~* \.(glb|gltf|fbx|obj|mp3|wav|ogg|flac|m4a)$ {
        expires 1h;
        add_header Cache-Control "public";
        add_header Access-Control-Allow-Origin *;
        access_log off;
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
DEVEOF

# Production nginx config (main domain)
cat > /tmp/phantasia_prod_config << 'PRODEOF'
# Production Configuration (Main Domain)
server {
    listen 80;
    server_name prismaticcollections.com www.prismaticcollections.com;
    return 301 https://prismaticcollections.com$request_uri;
}

# WWW to non-WWW redirect
server {
    listen 443 ssl http2;
    server_name www.prismaticcollections.com;

    ssl_certificate /etc/ssl/certs/Cloudflare_Origin_TLScert.txt;
    ssl_certificate_key /etc/ssl/certs/Cloudflare_Origin_TLScert_privatekey.txt;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    return 301 https://prismaticcollections.com$request_uri;
}

# Main production server
server {
    listen 443 ssl http2;
    server_name prismaticcollections.com;

    root /var/www/phantasia-prod;
    index index.html;

    # SSL Configuration
    ssl_certificate /etc/ssl/certs/Cloudflare_Origin_TLScert.txt;
    ssl_certificate_key /etc/ssl/certs/Cloudflare_Origin_TLScert_privatekey.txt;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Production security headers
    add_header X-Environment "production" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Cloudflare Real IP Headers
    set_real_ip_from 173.245.48.0/20;
    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 103.22.200.0/22;
    set_real_ip_from 103.31.4.0/22;
    set_real_ip_from 141.101.64.0/18;
    set_real_ip_from 108.162.192.0/18;
    set_real_ip_from 190.93.240.0/20;
    set_real_ip_from 188.114.96.0/20;
    set_real_ip_from 197.234.240.0/22;
    set_real_ip_from 198.41.128.0/17;
    set_real_ip_from 162.158.0.0/15;
    set_real_ip_from 104.16.0.0/13;
    set_real_ip_from 104.24.0.0/14;
    set_real_ip_from 172.64.0.0/13;
    set_real_ip_from 131.0.72.0/22;
    real_ip_header CF-Connecting-IP;

    # Angular SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy to GelDB backend
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $server_name;
        proxy_cache_bypass $http_upgrade;
    }

    # Static assets caching (production - long cache)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        add_header X-Environment "production";
        access_log off;
        gzip_static on;
    }

    # 3D and audio files
    location ~* \.(glb|gltf|fbx|obj|mp3|wav|ogg|flac|m4a)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        add_header Access-Control-Allow-Origin *;
        access_log off;
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
PRODEOF

# 2. Upload configurations
print_status "📤 Uploading configurations to server..."
scp -o StrictHostKeyChecking=no -i "$SERVER_KEY" /tmp/phantasia_dev_config root@$SERVER_IP:/tmp/
scp -o StrictHostKeyChecking=no -i "$SERVER_KEY" /tmp/phantasia_prod_config root@$SERVER_IP:/tmp/

# 3. Apply on server
print_status "🔧 Setting up dev/production separation on server..."

ssh -o StrictHostKeyChecking=no -i "$SERVER_KEY" root@$SERVER_IP << 'SERVER_SETUP'
#!/bin/bash

echo "🚀 Setting up dev/production folder separation..."

# Create dev and prod directories
echo "📁 Creating separate directories..."
mkdir -p /var/www/phantasia-dev
mkdir -p /var/www/phantasia-prod

# Copy current files to dev (current state becomes dev)
echo "📋 Moving current files to development folder..."
if [ -d "/var/www/phantasia" ]; then
    cp -r /var/www/phantasia/* /var/www/phantasia-dev/ 2>/dev/null || true
    echo "✅ Current website copied to development folder"
else
    echo "⚠️ No existing files to copy"
fi

# Set proper permissions
echo "🔐 Setting permissions..."
chown -R www-data:www-data /var/www/phantasia-dev
chown -R www-data:www-data /var/www/phantasia-prod
chmod -R 755 /var/www/phantasia-dev
chmod -R 755 /var/www/phantasia-prod

# Install nginx configurations
echo "⚙️ Installing nginx configurations..."
cp /tmp/phantasia_dev_config /etc/nginx/sites-available/phantasia-dev
cp /tmp/phantasia_prod_config /etc/nginx/sites-available/phantasia-prod

# Remove old configurations
echo "🧹 Removing old configurations..."
rm -f /etc/nginx/sites-enabled/phantasia-https
rm -f /etc/nginx/sites-enabled/prismaticcollections.com

# Enable new configurations
echo "✅ Enabling new configurations..."
ln -sf /etc/nginx/sites-available/phantasia-dev /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/phantasia-prod /etc/nginx/sites-enabled/

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
if nginx -t; then
    echo "✅ Nginx configuration test passed"
else
    echo "❌ Nginx configuration test failed!"
    exit 1
fi

# Reload nginx
echo "🔄 Reloading nginx..."
systemctl reload nginx

# Show status
echo "📊 Current nginx sites:"
ls -la /etc/nginx/sites-enabled/

echo "📁 Folder structure:"
ls -la /var/www/ | grep phantasia

echo "✅ Dev/Production separation setup completed!"

# Clean up
rm -f /tmp/phantasia_dev_config /tmp/phantasia_prod_config

echo ""
echo "=== SETUP SUMMARY ==="
echo "🟡 Development: $SERVER_IP -> /var/www/phantasia-dev/"
echo "🟢 Production: prismaticcollections.com -> /var/www/phantasia-prod/"
echo "📦 Current files moved to development folder"
echo "🚀 Production folder ready for first deployment"
SERVER_SETUP

print_success "✅ Dev/Production separation completed!"

# Clean up local files
rm -f /tmp/phantasia_dev_config /tmp/phantasia_prod_config

echo ""
echo "======================================================================"
print_success "✅ DEV/PRODUCTION SEPARATION COMPLETED!"
echo "======================================================================"
echo "🟡 Development Environment:"
echo "   🌐 URL: https://$SERVER_IP"
echo "   📁 Folder: /var/www/phantasia-dev/"
echo "   🔄 Cache: 1 hour (for faster development)"
echo "   🏷️ Header: X-Environment: development"
echo ""
echo "🟢 Production Environment:"
echo "   🌐 URL: https://prismaticcollections.com"
echo "   📁 Folder: /var/www/phantasia-prod/"
echo "   🔄 Cache: 1 year (for performance)"
echo "   🏷️ Header: X-Environment: production"
echo ""
echo "📋 Next Steps:"
echo "   1. Development: Deploy changes to dev first"
echo "   2. Testing: Test on https://$SERVER_IP"
echo "   3. Production: Promote dev to production when ready"
echo "======================================================================"