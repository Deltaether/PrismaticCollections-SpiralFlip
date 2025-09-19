#!/bin/bash

# Fix Angular SPA routing redirect cycle issue

echo "🔧 Fixing Angular SPA routing configuration..."

cat > /tmp/fix_spa_routing.sh << 'FIXEOF'
#!/bin/bash

echo "Fixing nginx redirect cycle for Angular SPA..."

# Backup current configuration
cp /etc/nginx/sites-available/phantasia /etc/nginx/sites-available/phantasia.backup.cycle

# Create fixed nginx configuration
cat > /etc/nginx/sites-available/phantasia << 'SPACONF'
# HTTP server - redirect to HTTPS
server {
    listen 80;
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

# HTTPS server with fixed Angular SPA routing
server {
    listen 443 ssl http2;
    server_name deeptesting.prismaticcollections.com 212.227.85.148;
    root /var/www/phantasia;
    index index.html;

    # Cloudflare Origin SSL certificates
    ssl_certificate /etc/ssl/cloudflare/cert.pem;
    ssl_certificate_key /etc/ssl/cloudflare/key.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

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

    # Serve index.html directly for root
    location = / {
        try_files /index.html =404;
    }

    # Angular SPA routing - handle all routes
    location / {
        try_files $uri $uri/ @fallback;
    }

    # Fallback to index.html for Angular routes
    location @fallback {
        rewrite ^.*$ /index.html last;
    }

    # Static assets with long-term caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp|avif)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
        try_files $uri =404;
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
SPACONF

# Test configuration
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Fixed nginx configuration is valid"
    systemctl reload nginx
    echo "✅ Nginx reloaded with fixed Angular SPA configuration"
else
    echo "❌ Configuration test failed"
    exit 1
fi

echo "Angular SPA routing fix completed"
FIXEOF

# Upload and run the fix
expect << EXPECTEOF
set timeout 60
spawn scp -o StrictHostKeyChecking=no /tmp/fix_spa_routing.sh root@212.227.85.148:/tmp/
expect "*password*" {
    send "KC361kLC\r"
}
expect eof
EXPECTEOF

./ssh_auto.sh "chmod +x /tmp/fix_spa_routing.sh && /tmp/fix_spa_routing.sh"

echo "🧪 Testing fixed configuration..."
sleep 3

echo "Testing HTTPS domain access:"
curl -I https://deeptesting.prismaticcollections.com/ --connect-timeout 15 | head -3

echo -e "\nTesting website content:"
curl -s https://deeptesting.prismaticcollections.com/ | grep -i "title" | head -2

rm -f /tmp/fix_spa_routing.sh

echo "✅ Angular SPA routing fix completed!"