/**
 * Environment Configuration for Production
 *
 * Contains all environment-specific settings including API keys,
 * URLs, and feature flags for the production environment.
 */

export const environment = {
  production: true,
  name: 'production',

  // API Configuration - optimized for production
  api: {
    baseUrl: '/api',      // Use relative URL for production
    timeout: 10000       // Reduced timeout for better performance
  },

  // Twitter Data Configuration - using unified backend approach
  twitter: {
    // Account to display
    username: 'prismcollect_',

    // Data API configuration (served from unified backend)
    api: {
      baseUrl: '/api/twitter',  // Relative URL for production
      timeout: 8000,           // Fast timeout for production
      retryDelay: 1000        // Quick retry for better UX
    },

    // Display configuration optimized for production
    display: {
      theme: 'dark',
      tweetLimit: 20,
      refreshInterval: 600000, // 10 minutes (reduced server load)
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

  // Feature flags - optimized for production
  features: {
    // Twitter Data integration
    twitterDataEnabled: true,    // ✅ ACTIVE: Using Python API v2 fetcher
    realTimeUpdates: true,
    offlineSupport: false,       // Disabled to reduce bundle size

    // Performance features
    analytics: true,             // Enable analytics in production
    debugMode: false,           // Disable debug mode
    lazyLoading: true,          // Enable lazy loading
    preloading: false           // Disable preloading to reduce initial bundle
  },

  // Debug settings - minimal for production
  debug: {
    enableLogging: false,        // Disable logging in production
    logLevel: 'error',          // Only log errors
    enableNetworkLogging: false, // Disable network logging
    showDataSource: false       // Hide debug info
  }
};