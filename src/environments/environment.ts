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
    // Twitter API Bearer Token (for Twitter API v2)
    // To get this:
    // 1. Go to https://developer.twitter.com/
    // 2. Create a developer account and project
    // 3. Generate Bearer Token for your app
    // 4. Add it here (keep it secure!)
    bearerToken: 'AAAAAAAAAAAAAAAAAAAAAFAC4QEAAAAAS%2FbfXUno6dIrCKYAnt98XEnXmS8%3DzvCZuOjMkf04fxuTl31G29fCIr1lSszDNRiYS3PAVqcv6a0est', // Twitter API Bearer Token for development

    // Twitter account to monitor
    username: 'prismcollect_',

    // API endpoints
    apiBaseUrl: 'https://api.twitter.com/2',

    // Rate limiting settings (Twitter API v2 limits)
    rateLimit: {
      requestsPerWindow: 75,
      windowDurationMs: 15 * 60 * 1000, // 15 minutes
    },

    // Cache settings
    cache: {
      durationMs: 5 * 60 * 1000, // 5 minutes
    },

    // Widget configuration for embeds
    embed: {
      theme: 'dark',
      height: 500,
      tweetLimit: 10,
      linkColor: '#1da1f2',
      borderColor: '#333333'
    }
  },

  // Feature flags
  features: {
    twitterIntegration: true,
    twitterApiEnabled: true, // Enabled with Bearer Token authentication
    twitterEmbedEnabled: true,
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