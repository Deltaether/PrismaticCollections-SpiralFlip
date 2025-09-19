import { Router } from 'express';
import { DatabaseService } from '../services/database.service';
import { MockDatabaseService } from '../services/mock-database.service';
import { TwitterScraperService } from '../services/scraper.service';
export declare class TwitterRoutes {
    private router;
    private database;
    private scraper;
    constructor(database: DatabaseService | MockDatabaseService, scraper: TwitterScraperService);
    private setupRoutes;
    private getTweets;
    private getTweetById;
    private getUser;
    private getScraperStatus;
    private triggerScraping;
    private stopScraping;
    private getStats;
    private startScraping;
    private getProfileImage;
    private checkProfileImage;
    getRouter(): Router;
}
//# sourceMappingURL=twitter.routes.d.ts.map