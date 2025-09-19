#!/bin/bash

# Add HTTPS configuration to working HTTP setup

echo "Adding HTTPS configuration with existing SSL certificates..."

# Backup current working config
cp /etc/nginx/sites-available/phantasia /etc/nginx/sites-available/phantasia.working

cat > /etc/nginx/sites-available/phantasia << 'EOF'
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

# HTTPS server
server {
    listen 443 ssl http2;
    server_name deeptesting.prismaticcollections.com 212.227.85.148;
    root /var/www/phantasia;
    index index.html;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/deeptesting.prismaticcollections.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/deeptesting.prismaticcollections.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Angular SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets with caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
EOF

echo "Testing HTTPS configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ HTTPS configuration is valid"
    systemctl reload nginx
    echo "✅ Nginx reloaded with HTTPS"

    # Test HTTPS
    sleep 3
    echo "Testing HTTPS access..."
    curl -I -k https://localhost/ --connect-timeout 10 | head -3
else
    echo "❌ HTTPS configuration test failed, restoring working config"
    cp /etc/nginx/sites-available/phantasia.working /etc/nginx/sites-available/phantasia
    systemctl reload nginx
    exit 1
fi

echo "HTTPS configuration added successfully"