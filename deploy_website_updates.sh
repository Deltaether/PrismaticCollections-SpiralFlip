#!/bin/bash

# Simple Angular Website Build & Deploy Script
# Builds the Angular app and uploads distribution files to nginx server

set -e

# Server Configuration
SERVER_IP="212.227.85.148"
SERVER_USER="root"
SERVER_PASSWORD="KC361kLC"
NGINX_WEB_ROOT="/var/www/phantasia"

echo "======================================================================"
echo "🚀 ANGULAR WEBSITE BUILD & DEPLOY"
echo "======================================================================"
echo "Server: $SERVER_USER@$SERVER_IP"
echo "Target: $NGINX_WEB_ROOT"
echo "This script will:"
echo "  ✅ Build Angular production app"
echo "  ✅ Create deployment package"
echo "  ✅ Upload to nginx web root"
echo "  ✅ Set proper permissions"
echo "======================================================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_step() {
    echo
    echo -e "${BLUE}🚀 $1${NC}"
}

# Step 1: Build Angular application
print_step "Building Angular application..."

if [ ! -f "package.json" ]; then
    print_error "package.json not found. Run this script from the Angular project root."
    exit 1
fi

# Clean previous build
rm -rf dist/

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    pnpm install
fi

# Build for production
echo "Building for production..."
pnpm run build

if [ ! -d "dist/phantasia" ]; then
    print_error "Build failed - dist/phantasia directory not found"
    exit 1
fi

print_success "Angular build completed"

# Step 2: Create deployment package
print_step "Creating deployment package..."

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
PACKAGE_NAME="phantasia-website-${TIMESTAMP}.tar.gz"

cd dist/phantasia
tar -czf "../../${PACKAGE_NAME}" .
cd ../..

PACKAGE_SIZE=$(ls -lh "$PACKAGE_NAME" | awk '{print $5}')
print_success "Package created: $PACKAGE_NAME ($PACKAGE_SIZE)"

# Step 3: Upload to server
print_step "Uploading to server..."

echo "📤 Uploading $PACKAGE_NAME to server..."

expect << EXPECTEOF
set timeout 300
spawn scp -o StrictHostKeyChecking=no $PACKAGE_NAME $SERVER_USER@$SERVER_IP:/tmp/
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect eof
EXPECTEOF

if [ $? -eq 0 ]; then
    print_success "Package uploaded successfully"
else
    print_error "Upload failed"
    exit 1
fi

# Step 4: Deploy on server
print_step "Deploying on server..."

cat > /tmp/deploy_website.sh << 'DEPLOYEOF'
#!/bin/bash

PACKAGE_FILE="/tmp/PACKAGE_NAME_PLACEHOLDER"
WEB_ROOT="/var/www/phantasia"

echo "Deploying website to $WEB_ROOT..."

# Backup current website
if [ -d "$WEB_ROOT" ]; then
    echo "Creating backup..."
    cp -r "$WEB_ROOT" "${WEB_ROOT}.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Create web root if it doesn't exist
mkdir -p "$WEB_ROOT"

# Clear current content (except hidden files like .well-known)
echo "Clearing current website files..."
find "$WEB_ROOT" -mindepth 1 -not -path '*/\.*' -delete

# Extract new website
echo "Extracting new website files..."
cd "$WEB_ROOT"
tar -xzf "$PACKAGE_FILE"

# Set proper permissions
echo "Setting permissions..."
chown -R www-data:www-data "$WEB_ROOT"
chmod -R 755 "$WEB_ROOT"
find "$WEB_ROOT" -type f -exec chmod 644 {} \;

# Verify index.html exists
if [ -f "$WEB_ROOT/index.html" ]; then
    echo "✅ Website deployed successfully"
    echo "📁 Files in web root:"
    ls -la "$WEB_ROOT" | head -10
else
    echo "❌ Deployment failed - index.html not found"
    exit 1
fi

# Clean up package
rm -f "$PACKAGE_FILE"

echo "Website deployment completed"
DEPLOYEOF

# Replace placeholder with actual package name
sed -i "s/PACKAGE_NAME_PLACEHOLDER/${PACKAGE_NAME}/" /tmp/deploy_website.sh

# Upload deployment script
expect << EXPECTEOF
set timeout 60
spawn scp -o StrictHostKeyChecking=no /tmp/deploy_website.sh $SERVER_USER@$SERVER_IP:/tmp/
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect eof
EXPECTEOF

# Run deployment on server
echo "🔧 Running deployment on server..."

expect << EXPECTEOF
set timeout 180
spawn ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect "*#*" {
    send "chmod +x /tmp/deploy_website.sh && /tmp/deploy_website.sh\r"
    expect "*#*"
    send "exit\r"
}
EXPECTEOF

if [ $? -eq 0 ]; then
    print_success "Website deployed on server"
else
    print_error "Server deployment failed"
    exit 1
fi

# Step 5: Test deployment
print_step "Testing deployment..."

echo "🧪 Testing website access..."
sleep 3

# Test HTTPS domain
HTTPS_STATUS=$(curl -I -s --connect-timeout 15 https://deeptesting.prismaticcollections.com/ | head -1)
echo "HTTPS Domain: $HTTPS_STATUS"

# Test HTTPS IP
HTTPS_IP_STATUS=$(curl -I -s -k --connect-timeout 15 https://212.227.85.148/ | head -1)
echo "HTTPS IP: $HTTPS_IP_STATUS"

# Test content
echo "Testing website content..."
TITLE=$(curl -s --connect-timeout 15 https://deeptesting.prismaticcollections.com/ | grep -i "<title>" | head -1)
if echo "$TITLE" | grep -q "Prismatic Collections"; then
    print_success "Website content verified - Prismatic Collections detected"
else
    echo "⚠️ Website content check: $TITLE"
fi

# Clean up local files
print_step "Cleaning up..."

rm -f "$PACKAGE_NAME"
rm -f /tmp/deploy_website.sh

print_success "Local cleanup completed"

echo
echo "======================================================================"
echo "🎉 DEPLOYMENT COMPLETED!"
echo "======================================================================"
echo "📦 Package: $PACKAGE_NAME"
echo "📁 Size: $PACKAGE_SIZE"
echo "🌐 Website URLs:"
echo "   🔒 HTTPS: https://deeptesting.prismaticcollections.com/"
echo "   📍 IP: https://212.227.85.148/"
echo "   📄 HTTP: http://deeptesting.prismaticcollections.com/ (redirects to HTTPS)"
echo
echo "⚙️ Server Info:"
echo "   📁 Web Root: $NGINX_WEB_ROOT"
echo "   🔐 Permissions: www-data:www-data (755/644)"
echo "   🗄️ Backup: Created with timestamp"
echo
echo "✅ Angular website successfully deployed!"
echo "======================================================================"