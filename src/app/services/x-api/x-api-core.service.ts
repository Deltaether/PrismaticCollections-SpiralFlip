import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, timer, EMPTY } from 'rxjs';
import { catchError, map, tap, retry, delayWhen, switchMap, finalize } from 'rxjs/operators';

/**
 * X API V2 Core Service
 *
 * Official implementation following https://docs.x.com/x-api/introduction
 *
 * Features:
 * - Bearer Token authentication (OAuth 2.0)
 * - Official X API V2 endpoints
 * - Proper rate limiting with exponential backoff
 * - Comprehensive error handling
 * - Response caching for efficiency
 * - Real-time rate limit tracking
 *
 * Authentication:
 * Uses Bearer Token authentication as recommended by X API V2 documentation
 *
 * Rate Limits (Official X API V2):
 * - GET /2/users/by/username/{username}: 300 requests per 15-minute window
 * - GET /2/users/{id}/tweets: 1500 requests per 15-minute window
 *
 * @see https://docs.x.com/x-api/introduction
 * @see https://docs.x.com/x-api/authentication/overview
 */

// Official X API V2 Response Interfaces
export interface XApiUser {
  id: string;
  name: string;
  username: string;
  description?: string;
  profile_image_url?: string;
  protected?: boolean;
  verified?: boolean;
  verified_type?: 'blue' | 'business' | 'government';
  url?: string;
  location?: string;
  created_at?: string;
  public_metrics?: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
    like_count: number;
  };
  withheld?: {
    country_codes: string[];
    scope: 'tweet' | 'user';
  };
}

export interface XApiTweet {
  id: string;
  text: string;
  created_at?: string;
  author_id?: string;
  conversation_id?: string;
  in_reply_to_user_id?: string;
  referenced_tweets?: Array<{
    type: 'retweeted' | 'quoted' | 'replied_to';
    id: string;
  }>;
  attachments?: {
    media_keys?: string[];
    poll_ids?: string[];
  };
  geo?: {
    coordinates?: {
      type: string;
      coordinates: number[];
    };
    place_id?: string;
  };
  context_annotations?: Array<{
    domain: {
      id: string;
      name: string;
      description?: string;
    };
    entity: {
      id: string;
      name: string;
      description?: string;
    };
  }>;
  entities?: {
    urls?: Array<{
      start: number;
      end: number;
      url: string;
      expanded_url?: string;
      display_url?: string;
      unwound_url?: string;
    }>;
    hashtags?: Array<{
      start: number;
      end: number;
      tag: string;
    }>;
    mentions?: Array<{
      start: number;
      end: number;
      username: string;
      id?: string;
    }>;
    cashtags?: Array<{
      start: number;
      end: number;
      tag: string;
    }>;
  };
  public_metrics?: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
    quote_count: number;
    bookmark_count: number;
    impression_count: number;
  };
  non_public_metrics?: {
    impression_count: number;
    url_link_clicks: number;
    user_profile_clicks: number;
  };
  organic_metrics?: {
    impression_count: number;
    like_count: number;
    reply_count: number;
    retweet_count: number;
    url_link_clicks: number;
    user_profile_clicks: number;
  };
  promoted_metrics?: {
    impression_count: number;
    like_count: number;
    reply_count: number;
    retweet_count: number;
    url_link_clicks: number;
    user_profile_clicks: number;
  };
  withheld?: {
    copyright: boolean;
    country_codes: string[];
    scope: 'tweet' | 'user';
  };
}

export interface XApiMedia {
  media_key: string;
  type: 'photo' | 'video' | 'animated_gif';
  height?: number;
  width?: number;
  duration_ms?: number;
  preview_image_url?: string;
  public_metrics?: {
    view_count: number;
  };
  non_public_metrics?: {
    playback_0_count: number;
    playback_25_count: number;
    playback_50_count: number;
    playback_75_count: number;
    playback_100_count: number;
  };
  organic_metrics?: {
    playback_0_count: number;
    playback_25_count: number;
    playback_50_count: number;
    playback_75_count: number;
    playback_100_count: number;
    view_count: number;
  };
  promoted_metrics?: {
    playback_0_count: number;
    playback_25_count: number;
    playback_50_count: number;
    playback_75_count: number;
    playback_100_count: number;
    view_count: number;
  };
  alt_text?: string;
  url?: string;
}

export interface XApiResponse<T> {
  data?: T;
  includes?: {
    tweets?: XApiTweet[];
    users?: XApiUser[];
    media?: XApiMedia[];
    polls?: any[];
    places?: any[];
  };
  meta?: {
    result_count?: number;
    next_token?: string;
    previous_token?: string;
    newest_id?: string;
    oldest_id?: string;
  };
  errors?: Array<{
    detail: string;
    title: string;
    resource_type: string;
    parameter: string;
    resource_id?: string;
    value?: string;
    section?: string;
    type: string;
  }>;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
  resetDate: Date;
  windowStart: Date;
}

export interface XApiServiceState {
  initialized: boolean;
  authenticated: boolean;
  loading: boolean;
  error: string | null;
  lastRequest: Date | null;
  requestCount: number;
  rateLimits: Map<string, RateLimitInfo>;
}

@Injectable({
  providedIn: 'root'
})
export class XApiCoreService {
  private readonly http = inject(HttpClient);

  // Official X API V2 Base URL
  private readonly API_BASE_URL = 'https://api.x.com/2';

  // Bearer Token for authentication (should be provided via environment or server)
  private bearerToken: string | null = null;

  // State management with Angular signals
  private stateSubject = new BehaviorSubject<XApiServiceState>({
    initialized: false,
    authenticated: false,
    loading: false,
    error: null,
    lastRequest: null,
    requestCount: 0,
    rateLimits: new Map()
  });

  readonly state = signal<XApiServiceState>(this.stateSubject.value);
  readonly initialized = computed(() => this.state().initialized);
  readonly authenticated = computed(() => this.state().authenticated);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly requestCount = computed(() => this.state().requestCount);

  // Cache for responses to minimize API calls
  private responseCache = new Map<string, { data: any; timestamp: number; expiresAt: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    // Subscribe to state changes
    this.stateSubject.subscribe(state => this.state.set(state));

    console.log('🐦 X API V2 Core Service initialized');
  }

  /**
   * Initialize service with Bearer Token
   *
   * @param bearerToken - OAuth 2.0 Bearer Token for X API V2
   */
  initialize(bearerToken: string): void {
    if (!bearerToken || bearerToken.trim().length === 0) {
      this.updateState({
        error: 'Bearer token is required for X API V2 authentication',
        initialized: false,
        authenticated: false
      });
      return;
    }

    this.bearerToken = bearerToken;
    this.updateState({
      initialized: true,
      authenticated: true,
      error: null
    });

    console.log('✅ X API V2 Core Service initialized with Bearer Token');
  }

  /**
   * Get user by username using official X API V2 endpoint
   *
   * @param username - Username without @ symbol
   * @param userFields - Optional user fields to include
   * @returns Observable with user data
   *
   * @see https://docs.x.com/x-api/users/lookup/api-reference/get-users-by-username-username
   */
  getUserByUsername(
    username: string,
    userFields?: string[]
  ): Observable<XApiUser | null> {
    if (!this.isAuthenticated()) {
      return throwError(() => new Error('Service not authenticated. Call initialize() with Bearer Token first.'));
    }

    const cleanUsername = username.replace('@', '');
    const cacheKey = `user:${cleanUsername}:${userFields?.join(',') || 'default'}`;

    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      console.log(`📋 Using cached user data for @${cleanUsername}`);
      return new Observable(observer => {
        observer.next(cached.data);
        observer.complete();
      });
    }

    const endpoint = `/users/by/username/${cleanUsername}`;
    const url = `${this.API_BASE_URL}${endpoint}`;

    // Build query parameters
    let params = new HttpParams();
    if (userFields && userFields.length > 0) {
      params = params.set('user.fields', userFields.join(','));
    } else {
      // Default fields for comprehensive user data
      params = params.set(
        'user.fields',
        'id,name,username,description,profile_image_url,verified,verified_type,public_metrics,created_at,location,url'
      );
    }

    const headers = this.createAuthHeaders();

    this.updateState({ loading: true, error: null });

    return this.http.get<XApiResponse<XApiUser>>(url, {
      headers,
      params,
      observe: 'response'
    }).pipe(
      tap(response => this.updateRateLimits(endpoint, response.headers)),
      map(response => {
        const userData = response.body?.data || null;

        // Cache successful response
        if (userData) {
          this.setCache(cacheKey, userData);
        }

        return userData;
      }),
      tap(() => {
        this.updateState({
          loading: false,
          lastRequest: new Date(),
          requestCount: this.state().requestCount + 1
        });
      }),
      retry({
        count: 2,
        delay: (error, retryCount) => this.getRetryDelay(error, retryCount)
      }),
      catchError(error => this.handleError(error, `getUserByUsername(${cleanUsername})`)),
      finalize(() => this.updateState({ loading: false }))
    );
  }

  /**
   * Get user tweets using official X API V2 endpoint
   *
   * @param userId - User ID (not username)
   * @param options - Query options
   * @returns Observable with tweets array
   *
   * @see https://docs.x.com/x-api/tweets/timelines/api-reference/get-users-id-tweets
   */
  getUserTweets(
    userId: string,
    options: {
      maxResults?: number;
      tweetFields?: string[];
      userFields?: string[];
      mediaFields?: string[];
      expansions?: string[];
      startTime?: string;
      endTime?: string;
      sinceId?: string;
      untilId?: string;
      paginationToken?: string;
      exclude?: string[];
    } = {}
  ): Observable<{
    tweets: XApiTweet[];
    includes?: XApiResponse<XApiTweet[]>['includes'];
    meta?: XApiResponse<XApiTweet[]>['meta'];
  }> {
    if (!this.isAuthenticated()) {
      return throwError(() => new Error('Service not authenticated. Call initialize() with Bearer Token first.'));
    }

    const cacheKey = `tweets:${userId}:${JSON.stringify(options)}`;

    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      console.log(`📋 Using cached tweets for user ${userId}`);
      return new Observable(observer => {
        observer.next(cached.data);
        observer.complete();
      });
    }

    const endpoint = `/users/${userId}/tweets`;
    const url = `${this.API_BASE_URL}${endpoint}`;

    // Build query parameters with defaults
    let params = new HttpParams();

    // Max results (default 10, max 100)
    params = params.set('max_results', Math.min(options.maxResults || 10, 100).toString());

    // Tweet fields
    const tweetFields = options.tweetFields || [
      'id', 'text', 'created_at', 'author_id', 'public_metrics',
      'context_annotations', 'entities', 'referenced_tweets'
    ];
    params = params.set('tweet.fields', tweetFields.join(','));

    // Expansions
    const expansions = options.expansions || ['author_id', 'referenced_tweets.id'];
    params = params.set('expansions', expansions.join(','));

    // User fields for expanded users
    if (options.userFields) {
      params = params.set('user.fields', options.userFields.join(','));
    }

    // Media fields for expanded media
    if (options.mediaFields) {
      params = params.set('media.fields', options.mediaFields.join(','));
    }

    // Time-based filtering
    if (options.startTime) params = params.set('start_time', options.startTime);
    if (options.endTime) params = params.set('end_time', options.endTime);
    if (options.sinceId) params = params.set('since_id', options.sinceId);
    if (options.untilId) params = params.set('until_id', options.untilId);
    if (options.paginationToken) params = params.set('pagination_token', options.paginationToken);

    // Exclusions
    if (options.exclude && options.exclude.length > 0) {
      params = params.set('exclude', options.exclude.join(','));
    }

    const headers = this.createAuthHeaders();

    this.updateState({ loading: true, error: null });

    return this.http.get<XApiResponse<XApiTweet[]>>(url, {
      headers,
      params,
      observe: 'response'
    }).pipe(
      tap(response => this.updateRateLimits(endpoint, response.headers)),
      map(response => {
        const body = response.body;
        const result = {
          tweets: body?.data || [],
          includes: body?.includes,
          meta: body?.meta
        };

        // Cache successful response
        this.setCache(cacheKey, result);

        return result;
      }),
      tap(() => {
        this.updateState({
          loading: false,
          lastRequest: new Date(),
          requestCount: this.state().requestCount + 1
        });
      }),
      retry({
        count: 2,
        delay: (error, retryCount) => this.getRetryDelay(error, retryCount)
      }),
      catchError(error => this.handleError(error, `getUserTweets(${userId})`)),
      finalize(() => this.updateState({ loading: false }))
    );
  }

  /**
   * Get rate limit information for specific endpoint
   */
  getRateLimitInfo(endpoint: string): RateLimitInfo | null {
    return this.state().rateLimits.get(endpoint) || null;
  }

  /**
   * Get all current rate limits
   */
  getAllRateLimits(): Map<string, RateLimitInfo> {
    return new Map(this.state().rateLimits);
  }

  /**
   * Clear response cache
   */
  clearCache(): void {
    this.responseCache.clear();
    console.log('🗑️ Response cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const now = Date.now();
    const entries = Array.from(this.responseCache.entries());
    const active = entries.filter(([_, entry]) => entry.expiresAt > now);
    const expired = entries.length - active.length;

    return {
      total: entries.length,
      active: active.length,
      expired,
      size: JSON.stringify(Object.fromEntries(this.responseCache)).length
    };
  }

  // Private helper methods

  private isAuthenticated(): boolean {
    return this.bearerToken !== null && this.state().authenticated;
  }

  private createAuthHeaders(): HttpHeaders {
    if (!this.bearerToken) {
      throw new Error('Bearer token not available');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${this.bearerToken}`,
      'Content-Type': 'application/json'
    });
  }

  private updateRateLimits(endpoint: string, headers: any): void {
    const limit = headers.get('x-rate-limit-limit');
    const remaining = headers.get('x-rate-limit-remaining');
    const reset = headers.get('x-rate-limit-reset');

    if (limit && remaining && reset) {
      const resetTimestamp = parseInt(reset) * 1000; // Convert to milliseconds
      const rateLimitInfo: RateLimitInfo = {
        limit: parseInt(limit),
        remaining: parseInt(remaining),
        reset: parseInt(reset),
        resetDate: new Date(resetTimestamp),
        windowStart: new Date(resetTimestamp - (15 * 60 * 1000)) // 15 minutes before reset
      };

      const currentState = this.state();
      const newRateLimits = new Map(currentState.rateLimits);
      newRateLimits.set(endpoint, rateLimitInfo);

      this.updateState({ rateLimits: newRateLimits });

      console.log(`📊 Rate limit updated for ${endpoint}: ${remaining}/${limit} remaining`);
    }
  }

  private getRetryDelay(error: any, retryCount: number): Observable<any> {
    // Rate limit exceeded - wait until reset time
    if (error.status === 429) {
      const resetTime = error.headers?.get('x-rate-limit-reset');
      if (resetTime) {
        const resetDate = new Date(parseInt(resetTime) * 1000);
        const delay = resetDate.getTime() - Date.now();
        console.log(`⏱️ Rate limited. Waiting ${Math.round(delay / 1000)}s until reset`);
        return timer(Math.max(delay, 1000)); // Wait at least 1 second
      }
    }

    // Exponential backoff for other errors
    const delayMs = Math.min(1000 * Math.pow(2, retryCount), 30000); // Max 30 seconds
    console.log(`🔄 Retrying in ${delayMs}ms (attempt ${retryCount + 1})`);
    return timer(delayMs);
  }

  private handleError(error: HttpErrorResponse, context: string): Observable<never> {
    let errorMessage = `X API error in ${context}`;

    if (error.status === 401) {
      errorMessage = 'Authentication failed. Check Bearer Token.';
    } else if (error.status === 403) {
      errorMessage = 'Access forbidden. Check permissions or account status.';
    } else if (error.status === 404) {
      errorMessage = 'Resource not found.';
    } else if (error.status === 429) {
      errorMessage = 'Rate limit exceeded. Try again later.';
    } else if (error.error?.errors) {
      errorMessage = error.error.errors.map((e: any) => e.detail).join('; ');
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error(`❌ ${errorMessage}`, error);

    this.updateState({
      error: errorMessage,
      loading: false
    });

    return throwError(() => new Error(errorMessage));
  }

  private getFromCache(key: string): { data: any; timestamp: number; expiresAt: number } | null {
    const cached = this.responseCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached;
    }

    // Remove expired entry
    if (cached) {
      this.responseCache.delete(key);
    }

    return null;
  }

  private setCache(key: string, data: any): void {
    const now = Date.now();
    this.responseCache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + this.CACHE_DURATION
    });
  }

  private updateState(updates: Partial<XApiServiceState>): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({ ...currentState, ...updates });
  }
}