import { Injectable, signal, computed, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, merge, EMPTY, timer } from 'rxjs';
import { catchError, retry, shareReplay, switchMap, tap, debounceTime } from 'rxjs/operators';
import { environment } from '../../environments/environment';

/**
 * Twitter Core Service - Consolidated Twitter Integration for Angular 20
 *
 * This is the single source of truth for all Twitter functionality in the application.
 * Designed for production-grade performance with conservative API usage patterns.
 *
 * Architecture Features:
 * - Angular 20 signals for reactive state management
 * - Progressive enhancement (embed-first, API fallback)
 * - Memory leak prevention with DestroyRef
 * - Conservative API usage respecting 100 calls/month limit
 * - Bundle size optimization with lazy loading patterns
 * - Comprehensive error boundaries and fallback strategies
 *
 * Performance Optimizations:
 * - Intelligent caching with automatic cleanup
 * - Debounced refresh operations
 * - Shared observables to prevent duplicate requests
 * - Lazy loading of OAuth implementation when needed
 */

export interface TwitterPost {
  readonly id: string;
  readonly text: string;
  readonly createdAt: Date;
  readonly metrics: {
    readonly likes: number;
    readonly retweets: number;
    readonly replies: number;
  };
  readonly url: string;
  readonly isFromEmbed: boolean; // Tracks data source for debugging
}

export interface TwitterProfile {
  readonly id: string;
  readonly username: string;
  readonly displayName: string;
  readonly avatarUrl?: string;
  readonly verified: boolean;
  readonly metrics: {
    readonly followers: number;
    readonly following: number;
    readonly posts: number;
  };
}

export interface TwitterServiceState {
  readonly initialized: boolean;
  readonly embedAvailable: boolean;
  readonly apiAvailable: boolean;
  readonly loading: boolean;
  readonly error: string | null;
  readonly profile: TwitterProfile | null;
  readonly posts: TwitterPost[];
  readonly lastUpdate: Date | null;
  readonly apiCallsRemaining: number;
  readonly cacheStats: {
    readonly hits: number;
    readonly misses: number;
    readonly hitRate: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TwitterCoreService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly http = inject(HttpClient);

  // Configuration from environment
  private readonly config = {
    username: environment.twitter.username,
    apiEnabled: environment.features.twitterApiEnabled,
    embedEnabled: environment.features.twitterEmbedEnabled,
    apiCallLimit: environment.twitter.rateLimit.monthlyLimit,
    cacheTimeout: environment.twitter.cache.durationMs,
    maxPosts: environment.twitter.embed.tweetLimit
  } as const;

  // State management with Angular signals
  private readonly stateSubject = new BehaviorSubject<TwitterServiceState>({
    initialized: false,
    embedAvailable: false,
    apiAvailable: false,
    loading: false,
    error: null,
    profile: null,
    posts: [],
    lastUpdate: null,
    apiCallsRemaining: this.config.apiCallLimit,
    cacheStats: { hits: 0, misses: 0, hitRate: 0 }
  });

  // Public reactive state
  readonly state = signal(this.stateSubject.value);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly posts = computed(() => this.state().posts);
  readonly profile = computed(() => this.state().profile);
  readonly initialized = computed(() => this.state().initialized);
  readonly embedAvailable = computed(() => this.state().embedAvailable);

  // Internal cache and performance tracking
  private cache = new Map<string, { data: any; timestamp: number; source: 'api' | 'embed' }>();
  private apiCallCount = 0;
  private embedWidgetPromise: Promise<any> | null = null;
  private refreshObservable: Observable<TwitterPost[]> | null = null;

  constructor() {
    // Set up state synchronization
    this.stateSubject
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(state => this.state.set(state));

    // Initialize service
    this.initializeService();

    // Set up periodic cache cleanup
    timer(0, 5 * 60 * 1000) // Every 5 minutes
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cleanupCache());
  }

  /**
   * Initialize Twitter service with progressive enhancement
   */
  private async initializeService(): Promise<void> {
    this.updateState({ loading: true, error: null });

    try {
      // Load cached data first for instant experience
      this.loadFromCache();

      // Initialize embed widget (primary strategy)
      if (this.config.embedEnabled) {
        await this.initializeEmbedWidget();
      }

      // Check API availability (secondary strategy)
      if (this.config.apiEnabled && this.state().apiCallsRemaining > 10) {
        await this.checkApiAvailability();
      }

      this.updateState({
        initialized: true,
        loading: false,
        error: null
      });

      console.log('✅ Twitter Core Service initialized successfully');

    } catch (error: any) {
      console.warn('⚠️ Twitter service initialization completed with warnings:', error.message);
      this.updateState({
        initialized: true,
        loading: false,
        error: `Partial initialization: ${error.message}`
      });
    }
  }

  /**
   * Initialize Twitter embed widget (primary strategy)
   */
  private async initializeEmbedWidget(): Promise<void> {
    if (typeof window === 'undefined') return;

    // Prevent multiple initializations
    if (this.embedWidgetPromise) {
      return this.embedWidgetPromise;
    }

    this.embedWidgetPromise = new Promise((resolve, reject) => {
      // Check if Twitter widgets already loaded
      if ((window as any).twttr?.widgets) {
        this.updateState({ embedAvailable: true });
        resolve((window as any).twttr);
        return;
      }

      // Load Twitter widgets script
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.onload = () => {
        this.updateState({ embedAvailable: true });
        resolve((window as any).twttr);
      };
      script.onerror = () => {
        const error = new Error('Failed to load Twitter embed widget');
        this.updateState({ error: error.message });
        reject(error);
      };

      document.head.appendChild(script);
    });

    return this.embedWidgetPromise;
  }

  /**
   * Create Twitter embed timeline in specified container
   */
  async createEmbedTimeline(containerId: string): Promise<void> {
    try {
      await this.initializeEmbedWidget();

      const container = document.getElementById(containerId);
      if (!container) {
        throw new Error(`Container ${containerId} not found`);
      }

      if (!(window as any).twttr?.widgets) {
        throw new Error('Twitter widgets not available');
      }

      // Clear container and create timeline
      container.innerHTML = '';

      await (window as any).twttr.widgets.createTimeline(
        {
          sourceType: 'profile',
          screenName: this.config.username
        },
        container,
        {
          height: environment.twitter.embed.height,
          theme: environment.twitter.embed.theme,
          chrome: 'noheader,nofooter,noborders',
          tweetLimit: this.config.maxPosts,
          linkColor: environment.twitter.embed.linkColor,
          borderColor: environment.twitter.embed.borderColor
        }
      );

      console.log('✅ Twitter embed timeline created successfully');

    } catch (error: any) {
      console.error('❌ Failed to create Twitter embed timeline:', error);
      this.updateState({ error: `Embed failed: ${error.message}` });
      throw error;
    }
  }

  /**
   * Refresh Twitter data with debouncing and deduplication
   */
  refreshData(): Observable<TwitterPost[]> {
    // Prevent multiple simultaneous refresh operations
    if (this.refreshObservable) {
      return this.refreshObservable;
    }

    this.refreshObservable = timer(0).pipe(
      debounceTime(1000), // Debounce rapid refresh requests
      switchMap(() => this.performRefresh()),
      shareReplay(1), // Share the result with multiple subscribers
      tap(() => {
        // Clear the shared observable after completion
        this.refreshObservable = null;
      }),
      takeUntilDestroyed(this.destroyRef)
    );

    return this.refreshObservable;
  }

  /**
   * Perform actual refresh operation
   */
  private performRefresh(): Observable<TwitterPost[]> {
    this.updateState({ loading: true, error: null });

    // Try API first if available
    if (this.state().apiAvailable && this.state().apiCallsRemaining > 0) {
      return this.fetchFromApi().pipe(
        tap(posts => {
          this.updateState({
            posts,
            loading: false,
            lastUpdate: new Date(),
            error: null
          });
          this.updateCacheStats('api', false);
        }),
        catchError(() => {
          // Fallback to cached data
          return this.getFallbackData();
        })
      );
    }

    // Use cached/fallback data
    return this.getFallbackData();
  }

  /**
   * Check API availability with minimal resource usage
   */
  private async checkApiAvailability(): Promise<void> {
    try {
      // Lazy load OAuth service only when needed
      const { TwitterOAuthService } = await import('./twitter-oauth.service');
      const oauthService = new TwitterOAuthService(this.http);

      // Test credentials with minimal API call
      const result = await oauthService.testCredentials({
        apiKey: environment.twitter.oauth.apiKey,
        apiSecret: environment.twitter.oauth.apiSecret,
        accessToken: environment.twitter.oauth.accessToken,
        accessTokenSecret: environment.twitter.oauth.accessTokenSecret
      });

      if (result.success) {
        this.updateState({
          apiAvailable: true,
          apiCallsRemaining: result.rateLimitRemaining || this.state().apiCallsRemaining - 1
        });
        this.apiCallCount++;
      }

    } catch (error: any) {
      console.warn('⚠️ API availability check failed:', error.message);
      this.updateState({ apiAvailable: false });
    }
  }

  /**
   * Fetch data from Twitter API (lazy loaded)
   */
  private async fetchFromApi(): Promise<TwitterPost[]> {
    const { TwitterApiService } = await import('./twitter-api.service');
    const apiService = new TwitterApiService(this.http, await import('./twitter-oauth.service').then(m => new m.TwitterOAuthService(this.http)));

    return apiService.getPrismCollectTweets(this.config.maxPosts).toPromise()
      .then(tweets => tweets?.map(this.convertApiTweetToPost) || []);
  }

  /**
   * Get fallback data (cached or empty)
   */
  private getFallbackData(): Observable<TwitterPost[]> {
    const cached = this.getFromCache('posts');

    this.updateState({
      posts: cached || [],
      loading: false,
      lastUpdate: cached ? new Date() : null,
      error: cached ? null : 'Using offline mode'
    });

    this.updateCacheStats('cache', true);

    return EMPTY;
  }

  /**
   * Cache management with automatic cleanup
   */
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.config.cacheTimeout;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: any, source: 'api' | 'embed' = 'api'): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      source
    });

    // Persist important data to localStorage
    try {
      localStorage.setItem(`twitter_${key}`, JSON.stringify({
        data,
        timestamp: Date.now(),
        source
      }));
    } catch (error) {
      console.warn('Failed to persist cache to localStorage:', error);
    }
  }

  private loadFromCache(): void {
    try {
      const keys = ['posts', 'profile'];
      keys.forEach(key => {
        const stored = localStorage.getItem(`twitter_${key}`);
        if (stored) {
          const { data, timestamp, source } = JSON.parse(stored);
          const age = Date.now() - timestamp;

          if (age < this.config.cacheTimeout) {
            this.cache.set(key, { data, timestamp, source });

            if (key === 'posts') {
              this.updateState({ posts: data });
            } else if (key === 'profile') {
              this.updateState({ profile: data });
            }
          }
        }
      });
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
    }
  }

  private cleanupCache(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.config.cacheTimeout) {
        this.cache.delete(key);
        localStorage.removeItem(`twitter_${key}`);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} expired cache entries`);
    }
  }

  /**
   * Update cache statistics for monitoring
   */
  private updateCacheStats(source: 'api' | 'cache', isHit: boolean): void {
    const current = this.state().cacheStats;
    const hits = isHit ? current.hits + 1 : current.hits;
    const misses = !isHit ? current.misses + 1 : current.misses;
    const total = hits + misses;
    const hitRate = total > 0 ? (hits / total) * 100 : 0;

    this.updateState({
      cacheStats: { hits, misses, hitRate }
    });
  }

  /**
   * Convert API tweet to standardized format
   */
  private convertApiTweetToPost(tweet: any): TwitterPost {
    return {
      id: tweet.tweet_id || tweet.id,
      text: tweet.text,
      createdAt: new Date(tweet.created_at),
      metrics: {
        likes: tweet.like_count || 0,
        retweets: tweet.retweet_count || 0,
        replies: tweet.reply_count || 0
      },
      url: `https://x.com/${this.config.username}/status/${tweet.tweet_id || tweet.id}`,
      isFromEmbed: false
    };
  }

  /**
   * Update service state immutably
   */
  private updateState(updates: Partial<TwitterServiceState>): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({ ...currentState, ...updates });
  }

  /**
   * Public utility methods
   */
  openTwitterProfile(): void {
    window.open(`https://x.com/${this.config.username}`, '_blank', 'noopener,noreferrer');
  }

  openTweet(tweetId: string): void {
    window.open(`https://x.com/${this.config.username}/status/${tweetId}`, '_blank', 'noopener,noreferrer');
  }

  shareTweet(post: TwitterPost): void {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `Check out this post from @${this.config.username}: ${post.text.substring(0, 100)}...`
    )}&url=${encodeURIComponent(post.url)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  }

  formatTweetContent(content: string): string {
    return content
      .replace(/#(\w+)/g, '<span class="hashtag">#$1</span>')
      .replace(/@(\w+)/g, '<span class="mention">@$1</span>')
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="link">$1</a>');
  }

  getServiceStats() {
    return {
      apiCallsUsed: this.apiCallCount,
      apiCallsRemaining: this.state().apiCallsRemaining,
      cacheSize: this.cache.size,
      cacheStats: this.state().cacheStats,
      lastUpdate: this.state().lastUpdate,
      initialized: this.state().initialized,
      embedAvailable: this.state().embedAvailable,
      apiAvailable: this.state().apiAvailable
    };
  }

  clearCache(): void {
    this.cache.clear();
    ['posts', 'profile'].forEach(key => {
      localStorage.removeItem(`twitter_${key}`);
    });

    this.updateState({
      posts: [],
      profile: null,
      lastUpdate: null,
      cacheStats: { hits: 0, misses: 0, hitRate: 0 }
    });

    console.log('🗑️ Twitter cache cleared');
  }
}