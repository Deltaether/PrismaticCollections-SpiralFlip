#!/bin/bash
set -e

echo "🚀 Initializing EdgeDB schema for Prismatic Collections..."

# Wait for EdgeDB to be ready
echo "⏳ Waiting for EdgeDB to be ready..."
until edgedb query --host localhost --port 5656 "SELECT 1" > /dev/null 2>&1; do
    echo "Waiting for EdgeDB..."
    sleep 2
done

echo "✅ EdgeDB is ready!"

# Apply the Twitter schema
echo "📦 Applying Twitter schema..."
edgedb query --host localhost --port 5656 --file /app/dbschema/twitter.gel

# Create initial data if needed
echo "📊 Creating initial database structure..."
edgedb query --host localhost --port 5656 "
  SELECT count(TwitterUser);
  SELECT count(Tweet);
"

echo "🎉 EdgeDB initialization complete!"
echo "📊 Database is ready for Twitter data collection!"