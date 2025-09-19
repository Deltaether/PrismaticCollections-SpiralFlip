#!/bin/bash

# Fix nginx configuration immediately

SERVER_IP="212.227.85.148"
SERVER_USER="root"
SERVER_PASSWORD="KC361kLC"

echo "🔧 FIXING NGINX CONFIGURATION NOW..."

expect << EXPECTEOF
set timeout 60
spawn ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}

expect "*#*" {
    send "cat > /etc/nginx/sites-available/phantasia << 'NGINXCONF'
server {
    listen 80;
    listen [::]:80;
    server_name deeptesting.prismaticcollections.com 212.227.85.148;

    location /.well-known/acme-challenge/ {
        root /var/www/phantasia;
        allow all;
    }

    location / {
        return 301 https://\\\$server_name\\\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name deeptesting.prismaticcollections.com 212.227.85.148;
    root /var/www/phantasia;
    index index.html;

    ssl_certificate /etc/letsencrypt/live/deeptesting.prismaticcollections.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/deeptesting.prismaticcollections.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains\" always;

    location / {
        try_files \\\$uri \\\$uri/ /index.html;
    }

    location ~* \\\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)\\\$ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }

    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \\\$host;
        proxy_set_header X-Real-IP \\\$remote_addr;
        proxy_set_header X-Forwarded-For \\\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\\$scheme;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
NGINXCONF\r"
    expect "*#*"
}

expect "*#*" {
    send "nginx -t\r"
    expect "*#*"
}

expect "*#*" {
    send "systemctl start nginx\r"
    expect "*#*"
}

expect "*#*" {
    send "systemctl enable nginx\r"
    expect "*#*"
}

expect "*#*" {
    send "systemctl status nginx --no-pager -l | head -3\r"
    expect "*#*"
}

expect "*#*" {
    send "exit\r"
}
EXPECTEOF

echo "✅ Configuration applied! Testing..."

sleep 3
echo "Testing HTTP..."
curl -I http://212.227.85.148/ --connect-timeout 10 | head -2

echo "Testing HTTPS..."
curl -I https://deeptesting.prismaticcollections.com/ --connect-timeout 10 | head -2

echo "🎉 Nginx fix completed!"