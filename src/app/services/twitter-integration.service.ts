import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, timer, BehaviorSubject } from 'rxjs';
import { catchError, retry, delay, shareReplay, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

/**
 * Twitter Integration Service for Prismatic Collections
 *
 * Provides multiple integration strategies:
 * 1. Twitter Embed Widget (primary, no API keys needed)
 * 2. Twitter API v2 (secondary, requires bearer token)
 * 3. Fallback static tweets (tertiary, always available)
 *
 * Features:
 * - Reactive state management with Angular signals
 * - Comprehensive error handling and retry logic
 * - Caching mechanisms to reduce API calls
 * - Rate limiting awareness
 * - Real-time tweet fetching from @prismcollect_
 */

export interface Tweet {
  id: string;
  text: string;
  created_at: string;
  author_id?: string;
  public_metrics?: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
  };
  attachments?: {
    media_keys?: string[];
  };
  media?: TwitterMedia[];
  formatted_date?: string;
  url: string;
}

export interface TwitterMedia {
  media_key: string;
  type: 'photo' | 'video' | 'animated_gif';
  url?: string;
  preview_image_url?: string;
  alt_text?: string;
}

export interface TwitterUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
  verified?: boolean;
}

export interface TwitterApiResponse {
  data?: Tweet[];
  includes?: {
    users?: TwitterUser[];
    media?: TwitterMedia[];
  };
  meta?: {
    result_count: number;
    next_token?: string;
  };
  errors?: Array<{
    title: string;
    detail: string;
    type: string;
  }>;
}

export interface TwitterServiceState {
  loading: boolean;
  error: string | null;
  tweets: Tweet[];
  user: TwitterUser | null;
  lastUpdate: Date | null;
  embedLoaded: boolean;
  apiAvailable: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TwitterIntegrationService {
  // Twitter API Configuration from environment
  private readonly TWITTER_USERNAME = environment.twitter.username;
  private readonly API_BASE_URL = environment.twitter.apiBaseUrl;
  private readonly CACHE_DURATION = environment.twitter.cache.durationMs;
  private readonly MAX_TWEETS = environment.twitter.embed.tweetLimit;
  private readonly RATE_LIMIT_WINDOW = environment.twitter.rateLimit.windowDurationMs;
  private readonly MAX_REQUESTS_PER_WINDOW = environment.twitter.rateLimit.requestsPerWindow;

  // State management with signals
  private stateSubject = new BehaviorSubject<TwitterServiceState>({
    loading: false,
    error: null,
    tweets: [],
    user: null,
    lastUpdate: null,
    embedLoaded: false,
    apiAvailable: false
  });

  // Public reactive state
  readonly state = signal<TwitterServiceState>(this.stateSubject.value);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly tweets = computed(() => this.state().tweets);
  readonly user = computed(() => this.state().user);
  readonly embedLoaded = computed(() => this.state().embedLoaded);

  // Private state tracking
  private cache = new Map<string, { data: any; timestamp: number }>();
  private requestCount = 0;
  private rateLimitReset = 0;

  constructor(private http: HttpClient) {
    // Subscribe to state changes and update signal
    this.stateSubject.subscribe(state => this.state.set(state));

    // Initialize service
    this.initializeService();

    // Set up periodic cache cleanup
    timer(0, 60000).subscribe(() => this.cleanupCache());
  }

  /**
   * Initialize the Twitter service
   * Attempts to load Twitter widgets and check API availability
   */
  private initializeService(): void {
    if (environment.debug.enableLogging) {
      console.log('Initializing Twitter Integration Service');
    }

    // Load Twitter widgets script if enabled
    if (environment.features.twitterEmbedEnabled) {
      this.loadTwitterWidgets();
    }

    // Check if we have API credentials
    this.checkApiAvailability();
  }

  /**
   * Load Twitter widgets script for embed functionality
   */
  private loadTwitterWidgets(): void {
    if (typeof window === 'undefined') return;

    // Check if Twitter widgets script is already loaded
    if ((window as any).twttr) {
      this.updateState({ embedLoaded: true });
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.onload = () => {
      if (environment.debug.enableLogging) {
        console.log('Twitter widgets loaded successfully');
      }
      this.updateState({ embedLoaded: true });
    };
    script.onerror = () => {
      if (environment.debug.enableLogging) {
        console.warn('Failed to load Twitter widgets');
      }
      this.updateState({ error: 'Twitter embed unavailable' });
    };

    document.head.appendChild(script);
  }

  /**
   * Check if Twitter API is available (credentials present)
   */
  private checkApiAvailability(): void {
    const hasApiKey = Boolean(environment.features.twitterApiEnabled &&
                             environment.twitter.bearerToken &&
                             environment.twitter.bearerToken.length > 0);

    this.updateState({ apiAvailable: hasApiKey });

    if (!hasApiKey && environment.debug.enableLogging) {
      console.warn('Twitter API credentials not available. Using embed and fallback modes.');
    }
  }

  /**
   * Create Twitter embed timeline
   * This is the primary method - no API keys required
   */
  createEmbedTimeline(containerId: string): void {
    if (typeof window === 'undefined' || !(window as any).twttr) {
      console.warn('Twitter widgets not available');
      return;
    }

    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container ${containerId} not found`);
      return;
    }

    // Clear container
    container.innerHTML = '';

    // Create embedded timeline
    (window as any).twttr.widgets.createTimeline(
      {
        sourceType: 'profile',
        screenName: this.TWITTER_USERNAME
      },
      container,
      {
        height: environment.twitter.embed.height,
        chrome: 'noheader,nofooter,noborders',
        theme: environment.twitter.embed.theme,
        tweetLimit: environment.twitter.embed.tweetLimit,
        linkColor: environment.twitter.embed.linkColor,
        borderColor: environment.twitter.embed.borderColor
      }
    ).then((timeline: any) => {
      if (environment.debug.enableLogging) {
        console.log('Twitter timeline embedded successfully');
      }
      this.updateState({ error: null });
    }).catch((error: any) => {
      if (environment.debug.enableLogging) {
        console.error('Failed to embed Twitter timeline:', error);
      }
      this.updateState({ error: 'Failed to load Twitter timeline' });
    });
  }

  /**
   * Fetch tweets using Twitter API v2
   * Requires bearer token authentication
   */
  fetchTweetsFromApi(): Observable<Tweet[]> {
    if (!this.state().apiAvailable) {
      return throwError(() => new Error('Twitter API not available'));
    }

    if (this.isRateLimited()) {
      return throwError(() => new Error('Rate limit exceeded'));
    }

    const cacheKey = `tweets_${this.TWITTER_USERNAME}`;
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return of(cached as Tweet[]);
    }

    this.updateState({ loading: true, error: null });

    // Get user ID first
    return this.getUserByUsername(this.TWITTER_USERNAME).pipe(
      switchMap(user => {
        if (!user) throw new Error('User not found');

        // Update user info
        this.updateState({ user });

        // Fetch user tweets
        return this.getUserTweets(user.id);
      }),
      map(response => this.processTweetsResponse(response)),
      tap(tweets => {
        this.setCache(cacheKey, tweets);
        this.updateState({
          loading: false,
          error: null,
          tweets,
          lastUpdate: new Date()
        });
      }),
      catchError(error => {
        console.error('Twitter API error:', error);
        this.updateState({
          loading: false,
          error: this.getErrorMessage(error),
          tweets: this.getFallbackTweets()
        });
        return of(this.getFallbackTweets());
      }),
      shareReplay(1)
    );
  }

  /**
   * Get user information by username
   */
  private getUserByUsername(username: string): Observable<TwitterUser | null> {
    const url = `${this.API_BASE_URL}/users/by/username/${username}`;
    const headers = this.getApiHeaders();

    this.incrementRequestCount();

    return this.http.get<{ data: TwitterUser }>(url, { headers }).pipe(
      map(response => response.data),
      retry({ count: 2, delay: 1000 }),
      catchError(error => {
        console.error('Error fetching user:', error);
        return of(null);
      })
    );
  }

  /**
   * Get user tweets by user ID
   */
  private getUserTweets(userId: string): Observable<TwitterApiResponse> {
    const url = `${this.API_BASE_URL}/users/${userId}/tweets`;
    const params = {
      'tweet.fields': 'created_at,public_metrics,attachments',
      'media.fields': 'url,preview_image_url,type,alt_text',
      'expansions': 'attachments.media_keys',
      'max_results': this.MAX_TWEETS.toString()
    };

    const headers = this.getApiHeaders();

    this.incrementRequestCount();

    return this.http.get<TwitterApiResponse>(url, {
      headers,
      params
    }).pipe(
      retry({ count: 2, delay: 1000 })
    );
  }

  /**
   * Process Twitter API response into our Tweet interface
   */
  private processTweetsResponse(response: TwitterApiResponse): Tweet[] {
    if (!response.data) return [];

    const mediaMap = new Map<string, TwitterMedia>();
    if (response.includes?.media) {
      response.includes.media.forEach(media => {
        mediaMap.set(media.media_key, media);
      });
    }

    return response.data.map(tweet => ({
      id: tweet.id,
      text: tweet.text,
      created_at: tweet.created_at,
      public_metrics: tweet.public_metrics,
      media: tweet.attachments?.media_keys?.map(key => mediaMap.get(key)).filter(Boolean) as TwitterMedia[],
      formatted_date: this.formatDate(new Date(tweet.created_at)),
      url: `https://twitter.com/${this.TWITTER_USERNAME}/status/${tweet.id}`
    }));
  }

  /**
   * Get API headers with authentication
   */
  private getApiHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${environment.twitter.bearerToken}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Get fallback tweets when API fails
   * These are manually curated tweets that represent the account
   */
  getFallbackTweets(): Tweet[] {
    const now = new Date();

    return [
      {
        id: 'fallback_1',
        text: '🚀 Just launched Project Phantasia 2.0! Experience the future of interactive 3D environments with enhanced performance and stunning visuals. Dive into the immersive world at our website. #Phantasia #3D #Launch #Interactive',
        created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        formatted_date: this.formatDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)),
        url: `https://x.com/${this.TWITTER_USERNAME}/status/fallback_1`,
        public_metrics: { retweet_count: 12, like_count: 45, reply_count: 8 }
      },
      {
        id: 'fallback_2',
        text: '🎵 New music release alert! "Ethereal Echoes" is now live on all streaming platforms. Dive into the ethereal soundscapes that inspired our latest collection. Link in bio! #Music #EtherealEchoes #Release #NewMusic',
        created_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        formatted_date: this.formatDate(new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)),
        url: `https://x.com/${this.TWITTER_USERNAME}/status/fallback_2`,
        public_metrics: { retweet_count: 8, like_count: 67, reply_count: 15 }
      },
      {
        id: 'fallback_3',
        text: '📱 Mobile users, rejoice! Our new touch-optimized interface is rolling out across all Prismatic Collections experiences. Smoother, faster, and more intuitive than ever. #Mobile #UI #Update #UX',
        created_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
        formatted_date: this.formatDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)),
        url: `https://x.com/${this.TWITTER_USERNAME}/status/fallback_3`,
        public_metrics: { retweet_count: 5, like_count: 34, reply_count: 6 }
      },
      {
        id: 'fallback_4',
        text: '⚡ Performance update: We\'ve reduced loading times by 40% and enhanced animation smoothness across all platforms. Better experiences for everyone! #Performance #Optimization #TechnicalUpdate #WebDev',
        created_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        formatted_date: this.formatDate(new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)),
        url: `https://x.com/${this.TWITTER_USERNAME}/status/fallback_4`,
        public_metrics: { retweet_count: 18, like_count: 92, reply_count: 23 }
      },
      {
        id: 'fallback_5',
        text: '🌟 Community spotlight! Amazing creations from our talented community members continue to inspire us. Keep sharing your incredible work and tag us! #Community #Creativity #Showcase #Art',
        created_at: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
        formatted_date: this.formatDate(new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)),
        url: `https://x.com/${this.TWITTER_USERNAME}/status/fallback_5`,
        public_metrics: { retweet_count: 7, like_count: 56, reply_count: 11 }
      }
    ];
  }

  /**
   * Refresh tweets - tries API first, falls back to embed/static
   */
  refreshTweets(): Observable<Tweet[]> {
    if (environment.debug.enableLogging) {
      console.log('Refreshing Twitter feed...');
    }

    // Clear cache
    this.clearCache();

    if (this.state().apiAvailable && environment.features.twitterApiEnabled) {
      return this.fetchTweetsFromApi();
    } else {
      // Use fallback tweets and try to refresh embed
      this.updateState({
        loading: false,
        tweets: this.getFallbackTweets(),
        lastUpdate: new Date(),
        error: null
      });

      return of(this.getFallbackTweets());
    }
  }

  /**
   * Format date for display
   */
  private formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffTime / (1000 * 60));

      if (diffHours > 0) return `${diffHours}h`;
      if (diffMinutes > 0) return `${diffMinutes}m`;
      return 'now';
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }

  /**
   * Update service state
   */
  private updateState(updates: Partial<TwitterServiceState>): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({ ...currentState, ...updates });
  }

  /**
   * Cache management
   */
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private clearCache(): void {
    this.cache.clear();
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Rate limiting
   */
  private isRateLimited(): boolean {
    const now = Date.now();
    if (now > this.rateLimitReset) {
      this.requestCount = 0;
      this.rateLimitReset = now + this.RATE_LIMIT_WINDOW;
    }

    return this.requestCount >= this.MAX_REQUESTS_PER_WINDOW;
  }

  private incrementRequestCount(): void {
    this.requestCount++;
  }

  /**
   * Error handling
   */
  private getErrorMessage(error: any): string {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 401:
          return 'Twitter API authentication failed';
        case 403:
          return 'Twitter API access forbidden';
        case 429:
          return 'Twitter API rate limit exceeded';
        case 500:
          return 'Twitter API server error';
        default:
          return 'Twitter API unavailable';
      }
    }

    return error.message || 'Unknown Twitter integration error';
  }

  /**
   * Utility methods for components
   */
  formatTweetContent(content: string): string {
    return content
      .replace(/#(\w+)/g, '<span class="tweet-hashtag">#$1</span>')
      .replace(/@(\w+)/g, '<span class="tweet-mention">@$1</span>')
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="tweet-link">$1</a>');
  }

  openTweetUrl(tweetId: string): void {
    const url = `https://x.com/${this.TWITTER_USERNAME}/status/${tweetId}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  shareTweet(tweet: Tweet): void {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out this tweet from @' + this.TWITTER_USERNAME + ': ' + tweet.text.substring(0, 100) + '...')}&url=${encodeURIComponent(tweet.url)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  }

  /**
   * Public getters for component use
   */
  getTwitterUsername(): string {
    return this.TWITTER_USERNAME;
  }

  getTwitterUrl(): string {
    return `https://x.com/${this.TWITTER_USERNAME}`;
  }

  getLastUpdateTime(): string {
    const lastUpdate = this.state().lastUpdate;
    if (!lastUpdate) return 'Never';

    return this.formatDate(lastUpdate);
  }
}