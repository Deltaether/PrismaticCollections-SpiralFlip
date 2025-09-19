#!/bin/bash
# EdgeDB Database Restore Script for Phantasia Collections
# Generated on 2025-09-19T13:14:39.031564

set -e

echo "🔄 Starting EdgeDB database restore..."

# Wait for EdgeDB to be ready
echo "⏳ Waiting for EdgeDB to be ready..."
for i in {1..30}; do
    if edgedb query "SELECT 1" > /dev/null 2>&1; then
        echo "✅ EdgeDB is ready"
        break
    fi
    echo "   Waiting... ($i/30)"
    sleep 2
done

# Check if database is empty (safe to restore)
TWEET_COUNT=$(edgedb query "SELECT count(Tweet)" 2>/dev/null || echo "0")
if [ "$TWEET_COUNT" != "0" ]; then
    echo "⚠️  Database contains $TWEET_COUNT tweets. Skipping restore to prevent data loss."
    echo "   To force restore, manually clear the database first."
    exit 0
fi

echo "📂 Restoring database from dump..."

# Restore from dump
if [ -d "/app/database_dump" ]; then
    edgedb restore --all /app/database_dump
    echo "✅ Database restored successfully"

    # Verify restore
    NEW_TWEET_COUNT=$(edgedb query "SELECT count(Tweet)" 2>/dev/null || echo "0")
    NEW_USER_COUNT=$(edgedb query "SELECT count(TwitterUser)" 2>/dev/null || echo "0")

    echo "📊 Restore verification:"
    echo "   • Tweets: $NEW_TWEET_COUNT"
    echo "   • Users: $NEW_USER_COUNT"

    if [ "$NEW_TWEET_COUNT" != "0" ]; then
        echo "🎉 Database restore completed successfully!"
    else
        echo "⚠️  Restore completed but no data found"
    fi
else
    echo "❌ Database dump not found at /app/database_dump"
    exit 1
fi
