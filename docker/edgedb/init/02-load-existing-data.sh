#!/bin/bash
set -e

echo "🔄 Loading real Twitter data from @prismcollect_ into EdgeDB container..."

# Wait for EdgeDB to be ready
echo "⏳ Waiting for EdgeDB to be ready..."
until edgedb query --host localhost --port 5656 --tls-security=insecure "SELECT 1" > /dev/null 2>&1; do
    echo "Waiting for EdgeDB..."
    sleep 3
done

echo "✅ EdgeDB is ready!"

# Check if data already exists (prevent re-importing)
TWEET_COUNT=$(edgedb query --host localhost --port 5656 --tls-security=insecure "SELECT count(Tweet)" || echo "0")
echo "📊 Current tweet count in database: $TWEET_COUNT"

if [ "$TWEET_COUNT" -gt "0" ]; then
    echo "📚 Data already exists in database, skipping import"
    echo "🎉 EdgeDB initialization with existing data complete!"
    exit 0
fi

# Load the data dump if available (updated to use real tweet data)
DUMP_FILE="/app/data-export/real_twitter_data.dump"
if [ -f "$DUMP_FILE" ]; then
    echo "📥 Loading data from dump file: $DUMP_FILE"
    edgedb restore --host localhost --port 5656 --tls-security=insecure "$DUMP_FILE"

    # Verify data was loaded
    FINAL_TWEET_COUNT=$(edgedb query --host localhost --port 5656 --tls-security=insecure "SELECT count(Tweet)")
    FINAL_USER_COUNT=$(edgedb query --host localhost --port 5656 --tls-security=insecure "SELECT count(TwitterUser)")

    echo "🎉 Data import successful!"
    echo "📊 Final counts:"
    echo "   - Tweets: $FINAL_TWEET_COUNT"
    echo "   - Users: $FINAL_USER_COUNT"
else
    echo "⚠️  No dump file found at $DUMP_FILE"
    echo "📝 Creating sample data for testing..."

    # Create sample data
    edgedb query --host localhost --port 5656 --tls-security=insecure "
        INSERT TwitterUser {
            userId := '12345',
            username := 'prismcollect_',
            displayName := 'Prismatic Collections',
            description := 'Interactive digital experiences and immersive technology',
            verified := false,
            followersCount := 100,
            followingCount := 50,
            tweetCount := 3,
            createdAt := <datetime>'2023-01-01T00:00:00Z',
            scrapedAt := <datetime>datetime_current()
        };
    "

    echo "✅ Sample user data created"
fi

echo "🎉 EdgeDB initialization with existing data complete!"
echo "🚀 Ready for Twitter data collection!"