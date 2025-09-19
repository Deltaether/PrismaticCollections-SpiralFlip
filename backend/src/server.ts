import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import cron from 'node-cron';
import path from 'path';
import { DatabaseService } from './services/database.service';
import { MockDatabaseService } from './services/mock-database.service';
import { TwitterScraperService } from './services/scraper.service';
import { TwitterRoutes } from './routes/twitter.routes';
import { scraperLogger } from './utils/logger';

// Load environment variables
dotenv.config();

class TwitterScraperServer {
  private app: express.Application;
  private database: DatabaseService | MockDatabaseService;
  private scraper: TwitterScraperService;
  private twitterRoutes: TwitterRoutes;
  private server: any;

  constructor() {
    this.app = express();
    // Use mock database for testing without EdgeDB
    this.database = process.env.USE_MOCK_DB === 'true' ? new MockDatabaseService() : new DatabaseService();
    this.scraper = new TwitterScraperService(this.database as any);
    this.twitterRoutes = new TwitterRoutes(this.database, this.scraper);

    this.setupMiddleware();
    this.setupRoutes();
    this.setupScheduledTasks();
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: false, // Disable for development
      crossOriginEmbedderPolicy: false
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:4300',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    // Compression middleware
    this.app.use(compression());

    // Logging middleware
    this.app.use(morgan('combined', {
      stream: {
        write: (message: string) => {
          scraperLogger.info(message.trim());
        }
      }
    }));

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Static file serving for profile pictures
    const profilePicsPath = path.join(__dirname, '../../twitter-scraper-linux/twitter-pfps');
    this.app.use('/api/twitter/profile-images', express.static(profilePicsPath, {
      maxAge: '1d', // Cache for 1 day
      etag: true,
      lastModified: true
    }));

    // Health check middleware
    this.app.use('/health', (_req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV || 'development'
      });
    });
  }

  private setupRoutes(): void {
    const apiPrefix = process.env.API_PREFIX || '/api';

    // Twitter API routes
    this.app.use(`${apiPrefix}/twitter`, this.twitterRoutes.getRouter());

    // Root route
    this.app.get('/', (_req, res) => {
      res.json({
        message: 'Prismatic Collections Twitter Scraper API',
        version: '1.0.0',
        documentation: `${apiPrefix}/docs`,
        health: '/health'
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
    this.app.use((error: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
      scraperLogger.error('Unhandled error in request', error, {
        method: req.method,
        url: req.url,
        body: req.body
      });

      res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    });
  }

  private setupScheduledTasks(): void {
    const timezone = process.env.TIMEZONE || 'Asia/Tokyo';
    const dailyScrapeTime = process.env.DAILY_SCRAPE_TIME || '09:00';

    // Daily scraping task for Japan morning (9 AM JST)
    const cronExpression = this.convertTimeToCron(dailyScrapeTime);

    scraperLogger.info(`Setting up daily scraping task`, {
      time: dailyScrapeTime,
      timezone,
      cronExpression
    });

    cron.schedule(cronExpression, async () => {
      try {
        scraperLogger.info('Starting scheduled daily scraping');

        if (this.scraper.running) {
          scraperLogger.warn('Skipping scheduled scraping - another session is running');
          return;
        }

        await this.performScheduledScraping();
      } catch (error) {
        scraperLogger.error('Scheduled scraping failed', error);
      }
    }, {
      timezone
    });

    // Regular maintenance task (every 6 hours)
    cron.schedule('0 */6 * * *', async () => {
      try {
        scraperLogger.info('Running maintenance tasks');
        await this.performMaintenance();
      } catch (error) {
        scraperLogger.error('Maintenance task failed', error);
      }
    }, {
      timezone
    });
  }

  private convertTimeToCron(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    return `${minutes} ${hours} * * *`;
  }

  private async performScheduledScraping(): Promise<void> {
    const username = process.env.TWITTER_USERNAME || 'prismcollect_';
    let sessionId: string | null = null;

    try {
      // Create scraping session
      sessionId = await this.database.createScrapingSession({
        targetUsername: username,
        sessionType: 'scheduled',
        startedAt: new Date(),
        tweetsCollected: 0,
        status: 'running'
      });

      scraperLogger.scrapingStart(sessionId, username);

      // Initialize scraper
      await this.scraper.initialize();

      // Get the latest tweet ID to avoid duplicates
      const latestTweetId = await this.database.getLatestTweetId(username);

      // Scrape user profile
      const user = await this.scraper.scrapeUserProfile(username);

      // Scrape tweets
      const tweets = await this.scraper.scrapeTweets(username, {
        maxTweets: parseInt(process.env.MAX_TWEETS_PER_SESSION || '100'),
        includeRetweets: true,
        includeReplies: true,
        startFromTweetId: latestTweetId || undefined
      });

      // Save to database
      await this.scraper.saveScrapedData(tweets, user || undefined);

      // Update session
      await this.database.updateScrapingSession(sessionId, {
        completedAt: new Date(),
        tweetsCollected: tweets.length,
        status: 'completed'
      });

      scraperLogger.scrapingComplete(sessionId, tweets.length, Date.now());

      // Close scraper to free resources
      await this.scraper.close();
    } catch (error) {
      if (sessionId) {
        await this.database.updateScrapingSession(sessionId, {
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });

        scraperLogger.scrapingError(sessionId, error);
      }

      // Try to close scraper even on error
      try {
        await this.scraper.close();
      } catch (closeError) {
        scraperLogger.error('Error closing scraper after failure', closeError);
      }

      throw error;
    }
  }

  private async performMaintenance(): Promise<void> {
    // This could include cleanup tasks, statistics updates, etc.
    scraperLogger.info('Maintenance completed');
  }

  async start(): Promise<void> {
    try {
      // Connect to database
      await this.database.connect();

      // Start server
      const port = process.env.PORT || 3001;
      this.server = this.app.listen(port, () => {
        scraperLogger.info(`Twitter Scraper API server started`, {
          port,
          environment: process.env.NODE_ENV || 'development',
          corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4300'
        });
      });

      // Graceful shutdown handling
      process.on('SIGTERM', this.shutdown.bind(this));
      process.on('SIGINT', this.shutdown.bind(this));
      process.on('uncaughtException', (error) => {
        scraperLogger.error('Uncaught exception', error);
        this.shutdown();
      });
      process.on('unhandledRejection', (reason, promise) => {
        scraperLogger.error('Unhandled rejection', reason, { promise });
      });

    } catch (error) {
      scraperLogger.error('Failed to start server', error);
      process.exit(1);
    }
  }

  private async shutdown(): Promise<void> {
    scraperLogger.info('Shutting down server...');

    try {
      // Stop scraper
      if (this.scraper.running) {
        await this.scraper.stop();
        await this.scraper.close();
      }

      // Close database connection
      await this.database.disconnect();

      // Close server
      if (this.server) {
        this.server.close(() => {
          scraperLogger.info('Server shutdown complete');
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    } catch (error) {
      scraperLogger.error('Error during shutdown', error);
      process.exit(1);
    }
  }
}

// Start server
const server = new TwitterScraperServer();
server.start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});