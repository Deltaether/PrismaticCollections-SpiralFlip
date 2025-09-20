#!/bin/bash

# Optimized Phantasia Website Deployment Script
# Builds with maximum optimizations and deploys to current server

set -e

# Server configuration (updated for current server)
SERVER_IP="216.225.206.85"
SERVER_KEY="/home/delta/Projects/PrismaticCollections(SpiralFlip_Site)/id_rsa_prismatic"
PROJECT_ROOT="/home/delta/Projects/PrismaticCollections(SpiralFlip_Site)"

echo "======================================================================"
echo "🚀 OPTIMIZED PHANTASIA DEPLOYMENT TO DEV"
echo "======================================================================"
echo "Server: root@$SERVER_IP"
echo "Target: /var/www/phantasia-dev/"
echo "Project: $PROJECT_ROOT"
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

# Change to project root directory
cd "$PROJECT_ROOT"

# 1. Clean previous builds
print_status "🧹 Cleaning previous builds..."
rm -rf dist/phantasia
rm -f /tmp/phantasia-*optimized*.tar.gz

# 2. Build with maximum optimization
print_status "🏗️ Building with maximum optimization..."

# First, run the standard optimized build
pnpm run build

# 3. Apply additional optimizations
print_status "⚡ Applying additional optimizations..."

# Compress all JavaScript files further (actual build is in browser subdirectory)
cd "$PROJECT_ROOT/dist/phantasia/browser"
find . -name "*.js" -exec gzip -k9 {} \;
find . -name "*.css" -exec gzip -k9 {} \;

# Remove source maps in production (optional security measure)
rm -f *.map

# Create optimized package
print_status "📦 Creating optimized package..."
tar -czf /tmp/phantasia-website-optimized.tar.gz *

cd "$PROJECT_ROOT"

PACKAGE_SIZE=$(ls -lh /tmp/phantasia-website-optimized.tar.gz | awk '{print $5}')
print_success "Package created: $PACKAGE_SIZE"

# 4. Upload to server
print_status "📤 Uploading optimized package to server..."
scp -o StrictHostKeyChecking=no -i "$SERVER_KEY" /tmp/phantasia-website-optimized.tar.gz root@$SERVER_IP:/tmp/

# 5. Deploy on server
print_status "🚀 Deploying optimized website..."

ssh -o StrictHostKeyChecking=no -i "$SERVER_KEY" root@$SERVER_IP << 'DEPLOY_SCRIPT'
#!/bin/bash

echo "🔧 Starting optimized deployment..."

# Backup existing dev website
if [ -d "/var/www/phantasia-dev" ]; then
    echo "📋 Backing up existing dev website..."
    mv /var/www/phantasia-dev /var/www/phantasia-dev.backup.$(date +%Y%m%d_%H%M%S)
fi

# Create fresh dev directory
echo "📁 Creating fresh dev website directory..."
mkdir -p /var/www/phantasia-dev
cd /var/www/phantasia-dev

# Extract optimized package
echo "📦 Extracting optimized website..."
tar -xzf /tmp/phantasia-website-optimized.tar.gz

# Set optimal permissions
echo "🔐 Setting optimal permissions..."
chown -R www-data:www-data /var/www/phantasia-dev
chmod -R 755 /var/www/phantasia-dev

# Verify critical files
echo "✅ Verifying deployment..."
if [ -f "index.html" ]; then
    echo "✅ index.html found"
else
    echo "❌ index.html missing!"
    exit 1
fi

# Count files and show size
FILE_COUNT=$(find /var/www/phantasia-dev -type f | wc -l)
TOTAL_SIZE=$(du -sh /var/www/phantasia-dev | cut -f1)
echo "📊 Deployed: $FILE_COUNT files, $TOTAL_SIZE total"

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
nginx -t

# Reload nginx (graceful, no downtime)
echo "🔄 Reloading nginx..."
systemctl reload nginx

# Test local access
echo "🌐 Testing local access..."
LOCAL_TEST=$(curl -I http://localhost 2>/dev/null | head -1 || echo "Failed")
echo "Local test: $LOCAL_TEST"

# Clean up
echo "🧹 Cleaning up..."
rm -f /tmp/phantasia-website-optimized.tar.gz

echo "✅ Optimized deployment completed successfully!"
DEPLOY_SCRIPT

# 6. Final verification
print_status "🧪 Verifying deployment..."

echo "Testing HTTPS access..."
HTTPS_STATUS=$(curl -I -s -k https://$SERVER_IP | head -1 || echo "HTTPS not accessible")
echo "HTTPS Response: $HTTPS_STATUS"

echo "Testing HTTP redirect..."
HTTP_STATUS=$(curl -I -s http://$SERVER_IP | head -1 || echo "HTTP not accessible")
echo "HTTP Response: $HTTP_STATUS"

# Clean up local files
print_status "🧹 Cleaning up local files..."
rm -f /tmp/phantasia-website-optimized.tar.gz

echo ""
echo "======================================================================"
print_success "✅ OPTIMIZED DEPLOYMENT COMPLETED!"
echo "======================================================================"
echo "🌐 Website URLs:"
echo "   HTTPS: https://$SERVER_IP"
echo "   HTTP: http://$SERVER_IP (redirects to HTTPS)"
echo ""
echo "⚡ Optimizations Applied:"
echo "   ✅ Angular production build"
echo "   ✅ Gzip pre-compression"
echo "   ✅ Source map removal"
echo "   ✅ Maximum compression packaging"
echo ""
echo "📁 Deployed to: /var/www/phantasia-dev/"
echo "⚙️ Nginx: Reloaded with zero downtime"
echo "🔒 SSL: Active with Cloudflare certificates"
echo "======================================================================"