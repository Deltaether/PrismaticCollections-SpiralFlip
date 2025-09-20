#!/bin/bash

# Main Domain Setup Script for prismaticcollections.com
# Sets up nginx configuration for the main domain alongside the existing setup

set -e

# Server configuration
SERVER_IP="216.225.206.85"
SERVER_KEY="/home/delta/Projects/PrismaticCollections(SpiralFlip_Site)/id_rsa_prismatic"
MAIN_DOMAIN="prismaticcollections.com"
WWW_DOMAIN="www.prismaticcollections.com"

echo "======================================================================"
echo "🌐 MAIN DOMAIN SETUP: $MAIN_DOMAIN"
echo "======================================================================"
echo "Server: root@$SERVER_IP"
echo "Domain: $MAIN_DOMAIN"
echo "WWW: $WWW_DOMAIN"
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

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Create nginx configuration for main domain
print_status "🔧 Creating nginx configuration for main domain..."

cat > /tmp/prismaticcollections_nginx_config << 'NGINXEOF'
# Main Domain Configuration: prismaticcollections.com
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name prismaticcollections.com www.prismaticcollections.com;
    return 301 https://prismaticcollections.com$request_uri;
}

# WWW to non-WWW redirect (HTTPS)
server {
    listen 443 ssl http2;
    server_name www.prismaticcollections.com;

    # SSL Configuration with Cloudflare Origin Certificates
    ssl_certificate /etc/ssl/certs/Cloudflare_Origin_TLScert.txt;
    ssl_certificate_key /etc/ssl/certs/Cloudflare_Origin_TLScert_privatekey.txt;

    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    return 301 https://prismaticcollections.com$request_uri;
}

# Main HTTPS server block
server {
    listen 443 ssl http2;
    server_name prismaticcollections.com;

    root /var/www/phantasia;
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

    # Security Headers for Production
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

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        access_log off;
        gzip_static on;
    }

    # 3D model files caching
    location ~* \.(glb|gltf|fbx|obj)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        access_log off;
        add_header Access-Control-Allow-Origin *;
    }

    # Audio files caching
    location ~* \.(mp3|wav|ogg|flac|m4a)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        access_log off;
        add_header Access-Control-Allow-Origin *;
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
NGINXEOF

# 2. Upload and configure on server
print_status "📤 Uploading main domain configuration..."
scp -o StrictHostKeyChecking=no -i "$SERVER_KEY" /tmp/prismaticcollections_nginx_config root@$SERVER_IP:/tmp/

# 3. Apply configuration on server
print_status "🔧 Applying main domain configuration on server..."

ssh -o StrictHostKeyChecking=no -i "$SERVER_KEY" root@$SERVER_IP << 'SERVER_SETUP'
#!/bin/bash

echo "🔧 Setting up main domain configuration..."

# Backup current configuration
echo "📋 Backing up current nginx configuration..."
cp -r /etc/nginx/sites-available /etc/nginx/sites-available.backup.$(date +%Y%m%d_%H%M%S)

# Install the main domain configuration
echo "📁 Installing main domain nginx configuration..."
cp /tmp/prismaticcollections_nginx_config /etc/nginx/sites-available/prismaticcollections.com

# Enable the site
echo "✅ Enabling main domain site..."
ln -sf /etc/nginx/sites-available/prismaticcollections.com /etc/nginx/sites-enabled/

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
if nginx -t; then
    echo "✅ Nginx configuration test passed"
else
    echo "❌ Nginx configuration test failed!"
    exit 1
fi

# Reload nginx gracefully
echo "🔄 Reloading nginx..."
systemctl reload nginx

# Verify nginx is running
echo "🔍 Verifying nginx status..."
systemctl status nginx --no-pager -l | head -5

# Show listening ports
echo "📡 Nginx listening ports:"
netstat -tlnp | grep nginx | head -5

echo "✅ Main domain setup completed!"

# Clean up
rm -f /tmp/prismaticcollections_nginx_config

# Show final configuration summary
echo ""
echo "=== MAIN DOMAIN SETUP SUMMARY ==="
echo "✅ prismaticcollections.com -> HTTPS (main site)"
echo "✅ www.prismaticcollections.com -> redirects to main"
echo "✅ HTTP -> HTTPS redirect active"
echo "✅ Cloudflare SSL certificates configured"
echo "✅ API proxy at /api/ -> localhost:3000"
echo "✅ Static asset caching enabled"
echo "✅ Security headers applied"
echo "✅ Gzip compression enabled"
SERVER_SETUP

# 4. Final verification
print_status "🧪 Verifying main domain setup..."

print_warning "Note: DNS must be pointed to $SERVER_IP for domain to work"

echo "Testing server response..."
SERVER_TEST=$(curl -I -s -k https://$SERVER_IP | head -1 || echo "Server not responding")
echo "Server Response: $SERVER_TEST"

# Clean up local files
print_status "🧹 Cleaning up local files..."
rm -f /tmp/prismaticcollections_nginx_config

echo ""
echo "======================================================================"
print_success "✅ MAIN DOMAIN SETUP COMPLETED!"
echo "======================================================================"
echo "🌐 Main Domain: https://prismaticcollections.com"
echo "🌐 WWW Domain: https://www.prismaticcollections.com (redirects to main)"
echo "🔒 SSL: Cloudflare Origin certificates"
echo "📱 Mobile: Fully responsive Angular SPA"
echo ""
echo "🔧 Configuration Files:"
echo "   📁 /etc/nginx/sites-available/prismaticcollections.com"
echo "   🔗 /etc/nginx/sites-enabled/prismaticcollections.com"
echo ""
echo "⚠️  DNS REQUIREMENTS:"
echo "   🌐 Point prismaticcollections.com A record to: $SERVER_IP"
echo "   🌐 Point www.prismaticcollections.com A record to: $SERVER_IP"
echo "   ☁️  Ensure Cloudflare proxy is enabled (orange cloud)"
echo ""
echo "🧪 NEXT STEPS:"
echo "   1. Configure DNS A records in Cloudflare"
echo "   2. Test: https://prismaticcollections.com"
echo "   3. Verify SSL grade: https://www.ssllabs.com/ssltest/"
echo "======================================================================"
