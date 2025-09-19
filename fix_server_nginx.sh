#!/bin/bash

# Complete Server and Nginx Fix Script
echo "======================================================================"
echo "PHANTASIA SERVER NGINX SETUP AND FIX"
echo "======================================================================"
echo "Issue Detected: Server not responding on HTTP/HTTPS"
echo "Cloudflare Error 521: Web server is down"
echo "Solution: Install, configure, and start nginx properly"
echo

echo "DIAGNOSIS FROM EXTERNAL TESTS:"
echo "✅ Domain resolves correctly (via Cloudflare)"
echo "❌ HTTP port 80: Connection refused"
echo "❌ HTTPS via domain: 521 error (server down)"
echo

echo "INSTRUCTIONS FOR SERVER:"
echo "======================================================================"
echo "Connect to server: ssh root@212.227.85.148"
echo "Password: Kd7bY1mQ"
echo
echo "Then run these commands step by step:"
echo

cat << 'EOF'
# 1. SYSTEM UPDATE AND NGINX INSTALLATION
echo "=== Installing nginx ==="
apt update
apt install -y nginx

# 2. START AND ENABLE NGINX
echo "=== Starting nginx ==="
systemctl start nginx
systemctl enable nginx
systemctl status nginx --no-pager

# 3. CHECK IF WEBSITE FILES EXIST
echo "=== Checking website files ==="
ls -la /var/www/
mkdir -p /var/www/phantasia/browser
ls -la /var/www/phantasia/

# If no website files, create a test page
if [ ! -f "/var/www/phantasia/browser/index.html" ]; then
    echo "Creating test page..."
    mkdir -p /var/www/phantasia/browser
    cat > /var/www/phantasia/browser/index.html << 'HTMLEOF'
<!DOCTYPE html>
<html>
<head>
    <title>Phantasia Test Page</title>
</head>
<body>
    <h1>Phantasia Server is Working!</h1>
    <p>Server: $(hostname)</p>
    <p>Date: $(date)</p>
    <p>Ready for Angular deployment</p>
</body>
</html>
HTMLEOF
fi

# 4. CONFIGURE NGINX FOR PHANTASIA
echo "=== Configuring nginx ==="
cat > /etc/nginx/sites-available/phantasia << 'NGINXEOF'
server {
    listen 80;
    listen [::]:80;
    server_name deeptesting.prismaticcollections.com 212.227.85.148;
    root /var/www/phantasia/browser;
    index index.html;

    # Angular routing support
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets caching
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
NGINXEOF

# 5. ENABLE THE SITE
echo "=== Enabling phantasia site ==="
ln -sf /etc/nginx/sites-available/phantasia /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 6. TEST NGINX CONFIGURATION
echo "=== Testing nginx configuration ==="
nginx -t

# 7. RELOAD NGINX
echo "=== Reloading nginx ==="
systemctl reload nginx

# 8. CONFIGURE FIREWALL
echo "=== Configuring firewall ==="
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

# 9. CHECK STATUS
echo "=== Checking services ==="
systemctl status nginx --no-pager
netstat -tlnp | grep -E ':80|:443'

# 10. TEST LOCAL ACCESS
echo "=== Testing local access ==="
curl -I http://localhost
curl -s http://localhost | head -5

# 11. SET PROPER PERMISSIONS
echo "=== Setting permissions ==="
chown -R www-data:www-data /var/www/phantasia
chmod -R 755 /var/www/phantasia

echo "=== Setup Complete ==="
echo "HTTP should now be working on:"
echo "  - http://212.227.85.148"
echo "  - http://deeptesting.prismaticcollections.com"
echo
echo "Next steps:"
echo "1. Deploy the actual Angular website files"
echo "2. Set up SSL certificates with Let's Encrypt"
echo "3. Test external access"

EOF

echo
echo "======================================================================"
echo "EXTERNAL VERIFICATION COMMANDS"
echo "======================================================================"
echo "After running the above commands, test from another machine:"
echo
echo "curl -I http://212.227.85.148"
echo "curl -I http://deeptesting.prismaticcollections.com"
echo
echo "If working, proceed with SSL setup:"
echo
cat << 'SSLEOF'
# SSL CERTIFICATE SETUP (run after HTTP is working)
apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace email)
certbot --nginx -d deeptesting.prismaticcollections.com \
    --non-interactive --agree-tos \
    --email admin@prismaticcollections.com

# Test SSL renewal
certbot renew --dry-run
SSLEOF

echo
echo "======================================================================"
echo "This should fix the nginx server and make it accessible to the world!"
echo "======================================================================"