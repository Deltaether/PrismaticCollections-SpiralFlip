"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_cron_1 = __importDefault(require("node-cron"));
const path_1 = __importDefault(require("path"));
const database_service_1 = require("./services/database.service");
const mock_database_service_1 = require("./services/mock-database.service");
const scraper_service_1 = require("./services/scraper.service");
const twitter_routes_1 = require("./routes/twitter.routes");
const logger_1 = require("./utils/logger");
// Load environment variables
dotenv_1.default.config();
class TwitterScraperServer {
    app;
    database;
    scraper;
    twitterRoutes;
    server;
    constructor() {
        this.app = (0, express_1.default)();
        // Use mock database for testing without EdgeDB
        this.database = process.env.USE_MOCK_DB === 'true' ? new mock_database_service_1.MockDatabaseService() : new database_service_1.DatabaseService();
        this.scraper = new scraper_service_1.TwitterScraperService(this.database);
        this.twitterRoutes = new twitter_routes_1.TwitterRoutes(this.database, this.scraper);
        this.setupMiddleware();
        this.setupRoutes();
        this.setupScheduledTasks();
    }
    setupMiddleware() {
        // Security middleware
        this.app.use((0, helmet_1.default)({
            contentSecurityPolicy: false, // Disable for development
            crossOriginEmbedderPolicy: false
        }));
        // CORS configuration
        this.app.use((0, cors_1.default)({
            origin: process.env.CORS_ORIGIN || 'http://localhost:4300',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
        }));
        // Compression middleware
        this.app.use((0, compression_1.default)());
        // Logging middleware
        this.app.use((0, morgan_1.default)('combined', {
            stream: {
                write: (message) => {
                    logger_1.scraperLogger.info(message.trim());
                }
            }
        }));
        // Body parsing middleware
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
        // Static file serving for profile pictures
        const profilePicsPath = path_1.default.join(__dirname, '../../twitter-scraper-linux/twitter-pfps');
        this.app.use('/api/twitter/profile-images', express_1.default.static(profilePicsPath, {
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
    setupRoutes() {
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
        this.app.use((error, req, res, _next) => {
            logger_1.scraperLogger.error('Unhandled error in request', error, {
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
    setupScheduledTasks() {
        const timezone = process.env.TIMEZONE || 'Asia/Tokyo';
        const dailyScrapeTime = process.env.DAILY_SCRAPE_TIME || '09:00';
        // Daily scraping task for Japan morning (9 AM JST)
        const cronExpression = this.convertTimeToCron(dailyScrapeTime);
        logger_1.scraperLogger.info(`Setting up daily scraping task`, {
            time: dailyScrapeTime,
            timezone,
            cronExpression
        });
        node_cron_1.default.schedule(cronExpression, async () => {
            try {
                logger_1.scraperLogger.info('Starting scheduled daily scraping');
                if (this.scraper.running) {
                    logger_1.scraperLogger.warn('Skipping scheduled scraping - another session is running');
                    return;
                }
                await this.performScheduledScraping();
            }
            catch (error) {
                logger_1.scraperLogger.error('Scheduled scraping failed', error);
            }
        }, {
            timezone
        });
        // Regular maintenance task (every 6 hours)
        node_cron_1.default.schedule('0 */6 * * *', async () => {
            try {
                logger_1.scraperLogger.info('Running maintenance tasks');
                await this.performMaintenance();
            }
            catch (error) {
                logger_1.scraperLogger.error('Maintenance task failed', error);
            }
        }, {
            timezone
        });
    }
    convertTimeToCron(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return `${minutes} ${hours} * * *`;
    }
    async performScheduledScraping() {
        const username = process.env.TWITTER_USERNAME || 'prismcollect_';
        let sessionId = null;
        try {
            // Create scraping session
            sessionId = await this.database.createScrapingSession({
                targetUsername: username,
                sessionType: 'scheduled',
                startedAt: new Date(),
                tweetsCollected: 0,
                status: 'running'
            });
            logger_1.scraperLogger.scrapingStart(sessionId, username);
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
            logger_1.scraperLogger.scrapingComplete(sessionId, tweets.length, Date.now());
            // Close scraper to free resources
            await this.scraper.close();
        }
        catch (error) {
            if (sessionId) {
                await this.database.updateScrapingSession(sessionId, {
                    status: 'failed',
                    errorMessage: error instanceof Error ? error.message : 'Unknown error'
                });
                logger_1.scraperLogger.scrapingError(sessionId, error);
            }
            // Try to close scraper even on error
            try {
                await this.scraper.close();
            }
            catch (closeError) {
                logger_1.scraperLogger.error('Error closing scraper after failure', closeError);
            }
            throw error;
        }
    }
    async performMaintenance() {
        // This could include cleanup tasks, statistics updates, etc.
        logger_1.scraperLogger.info('Maintenance completed');
    }
    async start() {
        try {
            // Connect to database
            await this.database.connect();
            // Start server
            const port = process.env.PORT || 3001;
            this.server = this.app.listen(port, () => {
                logger_1.scraperLogger.info(`Twitter Scraper API server started`, {
                    port,
                    environment: process.env.NODE_ENV || 'development',
                    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4300'
                });
            });
            // Graceful shutdown handling
            process.on('SIGTERM', this.shutdown.bind(this));
            process.on('SIGINT', this.shutdown.bind(this));
            process.on('uncaughtException', (error) => {
                logger_1.scraperLogger.error('Uncaught exception', error);
                this.shutdown();
            });
            process.on('unhandledRejection', (reason, promise) => {
                logger_1.scraperLogger.error('Unhandled rejection', reason, { promise });
            });
        }
        catch (error) {
            logger_1.scraperLogger.error('Failed to start server', error);
            process.exit(1);
        }
    }
    async shutdown() {
        logger_1.scraperLogger.info('Shutting down server...');
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
                    logger_1.scraperLogger.info('Server shutdown complete');
                    process.exit(0);
                });
            }
            else {
                process.exit(0);
            }
        }
        catch (error) {
            logger_1.scraperLogger.error('Error during shutdown', error);
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
//# sourceMappingURL=server.js.map