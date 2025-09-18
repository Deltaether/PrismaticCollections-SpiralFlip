/**
 * Environment Configuration for Development
 *
 * Contains all environment-specific settings including API keys,
 * URLs, and feature flags for the development environment.
 */

export const environment = {
  production: false,
  name: 'development',

  // API Configuration
  api: {
    baseUrl: 'http://localhost:3000/api',
    timeout: 30000
  },

  // Twitter API Configuration
  twitter: {
    // OAuth 1.0a Credentials (provided by user)
    // IMPORTANT: These are real credentials for testing - keep secure!
    oauth: {
      apiKey: 'OmR8bRNMB7x0KicX8xEFPDy8h',
      apiSecret: 'YgfnBAxgXOnHCiwFSA0z2f10hQ7kANL4WyG5p1whojz9KlvjW3',
      accessToken: '1778792494559350784-BWL7i22YEKgh5jsvJcH9gCrrwUbS9O',
      accessTokenSecret: 'giS3XRlGO5VIVCYQcuqehWGNJk6jCGN32zNxPrUddrgoq'
    },

    // Legacy Bearer Token (kept for backward compatibility)
    bearerToken: 'AAAAAAAAAAAAAAAAAAAAAFAC4QEAAAAAS/bfXUno6dIrCKYAnt98XEnXmS8=zvCZuOjMkf04fxuTl31G29fCIr1lSszDNRiYS3PAVqcv6a0est',

    // Twitter account to monitor
    username: 'prismcollect_',

    // API endpoints
    apiBaseUrl: 'https://api.x.com/2',

    // Rate limiting settings (Free Tier OAuth 1.0a limits)
    rateLimit: {
      requestsPerWindow: 900, // OAuth 1.0a user context limit
      windowDurationMs: 15 * 60 * 1000, // 15 minutes
      monthlyLimit: 100 // Free tier monthly limit
    },

    // Cache settings (conservative for API preservation)
    cache: {
      durationMs: 24 * 60 * 60 * 1000, // 24 hours for users
      tweetDurationMs: 12 * 60 * 60 * 1000, // 12 hours for tweets
    },

    // Widget configuration for embeds
    embed: {
      theme: 'dark',
      height: 500,
      tweetLimit: 10,
      linkColor: '#1da1f2',
      borderColor: '#333333'
    },

    // Unified service configuration
    enableEmbed: true,
    enableApi: true, // Enable for testing with real credentials
    conservativeMode: true, // Use conservative rate limiting
    maxTweets: 5,
    cacheHours: 24
  },

  // Feature flags
  features: {
    twitterIntegration: true,
    twitterApiEnabled: false, // Disabled due to CORS limitations in browser
    twitterEmbedEnabled: true, // Primary solution - no CORS issues
    analytics: false,
    debugMode: true
  },

  // Debug settings
  debug: {
    enableLogging: true,
    logLevel: 'debug', // 'error' | 'warn' | 'info' | 'debug'
    enableNetworkLogging: true
  }
};