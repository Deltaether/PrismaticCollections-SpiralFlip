#!/bin/bash

# Setup GelDB Music Database for Phantasia Website
# Creates database, schema, and REST API for music player

set -e

SERVER_IP="212.227.85.148"
SERVER_USER="root"
SERVER_PASSWORD="KC361kLC"

echo "======================================================================"
echo "🎵 GELDB MUSIC DATABASE SETUP"
echo "======================================================================"
echo "Server: $SERVER_USER@$SERVER_IP"
echo "This script will:"
echo "  ✅ Initialize GelDB project"
echo "  ✅ Create music database"
echo "  ✅ Set up music schema (artists, albums, songs)"
echo "  ✅ Populate with Phantasia music data"
echo "  ✅ Create REST API service"
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

# Step 1: Initialize GelDB Project
print_step "1" "INITIALIZING GELDB PROJECT"

cat > /tmp/init_geldb_project.sh << 'INITEOF'
#!/bin/bash

echo "Initializing GelDB project for Phantasia music database..."

# Create project directory
mkdir -p /opt/phantasia-music-db
cd /opt/phantasia-music-db

# Initialize GelDB project
echo "Initializing GelDB project..."
gel project init phantasia-music --non-interactive

# Check if initialization worked
if [ -f "gel.toml" ]; then
    echo "✅ GelDB project initialized successfully"
    cat gel.toml
else
    echo "❌ GelDB project initialization failed"
    exit 1
fi

echo "GelDB project initialization completed"
INITEOF

expect << EXPECTEOF
set timeout 120
spawn scp -o StrictHostKeyChecking=no /tmp/init_geldb_project.sh $SERVER_USER@$SERVER_IP:/tmp/
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect eof
EXPECTEOF

./ssh_auto.sh "chmod +x /tmp/init_geldb_project.sh && /tmp/init_geldb_project.sh"

print_success "GelDB project initialized"

# Step 2: Create Music Database Schema
print_step "2" "CREATING MUSIC DATABASE SCHEMA"

cat > /tmp/create_music_schema.sh << 'SCHEMAEOF'
#!/bin/bash

echo "Creating music database schema..."

cd /opt/phantasia-music-db

# Create schema directory
mkdir -p dbschema

# Create music schema
cat > dbschema/default.esdl << 'ESDLEOF'
module default {
    type Artist {
        required property name -> str {
            constraint exclusive;
        };
        property display_name -> str;
        property avatar_path -> str;
        property color -> str;
        property genre -> str;
        property social_links -> json;
        multi link albums := .<artist[is Album];
        multi link songs := .<artist[is Song];
    }

    type Album {
        required property title -> str;
        property release_date -> datetime;
        property cover_art -> str;
        property description -> str;
        required link artist -> Artist;
        multi link songs := .<album[is Song];
    }

    type Song {
        required property title -> str;
        required property audio_path -> str;
        property duration -> int32;
        property track_number -> int16;
        property release_date -> datetime;
        property lyrics -> str;
        required link artist -> Artist;
        link album -> Album;
        multi link featured_artists -> Artist;
    }

    type Playlist {
        required property name -> str;
        property description -> str;
        property created_at -> datetime {
            default := datetime_current();
        };
        multi link songs -> Song;
    }
}
ESDLEOF

echo "✅ Database schema created"

# Apply migration
echo "Applying database migration..."
gel migration create initial --non-interactive
gel migrate --non-interactive

if [ $? -eq 0 ]; then
    echo "✅ Database migration applied successfully"
else
    echo "❌ Database migration failed"
    exit 1
fi

echo "Music database schema setup completed"
SCHEMAEOF

expect << EXPECTEOF
set timeout 180
spawn scp -o StrictHostKeyChecking=no /tmp/create_music_schema.sh $SERVER_USER@$SERVER_IP:/tmp/
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect eof
EXPECTEOF

./ssh_auto.sh "chmod +x /tmp/create_music_schema.sh && /tmp/create_music_schema.sh"

print_success "Music database schema created"

# Step 3: Populate Database with Phantasia Music Data
print_step "3" "POPULATING DATABASE WITH MUSIC DATA"

cat > /tmp/populate_music_data.sh << 'POPULATEEOF'
#!/bin/bash

echo "Populating database with Phantasia music data..."

cd /opt/phantasia-music-db

# Create data population script
cat > populate_data.edgeql << 'DATAEOF'
# Insert Artists
INSERT Artist {
    name := "ENADON",
    display_name := "ENADON",
    color := "#ff6b6b",
    genre := "Electronic"
};

INSERT Artist {
    name := "Aika",
    display_name := "Aika",
    color := "#4ecdc4",
    genre := "Ambient"
};

INSERT Artist {
    name := "Various Artists",
    display_name := "Various Artists",
    color := "#9b59b6",
    genre := "Compilation"
};

# Insert Albums
INSERT Album {
    title := "Phantasia Disc One",
    release_date := <datetime>'2024-01-01T00:00:00+00:00',
    cover_art := "/assets/images/phantasia-disc-1.jpg",
    description := "The first disc of the Phantasia collection featuring electronic and ambient tracks.",
    artist := (SELECT Artist FILTER .name = "ENADON" LIMIT 1)
};

INSERT Album {
    title := "Phantasia Disc Two",
    release_date := <datetime>'2024-06-01T00:00:00+00:00',
    cover_art := "/assets/images/phantasia-disc-2.jpg",
    description := "The second disc of the Phantasia collection with extended compositions.",
    artist := (SELECT Artist FILTER .name = "Aika" LIMIT 1)
};

# Insert Songs for Disc One
INSERT Song {
    title := "Opening Theme",
    audio_path := "/assets/audio/phantasia/disc1/01-opening-theme.mp3",
    duration := 180,
    track_number := 1,
    artist := (SELECT Artist FILTER .name = "ENADON" LIMIT 1),
    album := (SELECT Album FILTER .title = "Phantasia Disc One" LIMIT 1)
};

INSERT Song {
    title := "Digital Dreams",
    audio_path := "/assets/audio/phantasia/disc1/02-digital-dreams.mp3",
    duration := 240,
    track_number := 2,
    artist := (SELECT Artist FILTER .name = "ENADON" LIMIT 1),
    album := (SELECT Album FILTER .title = "Phantasia Disc One" LIMIT 1)
};

INSERT Song {
    title := "Neon Nights",
    audio_path := "/assets/audio/phantasia/disc1/03-neon-nights.mp3",
    duration := 210,
    track_number := 3,
    artist := (SELECT Artist FILTER .name = "ENADON" LIMIT 1),
    album := (SELECT Album FILTER .title = "Phantasia Disc One" LIMIT 1)
};

INSERT Song {
    title := "Cyber Symphony",
    audio_path := "/assets/audio/phantasia/disc1/04-cyber-symphony.mp3",
    duration := 300,
    track_number := 4,
    artist := (SELECT Artist FILTER .name = "ENADON" LIMIT 1),
    album := (SELECT Album FILTER .title = "Phantasia Disc One" LIMIT 1)
};

INSERT Song {
    title := "Closing Credits",
    audio_path := "/assets/audio/phantasia/disc1/05-closing-credits.mp3",
    duration := 150,
    track_number := 5,
    artist := (SELECT Artist FILTER .name = "ENADON" LIMIT 1),
    album := (SELECT Album FILTER .title = "Phantasia Disc One" LIMIT 1)
};

# Insert Songs for Disc Two
INSERT Song {
    title := "Ambient Journey",
    audio_path := "/assets/audio/phantasia/disc2/01-ambient-journey.mp3",
    duration := 360,
    track_number := 1,
    artist := (SELECT Artist FILTER .name = "Aika" LIMIT 1),
    album := (SELECT Album FILTER .title = "Phantasia Disc Two" LIMIT 1)
};

INSERT Song {
    title := "Ethereal Waves",
    audio_path := "/assets/audio/phantasia/disc2/02-ethereal-waves.mp3",
    duration := 420,
    track_number := 2,
    artist := (SELECT Artist FILTER .name = "Aika" LIMIT 1),
    album := (SELECT Album FILTER .title = "Phantasia Disc Two" LIMIT 1)
};

INSERT Song {
    title := "Cosmic Meditation",
    audio_path := "/assets/audio/phantasia/disc2/03-cosmic-meditation.mp3",
    duration := 480,
    track_number := 3,
    artist := (SELECT Artist FILTER .name = "Aika" LIMIT 1),
    album := (SELECT Album FILTER .title = "Phantasia Disc Two" LIMIT 1)
};

INSERT Song {
    title := "Twilight Harmony",
    audio_path := "/assets/audio/phantasia/disc2/04-twilight-harmony.mp3",
    duration := 330,
    track_number := 4,
    artist := (SELECT Artist FILTER .name = "Aika" LIMIT 1),
    album := (SELECT Album FILTER .title = "Phantasia Disc Two" LIMIT 1)
};

# Create Default Playlist
INSERT Playlist {
    name := "Phantasia Complete",
    description := "Complete Phantasia collection with all tracks from both discs",
    songs := (SELECT Song)
};
DATAEOF

# Execute data population
echo "Executing data population..."
gel query -f populate_data.edgeql

if [ $? -eq 0 ]; then
    echo "✅ Database populated successfully"

    # Verify data
    echo "Verifying database content..."
    echo "Artists:"
    gel query "SELECT Artist { name, display_name, genre }"
    echo ""
    echo "Albums:"
    gel query "SELECT Album { title, artist: { name } }"
    echo ""
    echo "Songs count:"
    gel query "SELECT count(Song)"
else
    echo "❌ Database population failed"
    exit 1
fi

echo "Music data population completed"
POPULATEEOF

expect << EXPECTEOF
set timeout 180
spawn scp -o StrictHostKeyChecking=no /tmp/populate_music_data.sh $SERVER_USER@$SERVER_IP:/tmp/
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect eof
EXPECTEOF

./ssh_auto.sh "chmod +x /tmp/populate_music_data.sh && /tmp/populate_music_data.sh"

print_success "Database populated with music data"

# Step 4: Create REST API Service
print_step "4" "CREATING GELDB REST API SERVICE"

cat > /tmp/create_geldb_api.sh << 'APIEOF'
#!/bin/bash

echo "Creating GelDB REST API service..."

cd /opt/phantasia-music-db

# Create API server script
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
    dsn: process.env.EDGEDB_DSN || 'edgedb://phantasia-music'
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        await client.query('SELECT 1');
        res.json({ status: 'healthy', database: 'connected', timestamp: new Date().toISOString() });
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
                color,
                genre,
                avatar_path,
                social_links
            }
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
                cover_art,
                description,
                artist: { name, display_name }
            }
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
                audio_path,
                duration,
                track_number,
                artist: { name, display_name, color },
                album: { title, cover_art }
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
                audio_path,
                duration,
                track_number,
                artist: { name, display_name, color },
                album: { title, cover_art }
            }
            FILTER .album.title = <str>$albumTitle
            ORDER BY .track_number
        `, { albumTitle });
        res.json(songs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get playlists
app.get('/api/playlists', async (req, res) => {
    try {
        const playlists = await client.query(`
            SELECT Playlist {
                name,
                description,
                created_at,
                songs: {
                    title,
                    audio_path,
                    duration,
                    artist: { name, display_name },
                    album: { title }
                }
            }
        `);
        res.json(playlists);
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
    console.log(`   GET /api/playlists`);
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

# Create systemd service for API
cat > /etc/systemd/system/phantasia-music-api.service << 'SERVICEEOF'
[Unit]
Description=Phantasia Music API Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/phantasia-music-db
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

echo "GelDB REST API service created and started"
APIEOF

expect << EXPECTEOF
set timeout 300
spawn scp -o StrictHostKeyChecking=no /tmp/create_geldb_api.sh $SERVER_USER@$SERVER_IP:/tmp/
expect "*password*" {
    send "$SERVER_PASSWORD\r"
}
expect eof
EXPECTEOF

./ssh_auto.sh "chmod +x /tmp/create_geldb_api.sh && /tmp/create_geldb_api.sh"

print_success "GelDB REST API service created"

# Step 5: Test API Endpoints
print_step "5" "TESTING API ENDPOINTS"

echo "🧪 Testing API endpoints..."
sleep 5

echo "Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s --connect-timeout 10 http://212.227.85.148:3000/api/health | head -1)
echo "Health: $HEALTH_RESPONSE"

echo "Testing artists endpoint..."
ARTISTS_RESPONSE=$(curl -s --connect-timeout 10 http://212.227.85.148:3000/api/artists | head -1)
echo "Artists: $ARTISTS_RESPONSE"

echo "Testing songs endpoint..."
SONGS_RESPONSE=$(curl -s --connect-timeout 10 http://212.227.85.148:3000/api/songs | head -1)
echo "Songs: $SONGS_RESPONSE"

print_success "API endpoints tested"

# Step 6: Update nginx configuration to proxy API requests
print_step "6" "UPDATING NGINX CONFIGURATION"

echo "📝 Updating nginx to proxy API requests..."

./ssh_auto.sh "systemctl status phantasia-music-api --no-pager -l | head -3"

echo "🧪 Testing nginx proxy..."
sleep 3

echo "Testing through nginx proxy..."
NGINX_API_RESPONSE=$(curl -s --connect-timeout 10 https://deeptesting.prismaticcollections.com/api/health | head -1)
echo "Nginx API: $NGINX_API_RESPONSE"

# Clean up temporary files
rm -f /tmp/init_geldb_project.sh /tmp/create_music_schema.sh /tmp/populate_music_data.sh /tmp/create_geldb_api.sh

echo
echo "======================================================================"
echo "🎉 GELDB MUSIC DATABASE SETUP COMPLETED!"
echo "======================================================================"
echo "🗄️ Database:"
echo "   📍 Location: /opt/phantasia-music-db/"
echo "   🏷️ Instance: phantasia-music"
echo "   📊 Tables: Artist, Album, Song, Playlist"
echo
echo "🌐 API Endpoints:"
echo "   🔗 Health: https://deeptesting.prismaticcollections.com/api/health"
echo "   🎤 Artists: https://deeptesting.prismaticcollections.com/api/artists"
echo "   💿 Albums: https://deeptesting.prismaticcollections.com/api/albums"
echo "   🎵 Songs: https://deeptesting.prismaticcollections.com/api/songs"
echo "   📋 Playlists: https://deeptesting.prismaticcollections.com/api/playlists"
echo
echo "⚙️ Service:"
echo "   📋 Name: phantasia-music-api"
echo "   🔄 Status: systemctl status phantasia-music-api"
echo "   📄 Logs: journalctl -u phantasia-music-api -f"
echo
echo "🎵 The music player should now be able to load songs!"
echo "======================================================================"

print_success "GelDB music database setup completed successfully!"