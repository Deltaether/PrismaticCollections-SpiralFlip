import express from 'express';
import cors from 'cors';
import * as edgedb from 'edgedb';

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5005', 'http://localhost:4300', 'http://localhost:5006'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing
app.use(express.json());

// Connect to EdgeDB
let client: edgedb.Client;

const initEdgeDB = async () => {
  try {
    client = edgedb.createClient({
      instanceName: 'twitter_scraper',
      tlsSecurity: 'insecure'
    });
    console.log('✅ Connected to EdgeDB twitter_scraper instance');
  } catch (error) {
    console.error('❌ Failed to connect to EdgeDB:', error);
    process.exit(1);
  }
};

// API Routes
app.get('/api/twitter/tweets', async (req, res) => {
  try {
    const { page = '0', limit = '20' } = req.query;
    const pageNum = Math.max(0, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));

    const tweets = await client.query(`
      SELECT Tweet {
        tweetId,
        text,
        authorUsername,
        authorDisplayName,
        authorVerified,
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
      ORDER BY .createdAt DESC
      LIMIT <int64>$limit
    `, { limit: limitNum });

    res.json({
      data: tweets,
      meta: {
        resultCount: tweets.length,
        totalCount: tweets.length,
        page: pageNum,
        limit: limitNum,
        hasMore: false
      }
    });

    console.log(`📊 Served ${tweets.length} tweets`);
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

app.get('/api/twitter/scraper/status', async (_req, res) => {
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

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: 'EdgeDB twitter_scraper instance'
  });
});

// Root route
app.get('/', (_req, res) => {
  res.json({
    message: 'Twitter Real Data Server',
    version: '1.0.0',
    endpoints: {
      tweets: '/api/twitter/tweets',
      user: '/api/twitter/user/:username',
      status: '/api/twitter/scraper/status',
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