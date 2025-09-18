import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap, retry, delay, switchMap } from 'rxjs/operators';
import { TwitterOAuthService, TwitterOAuthCredentials } from './twitter-oauth.service';
import { environment } from '../../environments/environment';

/**
 * Twitter API v2 Service with OAuth 1.0a Authentication
 *
 * This service provides secure access to Twitter API v2 using OAuth 1.0a authentication.
 * It implements conservative API usage patterns to work within the 100 calls/month limit
 * of the free tier.
 *
 * Key Features:
 * - OAuth 1.0a authentication for Twitter API v2
 * - Conservative API usage (caching, minimal calls)
 * - Rate limit monitoring and management
 * - Comprehensive error handling
 * - Local caching to avoid duplicate API calls
 * - Support for username-to-ID conversion and tweet fetching
 *
 * API Endpoints Supported:
 * - GET /2/users/by/username/{username} - Convert username to user ID
 * - GET /2/users/{id}/tweets - Get user timeline tweets
 *
 * Rate Limits (Free Tier):
 * - Total: 100 API calls per month
 * - User Context: 900 requests per 15-minute window (when available)
 *
 * IMPORTANT: This service is designed for server-side use or development testing.
 * For production client-side usage, implement a proxy server to protect credentials.
 */

export interface TwitterApiUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
  verified?: boolean;
  public_metrics?: {
    followers_count: number;
    following_count: number;
    listed_count: number;
    tweet_count: number;
  };
}

export interface TwitterApiTweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  public_metrics?: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
    quote_count: number;
  };
  context_annotations?: Array<{
    domain: { id: string; name: string; description: string };
    entity: { id: string; name: string; description?: string };
  }>;
  attachments?: {
    media_keys?: string[];
  };
}

export interface TwitterApiResponse<T> {
  data?: T;
  includes?: {
    users?: TwitterApiUser[];
    media?: any[];
  };
  meta?: {
    result_count: number;
    next_token?: string;
    previous_token?: string;
  };
  errors?: Array<{
    title: string;
    detail: string;
    type: string;
    resource_type?: string;
    resource_id?: string;
  }>;
}

export interface ApiCallLog {
  timestamp: Date;
  endpoint: string;
  method: string;
  success: boolean;
  rateLimitRemaining?: number;
  error?: string;
}

export interface TwitterApiServiceState {
  initialized: boolean;
  credentialsValid: boolean;
  loading: boolean;
  error: string | null;
  totalApiCalls: number;
  monthlyCallsRemaining: number;
  rateLimitRemaining: number;
  lastApiCall: Date | null;
  cachedUsers: Map<string, TwitterApiUser>;
  cachedTweets: Map<string, TwitterApiTweet[]>;
}

@Injectable({
  providedIn: 'root'
})
export class TwitterApiService {

  // OAuth Credentials from environment
  private readonly credentials: TwitterOAuthCredentials = {
    apiKey: environment.twitter.oauth.apiKey,
    apiSecret: environment.twitter.oauth.apiSecret,
    accessToken: environment.twitter.oauth.accessToken,
    accessTokenSecret: environment.twitter.oauth.accessTokenSecret
  };

  // API Configuration from environment
  private readonly API_BASE_URL = environment.twitter.apiBaseUrl;
  private readonly MONTHLY_CALL_LIMIT = environment.twitter.rateLimit.monthlyLimit;
  private readonly CACHE_DURATION = environment.twitter.cache.durationMs;

  // State management
  private stateSubject = new BehaviorSubject<TwitterApiServiceState>({
    initialized: false,
    credentialsValid: false,
    loading: false,
    error: null,
    totalApiCalls: 0,
    monthlyCallsRemaining: 100,
    rateLimitRemaining: 900,
    lastApiCall: null,
    cachedUsers: new Map(),
    cachedTweets: new Map()
  });

  // Public reactive state
  readonly state = signal<TwitterApiServiceState>(this.stateSubject.value);
  readonly initialized = computed(() => this.state().initialized);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly apiCallsRemaining = computed(() => this.state().monthlyCallsRemaining);

  // Call logging for debugging and monitoring
  private apiCallLog: ApiCallLog[] = [];

  constructor(
    private http: HttpClient,
    private oauthService: TwitterOAuthService
  ) {
    // Subscribe to state changes
    this.stateSubject.subscribe(state => this.state.set(state));

    // Initialize service
    this.initializeService();
  }

  /**
   * Initialize the Twitter API service
   */
  private async initializeService(): Promise<void> {
    console.log('🐦 Initializing Twitter API Service with OAuth 1.0a...');

    this.updateState({ loading: true, error: null });

    try {
      // Validate credentials format
      const validation = this.oauthService.validateCredentials(this.credentials);
      if (!validation.valid) {
        throw new Error(`Invalid credentials: ${validation.errors.join(', ')}`);
      }

      // Load cached data
      this.loadFromCache();

      // Test credentials (conservative - only if we have calls remaining)
      if (this.state().monthlyCallsRemaining > 10) {
        console.log('🔐 Testing OAuth credentials...');
        const testResult = await this.oauthService.testCredentials(this.credentials);

        if (!testResult.success) {
          throw new Error(`Credential test failed: ${testResult.error}`);
        }

        console.log('✅ OAuth credentials validated successfully');
        console.log(`📊 Rate limit remaining: ${testResult.rateLimitRemaining}`);

        this.updateState({
          credentialsValid: true,
          rateLimitRemaining: testResult.rateLimitRemaining || 900
        });

        // Log API call
        this.logApiCall('GET', '/users/me', true, testResult.rateLimitRemaining);
      } else {
        console.log('⚠️ Skipping credential test - preserving API calls');
        this.updateState({ credentialsValid: true });
      }

      this.updateState({
        initialized: true,
        loading: false,
        error: null
      });

      console.log('🎉 Twitter API Service initialized successfully');

    } catch (error: any) {
      console.error('❌ Failed to initialize Twitter API Service:', error);
      this.updateState({
        initialized: false,
        loading: false,
        error: error.message,
        credentialsValid: false
      });
    }
  }

  /**
   * Get user information by username
   * Uses caching to avoid duplicate API calls
   *
   * @param username - Twitter username (without @)
   * @returns Observable with user data
   */
  getUserByUsername(username: string): Observable<TwitterApiUser | null> {
    // Remove @ if present
    const cleanUsername = username.replace('@', '');

    // Check cache first
    const cached = this.state().cachedUsers.get(cleanUsername);
    if (cached) {
      console.log(`📋 Using cached user data for @${cleanUsername}`);
      return of(cached);
    }

    // Check if we have API calls remaining
    if (this.state().monthlyCallsRemaining <= 0) {
      const error = 'Monthly API call limit exceeded. Using cached data only.';
      console.warn(`⚠️ ${error}`);
      this.updateState({ error });
      return throwError(() => new Error(error));
    }

    console.log(`🔍 Fetching user data for @${cleanUsername}...`);
    this.updateState({ loading: true, error: null });

    const url = `${this.API_BASE_URL}/users/by/username/${cleanUsername}`;
    const queryParams = {
      'user.fields': 'id,name,username,profile_image_url,verified,public_metrics'
    };

    const headers = this.oauthService.createAuthenticatedHeaders(
      'GET',
      url,
      queryParams,
      this.credentials
    );

    // Create HTTP params
    const httpParams = new HttpParams({ fromObject: queryParams });

    return this.http.get<TwitterApiResponse<TwitterApiUser>>(url, {
      headers,
      params: httpParams,
      observe: 'response'
    }).pipe(
      tap(response => {
        // Extract rate limit info
        const rateLimitRemaining = response.headers.get('x-rate-limit-remaining');
        if (rateLimitRemaining) {
          this.updateState({ rateLimitRemaining: parseInt(rateLimitRemaining) });
        }
      }),
      map(response => response.body?.data || null),
      tap(user => {
        if (user) {
          // Cache the user data
          this.cacheUser(cleanUsername, user);
          console.log(`✅ User data fetched for @${cleanUsername}`);
        } else {
          console.log(`❌ User not found: @${cleanUsername}`);
        }

        // Log API call
        this.logApiCall('GET', `/users/by/username/${cleanUsername}`, true);
        this.updateState({ loading: false });
      }),
      retry({ count: 1, delay: 2000 }),
      catchError(error => {
        console.error(`❌ Error fetching user @${cleanUsername}:`, error);

        // Log failed API call
        this.logApiCall('GET', `/users/by/username/${cleanUsername}`, false, undefined, error.message);

        this.updateState({
          loading: false,
          error: `Failed to fetch user @${cleanUsername}: ${error.message}`
        });

        return throwError(() => error);
      })
    );
  }

  /**
   * Get tweets for a user
   * Uses caching to avoid duplicate API calls
   *
   * @param userId - Twitter user ID
   * @param maxResults - Maximum number of tweets (1-100, default 10)
   * @returns Observable with tweet data
   */
  getUserTweets(userId: string, maxResults: number = 10): Observable<TwitterApiTweet[]> {
    // Ensure maxResults is within valid range
    maxResults = Math.min(Math.max(maxResults, 1), 100);

    // Check cache first
    const cacheKey = `${userId}_${maxResults}`;
    const cached = this.state().cachedTweets.get(cacheKey);
    if (cached) {
      console.log(`📋 Using cached tweets for user ${userId}`);
      return of(cached);
    }

    // Check if we have API calls remaining
    if (this.state().monthlyCallsRemaining <= 0) {
      const error = 'Monthly API call limit exceeded. Using cached data only.';
      console.warn(`⚠️ ${error}`);
      this.updateState({ error });
      return throwError(() => new Error(error));
    }

    console.log(`🔍 Fetching ${maxResults} tweets for user ${userId}...`);
    this.updateState({ loading: true, error: null });

    const url = `${this.API_BASE_URL}/users/${userId}/tweets`;
    const queryParams = {
      'tweet.fields': 'id,text,created_at,author_id,public_metrics,context_annotations,attachments',
      'max_results': maxResults.toString(),
      'exclude': 'retweets' // Exclude retweets to get original content
    };

    const headers = this.oauthService.createAuthenticatedHeaders(
      'GET',
      url,
      queryParams,
      this.credentials
    );

    // Create HTTP params
    const httpParams = new HttpParams({ fromObject: queryParams });

    return this.http.get<TwitterApiResponse<TwitterApiTweet[]>>(url, {
      headers,
      params: httpParams,
      observe: 'response'
    }).pipe(
      tap(response => {
        // Extract rate limit info
        const rateLimitRemaining = response.headers.get('x-rate-limit-remaining');
        if (rateLimitRemaining) {
          this.updateState({ rateLimitRemaining: parseInt(rateLimitRemaining) });
        }
      }),
      map(response => response.body?.data || []),
      tap(tweets => {
        if (tweets.length > 0) {
          // Cache the tweets
          this.cacheTweets(cacheKey, tweets);
          console.log(`✅ Fetched ${tweets.length} tweets for user ${userId}`);
        } else {
          console.log(`ℹ️ No tweets found for user ${userId}`);
        }

        // Log API call
        this.logApiCall('GET', `/users/${userId}/tweets`, true);
        this.updateState({ loading: false });
      }),
      retry({ count: 1, delay: 2000 }),
      catchError(error => {
        console.error(`❌ Error fetching tweets for user ${userId}:`, error);

        // Log failed API call
        this.logApiCall('GET', `/users/${userId}/tweets`, false, undefined, error.message);

        this.updateState({
          loading: false,
          error: `Failed to fetch tweets for user ${userId}: ${error.message}`
        });

        return throwError(() => error);
      })
    );
  }

  /**
   * Get tweets for @prismcollect_ (convenience method)
   *
   * @param maxResults - Maximum number of tweets (default 5 for conservation)
   * @returns Observable with tweets
   */
  getPrismCollectTweets(maxResults: number = 5): Observable<TwitterApiTweet[]> {
    console.log('🎭 Fetching tweets for @prismcollect_...');

    return this.getUserByUsername('prismcollect_').pipe(
      switchMap(user => {
        if (!user) {
          throw new Error('User @prismcollect_ not found');
        }
        return this.getUserTweets(user.id, maxResults);
      })
    );
  }

  /**
   * Cache user data
   */
  private cacheUser(username: string, user: TwitterApiUser): void {
    const currentState = this.state();
    const updatedCache = new Map(currentState.cachedUsers);
    updatedCache.set(username, user);
    this.updateState({ cachedUsers: updatedCache });
    this.saveToCache();
  }

  /**
   * Cache tweets data
   */
  private cacheTweets(cacheKey: string, tweets: TwitterApiTweet[]): void {
    const currentState = this.state();
    const updatedCache = new Map(currentState.cachedTweets);
    updatedCache.set(cacheKey, tweets);
    this.updateState({ cachedTweets: updatedCache });
    this.saveToCache();
  }

  /**
   * Log API call for monitoring
   */
  private logApiCall(
    method: string,
    endpoint: string,
    success: boolean,
    rateLimitRemaining?: number,
    error?: string
  ): void {
    const logEntry: ApiCallLog = {
      timestamp: new Date(),
      endpoint,
      method,
      success,
      rateLimitRemaining,
      error
    };

    this.apiCallLog.push(logEntry);

    // Update call counts
    const currentState = this.state();
    this.updateState({
      totalApiCalls: currentState.totalApiCalls + 1,
      monthlyCallsRemaining: Math.max(0, currentState.monthlyCallsRemaining - 1),
      lastApiCall: new Date(),
      rateLimitRemaining: rateLimitRemaining || currentState.rateLimitRemaining
    });

    console.log(`📊 API Call Logged: ${method} ${endpoint} - Success: ${success}`);
    console.log(`📈 Calls remaining this month: ${this.state().monthlyCallsRemaining}`);
  }

  /**
   * Get API call statistics
   */
  getApiStats() {
    return {
      totalCalls: this.state().totalApiCalls,
      monthlyRemaining: this.state().monthlyCallsRemaining,
      rateLimitRemaining: this.state().rateLimitRemaining,
      lastCall: this.state().lastApiCall,
      recentCalls: this.apiCallLog.slice(-10), // Last 10 calls
      successRate: this.apiCallLog.length > 0
        ? (this.apiCallLog.filter(call => call.success).length / this.apiCallLog.length) * 100
        : 0
    };
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.updateState({
      cachedUsers: new Map(),
      cachedTweets: new Map()
    });
    localStorage.removeItem('twitter_api_cache');
    console.log('🗑️ Cache cleared');
  }

  /**
   * Save cache to localStorage
   */
  private saveToCache(): void {
    try {
      const cacheData = {
        users: Array.from(this.state().cachedUsers.entries()),
        tweets: Array.from(this.state().cachedTweets.entries()),
        timestamp: Date.now()
      };
      localStorage.setItem('twitter_api_cache', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error);
    }
  }

  /**
   * Load cache from localStorage
   */
  private loadFromCache(): void {
    try {
      const cached = localStorage.getItem('twitter_api_cache');
      if (!cached) return;

      const cacheData = JSON.parse(cached);
      const age = Date.now() - cacheData.timestamp;

      // Check if cache is still valid (24 hours)
      if (age > this.CACHE_DURATION) {
        localStorage.removeItem('twitter_api_cache');
        return;
      }

      // Restore cached data
      const cachedUsers = new Map<string, TwitterApiUser>(
        Array.isArray(cacheData.users) ? cacheData.users : Object.entries(cacheData.users || {}) as [string, TwitterApiUser][]
      );
      const cachedTweets = new Map<string, TwitterApiTweet[]>(
        Array.isArray(cacheData.tweets) ? cacheData.tweets : Object.entries(cacheData.tweets || {}) as [string, TwitterApiTweet[]][]
      );

      this.updateState({
        cachedUsers,
        cachedTweets
      });

      console.log(`📋 Loaded cache: ${cachedUsers.size} users, ${cachedTweets.size} tweet sets`);

    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
      localStorage.removeItem('twitter_api_cache');
    }
  }

  /**
   * Update service state
   */
  private updateState(updates: Partial<TwitterApiServiceState>): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({ ...currentState, ...updates });
  }
}

// Re-export for convenience
export type { TwitterOAuthCredentials } from './twitter-oauth.service';