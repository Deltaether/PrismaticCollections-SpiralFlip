#!/bin/bash
# Docker Initialization Script for Phantasia Collections EdgeDB
# Generated on 2025-09-19T13:14:39.031881

set -e

echo "🐳 Initializing Phantasia Collections EdgeDB container..."

# Function to wait for EdgeDB
wait_for_edgedb() {
    echo "⏳ Waiting for EdgeDB server to start..."
    for i in {1..60}; do
        if edgedb query "SELECT 1" > /dev/null 2>&1; then
            echo "✅ EdgeDB server is ready"
            return 0
        fi
        echo "   Waiting for EdgeDB... ($i/60)"
        sleep 1
    done
    echo "❌ EdgeDB server failed to start within 60 seconds"
    exit 1
}

# Start EdgeDB server in background if not running
if ! pgrep -f "edgedb-server" > /dev/null; then
    echo "🚀 Starting EdgeDB server..."
    edgedb-server --foreground &
    EDGEDB_PID=$!

    # Wait for server to be ready
    wait_for_edgedb
else
    echo "✅ EdgeDB server already running"
    wait_for_edgedb
fi

# Check if database needs initialization
TWEET_COUNT=$(edgedb query "SELECT count(Tweet)" 2>/dev/null || echo "0")

if [ "$TWEET_COUNT" = "0" ]; then
    echo "📂 Database is empty - restoring from backup..."

    # Apply schema first
    if [ -d "/app/schema" ]; then
        echo "📋 Applying database schema..."
        # Copy schema files to expected location
        mkdir -p /app/dbschema
        cp -r /app/schema/* /app/dbschema/

        # Apply migrations
        if [ -d "/app/dbschema/migrations" ]; then
            edgedb migrate --to-latest
            echo "✅ Schema migrations applied"
        fi
    fi

    # Restore data
    if [ -f "/app/restore_database.sh" ]; then
        echo "🔄 Running database restore..."
        bash /app/restore_database.sh
    else
        echo "⚠️  No restore script found - database will be empty"
    fi
else
    echo "✅ Database contains $TWEET_COUNT tweets - skipping restore"
fi

# Final verification
FINAL_TWEET_COUNT=$(edgedb query "SELECT count(Tweet)" 2>/dev/null || echo "0")
FINAL_USER_COUNT=$(edgedb query "SELECT count(TwitterUser)" 2>/dev/null || echo "0")

echo "🎯 Initialization complete!"
echo "📊 Final database stats:"
echo "   • Tweets: $FINAL_TWEET_COUNT"
echo "   • Users: $FINAL_USER_COUNT"

# Keep container running if EdgeDB was started in background
if [ ! -z "$EDGEDB_PID" ]; then
    echo "🔄 Keeping EdgeDB server running..."
    wait $EDGEDB_PID
fi
