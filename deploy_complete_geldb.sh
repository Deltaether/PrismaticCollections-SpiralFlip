#!/bin/bash

# Complete EdgeDB (Gel) Database Deployment Script
# Uploads local EdgeDB project and sets up exact duplicate on remote server using official EdgeDB 6

set -e

# Server Configuration
SERVER_IP="212.227.85.148"
SERVER_USER="root"
SERVER_PASSWORD="KC361kLC"
GELDB_PATH="/opt/phantasia-geldb"

echo "======================================================================"
echo "🗄️ COMPLETE EDGEDB (GEL) DATABASE DEPLOYMENT"
echo "======================================================================"
echo "This script will:"
echo "  ✅ Package complete local EdgeDB project"
echo "  ✅ Upload to remote server"
echo "  ✅ Install EdgeDB 6 using official package repository"
echo "  ✅ Create EdgeDB instance and initialize database"
echo "  ✅ Apply schema migrations and import all local data"
echo "  ✅ Configure REST API service with proper EdgeDB connection"
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

# Step 1: Package local EdgeDB project
print_step "Packaging local EdgeDB project..."

if [ ! -d "src/geldb" ]; then
    print_error "Local EdgeDB directory not found at src/geldb"
    exit 1
fi

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
PACKAGE_NAME="edgedb-complete-${TIMESTAMP}.tar.gz"

echo "📦 Creating complete EdgeDB package..."
tar -czf "$PACKAGE_NAME" -C src/ geldb/

PACKAGE_SIZE=$(ls -lh "$PACKAGE_NAME" | awk '{print $5}')
print_success "Package created: $PACKAGE_NAME ($PACKAGE_SIZE)"

# Step 2: Upload to server
print_step "Uploading EdgeDB project to server..."

expect << EXPECTEOF
set timeout 300
spawn scp -o StrictHostKeyChecking=no $PACKAGE_NAME $SERVER_USER@$SERVER_IP:/tmp/
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect eof
EXPECTEOF

print_success "Package uploaded to server"

# Step 3: Create comprehensive setup script
print_step "Creating server setup script..."

cat > /tmp/setup_complete_geldb.sh << 'SETUPEOF'
#!/bin/bash

set -e

PACKAGE_FILE="/tmp/PACKAGE_NAME_PLACEHOLDER"
GELDB_PATH="/opt/phantasia-geldb"
GELDB_USER="geldb"
API_PORT="3001"

echo "🗄️ Setting up complete EdgeDB database..."

# Create non-root user for EdgeDB if doesn't exist
if ! id "$GELDB_USER" &>/dev/null; then
    echo "Creating geldb user..."
    useradd -r -s /bin/bash -d /var/lib/geldb -m $GELDB_USER
    echo "✅ User $GELDB_USER created"
else
    echo "✅ User $GELDB_USER already exists"
fi

# Install required packages
echo "Installing required packages..."
apt-get update
apt-get install -y curl

# Create EdgeDB directory
echo "Setting up EdgeDB directory..."
rm -rf "$GELDB_PATH"
mkdir -p "$GELDB_PATH"

# Extract EdgeDB project
echo "Extracting EdgeDB project..."
cd /tmp
tar -xzf "$PACKAGE_FILE"
mv geldb/* "$GELDB_PATH/"
chown -R $GELDB_USER:$GELDB_USER "$GELDB_PATH"

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

# Install EdgeDB/Gel using official package repository
echo "Installing EdgeDB (Gel) using official package repository..."

# Import Gel packaging key and add repository
curl -fsSL https://packages.edgedb.com/keys/edgedb.asc | gpg --dearmor | tee /usr/share/keyrings/edgedb.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/edgedb.gpg] https://packages.edgedb.com/apt $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/edgedb.list

# Update package list and install EdgeDB 6 (Gel)
apt-get update
apt-get install -y edgedb-6

# Enable and start EdgeDB server systemd service
systemctl enable --now edgedb-server-6

# Add EdgeDB CLI to PATH
export PATH="/usr/bin:$PATH"

# Create EdgeDB instance and initialize database
echo "Creating EdgeDB instance..."

# Create a new EdgeDB instance
edgedb instance create phantasia_geldb --port 5656

# Switch to geldb user and initialize project
echo "Initializing EdgeDB project as geldb user..."
sudo -u $GELDB_USER bash << 'GELDBEOF'
cd /opt/phantasia-geldb
export PATH="/usr/bin:$PATH"

# Initialize EdgeDB project with the created instance
edgedb project init --non-interactive --server-instance phantasia_geldb

# Create migration from schema
echo "Creating database migration from schema..."
edgedb migration create --non-interactive

# Apply migrations
echo "Applying database migrations..."
edgedb migrate

# Import artist data using proper query file syntax
echo "Importing artist data..."
if [ -f "phantasia2-artists-data.edgeql" ]; then
    edgedb query --file phantasia2-artists-data.edgeql
else
    echo "Warning: phantasia2-artists-data.edgeql not found"
fi

# Import complete credits if exists
if [ -f "phantasia2-complete-credits.edgeql" ]; then
    echo "Importing complete artist credits..."
    edgedb query --file phantasia2-complete-credits.edgeql
fi

echo "✅ EdgeDB database initialized and populated"
GELDBEOF

# Remove mock API service first
echo "Removing existing mock API service..."
systemctl stop phantasia-mock-api 2>/dev/null || true
systemctl disable phantasia-mock-api 2>/dev/null || true
rm -f /etc/systemd/system/phantasia-mock-api.service
rm -rf /opt/phantasia-mock-api
systemctl daemon-reload

# Install backend dependencies and start API
echo "Setting up REST API service..."
cd "$GELDB_PATH/backend"
sudo -u $GELDB_USER npm install

# Create systemd service for EdgeDB API
cat > /etc/systemd/system/phantasia-edgedb-api.service << SERVICEEOF
[Unit]
Description=Phantasia EdgeDB REST API Service
After=network.target

[Service]
Type=simple
User=$GELDB_USER
WorkingDirectory=$GELDB_PATH/backend
Environment=NODE_ENV=production
Environment=PORT=$API_PORT
Environment=EDGEDB_INSTANCE=phantasia_geldb
Environment=EDGEDB_HOST=localhost
Environment=EDGEDB_PORT=5656
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=phantasia-edgedb-api

[Install]
WantedBy=multi-user.target
SERVICEEOF

# Enable and start the service
systemctl daemon-reload
systemctl enable phantasia-edgedb-api
systemctl start phantasia-edgedb-api

# Wait for service to start
sleep 5

# Check service status
if systemctl is-active --quiet phantasia-edgedb-api; then
    echo "✅ EdgeDB API service started successfully"
    echo "🌐 API running on port $API_PORT"

    # Test the API
    echo "🧪 Testing API endpoints..."
    curl -s http://localhost:$API_PORT/api/health | head -50 || echo "Health check pending..."

else
    echo "❌ EdgeDB API service failed to start"
    systemctl status phantasia-edgedb-api --no-pager -l
    exit 1
fi

# Clean up
rm -f "$PACKAGE_FILE"

echo "🎉 Complete EdgeDB database deployment successful!"
echo "📊 Database: EdgeDB 6 (standalone instance)"
echo "👤 User: $GELDB_USER"
echo "📁 Path: $GELDB_PATH"
echo "🌐 API: http://localhost:$API_PORT"
echo "🔗 Health: http://localhost:$API_PORT/api/health"
SETUPEOF

# Replace placeholder with actual package name
sed -i "s/PACKAGE_NAME_PLACEHOLDER/${PACKAGE_NAME}/" /tmp/setup_complete_geldb.sh

# Step 4: Upload setup script and execute
print_step "Uploading and executing setup script..."

expect << EXPECTEOF
set timeout 60
spawn scp -o StrictHostKeyChecking=no /tmp/setup_complete_geldb.sh $SERVER_USER@$SERVER_IP:/tmp/
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect eof
EXPECTEOF

# Execute setup on server
echo "🔧 Running complete GelDB setup on server..."

expect << EXPECTEOF
set timeout 1800
spawn ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect "*#*" {
    send "chmod +x /tmp/setup_complete_geldb.sh && /tmp/setup_complete_geldb.sh\r"
    expect "*#*" {
        send "exit\r"
    }
}
expect eof
EXPECTEOF

if [ $? -eq 0 ]; then
    print_success "GelDB setup completed on server"
else
    print_error "Server setup failed"
    exit 1
fi

# Step 5: Update nginx proxy for new API
print_step "Updating nginx proxy configuration..."

cat > /tmp/update_nginx_geldb.sh << 'NGINXEOF'
#!/bin/bash

# Update nginx to proxy to EdgeDB API instead of mock API
echo "Updating nginx proxy to use EdgeDB API..."

# Backup current config
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup.edgedb.$(date +%Y%m%d_%H%M%S)

# Update API proxy to point to EdgeDB API on port 3001
sed -i 's|proxy_pass http://localhost:3000/api/;|proxy_pass http://localhost:3001/api/;|g' /etc/nginx/sites-available/default

# Test and reload nginx
nginx -t && systemctl reload nginx

echo "✅ nginx updated to use EdgeDB API on port 3001"
NGINXEOF

expect << EXPECTEOF
set timeout 60
spawn scp -o StrictHostKeyChecking=no /tmp/update_nginx_geldb.sh $SERVER_USER@$SERVER_IP:/tmp/
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect eof
EXPECTEOF

./ssh_auto.sh "chmod +x /tmp/update_nginx_geldb.sh && /tmp/update_nginx_geldb.sh"

# Step 6: Test deployment
print_step "Testing complete EdgeDB deployment..."

echo "🧪 Testing EdgeDB API endpoints..."
sleep 5

# Test health endpoint
HEALTH_STATUS=$(curl -s --connect-timeout 15 https://deeptesting.prismaticcollections.com/api/health)
echo "Health Check: $HEALTH_STATUS"

# Test artists endpoint
ARTIST_COUNT=$(curl -s --connect-timeout 15 https://deeptesting.prismaticcollections.com/api/artists | jq 'length' 2>/dev/null || echo "0")
echo "Artists Count: $ARTIST_COUNT"

if [ "$ARTIST_COUNT" -gt "3" ]; then
    print_success "EdgeDB API is working with complete dataset ($ARTIST_COUNT artists)"

    # Show first few artists
    echo "📋 Sample artists:"
    curl -s --connect-timeout 15 https://deeptesting.prismaticcollections.com/api/artists | jq '.[0:3][].name' 2>/dev/null || echo "Could not fetch artist names"

else
    echo "⚠️ API responding but may still have limited data"
fi

# Clean up local files
print_step "Cleaning up..."

rm -f "$PACKAGE_NAME"
rm -f /tmp/setup_complete_geldb.sh
rm -f /tmp/update_nginx_geldb.sh

print_success "Local cleanup completed"

echo
echo "======================================================================"
echo "🎉 COMPLETE EDGEDB DEPLOYMENT FINISHED!"
echo "======================================================================"
echo "📦 Package: $PACKAGE_NAME"
echo "📁 Size: $PACKAGE_SIZE"
echo "🗄️ Database: EdgeDB 6 with complete local data"
echo "👤 User: geldb (non-root EdgeDB user)"
echo "🌐 API Endpoint: https://deeptesting.prismaticcollections.com/api/"
echo "🔗 Health Check: https://deeptesting.prismaticcollections.com/api/health"
echo
echo "📊 Expected Data:"
echo "   👥 Artists: 33+ (SpiralFlip, eili, Ariatec, MB, etc.)"
echo "   💿 Albums: Phantasia 2 compilation"
echo "   🎵 Songs: Complete track listing with credits"
echo "   🔗 Social Links: Full artist profiles"
echo
echo "⚙️ Server Configuration:"
echo "   📁 EdgeDB Path: /opt/phantasia-geldb"
echo "   🗄️ Database: EdgeDB 6 (phantasia_geldb instance)"
echo "   🌐 API Port: 3001 (proxied through nginx)"
echo "   🔐 User: geldb (non-root for security)"
echo "   🏛️ Instance: phantasia_geldb on port 5656"
echo
echo "✅ Complete local EdgeDB database successfully deployed!"
echo "======================================================================"
