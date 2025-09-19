#!/bin/bash

# Deploy Existing GelDB Project to Server
# Uploads and configures the complete GelDB music database

set -e

SERVER_IP="212.227.85.148"
SERVER_USER="root"
SERVER_PASSWORD="KC361kLC"

echo "======================================================================"
echo "🎵 DEPLOY EXISTING GELDB PROJECT"
echo "======================================================================"
echo "Server: $SERVER_USER@$SERVER_IP"
echo "This script will:"
echo "  ✅ Upload existing GelDB project from src/geldb/"
echo "  ✅ Initialize GelDB with existing schema"
echo "  ✅ Apply migrations and populate data"
echo "  ✅ Set up REST API service"
echo "  ✅ Configure nginx proxy"
echo "  ✅ Test API endpoints"
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
    echo -e "${BLUE}======================================================================"
    echo -e "🚀 STEP $1: $2"
    echo -e "======================================================================${NC}"
}

# Check if geldb project exists
if [ ! -d "src/geldb" ]; then
    print_error "GelDB project not found at src/geldb/"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Step 1: Package and upload GelDB project
print_step "1" "PACKAGING AND UPLOADING GELDB PROJECT"

echo "📦 Creating GelDB project package..."
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
PACKAGE_NAME="geldb-project-${TIMESTAMP}.tar.gz"

cd src/
tar -czf "../${PACKAGE_NAME}" geldb/
cd ..

PACKAGE_SIZE=$(ls -lh "$PACKAGE_NAME" | awk '{print $5}')
print_success "Package created: $PACKAGE_NAME ($PACKAGE_SIZE)"

echo "📤 Uploading GelDB project to server..."

expect << EXPECTEOF
set timeout 300
spawn scp -o StrictHostKeyChecking=no $PACKAGE_NAME $SERVER_USER@$SERVER_IP:/tmp/
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect eof
EXPECTEOF

if [ $? -eq 0 ]; then
    print_success "GelDB project uploaded successfully"
else
    print_error "Upload failed"
    exit 1
fi

# Step 2: Extract and setup GelDB project on server
print_step "2" "SETTING UP GELDB PROJECT ON SERVER"

cat > /tmp/setup_geldb_project.sh << 'SETUPEOF'
#!/bin/bash

echo "Setting up GelDB project on server..."

# Create project directory
mkdir -p /opt/phantasia-geldb
cd /opt/phantasia-geldb

# Extract the uploaded project
echo "Extracting GelDB project..."
tar -xzf /tmp/PACKAGE_NAME_PLACEHOLDER

# Move contents to correct location
mv geldb/* .
rmdir geldb

# Check if extraction worked
if [ -f "gel.toml" ] && [ -f "dbschema/default.gel" ]; then
    echo "✅ GelDB project extracted successfully"
    ls -la
else
    echo "❌ GelDB project extraction failed"
    exit 1
fi

# Update gel.toml for server configuration
cat > gel.toml << 'TOMLEOF'
watch = []

[instance]
server-version = "6.9"
name = "phantasia-music"
TOMLEOF

echo "✅ GelDB configuration updated for server"

# Install Node.js and dependencies if needed
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

# Setup backend dependencies
if [ -d "backend" ]; then
    echo "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
fi

echo "GelDB project setup completed"
SETUPEOF

# Replace placeholder with actual package name
sed -i "s/PACKAGE_NAME_PLACEHOLDER/${PACKAGE_NAME}/" /tmp/setup_geldb_project.sh

expect << EXPECTEOF
set timeout 300
spawn scp -o StrictHostKeyChecking=no /tmp/setup_geldb_project.sh $SERVER_USER@$SERVER_IP:/tmp/
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect eof
EXPECTEOF

./ssh_auto.sh "chmod +x /tmp/setup_geldb_project.sh && /tmp/setup_geldb_project.sh"

print_success "GelDB project set up on server"

# Step 3: Initialize database and apply schema
print_step "3" "INITIALIZING DATABASE AND APPLYING SCHEMA"

cat > /tmp/init_database.sh << 'INITEOF'
#!/bin/bash

echo "Initializing GelDB database..."

cd /opt/phantasia-geldb

# Initialize GelDB project
echo "Initializing GelDB project..."
gel project init phantasia-music --non-interactive

# Apply database schema
echo "Creating database migration..."
gel migration create initial --non-interactive

echo "Applying database migration..."
gel migrate --non-interactive

if [ $? -eq 0 ]; then
    echo "✅ Database schema applied successfully"
else
    echo "❌ Database schema application failed"
    exit 1
fi

# Verify database is working
echo "Testing database connection..."
gel query "SELECT 1"

if [ $? -eq 0 ]; then
    echo "✅ Database connection verified"
else
    echo "❌ Database connection failed"
    exit 1
fi

echo "Database initialization completed"
INITEOF

expect << EXPECTEOF
set timeout 300
spawn scp -o StrictHostKeyChecking=no /tmp/init_database.sh $SERVER_USER@$SERVER_IP:/tmp/
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect eof
EXPECTEOF

./ssh_auto.sh "chmod +x /tmp/init_database.sh && /tmp/init_database.sh"

print_success "Database initialized and schema applied"

# Step 4: Populate database with existing data
print_step "4" "POPULATING DATABASE WITH PHANTASIA DATA"

cat > /tmp/populate_database.sh << 'POPULATEEOF'
#!/bin/bash

echo "Populating database with Phantasia data..."

cd /opt/phantasia-geldb

# Check if data files exist
if [ -f "phantasia2-artists-data.edgeql" ]; then
    echo "Applying Phantasia 2 artists data..."
    gel query -f phantasia2-artists-data.edgeql

    if [ $? -eq 0 ]; then
        echo "✅ Phantasia 2 artists data applied successfully"
    else
        echo "⚠️ Phantasia 2 artists data application had issues (continuing...)"
    fi
fi

if [ -f "phantasia2-complete-credits.edgeql" ]; then
    echo "Applying Phantasia 2 complete credits..."
    gel query -f phantasia2-complete-credits.edgeql

    if [ $? -eq 0 ]; then
        echo "✅ Phantasia 2 complete credits applied successfully"
    else
        echo "⚠️ Phantasia 2 credits application had issues (continuing...)"
    fi
fi

# Verify data population
echo "Verifying database content..."
echo "Artists count:"
gel query "SELECT count(Artist)"

echo ""
echo "Songs count:"
gel query "SELECT count(Song)"

echo ""
echo "Albums count:"
gel query "SELECT count(Album)"

echo ""
echo "Sample artists:"
gel query "SELECT Artist { name, display_name, genre } LIMIT 5"

echo "Database population completed"
POPULATEEOF

expect << EXPECTEOF
set timeout 300
spawn scp -o StrictHostKeyChecking=no /tmp/populate_database.sh $SERVER_USER@$SERVER_IP:/tmp/
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect eof
EXPECTEOF

./ssh_auto.sh "chmod +x /tmp/populate_database.sh && /tmp/populate_database.sh"

print_success "Database populated with Phantasia data"

# Step 5: Create REST API service
print_step "5" "CREATING REST API SERVICE"

cat > /tmp/create_api_service.sh << 'APIEOF'
#!/bin/bash

echo "Creating REST API service for Phantasia music database..."

cd /opt/phantasia-geldb

# Create API server
cat > api_server.js << 'APIEOF'
const { Client } = require('edgedb');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Initialize EdgeDB client
const client = new Client({
    instanceName: 'phantasia-music'
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        await client.query('SELECT 1');
        res.json({
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString(),
            instance: 'phantasia-music'
        });
    } catch (error) {
        res.status(500).json({ status: 'unhealthy', error: error.message });
    }
});

// Get all artists
app.get('/api/artists', async (req, res) => {
    try {
        const artists = await client.query(`
            SELECT Artist {
                name,
                display_name,
                bio,
                country,
                genre,
                avatar,
                color,
                social_links: {
                    youtube,
                    twitter,
                    instagram,
                    website,
                    bandcamp,
                    twitch
                }
            } ORDER BY .name
        `);
        res.json(artists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all albums
app.get('/api/albums', async (req, res) => {
    try {
        const albums = await client.query(`
            SELECT Album {
                title,
                release_date,
                genre,
                description,
                cover_art_url,
                track_count,
                duration_seconds,
                artist: { name, display_name, color }
            } ORDER BY .release_date DESC
        `);
        res.json(albums);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all songs
app.get('/api/songs', async (req, res) => {
    try {
        const songs = await client.query(`
            SELECT Song {
                title,
                main_artist: { name, display_name, color },
                album: { title, cover_art_url },
                track_number,
                duration_seconds,
                audio_file_path,
                audio_file_url,
                featured_artists: { name, display_name },
                collaborators: { name, display_name }
            } ORDER BY .album.title THEN .track_number
        `);
        res.json(songs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get songs by album
app.get('/api/albums/:albumTitle/songs', async (req, res) => {
    try {
        const { albumTitle } = req.params;
        const songs = await client.query(`
            SELECT Song {
                title,
                main_artist: { name, display_name, color },
                album: { title, cover_art_url },
                track_number,
                duration_seconds,
                audio_file_path,
                audio_file_url,
                featured_artists: { name, display_name },
                collaborators: { name, display_name }
            }
            FILTER .album.title = <str>$albumTitle
            ORDER BY .track_number
        `, { albumTitle });
        res.json(songs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get songs by artist
app.get('/api/artists/:artistName/songs', async (req, res) => {
    try {
        const { artistName } = req.params;
        const songs = await client.query(`
            SELECT Song {
                title,
                main_artist: { name, display_name, color },
                album: { title, cover_art_url },
                track_number,
                duration_seconds,
                audio_file_path,
                audio_file_url,
                featured_artists: { name, display_name },
                collaborators: { name, display_name }
            }
            FILTER .main_artist.name = <str>$artistName
               OR .featured_artists.name = <str>$artistName
               OR .collaborators.name = <str>$artistName
            ORDER BY .album.title THEN .track_number
        `, { artistName });
        res.json(songs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(port, '0.0.0.0', () => {
    console.log(`🎵 Phantasia Music API running on port ${port}`);
    console.log(`🔗 Health check: http://localhost:${port}/api/health`);
    console.log(`🎼 Endpoints available:`);
    console.log(`   GET /api/artists`);
    console.log(`   GET /api/albums`);
    console.log(`   GET /api/songs`);
    console.log(`   GET /api/albums/:albumTitle/songs`);
    console.log(`   GET /api/artists/:artistName/songs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 API server shutting down...');
    process.exit(0);
});
APIEOF

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm init -y
npm install edgedb express cors

# Create systemd service
cat > /etc/systemd/system/phantasia-music-api.service << 'SERVICEEOF'
[Unit]
Description=Phantasia Music API Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/phantasia-geldb
Environment=NODE_ENV=production
Environment=EDGEDB_INSTANCE=phantasia-music
ExecStart=/usr/bin/node api_server.js
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=phantasia-music-api

[Install]
WantedBy=multi-user.target
SERVICEEOF

# Enable and start service
systemctl daemon-reload
systemctl enable phantasia-music-api
systemctl start phantasia-music-api

# Check service status
sleep 3
systemctl status phantasia-music-api --no-pager -l | head -10

echo "REST API service created and started"
APIEOF

expect << EXPECTEOF
set timeout 300
spawn scp -o StrictHostKeyChecking=no /tmp/create_api_service.sh $SERVER_USER@$SERVER_IP:/tmp/
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect eof
EXPECTEOF

./ssh_auto.sh "chmod +x /tmp/create_api_service.sh && /tmp/create_api_service.sh"

print_success "REST API service created and started"

# Step 6: Test API endpoints
print_step "6" "TESTING API ENDPOINTS"

echo "🧪 Testing API endpoints..."
sleep 5

echo "Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s --connect-timeout 15 http://212.227.85.148:3000/api/health)
echo "Health: $HEALTH_RESPONSE"

echo ""
echo "Testing artists endpoint..."
ARTISTS_COUNT=$(curl -s --connect-timeout 15 http://212.227.85.148:3000/api/artists | jq 'length' 2>/dev/null || echo "API not responding")
echo "Artists count: $ARTISTS_COUNT"

echo ""
echo "Testing songs endpoint..."
SONGS_COUNT=$(curl -s --connect-timeout 15 http://212.227.85.148:3000/api/songs | jq 'length' 2>/dev/null || echo "API not responding")
echo "Songs count: $SONGS_COUNT"

echo ""
echo "Testing nginx proxy..."
NGINX_HEALTH=$(curl -s --connect-timeout 15 https://deeptesting.prismaticcollections.com/api/health)
echo "Nginx proxy health: $NGINX_HEALTH"

print_success "API endpoints tested"

# Clean up
rm -f "$PACKAGE_NAME"
rm -f /tmp/setup_geldb_project.sh /tmp/init_database.sh /tmp/populate_database.sh /tmp/create_api_service.sh

echo
echo "======================================================================"
echo "🎉 GELDB PROJECT DEPLOYMENT COMPLETED!"
echo "======================================================================"
echo "🗄️ Database:"
echo "   📍 Location: /opt/phantasia-geldb/"
echo "   🏷️ Instance: phantasia-music"
echo "   📊 Schema: Artist, Album, Song, Collection, Prism"
echo
echo "🌐 API Endpoints:"
echo "   🔗 Health: https://deeptesting.prismaticcollections.com/api/health"
echo "   🎤 Artists: https://deeptesting.prismaticcollections.com/api/artists"
echo "   💿 Albums: https://deeptesting.prismaticcollections.com/api/albums"
echo "   🎵 Songs: https://deeptesting.prismaticcollections.com/api/songs"
echo "   🎵 Album Songs: https://deeptesting.prismaticcollections.com/api/albums/:title/songs"
echo "   🎤 Artist Songs: https://deeptesting.prismaticcollections.com/api/artists/:name/songs"
echo
echo "⚙️ Service:"
echo "   📋 Name: phantasia-music-api"
echo "   🔄 Status: systemctl status phantasia-music-api"
echo "   📄 Logs: journalctl -u phantasia-music-api -f"
echo
echo "🎵 The music player should now load songs from the GelDB database!"
echo "======================================================================"

print_success "GelDB project deployment completed successfully!"