#!/bin/bash

# Create a simple working nginx configuration

echo "🔧 Creating simple working nginx configuration..."

./ssh_auto.sh "cat > /etc/nginx/sites-available/phantasia << 'SIMPLECONF'
# HTTP server - redirect to HTTPS
server {
    listen 80;
    server_name deeptesting.prismaticcollections.com 212.227.85.148;

    location /.well-known/acme-challenge/ {
        root /var/www/phantasia;
        allow all;
    }

    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# HTTPS server with simple working configuration
server {
    listen 443 ssl http2;
    server_name deeptesting.prismaticcollections.com 212.227.85.148;
    root /var/www/phantasia;
    index index.html;

    # Cloudflare Origin SSL certificates
    ssl_certificate /etc/ssl/cloudflare/cert.pem;
    ssl_certificate_key /etc/ssl/cloudflare/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains\" always;

    # Simple Angular SPA routing that works
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Static assets
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)\$ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
SIMPLECONF"

echo "Testing simple configuration..."
./ssh_auto.sh "nginx -t && systemctl reload nginx"

echo "Testing access..."
sleep 3
curl -I https://deeptesting.prismaticcollections.com/ --connect-timeout 15 | head -3

echo "✅ Simple configuration applied!"