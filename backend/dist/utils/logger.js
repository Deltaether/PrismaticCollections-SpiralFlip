"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scraperLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const logLevel = process.env.LOG_LEVEL || 'info';
const logFile = process.env.LOG_FILE || './logs/scraper.log';
// Create logs directory if it doesn't exist
const fs_1 = __importDefault(require("fs"));
const logDir = path_1.default.dirname(logFile);
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir, { recursive: true });
}
// Custom format for console output
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
        log += ` ${JSON.stringify(meta, null, 2)}`;
    }
    if (stack) {
        log += `\n${stack}`;
    }
    return log;
}));
// Custom format for file output
const fileFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json());
// Create the logger
const logger = winston_1.default.createLogger({
    level: logLevel,
    format: fileFormat,
    defaultMeta: { service: 'twitter-scraper' },
    transports: [
        // File transport for all logs
        new winston_1.default.transports.File({
            filename: logFile,
            maxsize: 10 * 1024 * 1024, // 10MB
            maxFiles: 5,
            tailable: true
        }),
        // Separate file for errors
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, 'error.log'),
            level: 'error',
            maxsize: 10 * 1024 * 1024, // 10MB
            maxFiles: 5,
            tailable: true
        })
    ]
});
// Add console transport in non-production environments
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: consoleFormat
    }));
}
// Utility functions for common logging patterns
exports.scraperLogger = {
    info: (message, meta) => logger.info(message, meta),
    warn: (message, meta) => logger.warn(message, meta),
    error: (message, error, meta) => {
        if (error instanceof Error) {
            logger.error(message, {
                error: error.message,
                stack: error.stack,
                ...meta
            });
        }
        else {
            logger.error(message, { error, ...meta });
        }
    },
    debug: (message, meta) => logger.debug(message, meta),
    // Specialized logging for scraping activities
    scrapingStart: (sessionId, username) => {
        logger.info('Scraping session started', {
            sessionId,
            username,
            timestamp: new Date().toISOString()
        });
    },
    scrapingComplete: (sessionId, tweetsCollected, duration) => {
        logger.info('Scraping session completed', {
            sessionId,
            tweetsCollected,
            durationMs: duration,
            timestamp: new Date().toISOString()
        });
    },
    scrapingError: (sessionId, error, context) => {
        logger.error('Scraping error occurred', {
            sessionId,
            error: error.message || error,
            stack: error.stack,
            context,
            timestamp: new Date().toISOString()
        });
    },
    rateLimitHit: (sessionId, delayMs) => {
        logger.warn('Rate limit detected, applying delay', {
            sessionId,
            delayMs,
            timestamp: new Date().toISOString()
        });
    },
    tweetProcessed: (sessionId, tweetId, action) => {
        logger.debug('Tweet processed', {
            sessionId,
            tweetId,
            action,
            timestamp: new Date().toISOString()
        });
    },
    browserAction: (sessionId, action, details) => {
        logger.debug('Browser action', {
            sessionId,
            action,
            details,
            timestamp: new Date().toISOString()
        });
    },
    apiRequest: (method, endpoint, statusCode, duration) => {
        logger.info('API request', {
            method,
            endpoint,
            statusCode,
            durationMs: duration,
            timestamp: new Date().toISOString()
        });
    }
};
exports.default = logger;
//# sourceMappingURL=logger.js.map