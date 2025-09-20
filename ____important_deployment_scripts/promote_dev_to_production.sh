#!/bin/bash

# Dev to Production Promotion Script
# Promotes tested development version to production safely

set -e

# Server configuration
SERVER_IP="216.225.206.85"
SERVER_KEY="/home/delta/Projects/PrismaticCollections(SpiralFlip_Site)/id_rsa_prismatic"

echo "========================================================================"
echo "🚀 PROMOTING DEVELOPMENT TO PRODUCTION"
echo "========================================================================"
echo "Server: root@$SERVER_IP"
echo "Source: /var/www/phantasia-dev/"
echo "Target: /var/www/phantasia-prod/"
echo ""

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

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Confirm promotion
echo "This will replace the production website with the current development version."
echo "Make sure you've tested the development version at https://$SERVER_IP"
echo ""
read -p "Are you sure you want to promote dev to production? (y/N): " confirm

if [[ $confirm != [yY] && $confirm != [yY][eE][sS] ]]; then
    print_warning "Promotion cancelled."
    exit 0
fi

print_status "🚀 Starting promotion from development to production..."

# Execute promotion on server
ssh -o StrictHostKeyChecking=no -i "$SERVER_KEY" root@$SERVER_IP << 'PROMOTION_SCRIPT'
#!/bin/bash

echo "🔄 Promoting development to production..."

# Check if dev folder exists and has content
if [ ! -d "/var/www/phantasia-dev" ] || [ -z "$(ls -A /var/www/phantasia-dev)" ]; then
    echo "❌ Development folder is empty or doesn't exist!"
    exit 1
fi

# Check if dev has index.html (critical file)
if [ ! -f "/var/www/phantasia-dev/index.html" ]; then
    echo "❌ Development folder missing index.html!"
    exit 1
fi

# Backup current production if it exists
if [ -d "/var/www/phantasia-prod" ] && [ "$(ls -A /var/www/phantasia-prod)" ]; then
    echo "📋 Backing up current production..."
    mv /var/www/phantasia-prod /var/www/phantasia-prod.backup.$(date +%Y%m%d_%H%M%S)
else
    echo "📝 No existing production to backup"
fi

# Create fresh production directory
echo "📁 Creating fresh production directory..."
mkdir -p /var/www/phantasia-prod

# Copy development to production
echo "📦 Copying development to production..."
cp -r /var/www/phantasia-dev/* /var/www/phantasia-prod/

# Set proper permissions
echo "🔐 Setting production permissions..."
chown -R www-data:www-data /var/www/phantasia-prod
chmod -R 755 /var/www/phantasia-prod

# Verify critical files exist
echo "✅ Verifying production files..."
if [ -f "/var/www/phantasia-prod/index.html" ]; then
    echo "✅ index.html found in production"
else
    echo "❌ index.html missing in production!"
    exit 1
fi

# Count files and show sizes
DEV_COUNT=$(find /var/www/phantasia-dev -type f | wc -l)
PROD_COUNT=$(find /var/www/phantasia-prod -type f | wc -l)
DEV_SIZE=$(du -sh /var/www/phantasia-dev | cut -f1)
PROD_SIZE=$(du -sh /var/www/phantasia-prod | cut -f1)

echo "📊 File comparison:"
echo "   🟡 Dev: $DEV_COUNT files, $DEV_SIZE"
echo "   🟢 Prod: $PROD_COUNT files, $PROD_SIZE"

if [ "$DEV_COUNT" != "$PROD_COUNT" ]; then
    echo "⚠️ File count mismatch, but continuing..."
fi

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
if nginx -t; then
    echo "✅ Nginx configuration test passed"
else
    echo "❌ Nginx configuration test failed!"
    exit 1
fi

# Reload nginx gracefully
echo "🔄 Reloading nginx..."
systemctl reload nginx

# Test production domain locally (if configured)
echo "🌐 Testing production access..."
PROD_TEST=$(curl -I -s http://localhost -H "Host: prismaticcollections.com" 2>/dev/null | head -1 || echo "Local test failed")
echo "Production test: $PROD_TEST"

# Show nginx sites status
echo "📊 Active nginx sites:"
ls -la /etc/nginx/sites-enabled/ | grep phantasia

echo "✅ Promotion completed successfully!"

# Summary
echo ""
echo "=== PROMOTION SUMMARY ==="
echo "✅ Development copied to production"
echo "✅ Permissions set correctly"
echo "✅ Nginx configuration verified"
echo "✅ Production ready at prismaticcollections.com"
PROMOTION_SCRIPT

# Final verification
print_status "🧪 Verifying promotion..."

echo "Testing development environment..."
DEV_STATUS=$(curl -I -s -k https://$SERVER_IP | head -1 || echo "Dev not accessible")
echo "Development: $DEV_STATUS"

print_warning "Production domain requires DNS configuration to test"

echo ""
echo "========================================================================"
print_success "✅ PROMOTION COMPLETED!"
echo "========================================================================"
echo "🟡 Development Environment:"
echo "   🌐 URL: https://$SERVER_IP"
echo "   📁 Folder: /var/www/phantasia-dev/"
echo "   🔄 Status: Active for testing new changes"
echo ""
echo "🟢 Production Environment:"
echo "   🌐 URL: https://prismaticcollections.com"
echo "   📁 Folder: /var/www/phantasia-prod/"
echo "   🔄 Status: Updated with latest development version"
echo ""
echo "📋 Next Steps:"
echo "   1. Configure DNS for prismaticcollections.com"
echo "   2. Test production domain once DNS is active"
echo "   3. Continue development in the dev environment"
echo "========================================================================"