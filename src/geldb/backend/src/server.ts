import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import { DatabaseService } from './services/database.service';
import { MockDatabaseService } from './services/mock-database.service';
import { TwitterRoutes } from './routes/twitter.routes';
import { scraperLogger } from './utils/logger';

// Load environment variables
dotenv.config();

class TwitterDataServer {
  private app: express.Application;
  private database: DatabaseService | MockDatabaseService;
  private twitterRoutes: TwitterRoutes;
  private server: any;

  constructor() {
    this.app = express();
    // Use mock database for testing without Gel
    this.database = process.env.USE_MOCK_DB === 'true' ? new MockDatabaseService() : new DatabaseService();
    this.twitterRoutes = new TwitterRoutes(this.database);

    this.setupMiddleware();
    this.setupRoutes();
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

    // Static file serving for profile pictures (updated to use assets directory)
    const profilePicsPath = path.join(__dirname, '../../../src/assets/images/profile-pics');
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
        message: 'Prismatic Collections Twitter Data API',
        version: '2.0.0',
        source: 'Python API v2 Fetcher',
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





  async start(): Promise<void> {
    try {
      // Connect to database
      await this.database.connect();

      // Start server
      const port = process.env.PORT || 3001;
      this.server = this.app.listen(port, () => {
        scraperLogger.info(`Twitter Data API server started`, {
          port,
          environment: process.env.NODE_ENV || 'development',
          corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4300',
          source: 'Python API v2 Fetcher'
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
const server = new TwitterDataServer();
server.start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});