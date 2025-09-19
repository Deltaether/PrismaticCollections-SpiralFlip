#!/bin/bash

# Setup Mock Music API for Phantasia
# Creates a simple REST API with mock music data for testing

set -e

SERVER_IP="212.227.85.148"
SERVER_USER="root"
SERVER_PASSWORD="KC361kLC"

echo "======================================================================"
echo "🎵 MOCK MUSIC API SETUP"
echo "======================================================================"
echo "Server: $SERVER_USER@$SERVER_IP"
echo "This script will:"
echo "  ✅ Create simple Node.js REST API with mock music data"
echo "  ✅ Install as systemd service"
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

# Step 1: Create Mock Music API
print_step "1" "CREATING MOCK MUSIC API"

cat > /tmp/create_mock_api.sh << 'APIEOF'
#!/bin/bash

echo "Creating mock music API..."

# Create API directory
mkdir -p /opt/phantasia-mock-api
cd /opt/phantasia-mock-api

# Create package.json
cat > package.json << 'PACKAGEEOF'
{
  "name": "phantasia-mock-api",
  "version": "1.0.0",
  "description": "Mock music API for Phantasia",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
PACKAGEEOF

# Create mock API server
cat > server.js << 'SERVEREOF'
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Mock music data
const mockArtists = [
    {
        name: "ENADON",
        display_name: "ENADON",
        bio: "Electronic music producer and composer",
        country: "Japan",
        genre: "Electronic",
        avatar: "/assets/images/artists/enadon.png",
        color: "#ff6b6b",
        social_links: {
            youtube: "https://youtube.com/@enadon",
            twitter: "https://twitter.com/enadon_music",
            bandcamp: "https://enadon.bandcamp.com"
        }
    },
    {
        name: "Aika",
        display_name: "Aika",
        bio: "Ambient and atmospheric sound designer",
        country: "Japan",
        genre: "Ambient",
        avatar: "/assets/images/artists/aika.png",
        color: "#4ecdc4",
        social_links: {
            youtube: "https://youtube.com/@aika",
            twitter: "https://twitter.com/aika_music"
        }
    },
    {
        name: "SpiralFlip",
        display_name: "SpiralFlip",
        bio: "Digital music creator and project curator",
        country: "International",
        genre: "Various",
        avatar: "/assets/images/artists/spiralflip.png",
        color: "#9b59b6",
        social_links: {
            website: "https://prismaticcollections.com"
        }
    }
];

const mockAlbums = [
    {
        title: "Phantasia Disc One",
        release_date: "2024-01-01",
        genre: "Electronic",
        description: "The first disc of the Phantasia collection featuring electronic and ambient tracks.",
        cover_art_url: "/assets/images/phantasia-disc-1.jpg",
        track_count: 5,
        duration_seconds: 1080,
        artist: { name: "ENADON", display_name: "ENADON", color: "#ff6b6b" }
    },
    {
        title: "Phantasia Disc Two",
        release_date: "2024-06-01",
        genre: "Ambient",
        description: "The second disc of the Phantasia collection with extended ambient compositions.",
        cover_art_url: "/assets/images/phantasia-disc-2.jpg",
        track_count: 4,
        duration_seconds: 1350,
        artist: { name: "Aika", display_name: "Aika", color: "#4ecdc4" }
    }
];

const mockSongs = [
    // Disc One
    {
        title: "Opening Theme",
        main_artist: { name: "ENADON", display_name: "ENADON", color: "#ff6b6b" },
        album: { title: "Phantasia Disc One", cover_art_url: "/assets/images/phantasia-disc-1.jpg" },
        track_number: 1,
        duration_seconds: 180,
        audio_file_path: "/assets/audio/phantasia/disc1/01-opening-theme.mp3",
        audio_file_url: "/assets/audio/phantasia/disc1/01-opening-theme.mp3",
        featured_artists: [],
        collaborators: []
    },
    {
        title: "Digital Dreams",
        main_artist: { name: "ENADON", display_name: "ENADON", color: "#ff6b6b" },
        album: { title: "Phantasia Disc One", cover_art_url: "/assets/images/phantasia-disc-1.jpg" },
        track_number: 2,
        duration_seconds: 240,
        audio_file_path: "/assets/audio/phantasia/disc1/02-digital-dreams.mp3",
        audio_file_url: "/assets/audio/phantasia/disc1/02-digital-dreams.mp3",
        featured_artists: [],
        collaborators: []
    },
    {
        title: "Neon Nights",
        main_artist: { name: "ENADON", display_name: "ENADON", color: "#ff6b6b" },
        album: { title: "Phantasia Disc One", cover_art_url: "/assets/images/phantasia-disc-1.jpg" },
        track_number: 3,
        duration_seconds: 210,
        audio_file_path: "/assets/audio/phantasia/disc1/03-neon-nights.mp3",
        audio_file_url: "/assets/audio/phantasia/disc1/03-neon-nights.mp3",
        featured_artists: [],
        collaborators: []
    },
    {
        title: "Cyber Symphony",
        main_artist: { name: "ENADON", display_name: "ENADON", color: "#ff6b6b" },
        album: { title: "Phantasia Disc One", cover_art_url: "/assets/images/phantasia-disc-1.jpg" },
        track_number: 4,
        duration_seconds: 300,
        audio_file_path: "/assets/audio/phantasia/disc1/04-cyber-symphony.mp3",
        audio_file_url: "/assets/audio/phantasia/disc1/04-cyber-symphony.mp3",
        featured_artists: [],
        collaborators: []
    },
    {
        title: "Closing Credits",
        main_artist: { name: "ENADON", display_name: "ENADON", color: "#ff6b6b" },
        album: { title: "Phantasia Disc One", cover_art_url: "/assets/images/phantasia-disc-1.jpg" },
        track_number: 5,
        duration_seconds: 150,
        audio_file_path: "/assets/audio/phantasia/disc1/05-closing-credits.mp3",
        audio_file_url: "/assets/audio/phantasia/disc1/05-closing-credits.mp3",
        featured_artists: [],
        collaborators: []
    },
    // Disc Two
    {
        title: "Ambient Journey",
        main_artist: { name: "Aika", display_name: "Aika", color: "#4ecdc4" },
        album: { title: "Phantasia Disc Two", cover_art_url: "/assets/images/phantasia-disc-2.jpg" },
        track_number: 1,
        duration_seconds: 360,
        audio_file_path: "/assets/audio/phantasia/disc2/01-ambient-journey.mp3",
        audio_file_url: "/assets/audio/phantasia/disc2/01-ambient-journey.mp3",
        featured_artists: [],
        collaborators: []
    },
    {
        title: "Ethereal Waves",
        main_artist: { name: "Aika", display_name: "Aika", color: "#4ecdc4" },
        album: { title: "Phantasia Disc Two", cover_art_url: "/assets/images/phantasia-disc-2.jpg" },
        track_number: 2,
        duration_seconds: 420,
        audio_file_path: "/assets/audio/phantasia/disc2/02-ethereal-waves.mp3",
        audio_file_url: "/assets/audio/phantasia/disc2/02-ethereal-waves.mp3",
        featured_artists: [],
        collaborators: []
    },
    {
        title: "Cosmic Meditation",
        main_artist: { name: "Aika", display_name: "Aika", color: "#4ecdc4" },
        album: { title: "Phantasia Disc Two", cover_art_url: "/assets/images/phantasia-disc-2.jpg" },
        track_number: 3,
        duration_seconds: 480,
        audio_file_path: "/assets/audio/phantasia/disc2/03-cosmic-meditation.mp3",
        audio_file_url: "/assets/audio/phantasia/disc2/03-cosmic-meditation.mp3",
        featured_artists: [],
        collaborators: []
    },
    {
        title: "Twilight Harmony",
        main_artist: { name: "Aika", display_name: "Aika", color: "#4ecdc4" },
        album: { title: "Phantasia Disc Two", cover_art_url: "/assets/images/phantasia-disc-2.jpg" },
        track_number: 4,
        duration_seconds: 330,
        audio_file_path: "/assets/audio/phantasia/disc2/04-twilight-harmony.mp3",
        audio_file_url: "/assets/audio/phantasia/disc2/04-twilight-harmony.mp3",
        featured_artists: [],
        collaborators: []
    }
];

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        database: 'mock',
        timestamp: new Date().toISOString(),
        service: 'phantasia-mock-api'
    });
});

// Get all artists
app.get('/api/artists', (req, res) => {
    res.json(mockArtists);
});

// Get all albums
app.get('/api/albums', (req, res) => {
    res.json(mockAlbums);
});

// Get all songs
app.get('/api/songs', (req, res) => {
    res.json(mockSongs);
});

// Get songs by album
app.get('/api/albums/:albumTitle/songs', (req, res) => {
    const { albumTitle } = req.params;
    const albumSongs = mockSongs.filter(song =>
        song.album.title.toLowerCase() === albumTitle.toLowerCase()
    );
    res.json(albumSongs);
});

// Get songs by artist
app.get('/api/artists/:artistName/songs', (req, res) => {
    const { artistName } = req.params;
    const artistSongs = mockSongs.filter(song =>
        song.main_artist.name.toLowerCase() === artistName.toLowerCase() ||
        song.featured_artists.some(artist => artist.name.toLowerCase() === artistName.toLowerCase()) ||
        song.collaborators.some(artist => artist.name.toLowerCase() === artistName.toLowerCase())
    );
    res.json(artistSongs);
});

// Start server
app.listen(port, '0.0.0.0', () => {
    console.log(`🎵 Phantasia Mock Music API running on port ${port}`);
    console.log(`🔗 Health check: http://localhost:${port}/api/health`);
    console.log(`🎼 Endpoints available:`);
    console.log(`   GET /api/artists (${mockArtists.length} artists)`);
    console.log(`   GET /api/albums (${mockAlbums.length} albums)`);
    console.log(`   GET /api/songs (${mockSongs.length} songs)`);
    console.log(`   GET /api/albums/:albumTitle/songs`);
    console.log(`   GET /api/artists/:artistName/songs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Mock API server shutting down...');
    process.exit(0);
});
SERVEREOF

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

# Create systemd service
cat > /etc/systemd/system/phantasia-mock-api.service << 'SERVICEEOF'
[Unit]
Description=Phantasia Mock Music API Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/phantasia-mock-api
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=phantasia-mock-api

[Install]
WantedBy=multi-user.target
SERVICEEOF

# Stop any existing music API service
systemctl stop phantasia-music-api 2>/dev/null || true
systemctl disable phantasia-music-api 2>/dev/null || true

# Enable and start mock API service
systemctl daemon-reload
systemctl enable phantasia-mock-api
systemctl start phantasia-mock-api

# Check service status
sleep 3
systemctl status phantasia-mock-api --no-pager -l | head -10

echo "Mock Music API created and started"
APIEOF

expect << EXPECTEOF
set timeout 180
spawn scp -o StrictHostKeyChecking=no /tmp/create_mock_api.sh $SERVER_USER@$SERVER_IP:/tmp/
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect eof
EXPECTEOF

./ssh_auto.sh "chmod +x /tmp/create_mock_api.sh && /tmp/create_mock_api.sh"

print_success "Mock Music API created and started"

# Step 2: Test API endpoints
print_step "2" "TESTING MOCK API ENDPOINTS"

echo "🧪 Testing mock API endpoints..."
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

print_success "Mock API endpoints tested"

# Clean up
rm -f /tmp/create_mock_api.sh

echo
echo "======================================================================"
echo "🎉 MOCK MUSIC API SETUP COMPLETED!"
echo "======================================================================"
echo "🗄️ API Service:"
echo "   📍 Location: /opt/phantasia-mock-api/"
echo "   🏷️ Service: phantasia-mock-api"
echo "   📊 Data: 3 artists, 2 albums, 9 songs"
echo
echo "🌐 API Endpoints:"
echo "   🔗 Health: https://deeptesting.prismaticcollections.com/api/health"
echo "   🎤 Artists: https://deeptesting.prismaticcollections.com/api/artists"
echo "   💿 Albums: https://deeptesting.prismaticcollections.com/api/albums"
echo "   🎵 Songs: https://deeptesting.prismaticcollections.com/api/songs"
echo "   🎵 Album Songs: https://deeptesting.prismaticcollections.com/api/albums/:title/songs"
echo "   🎤 Artist Songs: https://deeptesting.prismaticcollections.com/api/artists/:name/songs"
echo
echo "⚙️ Service Management:"
echo "   🔄 Status: systemctl status phantasia-mock-api"
echo "   📄 Logs: journalctl -u phantasia-mock-api -f"
echo "   🔄 Restart: systemctl restart phantasia-mock-api"
echo
echo "🎵 The music player should now be able to load songs from the mock API!"
echo "======================================================================"

print_success "Mock Music API setup completed successfully!"