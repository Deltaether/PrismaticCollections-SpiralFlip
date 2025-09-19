import { Tweet, TwitterUser, ScrapingSession } from '../models/tweet.model';
export declare class DatabaseService {
    private client;
    constructor();
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    saveTweet(tweet: Tweet): Promise<boolean>;
    getTweets(limit?: number, _offset?: number, username?: string, includeRetweets?: boolean, includeReplies?: boolean): Promise<Tweet[]>;
    getTweetById(tweetId: string): Promise<Tweet | null>;
    getTweetCount(username?: string): Promise<number>;
    getLatestTweetId(username: string): Promise<string | null>;
    saveUser(user: TwitterUser): Promise<boolean>;
    getUser(username: string): Promise<TwitterUser | null>;
    createScrapingSession(sessionData: Omit<ScrapingSession, 'sessionId'>): Promise<string>;
    updateScrapingSession(sessionId: string, updates: Partial<ScrapingSession>): Promise<boolean>;
    getActiveScrapingSession(): Promise<ScrapingSession | null>;
    private mapTweetFromDb;
    private mapUserFromDb;
    private mapSessionFromDb;
}
//# sourceMappingURL=database.service.d.ts.map