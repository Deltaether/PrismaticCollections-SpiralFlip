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
    baseUrl: 'http://localhost:3001/api',
    timeout: 30000
  },

  // Twitter Data Configuration (Python API v2)
  twitter: {
    // Account to display
    username: 'prismcollect_',

    // Data API configuration (served from unified backend)
    api: {
      baseUrl: 'http://localhost:3001/api/twitter',
      timeout: 15000,
      retryDelay: 2000
    },

    // Display configuration
    display: {
      theme: 'dark',
      tweetLimit: 20,
      refreshInterval: 300000, // 5 minutes
      showMediaPreview: true,
      showEngagementMetrics: true
    },

    // Python fetcher configuration
    fetcher: {
      source: 'Python API v2',
      features: ['original_posts', 'retweets', 'chronological_order'],
      rateLimiting: true,
      authentication: 'Bearer Token'
    }
  },

  // Feature flags
  features: {
    // Twitter Data integration
    twitterDataEnabled: true, // ✅ ACTIVE: Using Python API v2 fetcher with unified backend
    realTimeUpdates: true,
    offlineSupport: true,

    analytics: false,
    debugMode: true
  },

  // Debug settings
  debug: {
    enableLogging: true,
    logLevel: 'debug', // 'error' | 'warn' | 'info' | 'debug'
    enableNetworkLogging: true,
    showDataSource: true // Shows Python API v2 source in debug info
  }
};