import { Tweet, TwitterUser, ScrapingOptions } from '../models/tweet.model';
import { DatabaseService } from './database.service';
export declare class TwitterScraperService {
    private browser;
    private page;
    private database;
    private isRunning;
    private userDataDir;
    constructor(database: DatabaseService);
    initialize(): Promise<void>;
    scrapeUserProfile(username: string): Promise<TwitterUser | null>;
    scrapeTweets(username: string, options?: ScrapingOptions): Promise<Tweet[]>;
    private extractTweetsFromPage;
    private convertRawTweetToTweet;
    private humanLikeScroll;
    private randomDelay;
    saveScrapedData(tweets: Tweet[], user?: TwitterUser): Promise<void>;
    isLoggedIn(): Promise<boolean>;
    stop(): Promise<void>;
    close(): Promise<void>;
    get running(): boolean;
}
//# sourceMappingURL=scraper.service.d.ts.map