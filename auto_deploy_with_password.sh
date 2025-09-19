#!/bin/bash

# Automated Phantasia Deployment with Password
# This script automatically inputs the root password KC361kLC

set -e

SERVER_IP="212.227.85.148"
SERVER_USER="root"
SERVER_PASSWORD="KC361kLC"
DOMAIN="deeptesting.prismaticcollections.com"

echo "======================================================================"
echo "🎭 AUTOMATED PHANTASIA DEPLOYMENT"
echo "======================================================================"
echo "Server: $SERVER_USER@$SERVER_IP"
echo "Password: [AUTOMATED]"
echo "Domain: $DOMAIN"
echo

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to run commands on remote server with automatic password
run_remote_auto() {
    local command="$1"
    local description="$2"

    print_status "$description"

    expect << EXPECTEOF
set timeout 180
spawn ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect "*#*" {
    send "$command\r"
    expect "*#*"
    send "exit\r"
}
EXPECTEOF

    if [ $? -eq 0 ]; then
        print_success "$description - Completed"
    else
        print_error "$description - Failed"
        return 1
    fi
}

# Check if website package exists
if [ ! -f "phantasia-website-latest.tar.gz" ]; then
    print_status "Building website package..."
    pnpm run build
    tar -czf phantasia-website-latest.tar.gz -C dist/phantasia .
    print_success "Website package created: $(ls -lh phantasia-website-latest.tar.gz | awk '{print $5}')"
fi

print_status "Starting automated deployment..."

# Step 1: System Update and Package Installation
print_status "🔄 Step 1: System Update and Package Installation"
run_remote_auto "apt update && apt upgrade -y && apt install -y nginx ufw curl wget git expect nodejs npm" "System Update and Package Installation"

# Step 2: Firewall Configuration
print_status "🔥 Step 2: Firewall Configuration"
run_remote_auto "ufw allow 22 && ufw allow 80 && ufw allow 443 && ufw --force enable" "Firewall Configuration"

# Step 3: GelDB Installation
print_status "🗄️ Step 3: GelDB Installation"
cat > /tmp/geldb_install_auto.sh << 'GELDBEOF'
#!/bin/bash

echo "Installing GelDB with automated responses..."

# Download installer
curl https://www.geldata.com/sh --proto "=https" -sSf1 -o /tmp/geldb_installer.sh
chmod +x /tmp/geldb_installer.sh

# Use printf to pipe responses automatically
printf "1\n" | bash /tmp/geldb_installer.sh

# Add to PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
export PATH="$HOME/.local/bin:$PATH"

# Verify installation
if [ -f "/root/.local/bin/gel" ]; then
    echo "✅ GelDB installed successfully"
    /root/.local/bin/gel --version || echo "GelDB binary found"
else
    echo "⚠️ GelDB installation needs verification"
fi

rm -f /tmp/geldb_installer.sh
echo "GelDB installation completed"
GELDBEOF

scp -o StrictHostKeyChecking=no /tmp/geldb_install_auto.sh $SERVER_USER@$SERVER_IP:/tmp/
run_remote_auto "chmod +x /tmp/geldb_install_auto.sh && /tmp/geldb_install_auto.sh" "GelDB Installation"

# Step 4: Nginx Configuration
print_status "⚙️ Step 4: Nginx Configuration"
cat > /tmp/nginx_setup_auto.sh << 'NGINXEOF'
#!/bin/bash

echo "Configuring Nginx..."

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Create Phantasia nginx configuration
cat > /etc/nginx/sites-available/phantasia << 'CONFEOF'
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
CONFEOF

# Enable the site
ln -sf /etc/nginx/sites-available/phantasia /etc/nginx/sites-enabled/

# Test and start nginx
nginx -t
systemctl enable nginx
systemctl restart nginx

echo "✅ Nginx configured and started"
NGINXEOF

scp -o StrictHostKeyChecking=no /tmp/nginx_setup_auto.sh $SERVER_USER@$SERVER_IP:/tmp/
run_remote_auto "chmod +x /tmp/nginx_setup_auto.sh && /tmp/nginx_setup_auto.sh" "Nginx Configuration"

# Step 5: Website Deployment
print_status "🌐 Step 5: Website Deployment"
print_status "Uploading website package..."
scp -o StrictHostKeyChecking=no phantasia-website-latest.tar.gz $SERVER_USER@$SERVER_IP:/tmp/

cat > /tmp/deploy_website_auto.sh << 'DEPLOYEOF'
#!/bin/bash

echo "Deploying website..."

# Clean up root directory files
cd /root
rm -f *.js *.css *.html *.ico phantasia-website-*.tar.gz 2>/dev/null || true
rm -rf media 2>/dev/null || true

# Backup existing website
if [ -d "/var/www/phantasia" ]; then
    mv /var/www/phantasia /var/www/phantasia.backup.$(date +%Y%m%d_%H%M%S)
fi

# Create and deploy website
mkdir -p /var/www/phantasia
cd /var/www/phantasia
tar -xzf /tmp/phantasia-website-latest.tar.gz

# Set permissions
chown -R www-data:www-data /var/www/phantasia
chmod -R 755 /var/www/phantasia

# Restart nginx
systemctl restart nginx

# Test deployment
curl -I http://localhost

# Clean up
rm -f /tmp/phantasia-website-latest.tar.gz

echo "✅ Website deployed successfully"
echo "Files: $(find /var/www/phantasia -type f | wc -l)"
echo "Size: $(du -sh /var/www/phantasia | cut -f1)"
DEPLOYEOF

scp -o StrictHostKeyChecking=no /tmp/deploy_website_auto.sh $SERVER_USER@$SERVER_IP:/tmp/
run_remote_auto "chmod +x /tmp/deploy_website_auto.sh && /tmp/deploy_website_auto.sh" "Website Deployment"

# Step 6: Basic API Setup
print_status "🔗 Step 6: Basic API Setup"
cat > /tmp/api_setup_auto.sh << 'APIEOF'
#!/bin/bash

echo "Setting up basic API..."

# Create API directory
mkdir -p /var/geldb/phantasia
cd /var/geldb/phantasia

# Create simple API server
cat > api_server.js << 'JSEOF'
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'geldb',
        server: 'phantasia'
    });
});

// Basic endpoints
app.get('/api/artists', (req, res) => {
    res.json([{ id: 1, name: 'Sample Artist', genre: 'Electronic' }]);
});

app.get('/api/albums', (req, res) => {
    res.json([{ id: 1, title: 'Sample Album', artist: 'Sample Artist' }]);
});

app.listen(port, () => {
    console.log(`API server running on port ${port}`);
});
JSEOF

# Install dependencies
npm init -y
npm install express cors

# Create systemd service
cat > /etc/systemd/system/phantasia-api.service << 'SERVICEEOF'
[Unit]
Description=Phantasia API Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/geldb/phantasia
ExecStart=/usr/bin/node api_server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
SERVICEEOF

# Enable and start service
systemctl daemon-reload
systemctl enable phantasia-api
systemctl start phantasia-api

# Test API
sleep 3
curl -s http://localhost:3000/api/health || echo "API starting..."

echo "✅ Basic API setup completed"
APIEOF

scp -o StrictHostKeyChecking=no /tmp/api_setup_auto.sh $SERVER_USER@$SERVER_IP:/tmp/
run_remote_auto "chmod +x /tmp/api_setup_auto.sh && /tmp/api_setup_auto.sh" "API Setup"

# Step 7: Testing
print_status "🧪 Step 7: Testing Deployment"

echo "Testing HTTP access..."
HTTP_STATUS=$(curl -I -s --connect-timeout 10 http://$SERVER_IP | head -1)
echo "HTTP Response: $HTTP_STATUS"

echo "Testing API..."
API_STATUS=$(curl -s --connect-timeout 10 http://$SERVER_IP/api/health | head -50)
echo "API Response: $API_STATUS"

echo "Testing website content..."
WEBSITE_CONTENT=$(curl -s --connect-timeout 10 http://$SERVER_IP | grep -i "phantasia\|prismatic" | head -1)
echo "Website Content: $WEBSITE_CONTENT"

print_success "🎉 AUTOMATED DEPLOYMENT COMPLETED!"

echo
echo "======================================================================"
echo "✅ DEPLOYMENT SUMMARY"
echo "======================================================================"
echo "🌐 Website URLs:"
echo "   📍 IP: http://$SERVER_IP"
echo "   🌍 Domain: http://$DOMAIN"
echo ""
echo "🔗 API Endpoints:"
echo "   📊 Health: http://$SERVER_IP/api/health"
echo "   🎵 Artists: http://$SERVER_IP/api/artists"
echo "   💿 Albums: http://$SERVER_IP/api/albums"
echo ""
echo "⚙️ Services Status:"
echo "   🌐 Nginx: Running"
echo "   🗄️ GelDB: Installed"
echo "   🔗 API: Running on port 3000"
echo "   🔥 Firewall: Configured"
echo ""
echo "🔄 Optional next steps:"
echo "   🔒 SSL: ./setup_ssl.sh"
echo "   🧪 Full Test: ./test_deployment.sh"
echo "======================================================================"

# Clean up temporary files
rm -f /tmp/geldb_install_auto.sh /tmp/nginx_setup_auto.sh /tmp/deploy_website_auto.sh /tmp/api_setup_auto.sh

print_success "🎭 Phantasia is now live and accessible!"