#!/bin/bash

# Server Setup Script for Project Phantasia
# Run this script ON THE SERVER after uploading files

echo "🚀 Setting up Project Phantasia on server..."

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install nginx
echo "🌐 Installing nginx..."
apt install -y nginx

# Install Node.js (latest LTS)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
apt install -y nodejs

# Create project directory
echo "📁 Creating project directory..."
mkdir -p /root/Projects/ProjectPhantasia
cd /root/Projects/ProjectPhantasia

# Extract uploaded files
echo "📤 Extracting uploaded files..."
if [ -f /root/phantasia-deploy.tar.gz ]; then
    tar -xzf /root/phantasia-deploy.tar.gz
    rm /root/phantasia-deploy.tar.gz
    echo "✅ Files extracted successfully!"
else
    echo "❌ No deployment package found! Please upload phantasia-deploy.tar.gz to /root/ first."
    exit 1
fi

# Configure nginx
echo "🔧 Configuring nginx..."
cat > /etc/nginx/sites-available/phantasia << 'EOF'
server {
    listen 80;
    server_name _;
    
    root /root/Projects/ProjectPhantasia;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Handle Angular routing
    location ~ ^/(phantasia|collections|home|disc-1|disc-2|pv|information|mobile) {
        try_files $uri $uri/ /index.html;
    }
    
    # Static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/phantasia /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
echo "🔍 Testing nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    # Restart nginx
    echo "🔄 Restarting nginx..."
    systemctl restart nginx
    systemctl enable nginx
    
    echo "✅ nginx configured and started successfully!"
else
    echo "❌ nginx configuration failed!"
    exit 1
fi

# Show status
echo "📊 Server status:"
systemctl status nginx --no-pager -l

echo ""
echo "🎉 Setup completed!"
echo "📍 Website should be accessible at: http://212.227.85.148/"
echo ""
echo "🔧 Useful commands:"
echo "  - Check nginx status: systemctl status nginx"
echo "  - Restart nginx: systemctl restart nginx"
echo "  - View nginx logs: tail -f /var/log/nginx/error.log"
echo "  - View access logs: tail -f /var/log/nginx/access.log"