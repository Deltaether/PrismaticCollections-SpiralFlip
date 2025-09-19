"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterRoutes = void 0;
const express_1 = require("express");
const logger_1 = require("../utils/logger");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class TwitterRoutes {
    router;
    database;
    scraper;
    constructor(database, scraper) {
        this.router = (0, express_1.Router)();
        this.database = database;
        this.scraper = scraper;
        this.setupRoutes();
    }
    setupRoutes() {
        // Get tweets with pagination and filtering
        this.router.get('/tweets', this.getTweets.bind(this));
        // Get specific tweet by ID
        this.router.get('/tweets/:id', this.getTweetById.bind(this));
        // Get user profile
        this.router.get('/user/:username', this.getUser.bind(this));
        // Get scraper status
        this.router.get('/scraper/status', this.getScraperStatus.bind(this));
        // Trigger manual scraping
        this.router.post('/scraper/trigger', this.triggerScraping.bind(this));
        // Stop scraping
        this.router.post('/scraper/stop', this.stopScraping.bind(this));
        // Get scraping statistics
        this.router.get('/scraper/stats', this.getStats.bind(this));
        // Get profile image for specific user
        this.router.get('/profile-image/:username', this.getProfileImage.bind(this));
        // Check if profile image exists
        this.router.head('/profile-image/:username', this.checkProfileImage.bind(this));
    }
    async getTweets(req, res) {
        try {
            const { page = '0', limit = '20', username, includeRetweets = 'true', includeReplies = 'true' } = req.query;
            const pageNum = Math.max(0, parseInt(page));
            const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
            const offset = pageNum * limitNum;
            const tweets = await this.database.getTweets(limitNum, offset, username, includeRetweets === 'true', includeReplies === 'true');
            const totalCount = await this.database.getTweetCount(username);
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
            logger_1.scraperLogger.apiRequest(req.method, req.path, res.statusCode);
        }
        catch (error) {
            logger_1.scraperLogger.error('Error getting tweets', error);
            res.status(500).json({ error: 'Failed to retrieve tweets' });
        }
    }
    async getTweetById(req, res) {
        try {
            const { id } = req.params;
            const tweet = await this.database.getTweetById(id);
            if (!tweet) {
                res.status(404).json({ error: 'Tweet not found' });
                return;
            }
            res.json({ data: tweet });
            logger_1.scraperLogger.apiRequest(req.method, req.path, res.statusCode);
        }
        catch (error) {
            logger_1.scraperLogger.error(`Error getting tweet ${req.params.id}`, error);
            res.status(500).json({ error: 'Failed to retrieve tweet' });
        }
    }
    async getUser(req, res) {
        try {
            const { username } = req.params;
            const user = await this.database.getUser(username);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json({ data: user });
            logger_1.scraperLogger.apiRequest(req.method, req.path, res.statusCode);
        }
        catch (error) {
            logger_1.scraperLogger.error(`Error getting user ${req.params.username}`, error);
            res.status(500).json({ error: 'Failed to retrieve user' });
        }
    }
    async getScraperStatus(req, res) {
        try {
            const activeSession = await this.database.getActiveScrapingSession();
            const totalTweets = await this.database.getTweetCount();
            const status = {
                isRunning: this.scraper.running,
                lastScrapedAt: activeSession?.startedAt,
                totalTweetsStored: totalTweets,
                currentSession: activeSession,
                consecutiveFailures: 0 // Would need to track this in database
            };
            res.json(status);
            logger_1.scraperLogger.apiRequest(req.method, req.path, res.statusCode);
        }
        catch (error) {
            logger_1.scraperLogger.error('Error getting scraper status', error);
            res.status(500).json({ error: 'Failed to get scraper status' });
        }
    }
    async triggerScraping(req, res) {
        try {
            if (this.scraper.running) {
                res.status(409).json({ error: 'Scraping is already in progress' });
                return;
            }
            const { username = 'prismcollect_', maxTweets = 50 } = req.body;
            // Start scraping in background
            this.startScraping(username, { maxTweets })
                .catch(error => {
                logger_1.scraperLogger.error('Background scraping failed', error);
            });
            res.json({ message: 'Scraping started', username, maxTweets });
            logger_1.scraperLogger.apiRequest(req.method, req.path, res.statusCode);
        }
        catch (error) {
            logger_1.scraperLogger.error('Error triggering scraping', error);
            res.status(500).json({ error: 'Failed to trigger scraping' });
        }
    }
    async stopScraping(req, res) {
        try {
            await this.scraper.stop();
            res.json({ message: 'Scraping stop requested' });
            logger_1.scraperLogger.apiRequest(req.method, req.path, res.statusCode);
        }
        catch (error) {
            logger_1.scraperLogger.error('Error stopping scraping', error);
            res.status(500).json({ error: 'Failed to stop scraping' });
        }
    }
    async getStats(req, res) {
        try {
            const totalTweets = await this.database.getTweetCount();
            const userTweets = await this.database.getTweetCount('prismcollect_');
            const stats = {
                totalTweets,
                userTweets,
                lastUpdated: new Date().toISOString()
            };
            res.json(stats);
            logger_1.scraperLogger.apiRequest(req.method, req.path, res.statusCode);
        }
        catch (error) {
            logger_1.scraperLogger.error('Error getting stats', error);
            res.status(500).json({ error: 'Failed to get statistics' });
        }
    }
    async startScraping(username, options = {}) {
        let sessionId = null;
        try {
            // Create scraping session
            sessionId = await this.database.createScrapingSession({
                targetUsername: username,
                sessionType: 'manual',
                startedAt: new Date(),
                tweetsCollected: 0,
                status: 'running'
            });
            logger_1.scraperLogger.scrapingStart(sessionId, username);
            // Initialize scraper if needed
            if (!this.scraper.running) {
                await this.scraper.initialize();
            }
            // Scrape user profile
            const user = await this.scraper.scrapeUserProfile(username);
            // Scrape tweets
            const tweets = await this.scraper.scrapeTweets(username, {
                maxTweets: options.maxTweets || 50,
                includeRetweets: true,
                includeReplies: true
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
        }
        catch (error) {
            if (sessionId) {
                await this.database.updateScrapingSession(sessionId, {
                    status: 'failed',
                    errorMessage: error instanceof Error ? error.message : 'Unknown error'
                });
                logger_1.scraperLogger.scrapingError(sessionId, error);
            }
            throw error;
        }
    }
    async getProfileImage(req, res) {
        try {
            const { username } = req.params;
            const profilePicsPath = path_1.default.join(__dirname, '../../../twitter-scraper-linux/twitter-pfps');
            // Check for various image formats
            const possibleExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
            let imagePath = null;
            for (const ext of possibleExtensions) {
                const testPath = path_1.default.join(profilePicsPath, `${username}${ext}`);
                if (fs_1.default.existsSync(testPath)) {
                    imagePath = testPath;
                    break;
                }
            }
            if (!imagePath) {
                res.status(404).json({
                    error: 'Profile image not found',
                    username,
                    availableFormats: possibleExtensions
                });
                return;
            }
            // Set appropriate content type based on file extension
            const ext = path_1.default.extname(imagePath).toLowerCase();
            const contentTypeMap = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.webp': 'image/webp',
                '.gif': 'image/gif'
            };
            const contentType = contentTypeMap[ext] || 'image/jpeg';
            res.setHeader('Content-Type', contentType);
            res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
            res.setHeader('ETag', `"${username}-${fs_1.default.statSync(imagePath).mtime.getTime()}"`);
            res.sendFile(imagePath);
            logger_1.scraperLogger.apiRequest(req.method, req.path, res.statusCode);
        }
        catch (error) {
            logger_1.scraperLogger.error(`Error getting profile image for ${req.params.username}`, error);
            res.status(500).json({ error: 'Failed to retrieve profile image' });
        }
    }
    async checkProfileImage(req, res) {
        try {
            const { username } = req.params;
            const profilePicsPath = path_1.default.join(__dirname, '../../../twitter-scraper-linux/twitter-pfps');
            const possibleExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
            let imageExists = false;
            for (const ext of possibleExtensions) {
                const testPath = path_1.default.join(profilePicsPath, `${username}${ext}`);
                if (fs_1.default.existsSync(testPath)) {
                    imageExists = true;
                    break;
                }
            }
            if (imageExists) {
                res.status(200).end();
            }
            else {
                res.status(404).end();
            }
            logger_1.scraperLogger.apiRequest(req.method, req.path, res.statusCode);
        }
        catch (error) {
            logger_1.scraperLogger.error(`Error checking profile image for ${req.params.username}`, error);
            res.status(500).end();
        }
    }
    getRouter() {
        return this.router;
    }
}
exports.TwitterRoutes = TwitterRoutes;
//# sourceMappingURL=twitter.routes.js.map