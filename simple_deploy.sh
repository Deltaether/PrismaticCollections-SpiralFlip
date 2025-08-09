#!/bin/bash

# Simple deployment script for Project Phantasia
SERVER_IP="212.227.85.148"
USERNAME="root"
PASSWORD="16nFuBcg"

echo "🚀 Starting simple deployment..."

# Step 1: Test connection
echo "🔐 Testing connection..."
if timeout 10 bash -c "</dev/tcp/${SERVER_IP}/22" 2>/dev/null; then
    echo "✅ SSH port is accessible"
else
    echo "❌ Cannot connect to SSH port"
    exit 1
fi

# Step 2: Manual instructions since automated password input is challenging
echo ""
echo "📋 MANUAL DEPLOYMENT INSTRUCTIONS:"
echo "=================================="
echo ""
echo "1️⃣  Upload deployment package:"
echo "   scp -P 22 phantasia-deploy.tar.gz ${USERNAME}@${SERVER_IP}:~/"
echo "   Password: ${PASSWORD}"
echo ""
echo "2️⃣  Connect to server:"
echo "   ssh -p 22 ${USERNAME}@${SERVER_IP}"
echo "   Password: ${PASSWORD}"
echo ""
echo "3️⃣  Run these commands on the server:"
echo "=================================="
cat << 'SERVERCOMMANDS'

# Update system and install nginx
apt update && apt install -y nginx

# Create project directory
mkdir -p /root/Projects/ProjectPhantasia
cd /root/Projects/ProjectPhantasia

# Extract files
tar -xzf ~/phantasia-deploy.tar.gz
rm ~/phantasia-deploy.tar.gz

# Set permissions
chmod -R 755 /root/Projects/ProjectPhantasia/

# Configure nginx
cat > /etc/nginx/sites-available/phantasia << 'EOF'
server {
    listen 80;
    server_name _;
    
    root /root/Projects/ProjectPhantasia;
    index index.html;
    
    # Handle Angular routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Specific Angular routes
    location ~ ^/(phantasia|collections|home|disc-1|disc-2|pv|information|mobile) {
        try_files $uri $uri/ /index.html;
    }
    
    # Static assets with caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|glb|mp3|mp4)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/phantasia /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart nginx
nginx -t && systemctl restart nginx && systemctl enable nginx

# Test deployment
echo "Testing website..."
curl -I http://localhost/

echo "🎉 Deployment completed!"
echo "Website should be available at: http://212.227.85.148/"

SERVERCOMMANDS

echo "=================================="
echo ""
echo "4️⃣  After running the server commands, verify:"
echo "   curl -I http://212.227.85.148/"
echo ""
echo "📁 Files ready for upload:"
ls -la phantasia-deploy.tar.gz 2>/dev/null | grep phantasia || echo "❌ phantasia-deploy.tar.gz not found!"
echo ""

# Try to run the upload command directly
echo "🚀 Attempting direct upload..."
echo "You may need to enter the password: ${PASSWORD}"

# Use a temporary SSH config to handle the connection
mkdir -p ~/.ssh
cat > ~/.ssh/config_temp << EOF
Host phantasia-server
    HostName ${SERVER_IP}
    Port 22
    User ${USERNAME}
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
    PreferredAuthentications password
    PubkeyAuthentication no
EOF

echo "Running: scp -F ~/.ssh/config_temp phantasia-deploy.tar.gz phantasia-server:~/"
scp -F ~/.ssh/config_temp phantasia-deploy.tar.gz phantasia-server:~/ && echo "✅ Upload successful!" || echo "❌ Upload failed - please upload manually"

# Cleanup temp config
rm -f ~/.ssh/config_temp

echo ""
echo "🔐 SSH Command to connect:"
echo "ssh -p 22 ${USERNAME}@${SERVER_IP}"
echo "Password: ${PASSWORD}"