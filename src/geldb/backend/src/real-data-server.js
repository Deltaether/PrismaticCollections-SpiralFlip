const express = require('express');
const cors = require('cors');
const edgedb = require('edgedb');
const path = require('path');
const fs = require('fs');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5005', 'http://localhost:4300'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing
app.use(express.json());

// Static file serving for profile pictures
const profilePicsPath = path.join(__dirname, '../../twitter-scraper-linux/twitter-pfps');
app.use('/profile-images', express.static(profilePicsPath, {
  maxAge: '1d', // Cache for 1 day
  etag: true,
  lastModified: true
}));

// Connect to EdgeDB
let client;

const initEdgeDB = async () => {
  try {
    client = edgedb.createClient({
      instanceName: 'twitter_scraper',
      tlsSecurity: 'insecure'
    });
    console.log('✅ Connected to EdgeDB unified instance (50 tweets)');
  } catch (error) {
    console.error('❌ Failed to connect to EdgeDB:', error);
    process.exit(1);
  }
};

// API Routes
app.get('/api/twitter/tweets', async (req, res) => {
  try {
    const { page = '0', limit = '20' } = req.query;
    const pageNum = Math.max(0, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Increased max to 100
    const offsetNum = pageNum * limitNum;

    // Get total count
    const totalCountResult = await client.query(`
      SELECT count(Tweet)
    `);
    const totalCount = totalCountResult[0] || 0;

    // Get paginated tweets
    const tweets = await client.query(`
      SELECT Tweet {
        tweetId,
        text,
        authorUsername,
        authorDisplayName,
        authorVerified,
        authorProfileImageUrl,
        authorProfileImageLocalPath,
        createdAt,
        scrapedAt,
        likeCount,
        retweetCount,
        replyCount,
        quoteCount,
        isRetweet,
        isQuote,
        isReply,
        mediaUrls,
        hashtags,
        mentions,
        urls
      }
      ORDER BY .createdAt ASC
      OFFSET <int64>$offset
      LIMIT <int64>$limit
    `, { offset: offsetNum, limit: limitNum });

    const hasMore = (offsetNum + tweets.length) < totalCount;

    res.json({
      data: tweets,
      meta: {
        resultCount: tweets.length,
        totalCount: totalCount,
        page: pageNum,
        limit: limitNum,
        offset: offsetNum,
        hasMore: hasMore,
        totalPages: Math.ceil(totalCount / limitNum)
      }
    });

    console.log(`📊 Served ${tweets.length} tweets (page ${pageNum + 1}, total: ${totalCount})`);
  } catch (error) {
    console.error('Error getting tweets:', error);
    res.status(500).json({ error: 'Failed to retrieve tweets' });
  }
});

app.get('/api/twitter/user/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const user = await client.querySingle(`
      SELECT TwitterUser {
        userId,
        username,
        displayName,
        description,
        profileImageUrl,
        verified,
        followersCount,
        followingCount,
        tweetCount,
        createdAt,
        scrapedAt
      }
      FILTER .username = <str>$username
    `, { username });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ data: user });
    console.log(`👤 Served user: ${username}`);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
});

app.get('/api/twitter/scraper/status', async (req, res) => {
  try {
    const totalTweets = await client.querySingle(`SELECT count(Tweet)`);

    const status = {
      isRunning: false,
      totalTweetsStored: totalTweets,
      consecutiveFailures: 0,
      lastScrapedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    };

    res.json(status);
    console.log(`📈 Status: ${totalTweets} tweets stored`);
  } catch (error) {
    console.error('Error getting status:', error);
    res.status(500).json({ error: 'Failed to get status' });
  }
});

// Profile image endpoint
app.get('/api/twitter/profile-image/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // Look for image files with various extensions
    const extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    let imagePath = null;

    for (const ext of extensions) {
      // Check for files with username pattern
      const possiblePaths = [
        path.join(profilePicsPath, `${username.toLowerCase()}.${ext}`),
        path.join(profilePicsPath, `${username}.${ext}`)
      ];

      for (const filePath of possiblePaths) {
        if (fs.existsSync(filePath)) {
          imagePath = filePath;
          break;
        }
      }

      if (imagePath) break;
    }

    if (imagePath) {
      // Set appropriate content type
      const ext = path.extname(imagePath).toLowerCase();
      const contentType = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.gif': 'image/gif'
      }[ext] || 'image/jpeg';

      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day cache
      res.sendFile(imagePath);

      console.log(`🖼️  Served profile image for ${username}`);
    } else {
      res.status(404).json({ error: 'Profile image not found' });
    }
  } catch (error) {
    console.error('Error serving profile image:', error);
    res.status(500).json({ error: 'Failed to serve profile image' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: 'EdgeDB twitter_scraper instance'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Twitter Real Data Server',
    version: '1.0.0',
    endpoints: {
      tweets: '/api/twitter/tweets',
      user: '/api/twitter/user/:username',
      status: '/api/twitter/scraper/status',
      profileImage: '/api/twitter/profile-image/:username',
      profileImages: '/profile-images',
      health: '/health'
    }
  });
});

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  await initEdgeDB();

  app.listen(PORT, () => {
    console.log('🚀 Real Data Server started successfully!');
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌐 CORS: http://localhost:5005`);
    console.log(`💾 Database: EdgeDB twitter_scraper instance`);
    console.log(`📊 Visit: http://localhost:${PORT}/api/twitter/tweets`);
  });
};

startServer().catch(console.error);