export interface Tweet {
    tweetId: string;
    text: string;
    authorUsername: string;
    authorDisplayName: string;
    authorProfileImageUrl?: string;
    authorVerified: boolean;
    createdAt: Date;
    scrapedAt: Date;
    updatedAt?: Date;
    likeCount: number;
    retweetCount: number;
    replyCount: number;
    quoteCount: number;
    language?: string;
    isRetweet: boolean;
    isQuote: boolean;
    isReply: boolean;
    conversationId?: string;
    inReplyToUserId?: string;
    inReplyToTweetId?: string;
    mediaUrls: string[];
    mediaTypes: string[];
    hashtags: string[];
    mentions: string[];
    urls: string[];
    sourceTweetId?: string;
    sourceTweetText?: string;
    sourceAuthorUsername?: string;
    rawData?: any;
}
export interface TwitterUser {
    userId: string;
    username: string;
    displayName: string;
    description?: string;
    profileImageUrl?: string;
    profileImagePath?: string;
    bannerImageUrl?: string;
    verified: boolean;
    followersCount: number;
    followingCount: number;
    tweetCount: number;
    createdAt: Date;
    scrapedAt: Date;
    updatedAt?: Date;
    location?: string;
    website?: string;
    rawData?: any;
}
export interface ScrapingSession {
    sessionId: string;
    startedAt: Date;
    completedAt?: Date;
    targetUsername: string;
    sessionType: 'scheduled' | 'manual' | 'initial';
    tweetsCollected: number;
    errorsEncountered?: any;
    lastTweetIdProcessed?: string;
    status: 'running' | 'completed' | 'failed' | 'cancelled';
    errorMessage?: string;
}
export interface ScrapingStats {
    date: string;
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    tweetsScraped: number;
    rateLimitedCount: number;
    blockedCount: number;
    averageDelayMs?: number;
    sessionDurationSeconds?: number;
    createdAt: Date;
    updatedAt?: Date;
}
export interface ScraperConfig {
    key: string;
    value: string;
    description?: string;
    createdAt: Date;
    updatedAt?: Date;
}
export interface TweetResponse {
    data: Tweet[];
    meta: {
        resultCount: number;
        nextToken?: string;
        previousToken?: string;
    };
}
export interface ScraperStatus {
    isRunning: boolean;
    lastScrapedAt?: Date;
    nextScheduledRun?: Date;
    totalTweetsStored: number;
    lastError?: string;
    consecutiveFailures: number;
    currentSession?: ScrapingSession;
}
export interface ScrapingOptions {
    maxTweets?: number;
    includeRetweets?: boolean;
    includeReplies?: boolean;
    startFromTweetId?: string;
    delayMin?: number;
    delayMax?: number;
    timeout?: number;
}
export interface RawTweetData {
    id: string;
    text: string;
    authorName: string;
    authorHandle: string;
    authorImage?: string;
    authorVerified: boolean;
    timestamp: string;
    engagement: {
        likes: number;
        retweets: number;
        replies: number;
        quotes: number;
    };
    media?: Array<{
        type: 'image' | 'video' | 'gif';
        url: string;
        alt?: string;
    }>;
    hashtags: string[];
    mentions: string[];
    links: string[];
    isRetweet: boolean;
    isQuote: boolean;
    isReply: boolean;
    originalTweet?: RawTweetData;
}
//# sourceMappingURL=tweet.model.d.ts.map