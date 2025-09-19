"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockDatabaseService = void 0;
const logger_1 = require("../utils/logger");
class MockDatabaseService {
    tweets = new Map();
    users = new Map();
    sessions = new Map();
    currentSessionId = '';
    constructor() {
        this.loadMockData();
    }
    async connect() {
        logger_1.scraperLogger.info('Connected to Mock Database successfully');
    }
    async disconnect() {
        logger_1.scraperLogger.info('Disconnected from Mock Database');
    }
    // Tweet operations
    async saveTweet(tweet) {
        try {
            this.tweets.set(tweet.tweetId, tweet);
            logger_1.scraperLogger.debug(`Tweet ${tweet.tweetId} saved to mock database`);
            return true;
        }
        catch (error) {
            logger_1.scraperLogger.error(`Failed to save tweet ${tweet.tweetId}`, error);
            return false;
        }
    }
    async getTweets(limit = 20, offset = 0, username, includeRetweets = true, includeReplies = true) {
        try {
            let tweets = Array.from(this.tweets.values());
            // Apply filters
            if (username) {
                tweets = tweets.filter(t => t.authorUsername === username);
            }
            if (!includeRetweets) {
                tweets = tweets.filter(t => !t.isRetweet);
            }
            if (!includeReplies) {
                tweets = tweets.filter(t => !t.isReply);
            }
            // Sort by creation date (newest first)
            tweets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            // Update profile image URLs for all tweets
            tweets = tweets.map(tweet => ({
                ...tweet,
                authorProfileImageUrl: this.getProfileImageUrl(tweet.authorUsername)
            }));
            // Apply pagination
            return tweets.slice(offset, offset + limit);
        }
        catch (error) {
            logger_1.scraperLogger.error('Failed to get tweets', error);
            throw error;
        }
    }
    async getTweetById(tweetId) {
        return this.tweets.get(tweetId) || null;
    }
    async getTweetCount(username) {
        try {
            if (username) {
                return Array.from(this.tweets.values()).filter(t => t.authorUsername === username).length;
            }
            return this.tweets.size;
        }
        catch (error) {
            logger_1.scraperLogger.error('Failed to get tweet count', error);
            return 0;
        }
    }
    async getLatestTweetId(username) {
        try {
            const userTweets = Array.from(this.tweets.values())
                .filter(t => t.authorUsername === username)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return userTweets.length > 0 ? userTweets[0].tweetId : null;
        }
        catch (error) {
            logger_1.scraperLogger.error(`Failed to get latest tweet ID for ${username}`, error);
            return null;
        }
    }
    // User operations
    async saveUser(user) {
        try {
            this.users.set(user.username, user);
            logger_1.scraperLogger.debug(`User ${user.username} saved to mock database`);
            return true;
        }
        catch (error) {
            logger_1.scraperLogger.error(`Failed to save user ${user.username}`, error);
            return false;
        }
    }
    async getUser(username) {
        const user = this.users.get(username);
        if (!user)
            return null;
        // Generate profile image URL based on local availability
        const profileImageUrl = this.getProfileImageUrl(username);
        return {
            ...user,
            profileImageUrl,
            profileImagePath: profileImageUrl?.includes('/api/twitter/profile-image/')
                ? `${username}.jpg` // Assume .jpg for mock, real implementation would check filesystem
                : undefined
        };
    }
    getProfileImageUrl(username) {
        // In production, this would check if the file exists in twitter-pfps directory
        // For mock data, we'll return the API URL that would serve the image
        return `http://localhost:3002/api/twitter/profile-image/${username}`;
    }
    // Scraping session operations
    async createScrapingSession(sessionData) {
        try {
            const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const session = {
                sessionId,
                ...sessionData
            };
            this.sessions.set(sessionId, session);
            this.currentSessionId = sessionId;
            return sessionId;
        }
        catch (error) {
            logger_1.scraperLogger.error('Failed to create scraping session', error);
            throw error;
        }
    }
    async updateScrapingSession(sessionId, updates) {
        try {
            const session = this.sessions.get(sessionId);
            if (!session)
                return false;
            Object.assign(session, updates);
            this.sessions.set(sessionId, session);
            return true;
        }
        catch (error) {
            logger_1.scraperLogger.error(`Failed to update scraping session ${sessionId}`, error);
            return false;
        }
    }
    async getActiveScrapingSession() {
        try {
            const session = this.sessions.get(this.currentSessionId);
            return session?.status === 'running' ? session : null;
        }
        catch (error) {
            logger_1.scraperLogger.error('Failed to get active scraping session', error);
            return null;
        }
    }
    loadMockData() {
        // Create a mock user
        const mockUser = {
            userId: 'user_prismcollect_',
            username: 'prismcollect_',
            displayName: 'Prismatic Collections',
            description: 'Interactive digital art and music experiences. Exploring the intersection of technology and creativity.',
            profileImageUrl: 'https://pbs.twimg.com/profile_images/placeholder.jpg',
            verified: false,
            followersCount: 1250,
            followingCount: 150,
            tweetCount: 45,
            createdAt: new Date('2023-01-15'),
            scrapedAt: new Date()
        };
        this.users.set(mockUser.username, mockUser);
        // Create mock tweets
        const mockTweets = [
            {
                tweetId: '1834567890123456789',
                text: '🎵 Just released a new interactive music experience! Dive into the world of Phantasia where sound meets visual art. Experience it at our website! #DigitalArt #InteractiveMusic #WebGL',
                authorUsername: 'prismcollect_',
                authorDisplayName: 'Prismatic Collections',
                authorProfileImageUrl: 'https://pbs.twimg.com/profile_images/placeholder.jpg',
                authorVerified: false,
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                scrapedAt: new Date(),
                likeCount: 24,
                retweetCount: 8,
                replyCount: 3,
                quoteCount: 1,
                isRetweet: false,
                isQuote: false,
                isReply: false,
                mediaUrls: [],
                mediaTypes: [],
                hashtags: ['DigitalArt', 'InteractiveMusic', 'WebGL'],
                mentions: [],
                urls: []
            },
            {
                tweetId: '1834567890123456788',
                text: 'Working on some exciting new 3D visualizations using Three.js. The possibilities are endless when you combine mathematics with artistic vision! 🎨✨',
                authorUsername: 'prismcollect_',
                authorDisplayName: 'Prismatic Collections',
                authorProfileImageUrl: 'https://pbs.twimg.com/profile_images/placeholder.jpg',
                authorVerified: false,
                createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
                scrapedAt: new Date(),
                likeCount: 18,
                retweetCount: 5,
                replyCount: 2,
                quoteCount: 0,
                isRetweet: false,
                isQuote: false,
                isReply: false,
                mediaUrls: [],
                mediaTypes: [],
                hashtags: [],
                mentions: [],
                urls: []
            },
            {
                tweetId: '1834567890123456787',
                text: 'Behind the scenes: Our development workflow combines Angular, TypeScript, and creative coding. Each project pushes the boundaries of what\'s possible in the browser. 🚀',
                authorUsername: 'prismcollect_',
                authorDisplayName: 'Prismatic Collections',
                authorProfileImageUrl: 'https://pbs.twimg.com/profile_images/placeholder.jpg',
                authorVerified: false,
                createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
                scrapedAt: new Date(),
                likeCount: 31,
                retweetCount: 12,
                replyCount: 7,
                quoteCount: 2,
                isRetweet: false,
                isQuote: false,
                isReply: false,
                mediaUrls: [],
                mediaTypes: [],
                hashtags: [],
                mentions: [],
                urls: []
            },
            {
                tweetId: '1834567890123456786',
                text: 'RT @creativecoder: Amazing work from @prismcollect_! The intersection of music and visual art in digital spaces is truly inspiring. 🎶🎨',
                authorUsername: 'prismcollect_',
                authorDisplayName: 'Prismatic Collections',
                authorProfileImageUrl: 'https://pbs.twimg.com/profile_images/placeholder.jpg',
                authorVerified: false,
                createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
                scrapedAt: new Date(),
                likeCount: 12,
                retweetCount: 3,
                replyCount: 1,
                quoteCount: 0,
                isRetweet: true,
                isQuote: false,
                isReply: false,
                mediaUrls: [],
                mediaTypes: [],
                hashtags: [],
                mentions: ['creativecoder', 'prismcollect_'],
                urls: [],
                sourceTweetId: '1834567890123456785',
                sourceTweetText: 'Amazing work from @prismcollect_! The intersection of music and visual art in digital spaces is truly inspiring. 🎶🎨',
                sourceAuthorUsername: 'creativecoder'
            },
            {
                tweetId: '1834567890123456784',
                text: 'Exploring procedural generation techniques for creating infinite, ever-changing soundscapes. Each visitor experiences something unique! #ProceduralArt #GenerativeMusic',
                authorUsername: 'prismcollect_',
                authorDisplayName: 'Prismatic Collections',
                authorProfileImageUrl: 'https://pbs.twimg.com/profile_images/placeholder.jpg',
                authorVerified: false,
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
                scrapedAt: new Date(),
                likeCount: 42,
                retweetCount: 18,
                replyCount: 9,
                quoteCount: 3,
                isRetweet: false,
                isQuote: false,
                isReply: false,
                mediaUrls: [],
                mediaTypes: [],
                hashtags: ['ProceduralArt', 'GenerativeMusic'],
                mentions: [],
                urls: []
            }
        ];
        mockTweets.forEach(tweet => {
            this.tweets.set(tweet.tweetId, tweet);
        });
        logger_1.scraperLogger.info(`Loaded ${mockTweets.length} mock tweets and ${this.users.size} mock users`);
    }
}
exports.MockDatabaseService = MockDatabaseService;
//# sourceMappingURL=mock-database.service.js.map