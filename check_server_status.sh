#!/bin/bash

# Server Status Check Script
echo "======================================================================"
echo "PHANTASIA SERVER STATUS CHECK"
echo "======================================================================"
echo "Server: root@212.227.85.148"
echo "Domain: deeptesting.prismaticcollections.com"
echo "Password: Kd7bY1mQ"
echo

# Test external accessibility first
echo "1. Testing External Website Access..."
echo "--------------------------------------------------------------------"
echo "Testing HTTP access..."
if curl -I -s --connect-timeout 10 http://212.227.85.148 | head -1; then
    echo "✅ HTTP accessible"
else
    echo "❌ HTTP not accessible"
fi

echo
echo "Testing HTTPS access..."
if curl -I -s --connect-timeout 10 https://deeptesting.prismaticcollections.com | head -1; then
    echo "✅ HTTPS accessible"
else
    echo "❌ HTTPS not accessible"
fi

echo
echo "Testing domain resolution..."
if nslookup deeptesting.prismaticcollections.com; then
    echo "✅ Domain resolves"
else
    echo "❌ Domain resolution issues"
fi

echo
echo "2. Manual Server Check Instructions"
echo "--------------------------------------------------------------------"
echo "Since SSH key isn't set up yet, connect manually:"
echo "   ssh root@212.227.85.148"
echo "   (Password: Kd7bY1mQ)"
echo
echo "Then run these commands on the server:"
echo
cat << 'EOF'
# Check system status
echo "=== System Information ==="
hostname
date
uptime
df -h

# Check nginx status
echo "=== Nginx Status ==="
systemctl status nginx --no-pager
systemctl is-enabled nginx

# Check nginx configuration
echo "=== Nginx Configuration ==="
nginx -t
nginx -V 2>&1 | grep -o with-http_ssl_module || echo "SSL module not found"

# Check if website files exist
echo "=== Website Files ==="
ls -la /var/www/phantasia/ | head -10
du -sh /var/www/phantasia/

# Check nginx sites configuration
echo "=== Nginx Sites ==="
ls -la /etc/nginx/sites-enabled/
cat /etc/nginx/sites-enabled/default 2>/dev/null || echo "No default site config"

# Check SSL certificates
echo "=== SSL Certificates ==="
ls -la /etc/letsencrypt/live/ 2>/dev/null || echo "No Let's Encrypt certificates found"

# Check firewall status
echo "=== Firewall Status ==="
ufw status

# Check listening ports
echo "=== Listening Ports ==="
netstat -tlnp | grep -E ':80|:443'

# Check nginx error logs
echo "=== Recent Nginx Errors ==="
tail -20 /var/log/nginx/error.log 2>/dev/null || echo "No nginx error log found"

# Test local website access
echo "=== Local Website Test ==="
curl -I http://localhost 2>/dev/null || echo "Local HTTP test failed"
curl -I https://localhost 2>/dev/null || echo "Local HTTPS test failed"

# Check processes
echo "=== Running Processes ==="
ps aux | grep -E 'nginx|geldb|twitter' | grep -v grep

# Check if services are enabled for auto-start
echo "=== Service Auto-Start Status ==="
systemctl is-enabled nginx 2>/dev/null || echo "nginx auto-start not configured"
systemctl is-enabled geldb 2>/dev/null || echo "geldb auto-start not configured"

echo "=== Status Check Complete ==="
EOF

echo
echo "3. Quick Nginx Setup Commands (if needed)"
echo "--------------------------------------------------------------------"
cat << 'EOF'
# Install nginx if not present
apt update && apt install -y nginx

# Start and enable nginx
systemctl start nginx
systemctl enable nginx

# Basic nginx configuration for domain
cat > /etc/nginx/sites-available/phantasia << 'NGINXEOF'
server {
    listen 80;
    server_name deeptesting.prismaticcollections.com 212.227.85.148;
    root /var/www/phantasia/browser;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINXEOF

# Enable the site
ln -sf /etc/nginx/sites-available/phantasia /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload nginx
nginx -t && systemctl reload nginx

# Open firewall ports
ufw allow 80
ufw allow 443
ufw allow 22
EOF

echo
echo "4. SSL Certificate Setup (if needed)"
echo "--------------------------------------------------------------------"
cat << 'EOF'
# Install certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d deeptesting.prismaticcollections.com --non-interactive --agree-tos --email admin@prismaticcollections.com

# Test SSL renewal
certbot renew --dry-run
EOF

echo
echo "======================================================================"
echo "Run the above commands on the server to check and fix any issues."
echo "======================================================================"