import winston from 'winston';
declare const logger: winston.Logger;
export declare const scraperLogger: {
    info: (message: string, meta?: any) => winston.Logger;
    warn: (message: string, meta?: any) => winston.Logger;
    error: (message: string, error?: any, meta?: any) => void;
    debug: (message: string, meta?: any) => winston.Logger;
    scrapingStart: (sessionId: string, username: string) => void;
    scrapingComplete: (sessionId: string, tweetsCollected: number, duration: number) => void;
    scrapingError: (sessionId: string, error: any, context?: string) => void;
    rateLimitHit: (sessionId: string, delayMs: number) => void;
    tweetProcessed: (sessionId: string, tweetId: string, action: "created" | "updated" | "skipped") => void;
    browserAction: (sessionId: string, action: string, details?: any) => void;
    apiRequest: (method: string, endpoint: string, statusCode?: number, duration?: number) => void;
};
export default logger;
//# sourceMappingURL=logger.d.ts.map