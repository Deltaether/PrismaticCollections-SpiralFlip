#!/bin/bash

# Simple HTTP-only configuration

echo "Creating HTTP-only nginx configuration..."

cp /etc/nginx/sites-available/phantasia /etc/nginx/sites-available/phantasia.backup

cat > /etc/nginx/sites-available/phantasia << 'EOF'
server {
    listen 80;
    server_name deeptesting.prismaticcollections.com 212.227.85.148;
    root /var/www/phantasia;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
EOF

echo "Testing configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuration is valid"
    systemctl start nginx
    systemctl enable nginx
    echo "✅ Nginx started"
else
    echo "❌ Configuration test failed"
    exit 1
fi

echo "HTTP configuration applied successfully"