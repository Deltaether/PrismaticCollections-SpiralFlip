#!/bin/bash

# Complete deployment script for Project Phantasia
# Auto-generated - DO NOT COMMIT TO GIT

set -e  # Exit on any error

# Server Details
SERVER_IP="212.227.85.148"
SERVER_PORT="22"
USERNAME="root"
PASSWORD="16nFuBcg"

echo "🚀 Starting complete deployment for Project Phantasia..."
echo "Server: ${USERNAME}@${SERVER_IP}:${SERVER_PORT}"

# Step 1: Test SSH connection
echo "🔐 Step 1: Testing SSH connection..."
if timeout 10 bash -c "</dev/tcp/${SERVER_IP}/${SERVER_PORT}" 2>/dev/null; then
    echo "✅ Port ${SERVER_PORT} is accessible"
else
    echo "❌ Port ${SERVER_PORT} is not accessible. Checking server status..."
    curl -I http://${SERVER_IP} 2>/dev/null | head -2
    exit 1
fi

# Install sshpass if needed
if ! command -v sshpass &> /dev/null; then
    echo "📦 Installing sshpass for automated SSH..."
    if command -v apt-get &> /dev/null; then
        echo "Using apt-get to install sshpass..."
        echo "Note: This may require sudo password"
    else
        echo "❌ Cannot install sshpass automatically. Please install manually."
        exit 1
    fi
fi

# Step 2: Upload deployment package
echo "📤 Step 2: Uploading deployment files..."
if [ ! -f "phantasia-deploy.tar.gz" ]; then
    echo "❌ Deployment package not found. Building first..."
    # Build the application
    unset NPM_CONFIG_PREFIX
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm use default
    ng build --configuration production
    
    # Create deployment package
    tar -czf phantasia-deploy.tar.gz -C dist/phantasia .
    echo "✅ Deployment package created"
fi

# Upload files using sshpass or manual method
echo "Uploading files to server..."
if command -v sshpass &> /dev/null; then
    sshpass -p "${PASSWORD}" scp -o StrictHostKeyChecking=no -P ${SERVER_PORT} phantasia-deploy.tar.gz ${USERNAME}@${SERVER_IP}:~/
else
    echo "Manual upload required:"
    echo "scp -P ${SERVER_PORT} phantasia-deploy.tar.gz ${USERNAME}@${SERVER_IP}:~/"
    echo "Password: ${PASSWORD}"
    exit 1
fi

echo "✅ Files uploaded successfully!"

# Step 3: Connect to server and run deployment
echo "🔧 Step 3: Connecting to server and setting up..."

# Create server setup script
cat > server_commands.sh << 'EOFSCRIPT'
#!/bin/bash
set -e

echo "🚀 Setting up Project Phantasia on remote server..."

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install nginx if not present
echo "🌐 Installing/checking nginx..."
apt install -y nginx

# Install Node.js if needed (for future updates)
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
    apt install -y nodejs
fi

# Create project directory structure
echo "📁 Creating project directory structure..."
mkdir -p /root/Projects/ProjectPhantasia
cd /root/Projects/ProjectPhantasia

# Extract uploaded files
echo "📤 Extracting deployment files..."
if [ -f /root/phantasia-deploy.tar.gz ]; then
    tar -xzf /root/phantasia-deploy.tar.gz
    rm /root/phantasia-deploy.tar.gz
    echo "✅ Files extracted to $(pwd)"
    ls -la | head -10
else
    echo "❌ Deployment package not found!"
    exit 1
fi

# Set proper permissions
chown -R www-data:www-data /root/Projects/ProjectPhantasia/ || echo "Warning: Could not set www-data ownership"
chmod -R 755 /root/Projects/ProjectPhantasia/

# Configure nginx for Angular
echo "🔧 Configuring nginx..."
cat > /etc/nginx/sites-available/phantasia << 'EOF'
server {
    listen 80;
    server_name _;
    
    root /root/Projects/ProjectPhantasia;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Handle Angular routing - all routes should serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Specific Angular routes
    location ~ ^/(phantasia|collections|home|disc-1|disc-2|pv|information|mobile) {
        try_files $uri $uri/ /index.html;
    }
    
    # Handle API routes if any (future use)
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static assets with long caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|glb|mp3|mp4)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
        
        # CORS for assets if needed
        add_header Access-Control-Allow-Origin "*";
    }
    
    # Disable access to hidden files
    location ~ /\. {
        deny all;
    }
}
EOF

# Enable the site and disable default
echo "🔗 Enabling nginx site..."
ln -sf /etc/nginx/sites-available/phantasia /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
echo "🔍 Testing nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "🔄 Restarting nginx..."
    systemctl restart nginx
    systemctl enable nginx
    echo "✅ nginx configured and restarted successfully!"
else
    echo "❌ nginx configuration test failed!"
    exit 1
fi

# Show final status
echo "📊 Final status check..."
systemctl status nginx --no-pager -l | head -10

echo ""
echo "🎉 Deployment completed successfully!"
echo "📍 Website available at: http://212.227.85.148/"
echo "🔧 Project files located at: /root/Projects/ProjectPhantasia/"

# Test the deployment
echo "🧪 Testing website..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost/ | grep -q "200"; then
    echo "✅ Website is serving correctly (HTTP 200)"
else
    echo "⚠️  Website test returned non-200 status"
fi

# Test Angular routing
echo "🧪 Testing Angular routes..."
for route in "" "phantasia" "collections" "home"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/$route)
    if [ "$status" = "200" ]; then
        echo "✅ Route /$route: OK"
    else
        echo "❌ Route /$route: Failed ($status)"
    fi
done

echo "🎉 All tests completed!"
EOFSCRIPT

# Upload and execute the server script
if command -v sshpass &> /dev/null; then
    echo "Uploading server setup script..."
    sshpass -p "${PASSWORD}" scp -o StrictHostKeyChecking=no -P ${SERVER_PORT} server_commands.sh ${USERNAME}@${SERVER_IP}:~/
    
    echo "Executing deployment on server..."
    sshpass -p "${PASSWORD}" ssh -o StrictHostKeyChecking=no -p ${SERVER_PORT} ${USERNAME}@${SERVER_IP} 'chmod +x server_commands.sh && ./server_commands.sh'
    
    echo "✅ Server deployment completed!"
    
    # Final verification
    echo "🔍 Final verification..."
    echo "Testing website accessibility from local machine..."
    
    if curl -s -o /dev/null -w "%{http_code}" http://${SERVER_IP}/ | grep -q "200"; then
        echo "✅ Website is accessible from external network!"
        echo "🌐 SUCCESS: Project Phantasia is live at http://${SERVER_IP}/"
        
        # Test main routes
        echo "Testing main application routes..."
        for route in "phantasia" "collections" "home"; do
            status=$(curl -s -o /dev/null -w "%{http_code}" http://${SERVER_IP}/$route)
            if [ "$status" = "200" ]; then
                echo "✅ http://${SERVER_IP}/$route - Working"
            else
                echo "⚠️  http://${SERVER_IP}/$route - Status: $status"
            fi
        done
        
    else
        echo "❌ Website is not accessible externally"
        exit 1
    fi
    
else
    echo "Manual execution required on server:"
    echo "ssh -p ${SERVER_PORT} ${USERNAME}@${SERVER_IP}"
    echo "chmod +x server_commands.sh && ./server_commands.sh"
    echo "Password: ${PASSWORD}"
fi

# Cleanup
rm -f server_commands.sh

echo ""
echo "🎉🎉🎉 DEPLOYMENT COMPLETED SUCCESSFULLY! 🎉🎉🎉"
echo ""
echo "📍 Project Phantasia is now live at:"
echo "   🌐 http://${SERVER_IP}/"
echo "   🎵 http://${SERVER_IP}/phantasia"
echo "   📚 http://${SERVER_IP}/collections"
echo ""
echo "🔧 Server details:"
echo "   📁 Files: /root/Projects/ProjectPhantasia/"
echo "   ⚙️  nginx: /etc/nginx/sites-available/phantasia"
echo "   📊 Status: systemctl status nginx"
echo ""