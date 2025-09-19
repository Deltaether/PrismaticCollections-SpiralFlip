#!/bin/bash

# Setup Main Domain nginx Configuration
# Sets up prismaticcollections.com with HTTPS, SSL, and default HTML

set -e

# Server Configuration
SERVER_IP="212.227.85.148"
SERVER_USER="root"
SERVER_PASSWORD="KC361kLC"
MAIN_DOMAIN="prismaticcollections.com"
WEB_ROOT="/var/www/prismaticcollections"

echo "======================================================================"
echo "🌐 MAIN DOMAIN NGINX SETUP"
echo "======================================================================"
echo "Domain: $MAIN_DOMAIN"
echo "Server: $SERVER_USER@$SERVER_IP"
echo "Web Root: $WEB_ROOT"
echo "This script will:"
echo "  ✅ Create nginx configuration for main domain"
echo "  ✅ Set up SSL with Cloudflare Origin certificates"
echo "  ✅ Create default HTML content"
echo "  ✅ Configure HTTPS redirects"
echo "  ✅ Test domain access"
echo "======================================================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
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

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

# Check if Cloudflare certificates exist locally
if [ ! -f "remote_ssh/Cloudflare_Origin_TLScert.txt" ] || [ ! -f "remote_ssh/Cloudflare_Origin_TLScert_privatekey.txt" ]; then
    print_error "Cloudflare Origin certificates not found in remote_ssh/ directory"
    echo "Please ensure these files exist:"
    echo "  - remote_ssh/Cloudflare_Origin_TLScert.txt"
    echo "  - remote_ssh/Cloudflare_Origin_TLScert_privatekey.txt"
    exit 1
fi

# Step 1: Create web directory and default HTML
print_step "1" "CREATING WEB DIRECTORY AND DEFAULT HTML"

cat > /tmp/setup_main_webroot.sh << 'WEBROOTEOF'
#!/bin/bash

WEB_ROOT="/var/www/prismaticcollections"
DOMAIN="prismaticcollections.com"

echo "Creating web root directory..."

# Create web root directory
mkdir -p "$WEB_ROOT"

# Create default HTML page
cat > "$WEB_ROOT/index.html" << 'HTMLEOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prismatic Collections</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 60px 40px;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            border: 1px solid rgba(255, 255, 255, 0.18);
            max-width: 600px;
            width: 90%;
        }

        h1 {
            font-size: 3rem;
            margin-bottom: 20px;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .subtitle {
            font-size: 1.3rem;
            margin-bottom: 30px;
            opacity: 0.9;
        }

        .description {
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 30px;
            opacity: 0.8;
        }

        .status {
            background: rgba(76, 175, 80, 0.2);
            border: 1px solid rgba(76, 175, 80, 0.5);
            border-radius: 10px;
            padding: 15px;
            margin-top: 20px;
        }

        .status strong {
            color: #4caf50;
        }

        .footer {
            margin-top: 40px;
            font-size: 0.9rem;
            opacity: 0.7;
        }

        @media (max-width: 768px) {
            h1 {
                font-size: 2.5rem;
            }
            .container {
                padding: 40px 30px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Prismatic Collections</h1>
        <div class="subtitle">Welcome to Our Digital Universe</div>
        <div class="description">
            This is the main domain for Prismatic Collections. We're currently setting up our digital presence with cutting-edge web technologies and beautiful interactive experiences.
        </div>
        <div class="status">
            <strong>🚀 Status:</strong> Main domain successfully configured with HTTPS and SSL security
        </div>
        <div class="footer">
            <p>Powered by nginx • Secured by Cloudflare SSL • Built with ❤️</p>
        </div>
    </div>
</body>
</html>
HTMLEOF

# Create favicon
cat > "$WEB_ROOT/favicon.ico" << 'FAVICONEOF'
# Simple favicon placeholder - you can replace this with actual favicon later
FAVICONEOF

# Set proper permissions
chown -R www-data:www-data "$WEB_ROOT"
chmod -R 755 "$WEB_ROOT"
find "$WEB_ROOT" -type f -exec chmod 644 {} \;

echo "✅ Web root created: $WEB_ROOT"
echo "✅ Default HTML page created"
echo "✅ Permissions set (www-data:www-data)"

ls -la "$WEB_ROOT"
WEBROOTEOF

# Upload and run web root setup
expect << EXPECTEOF
set timeout 60
spawn scp -o StrictHostKeyChecking=no /tmp/setup_main_webroot.sh $SERVER_USER@$SERVER_IP:/tmp/
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect eof
EXPECTEOF

./ssh_auto.sh "chmod +x /tmp/setup_main_webroot.sh && /tmp/setup_main_webroot.sh"

print_success "Web root and default HTML created"

# Step 2: Upload Cloudflare certificates for main domain
print_step "2" "UPLOADING CLOUDFLARE ORIGIN CERTIFICATES"

echo "📤 Uploading Cloudflare certificates for main domain..."

# Upload certificate (reuse the same Cloudflare Origin cert as it covers *.prismaticcollections.com)
expect << EXPECTEOF
set timeout 60
spawn scp -o StrictHostKeyChecking=no remote_ssh/Cloudflare_Origin_TLScert.txt $SERVER_USER@$SERVER_IP:/tmp/main_domain_cert.pem
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect eof
EXPECTEOF

# Upload private key
expect << EXPECTEOF
set timeout 60
spawn scp -o StrictHostKeyChecking=no remote_ssh/Cloudflare_Origin_TLScert_privatekey.txt $SERVER_USER@$SERVER_IP:/tmp/main_domain_key.pem
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect eof
EXPECTEOF

print_success "Certificates uploaded for main domain"

# Step 3: Install certificates for main domain
print_step "3" "INSTALLING MAIN DOMAIN CERTIFICATES"

cat > /tmp/install_main_certs.sh << 'MAINCERTEOF'
#!/bin/bash

echo "Installing main domain certificates..."

# Create directory for main domain certificates
mkdir -p /etc/ssl/prismaticcollections
chmod 755 /etc/ssl/prismaticcollections

# Move and set permissions for certificates
mv /tmp/main_domain_cert.pem /etc/ssl/prismaticcollections/cert.pem
mv /tmp/main_domain_key.pem /etc/ssl/prismaticcollections/key.pem

# Set secure permissions
chmod 644 /etc/ssl/prismaticcollections/cert.pem
chmod 600 /etc/ssl/prismaticcollections/key.pem
chown root:root /etc/ssl/prismaticcollections/*

# Verify certificates
if [ -f "/etc/ssl/prismaticcollections/cert.pem" ] && [ -f "/etc/ssl/prismaticcollections/key.pem" ]; then
    echo "✅ Main domain certificates installed successfully"
    ls -la /etc/ssl/prismaticcollections/
else
    echo "❌ Main domain certificate installation failed"
    exit 1
fi

echo "Main domain certificate installation completed"
MAINCERTEOF

expect << EXPECTEOF
set timeout 60
spawn scp -o StrictHostKeyChecking=no /tmp/install_main_certs.sh $SERVER_USER@$SERVER_IP:/tmp/
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect eof
EXPECTEOF

./ssh_auto.sh "chmod +x /tmp/install_main_certs.sh && /tmp/install_main_certs.sh"

print_success "Main domain certificates installed"

# Step 4: Create nginx configuration for main domain
print_step "4" "CREATING MAIN DOMAIN NGINX CONFIGURATION"

cat > /tmp/create_main_nginx.sh << 'MAINNGINXEOF'
#!/bin/bash

echo "Creating nginx configuration for prismaticcollections.com..."

# Create nginx configuration for main domain
cat > /etc/nginx/sites-available/prismaticcollections << 'MAINCONF'
# HTTP server - redirect to HTTPS
server {
    listen 80;
    server_name prismaticcollections.com www.prismaticcollections.com;

    # Allow Let's Encrypt challenges
    location /.well-known/acme-challenge/ {
        root /var/www/prismaticcollections;
        allow all;
    }

    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server for main domain
server {
    listen 443 ssl http2;
    server_name prismaticcollections.com www.prismaticcollections.com;
    root /var/www/prismaticcollections;
    index index.html;

    # Cloudflare Origin SSL certificates
    ssl_certificate /etc/ssl/prismaticcollections/cert.pem;
    ssl_certificate_key /etc/ssl/prismaticcollections/key.pem;

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

    # Simple routing for static HTML
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets with long-term caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp|avif)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
    }

    # API proxy for future backend
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header CF-Connecting-IP $http_cf_connecting_ip;
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
MAINCONF

# Test configuration
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Main domain nginx configuration is valid"
else
    echo "❌ Main domain nginx configuration test failed"
    exit 1
fi

echo "Main domain nginx configuration created"
MAINNGINXEOF

expect << EXPECTEOF
set timeout 60
spawn scp -o StrictHostKeyChecking=no /tmp/create_main_nginx.sh $SERVER_USER@$SERVER_IP:/tmp/
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect eof
EXPECTEOF

./ssh_auto.sh "chmod +x /tmp/create_main_nginx.sh && /tmp/create_main_nginx.sh"

print_success "Main domain nginx configuration created"

# Step 5: Enable main domain site
print_step "5" "ENABLING MAIN DOMAIN SITE"

./ssh_auto.sh "ln -sf /etc/nginx/sites-available/prismaticcollections /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx"

print_success "Main domain site enabled and nginx reloaded"

# Step 6: Test main domain access
print_step "6" "TESTING MAIN DOMAIN ACCESS"

echo "🧪 Testing main domain access..."
sleep 5

echo "Testing HTTPS main domain..."
HTTPS_MAIN=$(curl -I -s --connect-timeout 15 https://prismaticcollections.com/ | head -1)
echo "HTTPS Main Domain: $HTTPS_MAIN"

echo "Testing HTTP redirect..."
HTTP_MAIN=$(curl -I -s --connect-timeout 15 http://prismaticcollections.com/ | head -1)
echo "HTTP Main Domain: $HTTP_MAIN"

echo "Testing website content..."
TITLE_MAIN=$(curl -s --connect-timeout 15 https://prismaticcollections.com/ | grep -i "<title>" | head -1)
if echo "$TITLE_MAIN" | grep -q "Prismatic Collections"; then
    print_success "Main domain content verified - Prismatic Collections detected"
else
    print_warning "Main domain content check: $TITLE_MAIN"
fi

# Step 7: Display server status
print_step "7" "SERVER STATUS SUMMARY"

./ssh_auto.sh "echo 'Active nginx sites:' && ls -la /etc/nginx/sites-enabled/ && echo '' && echo 'nginx status:' && systemctl status nginx --no-pager -l | head -5"

# Clean up temporary files
rm -f /tmp/setup_main_webroot.sh /tmp/install_main_certs.sh /tmp/create_main_nginx.sh

echo
echo "======================================================================"
echo "🎉 MAIN DOMAIN SETUP COMPLETED!"
echo "======================================================================"
echo "🌐 Main Domain URLs:"
echo "   🔒 HTTPS: https://prismaticcollections.com/"
echo "   🔒 HTTPS WWW: https://www.prismaticcollections.com/"
echo "   📄 HTTP: http://prismaticcollections.com/ (redirects to HTTPS)"
echo
echo "🏠 Subdomain URLs (existing):"
echo "   🔒 HTTPS: https://deeptesting.prismaticcollections.com/"
echo "   📍 IP: https://212.227.85.148/"
echo
echo "📁 Server Directories:"
echo "   🌐 Main: /var/www/prismaticcollections/"
echo "   🧪 Sub: /var/www/phantasia/"
echo
echo "🔒 SSL Certificates:"
echo "   📜 Main: /etc/ssl/prismaticcollections/"
echo "   📜 Sub: /etc/ssl/cloudflare/"
echo
echo "⚙️ nginx Sites:"
echo "   ✅ prismaticcollections (main domain)"
echo "   ✅ phantasia (subdomain)"
echo
echo "🚀 Both domains are now live with HTTPS and SSL!"
echo "======================================================================"

print_success "Main domain setup completed successfully!"

echo
print_warning "IMPORTANT: Make sure prismaticcollections.com DNS points to $SERVER_IP"
print_warning "Set Cloudflare SSL mode to 'Full (strict)' for both domains"