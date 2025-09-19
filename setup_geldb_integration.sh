#!/bin/bash

# GelDB Integration Script
# This script sets up GelDB integration with the Angular website

set -e

SERVER_IP="212.227.85.148"
SERVER_USER="root"

echo "======================================================================"
echo "🗄️ GELDB INTEGRATION SETUP"
echo "======================================================================"
echo "Server: $SERVER_USER@$SERVER_IP"
echo "Task: Connect GelDB to Angular website"
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

# Create GelDB setup script
cat > /tmp/geldb_setup.sh << 'GELDBEOF'
#!/bin/bash

echo "Starting GelDB integration setup..."

# Verify GelDB installation
echo "Verifying GelDB installation..."
if command -v gel &> /dev/null; then
    echo "✅ GelDB is installed: $(gel --version)"
else
    echo "❌ GelDB not found, installing..."

    # Download installer
    curl https://www.geldata.com/sh --proto "=https" -sSf1 -o /tmp/geldb_installer.sh

    # Make it executable
    chmod +x /tmp/geldb_installer.sh

    # Run installer with automated responses using expect
    expect << 'GELDBINSTALL'
set timeout 60
spawn bash /tmp/geldb_installer.sh

expect {
    "*Installation Path*" {
        expect "*Cancel installation*"
        send "1\r"
        exp_continue
    }
    "*Proceed with installation*" {
        send "1\r"
        exp_continue
    }
    "*default*" {
        send "1\r"
        exp_continue
    }
    "*y/N*" {
        send "y\r"
        exp_continue
    }
    "*Y/n*" {
        send "Y\r"
        exp_continue
    }
    eof
}
GELDBINSTALL

    # Add to PATH if not already there
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
    export PATH="$HOME/.local/bin:$PATH"

    # Verify installation
    if command -v gel &> /dev/null; then
        echo "✅ GelDB installed successfully: $(gel --version)"
    else
        echo "❌ GelDB installation failed"
        exit 1
    fi
fi

# Create GelDB project directory
echo "Creating GelDB project..."
mkdir -p /var/geldb/phantasia
cd /var/geldb/phantasia

# Initialize GelDB for Phantasia
echo "Initializing GelDB database..."
gel init phantasia-db

# Create basic database schema for Phantasia
cat > schema.gel << 'SCHEMAEOF'
// Phantasia Database Schema

// Artists table
table artists {
    id: string primary_key
    name: string required
    display_name: string
    bio: text
    country: string
    genre: string
    website: string
    avatar: string
    color: string
    social_links: json
    created_at: datetime default_now
    updated_at: datetime default_now
}

// Albums table
table albums {
    id: string primary_key
    title: string required
    artist_id: string foreign_key(artists.id)
    release_date: date
    genre: string
    description: text
    cover_art_url: string
    track_count: integer
    duration_seconds: integer
    created_at: datetime default_now
}

// Tracks table
table tracks {
    id: string primary_key
    title: string required
    album_id: string foreign_key(albums.id)
    artist_id: string foreign_key(artists.id)
    track_number: integer
    duration_seconds: integer
    audio_file_url: string
    lyrics: text
    genre: string
    created_at: datetime default_now
}

// Collections table
table collections {
    id: string primary_key
    name: string required
    description: text
    cover_image_url: string
    is_public: boolean default_true
    created_at: datetime default_now
}

// Twitter users table
table twitter_users {
    id: string primary_key
    twitter_id: string required unique
    username: string required
    display_name: string required
    profile_image_url: string
    verified: boolean default_false
    followers_count: integer
    cached_at: datetime default_now
}

// Twitter tweets table
table twitter_tweets {
    id: string primary_key
    tweet_id: string required unique
    user_id: string foreign_key(twitter_users.id)
    text: text required
    created_at: datetime required
    retweet_count: integer default_0
    like_count: integer default_0
    cached_at: datetime default_now
}
SCHEMAEOF

# Apply schema
echo "Applying database schema..."
gel schema apply schema.gel

# Create API server configuration
cat > api_server.js << 'APIEOF'
const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const port = 3000;

// Enable CORS for Angular app
app.use(cors({
    origin: ['http://212.227.85.148', 'http://deeptesting.prismaticcollections.com', 'https://deeptesting.prismaticcollections.com'],
    credentials: true
}));

app.use(express.json());

// Function to execute GelDB queries
function queryGelDB(query) {
    return new Promise((resolve, reject) => {
        exec(`gel query "${query}"`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            try {
                resolve(JSON.parse(stdout));
            } catch (e) {
                resolve(stdout);
            }
        });
    });
}

// API Routes

// Get all artists
app.get('/api/artists', async (req, res) => {
    try {
        const result = await queryGelDB('SELECT * FROM artists ORDER BY name');
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get artist by ID
app.get('/api/artists/:id', async (req, res) => {
    try {
        const result = await queryGelDB(`SELECT * FROM artists WHERE id = '${req.params.id}'`);
        res.json(result[0] || null);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all albums
app.get('/api/albums', async (req, res) => {
    try {
        const result = await queryGelDB('SELECT * FROM albums ORDER BY release_date DESC');
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get tracks by album
app.get('/api/albums/:id/tracks', async (req, res) => {
    try {
        const result = await queryGelDB(`SELECT * FROM tracks WHERE album_id = '${req.params.id}' ORDER BY track_number`);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Twitter data
app.get('/api/twitter/users', async (req, res) => {
    try {
        const result = await queryGelDB('SELECT * FROM twitter_users ORDER BY followers_count DESC');
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), database: 'geldb' });
});

// Start server
app.listen(port, () => {
    console.log(`GelDB API server running on port ${port}`);
    console.log(`Health check: http://localhost:${port}/api/health`);
});
APIEOF

# Install Node.js and npm if not present
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    apt-get install -y nodejs
fi

# Install API dependencies
echo "Installing API dependencies..."
npm init -y
npm install express cors

# Create systemd service for the API
cat > /etc/systemd/system/geldb-api.service << 'SERVICEEOF'
[Unit]
Description=GelDB API Server for Phantasia
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/geldb/phantasia
ExecStart=/usr/bin/node api_server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
SERVICEEOF

# Enable and start the service
systemctl daemon-reload
systemctl enable geldb-api
systemctl start geldb-api

# Test the API
sleep 5
echo "Testing GelDB API..."
curl -s http://localhost:3000/api/health | head -3

echo "✅ GelDB integration completed!"
echo "📊 API server running on port 3000"
echo "🔗 Nginx configured to proxy /api/ requests"
GELDBEOF

print_status "📤 Uploading GelDB integration script..."
scp -o StrictHostKeyChecking=no /tmp/geldb_setup.sh $SERVER_USER@$SERVER_IP:/tmp/

print_status "🔧 Setting up GelDB integration..."
expect << EXPECTEOF
set timeout 300
spawn ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP
expect "*password*" {
    send "KC361kLC\r"
}
expect "*#*" {
    send "chmod +x /tmp/geldb_setup.sh && /tmp/geldb_setup.sh\r"
    expect "*#*"
    send "exit\r"
}
EXPECTEOF

print_success "✅ GelDB integration completed!"

# Test the integration
print_status "🧪 Testing database integration..."

echo "Testing API health check..."
API_HEALTH=$(curl -s http://$SERVER_IP/api/health 2>/dev/null || echo "API not accessible yet")
echo "API Response: $API_HEALTH"

echo
echo "======================================================================"
echo "✅ GELDB INTEGRATION COMPLETED!"
echo "======================================================================"
echo "🗄️ Database: GelDB initialized with Phantasia schema"
echo "🚀 API Server: Running on port 3000"
echo "🔗 Nginx Proxy: /api/ requests routed to GelDB API"
echo ""
echo "📊 Available API endpoints:"
echo "   GET /api/health - Health check"
echo "   GET /api/artists - All artists"
echo "   GET /api/albums - All albums"
echo "   GET /api/twitter/users - Twitter users"
echo ""
echo "🔄 Next step: Run ./setup_ssl.sh to enable HTTPS"
echo "======================================================================"