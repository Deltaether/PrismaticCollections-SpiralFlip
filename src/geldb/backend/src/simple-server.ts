import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { MockDatabaseService } from './services/mock-database.service';

// Load environment variables
dotenv.config();

class SimpleTwitterDataServer {
  private app: express.Application;
  private database: MockDatabaseService;
  private server: any;

  constructor() {
    this.app = express();
    this.database = new MockDatabaseService();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false
    }));

    // CORS configuration
    this.app.use(cors({
      origin: 'http://localhost:5005',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    // Compression and parsing
    this.app.use(compression());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging
    this.app.use(morgan('combined'));
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (_req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    // Twitter API routes
    this.app.get('/api/twitter/tweets', async (req, res) => {
      try {
        const {
          page = '0',
          limit = '20',
          username,
          includeRetweets = 'true',
          includeReplies = 'true'
        } = req.query;

        const pageNum = Math.max(0, parseInt(page as string));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
        const offset = pageNum * limitNum;

        const tweets = await this.database.getTweets(
          limitNum,
          offset,
          username as string,
          includeRetweets === 'true',
          includeReplies === 'true'
        );

        const totalCount = await this.database.getTweetCount(username as string);

        res.json({
          data: tweets,
          meta: {
            resultCount: tweets.length,
            totalCount,
            page: pageNum,
            limit: limitNum,
            hasMore: offset + tweets.length < totalCount
          }
        });
      } catch (error) {
        console.error('Error getting tweets:', error);
        res.status(500).json({ error: 'Failed to retrieve tweets' });
      }
    });

    this.app.get('/api/twitter/user/:username', async (req, res) => {
      try {
        const username = req.params.username || 'prismcollect_';
        const user = await this.database.getUser(username);

        if (!user) {
          res.status(404).json({ error: 'User not found' });
          return;
        }

        res.json({ data: user });
      } catch (error) {
        console.error(`Error getting user:`, error);
        res.status(500).json({ error: 'Failed to retrieve user' });
      }
    });

    this.app.get('/api/twitter/scraper/status', async (_req, res) => {
      try {
        const totalTweets = await this.database.getTweetCount();

        const status = {
          isRunning: false, // Python fetcher runs independently
          totalTweetsStored: totalTweets,
          consecutiveFailures: 0,
          lastScrapedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          source: 'Python API v2 (Mock Mode)'
        };

        res.json(status);
      } catch (error) {
        console.error('Error getting system status:', error);
        res.status(500).json({ error: 'Failed to get system status' });
      }
    });


    // Root route
    this.app.get('/', (_req, res) => {
      res.json({
        message: 'Twitter Data API (Mock Mode)',
        version: '2.0.0',
        source: 'Python API v2 (Mock)',
        endpoints: {
          health: '/health',
          tweets: '/api/twitter/tweets',
          user: '/api/twitter/user/:username',
          status: '/api/twitter/scraper/status'
        }
      });
    });

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method
      });
    });

    // Global error handler
    this.app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error('Unhandled error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    });
  }

  async start(): Promise<void> {
    try {
      await this.database.connect();

      const port = process.env.PORT || 3001;
      this.server = this.app.listen(port, () => {
        console.log(`🚀 Twitter Data API (Mock Mode) started on port ${port}`);
        console.log(`📊 Health check: http://localhost:${port}/health`);
        console.log(`🐦 API endpoints: http://localhost:${port}/api/twitter/*`);
        console.log(`🔌 Source: Python API v2 (Mock Mode)`);
      });

      process.on('SIGTERM', this.shutdown.bind(this));
      process.on('SIGINT', this.shutdown.bind(this));

    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private async shutdown(): Promise<void> {
    console.log('Shutting down server...');

    try {
      await this.database.disconnect();

      if (this.server) {
        this.server.close(() => {
          console.log('Server shutdown complete');
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  }
}

// Start server
const server = new SimpleTwitterDataServer();
server.start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});