#!/bin/bash

# Complete deployment script for Phantasia website
# Deploys Angular app to remote server and sets up nginx

set -e  # Exit on any error

# Server credentials
HOST="212.227.85.148"
PORT="22"
PASSWORD="16nFuBcg"
USER="root"

# Local and remote paths
LOCAL_DIST_PATH="./dist/phantasia"
REMOTE_PROJECT_PATH="/root/Projects/ProjectPhantasia"

echo "=== Starting Complete Website Deployment ==="

# Function to install sshpass if not available
install_sshpass() {
    if ! command -v sshpass &> /dev/null; then
        echo "Installing sshpass..."
        if command -v apt-get &> /dev/null; then
            sudo apt-get update
            sudo apt-get install -y sshpass
        elif command -v yum &> /dev/null; then
            sudo yum install -y sshpass
        else
            echo "Please install sshpass manually"
            exit 1
        fi
    fi
}

# Function to execute commands on remote server
remote_exec() {
    sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no -p "$PORT" "$USER@$HOST" "$1"
}

# Function to upload files to remote server
upload_files() {
    echo "Uploading website files..."
    sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no -P "$PORT" -r "$LOCAL_DIST_PATH"/* "$USER@$HOST:$REMOTE_PROJECT_PATH/"
}

# Install dependencies
install_sshpass

echo "Step 1: Creating remote directory structure..."
remote_exec "mkdir -p $REMOTE_PROJECT_PATH"

echo "Step 2: Uploading website files..."
upload_files

echo "Step 3: Installing system dependencies..."
remote_exec "apt-get update && apt-get install -y curl nginx"

echo "Step 4: Installing Node.js and npm..."
remote_exec "curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs"

echo "Step 5: Configuring nginx..."
remote_exec "cat > /etc/nginx/sites-available/phantasia << 'EOF'
server {
    listen 80;
    server_name _;
    root $REMOTE_PROJECT_PATH;
    index index.html;

    # Handle Angular routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control \"public, no-transform\";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
EOF"

echo "Step 6: Enabling nginx site..."
remote_exec "ln -sf /etc/nginx/sites-available/phantasia /etc/nginx/sites-enabled/"
remote_exec "rm -f /etc/nginx/sites-enabled/default"

echo "Step 7: Testing nginx configuration..."
remote_exec "nginx -t"

echo "Step 8: Starting nginx..."
remote_exec "systemctl restart nginx && systemctl enable nginx"

echo "Step 9: Checking nginx status..."
remote_exec "systemctl status nginx --no-pager"

echo "Step 10: Verifying website is accessible..."
remote_exec "curl -I http://localhost"

echo "=== Deployment Complete ==="
echo "Website should now be accessible at: http://$HOST"
echo "Testing connection..."

# Test the website
if curl -s "http://$HOST" > /dev/null; then
    echo "✅ SUCCESS: Website is running and accessible!"
else
    echo "❌ WARNING: Website might not be fully accessible yet. Check nginx logs on the server."
fi

echo "=== Final Status Check ==="
remote_exec "systemctl is-active nginx && echo 'Nginx is running' || echo 'Nginx is not running'"
remote_exec "ls -la $REMOTE_PROJECT_PATH | head -10"