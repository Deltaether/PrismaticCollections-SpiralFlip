#!/bin/bash

# Final nginx fix - simple and clean

./ssh_auto.sh "cat > /etc/nginx/sites-available/phantasia << 'EOF'
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

server {
    listen 443 ssl http2;
    server_name deeptesting.prismaticcollections.com 212.227.85.148;
    root /var/www/phantasia;
    index index.html;

    ssl_certificate /etc/letsencrypt/live/deeptesting.prismaticcollections.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/deeptesting.prismaticcollections.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains\" always;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)\$ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }

    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
EOF"

echo "Testing configuration..."
./ssh_auto.sh "nginx -t"

echo "Starting nginx..."
./ssh_auto.sh "systemctl start nginx && systemctl enable nginx"

echo "Checking status..."
./ssh_auto.sh "systemctl status nginx --no-pager -l | head -3"

echo "Testing sites..."
sleep 3
curl -I http://212.227.85.148/ --connect-timeout 10 | head -2
curl -I https://deeptesting.prismaticcollections.com/ --connect-timeout 10 | head -2