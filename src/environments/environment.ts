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

  // Twitter Scraper Configuration
  twitter: {
    // Account to scrape and display
    username: 'prismcollect_',

    // Scraper API configuration
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
    }
  },

  // Feature flags
  features: {
    // Twitter Scraper integration
    twitterScraperEnabled: true, // ✅ ACTIVE: Using Playwright-based scraper
    realTimeUpdates: true,
    offlineSupport: true,

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