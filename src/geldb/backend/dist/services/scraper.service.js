"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterScraperService = void 0;
const playwright_1 = require("playwright");
// import path from 'path';
const fs_1 = __importDefault(require("fs"));
const logger_1 = require("../utils/logger");
class TwitterScraperService {
    browser = null;
    page = null;
    database;
    isRunning = false;
    userDataDir;
    constructor(database) {
        this.database = database;
        this.userDataDir = process.env.BROWSER_USER_DATA_DIR || './browser-data';
        // Ensure user data directory exists
        if (!fs_1.default.existsSync(this.userDataDir)) {
            fs_1.default.mkdirSync(this.userDataDir, { recursive: true });
        }
    }
    async initialize() {
        try {
            logger_1.scraperLogger.info('Initializing Twitter scraper with persistent browser data');
            // Launch browser with persistent context
            this.browser = await playwright_1.chromium.launchPersistentContext(this.userDataDir, {
                headless: process.env.BROWSER_HEADLESS === 'true',
                viewport: { width: 1366, height: 768 },
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                args: [
                    '--disable-blink-features=AutomationControlled',
                    '--disable-dev-shm-usage',
                    '--no-first-run',
                    '--no-default-browser-check',
                    '--disable-extensions',
                    '--disable-plugins',
                    '--disable-background-timer-throttling',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-renderer-backgrounding'
                ],
                locale: 'en-US',
                timezoneId: 'Asia/Tokyo'
            });
            // Create new page
            this.page = await this.browser.newPage();
            // Wait 1 minute for browser stabilization after initialization
            logger_1.scraperLogger.info('Waiting 1 minute for browser stabilization...');
            await new Promise(resolve => setTimeout(resolve, 60000)); // 60 seconds
            logger_1.scraperLogger.info('Browser stabilization wait completed');
            // Set additional anti-detection measures
            if (this.page) {
                await this.page.addInitScript(() => {
                    // Remove webdriver property
                    Object.defineProperty(navigator, 'webdriver', {
                        get: () => undefined,
                    });
                    // Mock chrome runtime
                    window.chrome = {
                        runtime: {}
                    };
                    // Mock plugins
                    Object.defineProperty(navigator, 'plugins', {
                        get: () => [1, 2, 3, 4, 5],
                    });
                    // Mock languages
                    Object.defineProperty(navigator, 'languages', {
                        get: () => ['en-US', 'en'],
                    });
                });
            }
            logger_1.scraperLogger.info('Twitter scraper initialized successfully');
        }
        catch (error) {
            logger_1.scraperLogger.error('Failed to initialize Twitter scraper', error);
            throw error;
        }
    }
    async scrapeUserProfile(username) {
        if (!this.page) {
            throw new Error('Scraper not initialized');
        }
        try {
            logger_1.scraperLogger.info(`Scraping user profile: ${username}`);
            const profileUrl = `https://x.com/${username}`;
            await this.page.goto(profileUrl, {
                waitUntil: 'networkidle',
                timeout: parseInt(process.env.BROWSER_TIMEOUT || '30000')
            });
            // Wait for profile to load
            await this.page.waitForSelector('[data-testid="UserName"]', { timeout: 10000 });
            // Extract user data
            const userData = await this.page.evaluate(() => {
                const nameElement = document.querySelector('[data-testid="UserName"]');
                const handleElement = document.querySelector('[data-testid="UserScreenName"]');
                const descriptionElement = document.querySelector('[data-testid="UserDescription"]');
                const avatarElement = document.querySelector('[data-testid="UserAvatar"] img');
                const verifiedElement = document.querySelector('[data-testid="UserName"] [data-testid="Icon"][aria-label*="Verified"]');
                // Stats elements
                const followingElement = document.querySelector('a[href$="/following"] span');
                const followersElement = document.querySelector('a[href$="/verified_followers"] span, a[href$="/followers"] span');
                return {
                    displayName: nameElement?.textContent?.trim() || '',
                    username: handleElement?.textContent?.replace('@', '') || '',
                    description: descriptionElement?.textContent?.trim() || '',
                    profileImageUrl: avatarElement?.src || '',
                    verified: !!verifiedElement,
                    followingCount: parseInt(followingElement?.textContent?.replace(/,/g, '') || '0'),
                    followersCount: parseInt(followersElement?.textContent?.replace(/,/g, '') || '0')
                };
            });
            const user = {
                userId: `user_${username}`, // Will be updated with actual ID if available
                username: userData.username || username,
                displayName: userData.displayName,
                description: userData.description,
                profileImageUrl: userData.profileImageUrl,
                verified: userData.verified,
                followersCount: userData.followersCount,
                followingCount: userData.followingCount,
                tweetCount: 0, // Will be updated from API if available
                createdAt: new Date(), // Placeholder
                scrapedAt: new Date()
            };
            logger_1.scraperLogger.info(`User profile scraped: ${username}`, {
                displayName: user.displayName,
                verified: user.verified,
                followers: user.followersCount
            });
            return user;
        }
        catch (error) {
            logger_1.scraperLogger.error(`Failed to scrape user profile: ${username}`, error);
            return null;
        }
    }
    async scrapeTweets(username, options = {}) {
        if (!this.page) {
            throw new Error('Scraper not initialized');
        }
        this.isRunning = true;
        const tweets = [];
        try {
            const { maxTweets = 50, includeRetweets = true, includeReplies = true, delayMin = 180000, // 3 minutes
            delayMax = 210000 // 3.5 minutes
             } = options;
            logger_1.scraperLogger.info(`Starting tweet scraping for ${username}`, {
                maxTweets,
                includeRetweets,
                includeReplies
            });
            const profileUrl = `https://x.com/${username}`;
            await this.page.goto(profileUrl, {
                waitUntil: 'networkidle',
                timeout: parseInt(process.env.BROWSER_TIMEOUT || '30000')
            });
            // Wait for tweets to load
            await this.page.waitForSelector('[data-testid="tweet"]', { timeout: 15000 });
            let processedTweets = 0;
            let consecutiveEmptyScrolls = 0;
            const maxEmptyScrolls = 3;
            const seenTweetIds = new Set();
            while (processedTweets < maxTweets && consecutiveEmptyScrolls < maxEmptyScrolls && this.isRunning) {
                // Extract tweets from current view
                const rawTweets = await this.extractTweetsFromPage();
                let newTweetsFound = 0;
                for (const rawTweet of rawTweets) {
                    if (processedTweets >= maxTweets)
                        break;
                    if (seenTweetIds.has(rawTweet.id))
                        continue;
                    // Apply filters
                    if (!includeRetweets && rawTweet.isRetweet)
                        continue;
                    if (!includeReplies && rawTweet.isReply)
                        continue;
                    const tweet = this.convertRawTweetToTweet(rawTweet);
                    tweets.push(tweet);
                    seenTweetIds.add(rawTweet.id);
                    processedTweets++;
                    newTweetsFound++;
                    logger_1.scraperLogger.debug(`Processed tweet ${rawTweet.id}`, {
                        author: rawTweet.authorHandle,
                        isRetweet: rawTweet.isRetweet,
                        isReply: rawTweet.isReply
                    });
                }
                if (newTweetsFound === 0) {
                    consecutiveEmptyScrolls++;
                }
                else {
                    consecutiveEmptyScrolls = 0;
                    // Add additional random delay after processing tweets (10-30 seconds)
                    const additionalDelay = Math.random() * (30000 - 10000) + 10000;
                    logger_1.scraperLogger.info(`Waiting additional ${(additionalDelay / 1000).toFixed(1)} seconds after processing ${newTweetsFound} tweets`);
                    await new Promise(resolve => setTimeout(resolve, additionalDelay));
                }
                // Scroll to load more tweets
                if (processedTweets < maxTweets && consecutiveEmptyScrolls < maxEmptyScrolls) {
                    await this.humanLikeScroll();
                    await this.randomDelay(delayMin, delayMax);
                }
            }
            logger_1.scraperLogger.info(`Tweet scraping completed for ${username}`, {
                tweetsFound: tweets.length,
                requestedMax: maxTweets
            });
            return tweets;
        }
        catch (error) {
            logger_1.scraperLogger.error(`Failed to scrape tweets for ${username}`, error);
            throw error;
        }
        finally {
            this.isRunning = false;
        }
    }
    async extractTweetsFromPage() {
        if (!this.page)
            return [];
        return await this.page.evaluate(() => {
            const tweetElements = document.querySelectorAll('[data-testid="tweet"]');
            const tweets = [];
            tweetElements.forEach((tweetEl) => {
                try {
                    // Extract tweet ID from URL
                    const timeElement = tweetEl.querySelector('time');
                    const parentLink = timeElement?.closest('a');
                    const tweetUrl = parentLink?.href || '';
                    const tweetId = tweetUrl.split('/status/')[1]?.split('?')[0] || '';
                    if (!tweetId)
                        return;
                    // Extract text content
                    const textElement = tweetEl.querySelector('[data-testid="tweetText"]');
                    const text = textElement?.textContent || '';
                    // Extract author information
                    const authorElement = tweetEl.querySelector('[data-testid="User-Name"]');
                    const authorNameEl = authorElement?.querySelector('span');
                    const authorHandleEl = authorElement?.querySelectorAll('span')[1];
                    const authorName = authorNameEl?.textContent || '';
                    const authorHandle = authorHandleEl?.textContent?.replace('@', '') || '';
                    // Extract avatar
                    const avatarEl = tweetEl.querySelector('[data-testid="Tweet-User-Avatar"] img');
                    const authorImage = avatarEl?.src || '';
                    // Check for verified badge
                    const verifiedEl = tweetEl.querySelector('[data-testid="User-Name"] [data-testid="Icon"][aria-label*="Verified"]');
                    const authorVerified = !!verifiedEl;
                    // Extract timestamp
                    const timestamp = timeElement?.getAttribute('datetime') || '';
                    // Extract engagement metrics
                    const likeButton = tweetEl.querySelector('[data-testid="like"]');
                    const retweetButton = tweetEl.querySelector('[data-testid="retweet"]');
                    const replyButton = tweetEl.querySelector('[data-testid="reply"]');
                    const likeCount = parseInt(likeButton?.textContent?.trim() || '0');
                    const retweetCount = parseInt(retweetButton?.textContent?.trim() || '0');
                    const replyCount = parseInt(replyButton?.textContent?.trim() || '0');
                    // Extract media
                    const mediaElements = tweetEl.querySelectorAll('[data-testid="tweetPhoto"] img, [data-testid="videoComponent"] video');
                    const media = Array.from(mediaElements).map((el) => ({
                        type: el.tagName.toLowerCase() === 'img' ? 'image' : 'video',
                        url: el.getAttribute('src') || '',
                        alt: el.getAttribute('alt') || ''
                    }));
                    // Extract hashtags and mentions from text
                    const hashtags = Array.from(text.matchAll(/#(\w+)/g)).map(match => match[1]);
                    const mentions = Array.from(text.matchAll(/@(\w+)/g)).map(match => match[1]);
                    // Extract links
                    const linkElements = tweetEl.querySelectorAll('a[href*="//t.co/"]');
                    const links = Array.from(linkElements).map(el => el.getAttribute('href') || '');
                    // Determine tweet type
                    const isRetweet = tweetEl.querySelector('[data-testid="socialContext"]')?.textContent?.includes('retweeted') || false;
                    const isQuote = !!tweetEl.querySelector('[data-testid="quoteTweet"]');
                    const isReply = text.startsWith('@') || !!tweetEl.querySelector('[data-testid="inReplyTo"]');
                    tweets.push({
                        id: tweetId,
                        text,
                        authorName,
                        authorHandle,
                        authorImage,
                        authorVerified,
                        timestamp,
                        engagement: {
                            likes: likeCount,
                            retweets: retweetCount,
                            replies: replyCount,
                            quotes: 0 // Not easily extractable
                        },
                        media,
                        hashtags,
                        mentions,
                        links,
                        isRetweet,
                        isQuote,
                        isReply
                    });
                }
                catch (error) {
                    console.error('Error extracting tweet data:', error);
                }
            });
            return tweets;
        });
    }
    convertRawTweetToTweet(rawTweet) {
        return {
            tweetId: rawTweet.id,
            text: rawTweet.text,
            authorUsername: rawTweet.authorHandle,
            authorDisplayName: rawTweet.authorName,
            authorProfileImageUrl: rawTweet.authorImage,
            authorVerified: rawTweet.authorVerified,
            createdAt: new Date(rawTweet.timestamp),
            scrapedAt: new Date(),
            likeCount: rawTweet.engagement.likes,
            retweetCount: rawTweet.engagement.retweets,
            replyCount: rawTweet.engagement.replies,
            quoteCount: rawTweet.engagement.quotes,
            isRetweet: rawTweet.isRetweet,
            isQuote: rawTweet.isQuote,
            isReply: rawTweet.isReply,
            mediaUrls: rawTweet.media?.map(m => m.url) || [],
            mediaTypes: rawTweet.media?.map(m => m.type) || [],
            hashtags: rawTweet.hashtags,
            mentions: rawTweet.mentions,
            urls: rawTweet.links,
            rawData: rawTweet
        };
    }
    async humanLikeScroll() {
        if (!this.page)
            return;
        // Random scroll behavior to mimic human
        const scrollDistance = Math.random() * 500 + 300; // 300-800px
        const scrollSteps = Math.floor(Math.random() * 3) + 2; // 2-4 steps
        const stepDistance = scrollDistance / scrollSteps;
        for (let i = 0; i < scrollSteps; i++) {
            await this.page.evaluate((distance) => {
                window.scrollBy(0, distance);
            }, stepDistance);
            await this.randomDelay(100, 300);
        }
        // Pause to let content load
        await this.randomDelay(500, 1500);
    }
    async randomDelay(min, max) {
        const delay = Math.random() * (max - min) + min;
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    async saveScrapedData(tweets, user) {
        try {
            logger_1.scraperLogger.info(`Saving ${tweets.length} tweets to database`);
            // Save user if provided
            if (user) {
                await this.database.saveUser(user);
                logger_1.scraperLogger.info(`User ${user.username} saved to database`);
            }
            // Save tweets
            let savedCount = 0;
            for (const tweet of tweets) {
                const success = await this.database.saveTweet(tweet);
                if (success)
                    savedCount++;
            }
            logger_1.scraperLogger.info(`Saved ${savedCount}/${tweets.length} tweets to database`);
        }
        catch (error) {
            logger_1.scraperLogger.error('Failed to save scraped data', error);
            throw error;
        }
    }
    async isLoggedIn() {
        if (!this.page)
            return false;
        try {
            await this.page.goto('https://x.com/home', { waitUntil: 'networkidle', timeout: 10000 });
            // Check if login form is present
            const loginForm = await this.page.$('[data-testid="loginForm"]');
            return !loginForm;
        }
        catch (error) {
            logger_1.scraperLogger.warn('Could not determine login status', error);
            return false;
        }
    }
    async stop() {
        this.isRunning = false;
        logger_1.scraperLogger.info('Scraper stop requested');
    }
    async close() {
        try {
            if (this.page) {
                await this.page.close();
                this.page = null;
            }
            if (this.browser) {
                await this.browser.close();
                this.browser = null;
            }
            logger_1.scraperLogger.info('Twitter scraper closed');
        }
        catch (error) {
            logger_1.scraperLogger.error('Error closing scraper', error);
        }
    }
    get running() {
        return this.isRunning;
    }
}
exports.TwitterScraperService = TwitterScraperService;
//# sourceMappingURL=scraper.service.js.map