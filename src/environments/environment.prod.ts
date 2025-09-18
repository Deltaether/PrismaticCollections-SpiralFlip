/**
 * Environment Configuration for Production
 *
 * Contains all environment-specific settings including API keys,
 * URLs, and feature flags for the production environment.
 */

export const environment = {
  production: true,
  name: 'production',

  // API Configuration
  api: {
    baseUrl: 'https://api.prismaticcollections.com',
    timeout: 30000
  },

  // Twitter API Configuration
  twitter: {
    // Twitter API Bearer Token (for Twitter API v2)
    // IMPORTANT: Use environment variables in production!
    // Never commit real API keys to source control
    bearerToken: 'AAAAAAAAAAAAAAAAAAAAAFAC4QEAAAAAS%2FbfXUno6dIrCKYAnt98XEnXmS8%3DzvCZuOjMkf04fxuTl31G29fCIr1lSszDNRiYS3PAVqcv6a0est', // Twitter API Bearer Token for production

    // Twitter account to monitor
    username: 'prismcollect_',

    // API endpoints
    apiBaseUrl: 'https://api.twitter.com/2',

    // Rate limiting settings (Twitter API v2 limits)
    rateLimit: {
      requestsPerWindow: 75,
      windowDurationMs: 15 * 60 * 1000, // 15 minutes
    },

    // Cache settings (longer for production)
    cache: {
      durationMs: 10 * 60 * 1000, // 10 minutes
    },

    // Widget configuration for embeds
    embed: {
      theme: 'dark',
      height: 500,
      tweetLimit: 10,
      linkColor: '#1da1f2',
      borderColor: '#333333'
    },

    // OAuth 1.0a Configuration for Twitter API v2
    oauth: {
      apiKey: 'OmR8bRNMB7x0KicX8xEFPDy8h',
      apiSecret: 'YgfnBAxgXOnHCiwFSA0z2f10hQ7kANL4WyG5p1whojz9KlvjW3',
      accessToken: '1778792494559350784-BWL7i22YEKgh5jsvJcH9gCrrwUbS9O',
      accessTokenSecret: 'giS3XRlGO5VIVCYQcuqehWGNJk6jCGN32zNxPrUddrgoq'
    }
  },

  // Feature flags
  features: {
    twitterIntegration: true,
    twitterApiEnabled: true, // Enabled with Bearer Token authentication
    twitterEmbedEnabled: true,
    analytics: true,
    debugMode: false
  },

  // Debug settings (minimal for production)
  debug: {
    enableLogging: false,
    logLevel: 'error', // Only log errors in production
    enableNetworkLogging: false
  }
};