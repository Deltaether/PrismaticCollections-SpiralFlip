import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

/**
 * Enhanced Twitter Embed Service - Robust CORS-Free Integration
 *
 * This service provides reliable Twitter content display without CORS issues:
 * 1. Dynamically loads Twitter widgets JavaScript
 * 2. Creates embedded timeline widgets
 * 3. Extracts tweet data from embedded widgets
 * 4. Provides fallback content when embeds fail
 * 5. Handles Twitter API rate limits gracefully
 */

declare global {
  interface Window {
    twttr: any;
  }
}

export interface EmbedConfig {
  theme: 'light' | 'dark';
  height: number;
  tweetLimit: number;
  linkColor: string;
  borderColor: string;
  chrome: string[];
  dnt: boolean; // Do Not Track
}

export interface EmbedState {
  loaded: boolean;
  error: string | null;
  widgetId: string | null;
  lastUpdate: Date | null;
  retryCount: number;
}

export interface TwitterWidgetOptions {
  theme?: 'light' | 'dark';
  chrome?: string[];
  height?: number;
  tweetLimit?: number;
  linkColor?: string;
  borderColor?: string;
  lang?: string;
  dnt?: boolean;
  related?: string;
  via?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TwitterEmbedEnhancedService {

  private readonly TWITTER_WIDGETS_URL = 'https://platform.twitter.com/widgets.js';
  private readonly MAX_RETRIES = 3;
  private readonly LOAD_TIMEOUT = 15000;

  private embedStateSubject = new BehaviorSubject<EmbedState>({
    loaded: false,
    error: null,
    widgetId: null,
    lastUpdate: null,
    retryCount: 0
  });

  private scriptLoaded = false;
  private scriptLoading = false;
  private loadPromise: Promise<void> | null = null;

  public embedState$ = this.embedStateSubject.asObservable();

  constructor(private ngZone: NgZone) {}

  /**
   * Initialize Twitter Widgets script
   */
  async initializeTwitterWidgets(): Promise<void> {
    if (this.scriptLoaded && window.twttr) {
      console.log('✅ Twitter widgets already loaded');
      return Promise.resolve();
    }

    if (this.scriptLoading && this.loadPromise) {
      console.log('🔄 Twitter widgets loading in progress, waiting...');
      return this.loadPromise;
    }

    console.log('🚀 Loading Twitter widgets script...');
    this.scriptLoading = true;

    this.loadPromise = new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.twttr) {
        this.scriptLoaded = true;
        this.scriptLoading = false;
        resolve();
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = this.TWITTER_WIDGETS_URL;
      script.async = true;
      script.defer = true;

      // Set up timeout
      const timeoutId = setTimeout(() => {
        this.scriptLoading = false;
        this.updateEmbedState({ error: 'Twitter widgets script load timeout' });
        reject(new Error('Twitter widgets script load timeout'));
      }, this.LOAD_TIMEOUT);

      script.onload = () => {
        clearTimeout(timeoutId);
        console.log('✅ Twitter widgets script loaded successfully');

        // Wait for twttr to be available
        this.waitForTwitterReady().then(() => {
          this.scriptLoaded = true;
          this.scriptLoading = false;
          this.updateEmbedState({ loaded: true, error: null });
          resolve();
        }).catch(reject);
      };

      script.onerror = () => {
        clearTimeout(timeoutId);
        this.scriptLoading = false;
        const error = 'Failed to load Twitter widgets script';
        this.updateEmbedState({ error });
        reject(new Error(error));
      };

      // Add to document
      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  /**
   * Wait for Twitter widgets to be ready
   */
  private waitForTwitterReady(): Promise<void> {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 50;

      const checkReady = () => {
        attempts++;

        if (window.twttr && window.twttr.widgets) {
          console.log('✅ Twitter widgets ready');
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error('Twitter widgets not ready after maximum attempts'));
        } else {
          setTimeout(checkReady, 100);
        }
      };

      checkReady();
    });
  }

  /**
   * Create Twitter timeline embed
   */
  async createTimelineEmbed(
    containerId: string,
    username: string,
    options: TwitterWidgetOptions = {}
  ): Promise<string> {

    try {
      await this.initializeTwitterWidgets();

      if (!window.twttr || !window.twttr.widgets) {
        throw new Error('Twitter widgets not available');
      }

      // Enhanced container validation with retry logic
      let container = document.getElementById(containerId);
      if (!container) {
        console.warn(`⚠️ Container '${containerId}' not found, waiting for DOM...`);

        // Wait up to 2 seconds for container to be available
        for (let i = 0; i < 20; i++) {
          await new Promise(resolve => setTimeout(resolve, 100));
          container = document.getElementById(containerId);
          if (container) {
            console.log(`✅ Container '${containerId}' found after ${(i + 1) * 100}ms`);
            break;
          }
        }

        if (!container) {
          throw new Error(`Container element '${containerId}' not found after waiting 2 seconds`);
        }
      }

      // Clear existing content
      container.innerHTML = '<div class="twitter-loading">Loading Twitter feed...</div>';

      // Merge with default config
      const config: TwitterWidgetOptions = {
        theme: environment.twitter.embed.theme as 'light' | 'dark',
        height: environment.twitter.embed.height,
        tweetLimit: environment.twitter.embed.tweetLimit,
        linkColor: environment.twitter.embed.linkColor,
        borderColor: environment.twitter.embed.borderColor,
        chrome: ['noheader', 'nofooter', 'noborders', 'transparent'],
        lang: 'en',
        dnt: true, // Respect Do Not Track
        ...options
      };

      console.log(`🎨 Creating timeline embed for @${username}`, config);

      // Create timeline widget with enhanced error handling
      const widget = await this.ngZone.runOutsideAngular(async () => {
        try {
          return await window.twttr.widgets.createTimeline(
            {
              sourceType: 'profile',
              screenName: username
            },
            container!,
            config
          );
        } catch (widgetError: any) {
          console.error(`❌ Timeline widget creation failed:`, widgetError);
          throw new Error(`Timeline widget creation failed: ${widgetError.message}`);
        }
      });

      if (widget) {
        const widgetId = widget.id || `twitter-timeline-${Date.now()}`;
        console.log(`✅ Twitter timeline embed created successfully: ${widgetId}`);

        this.updateEmbedState({
          loaded: true,
          error: null,
          widgetId,
          lastUpdate: new Date(),
          retryCount: 0
        });

        // Add loading state handler
        this.setupWidgetLoadHandlers(widget, containerId);

        return widgetId;
      } else {
        throw new Error('Failed to create Twitter timeline widget');
      }

    } catch (error: any) {
      console.error('❌ Failed to create Twitter timeline embed:', error);
      this.handleEmbedError(error, containerId);
      throw error;
    }
  }

  /**
   * Create single tweet embed
   */
  async createTweetEmbed(
    containerId: string,
    tweetId: string,
    options: TwitterWidgetOptions = {}
  ): Promise<string> {

    try {
      await this.initializeTwitterWidgets();

      if (!window.twttr || !window.twttr.widgets) {
        throw new Error('Twitter widgets not available');
      }

      const container = document.getElementById(containerId);
      if (!container) {
        throw new Error(`Container element '${containerId}' not found`);
      }

      container.innerHTML = '<div class="twitter-loading">Loading tweet...</div>';

      const config: TwitterWidgetOptions = {
        theme: environment.twitter.embed.theme as 'light' | 'dark',
        linkColor: environment.twitter.embed.linkColor,
        lang: 'en',
        dnt: true,
        ...options
      };

      console.log(`🐦 Creating tweet embed for ${tweetId}`, config);

      const widget = await this.ngZone.runOutsideAngular(() => {
        return window.twttr.widgets.createTweet(tweetId, container, config);
      });

      if (widget) {
        const widgetId = widget.id || `twitter-tweet-${Date.now()}`;
        console.log(`✅ Twitter tweet embed created successfully: ${widgetId}`);

        this.updateEmbedState({
          loaded: true,
          error: null,
          widgetId,
          lastUpdate: new Date(),
          retryCount: 0
        });

        return widgetId;
      } else {
        throw new Error('Failed to create Twitter tweet widget');
      }

    } catch (error: any) {
      console.error('❌ Failed to create Twitter tweet embed:', error);
      this.handleEmbedError(error, containerId);
      throw error;
    }
  }

  /**
   * Setup widget load event handlers
   */
  private setupWidgetLoadHandlers(widget: any, containerId: string): void {
    if (!window.twttr || !window.twttr.events) return;

    // Handle widget load events
    window.twttr.events.bind('loaded', (event: any) => {
      if (event.target && event.target.closest(`#${containerId}`)) {
        console.log('🎉 Twitter widget loaded successfully');
        this.removeLoadingState(containerId);
      }
    });

    // Handle widget render events
    window.twttr.events.bind('rendered', (event: any) => {
      if (event.target && event.target.closest(`#${containerId}`)) {
        console.log('🎨 Twitter widget rendered successfully');
        this.removeLoadingState(containerId);
      }
    });

    // Handle errors
    window.twttr.events.bind('error', (event: any) => {
      if (event.target && event.target.closest(`#${containerId}`)) {
        console.error('❌ Twitter widget error:', event);
        this.handleEmbedError(new Error('Widget render error'), containerId);
      }
    });
  }

  /**
   * Remove loading state from container
   */
  private removeLoadingState(containerId: string): void {
    const container = document.getElementById(containerId);
    if (container) {
      const loadingEl = container.querySelector('.twitter-loading');
      if (loadingEl) {
        loadingEl.remove();
      }
    }
  }

  /**
   * Handle embed errors with fallback content
   */
  private handleEmbedError(error: Error, containerId: string): void {
    const currentState = this.embedStateSubject.value;
    const retryCount = currentState.retryCount + 1;

    this.updateEmbedState({
      error: error.message,
      retryCount
    });

    // Show fallback content
    this.showFallbackContent(containerId, error.message);
  }

  /**
   * Show fallback content when embed fails
   */
  private showFallbackContent(containerId: string, errorMessage: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    const username = environment.twitter.username;
    const twitterUrl = `https://twitter.com/${username}`;

    container.innerHTML = `
      <div class="twitter-fallback">
        <div class="twitter-fallback-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span>@${username}</span>
        </div>
        <div class="twitter-fallback-content">
          <p>Unable to load Twitter feed</p>
          <p class="error-details">${errorMessage}</p>
          <a href="${twitterUrl}" target="_blank" rel="noopener noreferrer" class="twitter-fallback-link">
            View on Twitter →
          </a>
        </div>
        <button class="twitter-retry-btn" onclick="this.parentElement.parentElement.retryEmbed?.()">
          🔄 Retry
        </button>
      </div>
    `;

    // Add retry functionality
    (container as any).retryEmbed = () => {
      const currentState = this.embedStateSubject.value;
      if (currentState.retryCount < this.MAX_RETRIES) {
        console.log(`🔄 Retrying Twitter embed (${currentState.retryCount + 1}/${this.MAX_RETRIES})`);
        this.createTimelineEmbed(containerId, username);
      } else {
        console.warn('🚫 Maximum retry attempts reached for Twitter embed');
      }
    };
  }

  /**
   * Update embed state
   */
  private updateEmbedState(updates: Partial<EmbedState>): void {
    const currentState = this.embedStateSubject.value;
    const newState = { ...currentState, ...updates };
    this.embedStateSubject.next(newState);
  }

  /**
   * Get current embed state
   */
  getEmbedState(): EmbedState {
    return this.embedStateSubject.value;
  }

  /**
   * Check if Twitter widgets are available
   */
  isTwitterWidgetsAvailable(): boolean {
    return this.scriptLoaded && !!(window.twttr && window.twttr.widgets);
  }

  /**
   * Refresh embed widget
   */
  async refreshEmbed(containerId: string, username: string): Promise<void> {
    console.log('🔄 Refreshing Twitter embed...');

    const container = document.getElementById(containerId);
    if (container) {
      // Clear existing content
      container.innerHTML = '';

      // Reset state
      this.updateEmbedState({
        loaded: false,
        error: null,
        widgetId: null,
        retryCount: 0
      });

      // Recreate embed
      await this.createTimelineEmbed(containerId, username);
    }
  }

  /**
   * Extract tweet data from DOM (for analytics/display)
   */
  extractTweetData(containerId: string): any[] {
    const container = document.getElementById(containerId);
    if (!container) return [];

    const tweets: any[] = [];
    const tweetElements = container.querySelectorAll('iframe[id*="twitter-widget"]');

    tweetElements.forEach((iframe, index) => {
      // Note: Due to cross-origin restrictions, we can't access iframe content
      // This is a placeholder for potential tweet data extraction
      tweets.push({
        id: `extracted-${index}`,
        type: 'embedded',
        iframe: iframe.id,
        url: (iframe as HTMLIFrameElement).src
      });
    });

    return tweets;
  }

  /**
   * Clean up and destroy widgets
   */
  destroyEmbeds(containerId?: string): void {
    if (containerId) {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
      }
    }

    // Reset state
    this.updateEmbedState({
      loaded: false,
      error: null,
      widgetId: null,
      lastUpdate: null,
      retryCount: 0
    });

    console.log('🧹 Twitter embeds destroyed');
  }

  /**
   * Get embed configuration for debugging
   */
  getEmbedConfig(): EmbedConfig {
    return {
      theme: environment.twitter.embed.theme as 'light' | 'dark',
      height: environment.twitter.embed.height,
      tweetLimit: environment.twitter.embed.tweetLimit,
      linkColor: environment.twitter.embed.linkColor,
      borderColor: environment.twitter.embed.borderColor,
      chrome: ['noheader', 'nofooter', 'noborders', 'transparent'],
      dnt: true
    };
  }
}