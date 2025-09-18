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
    enableEmbed: true, // ✅ PRIMARY: Use Twitter embed widgets
    enableApi: false, // ❌ DISABLED: CORS policy prevents browser API access
    conservativeMode: true, // Use conservative rate limiting
    maxTweets: 5,
    cacheHours: 24
  },

  // X API V2 Configuration (Bearer Token Implementation)
  xApi: {
    // OAuth 1.0a Credentials (for backward compatibility)
    oauth: {
      apiKey: 'OmR8bRNMB7x0KicX8xEFPDy8h',
      apiSecret: 'YgfnBAxgXOnHCiwFSA0z2f10hQ7kANL4WyG5p1whojz9KlvjW3',
      accessToken: '1778792494559350784-BWL7i22YEKgh5jsvJcH9gCrrwUbS9O',
      accessTokenSecret: 'giS3XRlGO5VIVCYQcuqehWGNJk6jCGN32zNxPrUddrgoq'
    },
    // Bearer Token Authentication (provided by user)
    // IMPORTANT: This is a real Bearer Token for testing - keep secure!
    // Fixed: URL-decoded for proper HTTP header usage
    bearerToken: 'AAAAAAAAAAAAAAAAAAAAAFAC4QEAAAAAoNT3QogtYZadw6EnYd4rlBcZr3A=oCHXPew0U784oDM1H2I9WzXsiwb6x3jkQPYKHmJ48JE9bRqlNn',

    // API Configuration
    baseUrl: 'https://api.x.com/2',
    enabled: true,
    enableLogging: true, // Set to false in production
    useOAuth1a: false, // DISABLED: OAuth 1.0a causing timing issues
    useBearerToken: true, // ENABLED: Simple Bearer Token authentication

    // Target username for profile and tweets
    username: 'prismcollect_',

    // Cache settings
    cacheDuration: 5 * 60 * 1000, // 5 minutes

    // Rate limiting configuration (Bearer Token limits)
    rateLimiting: {
      enabled: true,
      warningThreshold: 0.2, // Warning at 20% remaining
      criticalThreshold: 0.1,  // Critical at 10% remaining
      // Bearer Token specific limits (App-only auth)
      userContext: {
        requestsPerWindow: 300,  // GET /2/users/by/username/{username}
        tweetsPerWindow: 1500,   // GET /2/users/{id}/tweets
        windowDurationMs: 15 * 60 * 1000 // 15 minutes
      }
    },

    // Retry configuration
    retry: {
      maxRetries: 3,
      baseDelay: 1000,   // 1 second
      maxDelay: 30000    // 30 seconds
    }
  },

  // Feature flags
  features: {
    // Legacy Twitter integration (deprecated)
    twitterIntegration: false, // ❌ DEPRECATED: Use xApi instead
    twitterApiEnabled: false, // ❌ DEPRECATED: Replaced by official X API V2
    twitterEmbedEnabled: false, // ❌ DEPRECATED: Use official X API V2

    // New X API V2 integration
    xApiEnabled: true, // ✅ NEW: Official X API V2 implementation

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