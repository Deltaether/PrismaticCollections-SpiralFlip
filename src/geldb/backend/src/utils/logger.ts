import winston from 'winston';
import path from 'path';

const logLevel = process.env.LOG_LEVEL || 'info';
const logFile = process.env.LOG_FILE || './logs/twitter-data.log';

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
  defaultMeta: { service: 'twitter-data-api' },
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

  // API request logging
  apiRequest: (method: string, endpoint: string, statusCode?: number, duration?: number) => {
    logger.info('API request', {
      method,
      endpoint,
      statusCode,
      durationMs: duration,
      timestamp: new Date().toISOString()
    });
  },

  // Data processing logging
  dataFetch: (source: string, recordCount: number, operation: string) => {
    logger.info('Data operation', {
      source,
      recordCount,
      operation,
      timestamp: new Date().toISOString()
    });
  },

  // Python fetcher integration logging
  pythonFetcherStatus: (isRunning: boolean, lastRun?: Date, tweetsStored?: number) => {
    logger.info('Python fetcher status', {
      isRunning,
      lastRun: lastRun?.toISOString(),
      tweetsStored,
      source: 'Python API v2',
      timestamp: new Date().toISOString()
    });
  }
};

// Export both the structured logger and raw winston logger
export { logger };
export default logger;