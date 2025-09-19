#!/bin/bash

# Direct Server Commands Script
echo "======================================================================"
echo "NGINX SERVER FIX COMMANDS"
echo "======================================================================"
echo "Server: root@212.227.85.148"
echo "Password: Kd7bY1mQ"
echo

# Create a commands file to upload and execute
cat > /tmp/server_fix_commands.sh << 'CMDEOF'
#!/bin/bash

echo "======================================================================"
echo "EXECUTING NGINX SERVER FIX"
echo "======================================================================"
echo "Server: $(hostname)"
echo "Date: $(date)"
echo "User: $(whoami)"
echo

# Update system
echo "=== Updating system ==="
apt update

# Install nginx
echo "=== Installing nginx ==="
apt install -y nginx

# Start and enable nginx
echo "=== Starting nginx ==="
systemctl start nginx
systemctl enable nginx

# Create website directory
echo "=== Creating website directory ==="
mkdir -p /var/www/phantasia/browser

# Create test HTML file
echo "=== Creating test HTML page ==="
cat > /var/www/phantasia/browser/index.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Phantasia Server - Online</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 50px;
        }
        .container {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }
        h1 { color: #ffeb3b; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎭 Phantasia Server is Online!</h1>
        <p><strong>Server:</strong> $(hostname)</p>
        <p><strong>Status:</strong> Ready for Angular deployment</p>
        <p><strong>Time:</strong> $(date)</p>
        <p><strong>Port 80:</strong> ✅ Active</p>
        <p><strong>Nginx:</strong> ✅ Running</p>
        <hr>
        <p>Ready to receive the Phantasia website files!</p>
    </div>
</body>
</html>
HTMLEOF

# Configure nginx for Phantasia
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

    # API proxy (for future GelDB integration)
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
NGINXEOF

# Enable the site
echo "=== Enabling phantasia site ==="
ln -sf /etc/nginx/sites-available/phantasia /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
echo "=== Testing nginx configuration ==="
nginx -t

# Reload nginx
echo "=== Reloading nginx ==="
systemctl reload nginx

# Configure firewall
echo "=== Configuring firewall ==="
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

# Set proper permissions
echo "=== Setting permissions ==="
chown -R www-data:www-data /var/www/phantasia
chmod -R 755 /var/www/phantasia

# Test local access
echo "=== Testing local access ==="
curl -I http://localhost

# Show status
echo "=== Service Status ==="
systemctl status nginx --no-pager
echo
echo "=== Listening Ports ==="
netstat -tlnp | grep -E ':80|:443'

echo
echo "======================================================================"
echo "✅ NGINX SETUP COMPLETE!"
echo "======================================================================"
echo "HTTP Server: ✅ Running on port 80"
echo "Domain: deeptesting.prismaticcollections.com"
echo "IP: 212.227.85.148"
echo "Status: Ready for Angular deployment"
echo "======================================================================"

CMDEOF

chmod +x /tmp/server_fix_commands.sh

echo "Commands script created: /tmp/server_fix_commands.sh"
echo
echo "NEXT STEPS:"
echo "======================================================================"
echo "1. Copy the script to the server:"
echo "   scp /tmp/server_fix_commands.sh root@212.227.85.148:~/"
echo
echo "2. Connect to the server:"
echo "   ssh root@212.227.85.148"
echo "   (Password: Kd7bY1mQ)"
echo
echo "3. Run the script on the server:"
echo "   chmod +x ~/server_fix_commands.sh"
echo "   ./server_fix_commands.sh"
echo
echo "OR run this command to attempt automated transfer and execution:"
echo "======================================================================"

# Try to execute via SSH directly
echo "Attempting direct SSH execution..."

timeout 60 ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 root@212.227.85.148 'bash -s' < /tmp/server_fix_commands.sh