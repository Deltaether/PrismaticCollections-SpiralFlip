#!/bin/bash

# Quick Fixed Deployment Script
# This script handles the GelDB interactive installer properly

set -e

SERVER_IP="212.227.85.148"
SERVER_USER="root"
SERVER_PASSWORD="KC361kLC"

echo "======================================================================"
echo "🚀 QUICK PHANTASIA DEPLOYMENT (FIXED GELDB)"
echo "======================================================================"
echo "Server: $SERVER_USER@$SERVER_IP"
echo "Password: $SERVER_PASSWORD"
echo

# Create comprehensive setup script for server
cat > /tmp/complete_setup.sh << 'SETUPEOF'
#!/bin/bash

echo "Starting complete server setup..."

# Update system
echo "=== Updating system ==="
apt update && apt upgrade -y

# Install essential packages
echo "=== Installing essential packages ==="
apt install -y nginx ufw curl wget git expect nodejs npm

# Configure firewall
echo "=== Configuring firewall ==="
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

# Install GelDB with proper handling
echo "=== Installing GelDB ==="

# Method 1: Try non-interactive installation
export GELDB_INSTALL_PATH="/root/.local/bin"
export GELDB_MODIFY_PATH="no"

# Download installer
curl https://www.geldata.com/sh --proto "=https" -sSf1 -o /tmp/geldb_installer.sh
chmod +x /tmp/geldb_installer.sh

# Use echo to provide input
echo "1" | bash /tmp/geldb_installer.sh || {
    echo "Method 1 failed, trying expect..."

    # Method 2: Use expect for interactive handling
    expect << 'GELDBEXPECT'
set timeout 60
spawn bash /tmp/geldb_installer.sh

expect {
    "*Installation Path*" {
        expect "*Cancel installation*"
        send "1\r"
        exp_continue
    }
    "*Proceed with installation*" {
        send "1\r"
        exp_continue
    }
    "*default*" {
        send "1\r"
        exp_continue
    }
    "*1)*" {
        send "1\r"
        exp_continue
    }
    eof
}
GELDBEXPECT
}

# Add GelDB to PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
export PATH="$HOME/.local/bin:$PATH"

# Verify GelDB installation
if [ -f "/root/.local/bin/gel" ]; then
    echo "✅ GelDB installed at /root/.local/bin/gel"
    /root/.local/bin/gel --version || echo "GelDB binary found but version check failed"
else
    echo "❌ GelDB installation may have failed"
    ls -la /root/.local/bin/ || echo "No .local/bin directory"
fi

# Configure Nginx
echo "=== Configuring Nginx ==="

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Create Phantasia site config
cat > /etc/nginx/sites-available/phantasia << 'NGINXCONF'
server {
    listen 80;
    listen [::]:80;
    server_name deeptesting.prismaticcollections.com 212.227.85.148;
    root /var/www/phantasia;
    index index.html;

    # Angular SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets with caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy for GelDB
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
NGINXCONF

# Enable site
ln -sf /etc/nginx/sites-available/phantasia /etc/nginx/sites-enabled/

# Test and start nginx
nginx -t
systemctl enable nginx
systemctl restart nginx

echo "✅ Server setup completed!"

# Show status
echo "=== Service Status ==="
systemctl status nginx --no-pager -l | head -10
echo

echo "=== GelDB Status ==="
if command -v gel &> /dev/null; then
    echo "✅ GelDB command available: $(which gel)"
    gel --version
else
    echo "❌ GelDB command not in PATH"
    echo "Available in /root/.local/bin:"
    ls -la /root/.local/bin/
fi

echo "=== Firewall Status ==="
ufw status

echo "Setup completed at $(date)"
SETUPEOF

# Upload and run setup script
echo "📤 Uploading setup script to server..."
scp -o StrictHostKeyChecking=no /tmp/complete_setup.sh $SERVER_USER@$SERVER_IP:/tmp/

echo "🔧 Running complete setup on server..."
expect << EXPECTEOF
set timeout 300
spawn ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP

expect "*password*" {
    send "$SERVER_PASSWORD\r"
}

expect "*#*" {
    send "chmod +x /tmp/complete_setup.sh && /tmp/complete_setup.sh\r"
    expect "*#*"
    send "exit\r"
}
EXPECTEOF

echo "✅ Server setup completed!"

# Test the deployment
echo "🧪 Testing server..."

echo "Testing HTTP access..."
HTTP_RESULT=$(curl -I -s --connect-timeout 10 http://$SERVER_IP | head -1)
echo "HTTP Response: $HTTP_RESULT"

echo "Testing nginx status..."
nginx_status=$(ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP 'systemctl is-active nginx' 2>/dev/null || echo "unknown")
echo "Nginx Status: $nginx_status"

echo
echo "======================================================================"
echo "✅ QUICK DEPLOYMENT COMPLETED!"
echo "======================================================================"
echo "🌐 Server: http://$SERVER_IP"
echo "🌍 Domain: http://deeptesting.prismaticcollections.com"
echo "⚙️ Nginx: $nginx_status"
echo "🗄️ GelDB: Installation attempted (check server for status)"
echo
echo "🔄 Next steps:"
echo "1. Deploy website files: ./deploy_website.sh"
echo "2. Set up SSL: ./setup_ssl.sh"
echo "3. Test everything: ./test_deployment.sh"
echo "======================================================================"