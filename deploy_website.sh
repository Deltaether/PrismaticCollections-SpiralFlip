#!/bin/bash

# Website Deployment Script
# This script uploads and deploys the latest Angular website

set -e

SERVER_IP="212.227.85.148"
SERVER_USER="root"
WEBSITE_PACKAGE="phantasia-website-latest.tar.gz"

echo "======================================================================"
echo "🌐 PHANTASIA WEBSITE DEPLOYMENT"
echo "======================================================================"
echo "Server: $SERVER_USER@$SERVER_IP"
echo "Package: $WEBSITE_PACKAGE"
echo

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Check if website package exists
if [ ! -f "$WEBSITE_PACKAGE" ]; then
    echo "❌ Website package $WEBSITE_PACKAGE not found!"
    echo "Run: pnpm run build && tar -czf $WEBSITE_PACKAGE -C dist/phantasia ."
    exit 1
fi

print_status "📦 Website package found: $(ls -lh $WEBSITE_PACKAGE | awk '{print $5}')"

# 1. Upload website package
print_status "📤 Uploading website package to server..."
scp -o StrictHostKeyChecking=no $WEBSITE_PACKAGE $SERVER_USER@$SERVER_IP:/tmp/

# 2. Deploy website on server
print_status "🚀 Deploying website on server..."

cat > /tmp/deploy_commands.sh << 'DEPLOYEOF'
#!/bin/bash

echo "Starting website deployment..."

# Clean up any files in root directory that belong to the website
cd /root
rm -f *.js *.css *.html *.ico phantasia-website-*.tar.gz 2>/dev/null || true
rm -rf media 2>/dev/null || true

# Create backup of existing website if it exists
if [ -d "/var/www/phantasia" ]; then
    echo "Backing up existing website..."
    mv /var/www/phantasia /var/www/phantasia.backup.$(date +%Y%m%d_%H%M%S)
fi

# Create website directory
echo "Creating website directory..."
mkdir -p /var/www/phantasia

# Extract website files to correct location
echo "Extracting website files..."
cd /var/www/phantasia
tar -xzf /tmp/phantasia-website-latest.tar.gz

# Set correct permissions
echo "Setting permissions..."
chown -R www-data:www-data /var/www/phantasia
chmod -R 755 /var/www/phantasia

# Verify deployment
echo "Verifying deployment..."
ls -la /var/www/phantasia/ | head -10

# Test nginx configuration
echo "Testing nginx configuration..."
nginx -t

# Restart nginx
echo "Restarting nginx..."
systemctl restart nginx

# Test local access
echo "Testing local access..."
curl -I http://localhost 2>/dev/null | head -3

# Clean up
echo "Cleaning up..."
rm -f /tmp/phantasia-website-latest.tar.gz

echo "✅ Website deployment completed successfully!"

# Show file count and size
echo "Deployed files:"
echo "Total files: $(find /var/www/phantasia -type f | wc -l)"
echo "Total size: $(du -sh /var/www/phantasia | cut -f1)"
DEPLOYEOF

# Upload and execute deployment script
scp -o StrictHostKeyChecking=no /tmp/deploy_commands.sh $SERVER_USER@$SERVER_IP:/tmp/

expect << EXPECTEOF
set timeout 180
spawn ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP
expect "*password*" {
    send "KC361kLC\r"
}
expect "*#*" {
    send "chmod +x /tmp/deploy_commands.sh && /tmp/deploy_commands.sh\r"
    expect "*#*"
    send "exit\r"
}
EXPECTEOF

print_success "✅ Website deployed successfully!"

# 3. Test deployment
print_status "🧪 Testing deployment..."

echo "Testing HTTP access..."
HTTP_STATUS=$(curl -I -s http://$SERVER_IP | head -1)
echo "HTTP Response: $HTTP_STATUS"

echo "Testing domain access..."
DOMAIN_STATUS=$(curl -I -s http://deeptesting.prismaticcollections.com 2>/dev/null | head -1 || echo "Domain not accessible yet")
echo "Domain Response: $DOMAIN_STATUS"

echo
echo "======================================================================"
echo "✅ DEPLOYMENT COMPLETED!"
echo "======================================================================"
echo "🌐 Website URLs:"
echo "   HTTP: http://$SERVER_IP"
echo "   Domain: http://deeptesting.prismaticcollections.com"
echo ""
echo "📁 Files deployed to: /var/www/phantasia/"
echo "⚙️ Nginx: Configured and running"
echo ""
echo "🔄 Next steps:"
echo "1. Run: ./setup_geldb_integration.sh (connect database)"
echo "2. Run: ./setup_ssl.sh (enable HTTPS)"
echo "======================================================================"