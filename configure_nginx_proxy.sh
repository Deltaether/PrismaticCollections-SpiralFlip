#!/bin/bash

SERVER_IP="212.227.85.148"
SERVER_USER="root"
SERVER_PASSWORD="KC361kLC"

echo "========================================================================"
echo "🌐 CONFIGURE NGINX API PROXY"
echo "========================================================================"
echo "This script will configure nginx to proxy API requests to mock music API"

cat > /tmp/configure_nginx_api.sh << 'PROXYEOF'
#!/bin/bash

# Add API proxy location to nginx configuration
echo "Configuring nginx API proxy..."

# Backup current nginx config
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup.$(date +%Y%m%d_%H%M%S)

# Check if API location already exists
if grep -q "location /api/" /etc/nginx/sites-available/default; then
    echo "API proxy already configured"
else
    # Add API proxy configuration to the server block
    sed -i '/location \/ {/i \
    # API proxy to mock music API\
    location /api/ {\
        proxy_pass http://localhost:3000/api/;\
        proxy_set_header Host $host;\
        proxy_set_header X-Real-IP $remote_addr;\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\
        proxy_set_header X-Forwarded-Proto $scheme;\
        proxy_buffering off;\
    }\
' /etc/nginx/sites-available/default

    echo "✅ API proxy configuration added"
fi

# Test nginx configuration
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ nginx configuration is valid"
    systemctl reload nginx
    echo "✅ nginx reloaded"
else
    echo "❌ nginx configuration error"
    exit 1
fi

echo "nginx API proxy configuration completed"
PROXYEOF

expect << EXPECTEOF
set timeout 60
spawn scp -o StrictHostKeyChecking=no /tmp/configure_nginx_api.sh $SERVER_USER@$SERVER_IP:/tmp/
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect eof
EXPECTEOF

./ssh_auto.sh "chmod +x /tmp/configure_nginx_api.sh && /tmp/configure_nginx_api.sh"

echo "✅ nginx API proxy configured"
rm -f /tmp/configure_nginx_api.sh
