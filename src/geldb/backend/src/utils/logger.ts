import winston from 'winston';
import path from 'path';

const logLevel = process.env.LOG_LEVEL || 'info';
const logFile = process.env.LOG_FILE || './logs/scraper.log';

// Create logs directory if it doesn't exist
import fs from 'fs';
const logDir = path.dirname(logFile);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;

    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta, null, 2)}`;
    }

    if (stack) {
      log += `\n${stack}`;
    }

    return log;
  })
);

// Custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create the logger
const logger = winston.createLogger({
  level: logLevel,
  format: fileFormat,
  defaultMeta: { service: 'twitter-scraper' },
  transports: [
    // File transport for all logs
    new winston.transports.File({
      filename: logFile,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true
    }),

    // Separate file for errors
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true
    })
  ]
});

// Add console transport in non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

// Utility functions for common logging patterns
export const scraperLogger = {
  info: (message: string, meta?: any) => logger.info(message, meta),
  warn: (message: string, meta?: any) => logger.warn(message, meta),
  error: (message: string, error?: any, meta?: any) => {
    if (error instanceof Error) {
      logger.error(message, {
        error: error.message,
        stack: error.stack,
        ...meta
      });
    } else {
      logger.error(message, { error, ...meta });
    }
  },
  debug: (message: string, meta?: any) => logger.debug(message, meta),

  // Specialized logging for scraping activities
  scrapingStart: (sessionId: string, username: string) => {
    logger.info('Scraping session started', {
      sessionId,
      username,
      timestamp: new Date().toISOString()
    });
  },

  scrapingComplete: (sessionId: string, tweetsCollected: number, duration: number) => {
    logger.info('Scraping session completed', {
      sessionId,
      tweetsCollected,
      durationMs: duration,
      timestamp: new Date().toISOString()
    });
  },

  scrapingError: (sessionId: string, error: any, context?: string) => {
    logger.error('Scraping error occurred', {
      sessionId,
      error: error.message || error,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    });
  },

  rateLimitHit: (sessionId: string, delayMs: number) => {
    logger.warn('Rate limit detected, applying delay', {
      sessionId,
      delayMs,
      timestamp: new Date().toISOString()
    });
  },

  tweetProcessed: (sessionId: string, tweetId: string, action: 'created' | 'updated' | 'skipped') => {
    logger.debug('Tweet processed', {
      sessionId,
      tweetId,
      action,
      timestamp: new Date().toISOString()
    });
  },

  browserAction: (sessionId: string, action: string, details?: any) => {
    logger.debug('Browser action', {
      sessionId,
      action,
      details,
      timestamp: new Date().toISOString()
    });
  },

  apiRequest: (method: string, endpoint: string, statusCode?: number, duration?: number) => {
    logger.info('API request', {
      method,
      endpoint,
      statusCode,
      durationMs: duration,
      timestamp: new Date().toISOString()
    });
  }
};

export default logger;