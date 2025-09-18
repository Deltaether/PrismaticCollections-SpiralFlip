import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

import { XApiCoreService } from './x-api-core.service';
import { XApiConfigService } from './x-api-config.service';
import { XApiErrorService } from './x-api-error.service';
import {
  XApiUser,
  XApiTweet,
  UserTweetsResponse,
  UserFields,
  TweetFields,
  Expansions,
  TweetExcludes
} from './interfaces/x-api.interfaces';

/**
 * X API High-Level Service
 *
 * Main service interface for X API V2 integration that provides
 * simplified methods for common operations while handling all
 * complexity internally.
 *
 * Features:
 * - Simplified API for common operations
 * - Automatic error handling and user feedback
 * - Built-in caching and rate limiting
 * - Reactive state management
 * - Configuration-aware operation
 *
 * Usage Example:
 * ```typescript
 * // Initialize
 * xApiService.initialize(bearerToken);
 *
 * // Get user profile
 * xApiService.getUserProfile('username').subscribe(user => {
 *   console.log(user);
 * });
 *
 * // Get user tweets
 * xApiService.getUserTweets('username', { maxResults: 10 }).subscribe(result => {
 *   console.log(result.tweets);
 * });
 * ```
 */

export interface UserProfileOptions {
  /** Additional user fields to include */
  includeMetrics?: boolean;
  /** Include user's pinned tweet */
  includePinnedTweet?: boolean;
  /** Include user verification info */
  includeVerification?: boolean;
}

export interface UserTweetsOptions {
  /** Maximum number of tweets to retrieve (1-100) */
  maxResults?: number;
  /** Include tweet metrics */
  includeMetrics?: boolean;
  /** Include media attachments */
  includeMedia?: boolean;
  /** Include referenced tweets (replies, retweets, quotes) */
  includeReferencedTweets?: boolean;
  /** Exclude retweets or replies */
  exclude?: TweetExcludes[];
  /** Only tweets after this date */
  startTime?: Date;
  /** Only tweets before this date */
  endTime?: Date;
  /** Pagination token for next page */
  paginationToken?: string;
}

export interface ServiceStatus {
  initialized: boolean;
  authenticated: boolean;
  loading: boolean;
  error: string | null;
  rateLimitStatus: 'normal' | 'warning' | 'critical';
  lastActivity: Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class XApiService {
  private readonly coreService = inject(XApiCoreService);
  private readonly configService = inject(XApiConfigService);
  private readonly errorService = inject(XApiErrorService);

  // Reactive service status
  private statusSignal = signal<ServiceStatus>({
    initialized: false,
    authenticated: false,
    loading: false,
    error: null,
    rateLimitStatus: 'normal',
    lastActivity: null
  });

  readonly status = this.statusSignal.asReadonly();
  readonly serviceReady = computed(() =>
    this.status().initialized && this.status().authenticated && !this.status().error
  );

  // Convenience computed properties
  readonly isLoading = computed(() => this.status().loading);
  readonly hasError = computed(() => !!this.status().error);
  readonly rateLimitStatus = computed(() => this.status().rateLimitStatus);

  constructor() {
    // Monitor core service state changes
    this.setupStateMonitoring();
    console.log('🐦 X API Service initialized');
  }

  /**
   * Initialize the X API service with Bearer Token
   *
   * @param bearerToken - OAuth 2.0 Bearer Token
   * @param options - Optional configuration overrides
   */
  initialize(bearerToken: string, options?: {
    enableLogging?: boolean;
    environment?: 'development' | 'staging' | 'production';
  }): void {
    try {
      // Configure the service
      this.configService.configureFromEnvironment({
        environment: options?.environment || 'development',
        bearerToken,
        enableLogging: options?.enableLogging
      });

      // Initialize core service
      this.coreService.initialize(bearerToken);

      this.updateStatus({
        initialized: true,
        authenticated: true,
        error: null
      });

      if (this.configService.isLoggingEnabled()) {
        console.log('✅ X API Service ready for use');
      }

    } catch (error: any) {
      this.updateStatus({
        initialized: false,
        authenticated: false,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get user profile by username
   *
   * @param username - Username without @ symbol
   * @param options - Additional options for user data
   * @returns Observable with user profile data
   */
  getUserProfile(
    username: string,
    options: UserProfileOptions = {}
  ): Observable<XApiUser | null> {
    if (!this.isReady()) {
      return this.handleNotReady('getUserProfile');
    }

    this.updateStatus({ loading: true, error: null });

    // Build user fields based on options
    const userFields: UserFields[] = [
      'id', 'name', 'username', 'description', 'profile_image_url',
      'verified', 'verified_type', 'created_at', 'location', 'url'
    ];

    if (options.includeMetrics) {
      userFields.push('public_metrics');
    }

    if (options.includePinnedTweet) {
      userFields.push('pinned_tweet_id');
    }

    return this.coreService.getUserByUsername(username, userFields).pipe(
      map(user => {
        this.updateStatus({
          loading: false,
          lastActivity: new Date()
        });
        return user;
      }),
      catchError(error => this.handleError(error, 'getUserProfile'))
    );
  }

  /**
   * Get user tweets by username
   *
   * @param username - Username without @ symbol
   * @param options - Options for tweet retrieval
   * @returns Observable with tweets and metadata
   */
  getUserTweets(
    username: string,
    options: UserTweetsOptions = {}
  ): Observable<UserTweetsResponse> {
    if (!this.isReady()) {
      return this.handleNotReady('getUserTweets');
    }

    this.updateStatus({ loading: true, error: null });

    // First get user to obtain ID
    return this.coreService.getUserByUsername(username, ['id']).pipe(
      switchMap(user => {
        if (!user) {
          throw new Error(`User @${username} not found`);
        }

        // Build request parameters
        const tweetFields: TweetFields[] = [
          'id', 'text', 'created_at', 'author_id'
        ];

        const expansions: Expansions[] = ['author_id'];

        if (options.includeMetrics) {
          tweetFields.push('public_metrics');
        }

        if (options.includeMedia) {
          tweetFields.push('attachments');
          expansions.push('attachments.media_keys');
        }

        if (options.includeReferencedTweets) {
          tweetFields.push('referenced_tweets');
          expansions.push('referenced_tweets.id');
        }

        // Convert dates to ISO strings
        const startTime = options.startTime?.toISOString();
        const endTime = options.endTime?.toISOString();

        return this.coreService.getUserTweets(user.id, {
          maxResults: options.maxResults || 10,
          tweetFields,
          expansions,
          exclude: options.exclude,
          startTime,
          endTime,
          paginationToken: options.paginationToken
        });
      }),
      map(result => {
        this.updateStatus({
          loading: false,
          lastActivity: new Date()
        });
        return result;
      }),
      catchError(error => this.handleError(error, 'getUserTweets'))
    );
  }

  /**
   * Get tweets for a specific project account
   * Convenience method for project-specific accounts
   *
   * @param projectUsername - Project username (e.g., 'prismcollect_')
   * @param maxTweets - Maximum number of tweets to retrieve
   * @returns Observable with tweet data
   */
  getProjectTweets(
    projectUsername: string,
    maxTweets: number = 5
  ): Observable<UserTweetsResponse> {
    return this.getUserTweets(projectUsername, {
      maxResults: maxTweets,
      includeMetrics: true,
      includeMedia: true,
      exclude: ['retweets'] // Usually want original content for projects
    });
  }

  /**
   * Search for specific content in user tweets
   * Note: This is a client-side filter since X API V2 search requires different endpoints
   *
   * @param username - Username to search in
   * @param searchTerm - Term to search for
   * @param maxTweets - Maximum tweets to search through
   * @returns Observable with matching tweets
   */
  searchUserTweets(
    username: string,
    searchTerm: string,
    maxTweets: number = 50
  ): Observable<XApiTweet[]> {
    return this.getUserTweets(username, { maxResults: maxTweets }).pipe(
      map(result => {
        const searchLower = searchTerm.toLowerCase();
        return result.tweets.filter(tweet =>
          tweet.text.toLowerCase().includes(searchLower)
        );
      })
    );
  }

  /**
   * Get rate limit status for common endpoints
   */
  getRateLimitStatus(): Observable<{
    userLookup: { remaining: number; resetTime: Date } | null;
    userTweets: { remaining: number; resetTime: Date } | null;
    overall: 'normal' | 'warning' | 'critical';
  }> {
    const rateLimits = this.coreService.getAllRateLimits();

    const userLookupLimit = rateLimits.get('/users/by/username/{username}');
    const userTweetsLimit = rateLimits.get('/users/{id}/tweets');

    // Determine overall status
    let overall: 'normal' | 'warning' | 'critical' = 'normal';

    const limits = [userLookupLimit, userTweetsLimit].filter(Boolean);
    if (limits.length > 0) {
      const minPercentage = Math.min(...limits.map(limit =>
        limit!.remaining / limit!.limit
      ));

      if (minPercentage <= 0.1) {
        overall = 'critical';
      } else if (minPercentage <= 0.2) {
        overall = 'warning';
      }
    }

    return of({
      userLookup: userLookupLimit ? {
        remaining: userLookupLimit.remaining,
        resetTime: userLookupLimit.resetDate
      } : null,
      userTweets: userTweetsLimit ? {
        remaining: userTweetsLimit.remaining,
        resetTime: userTweetsLimit.resetDate
      } : null,
      overall
    });
  }

  /**
   * Clear all caches and reset service state
   */
  clearCache(): void {
    this.coreService.clearCache();
    this.errorService.clearErrorLog();

    if (this.configService.isLoggingEnabled()) {
      console.log('🗑️ X API Service cache cleared');
    }
  }

  /**
   * Get service statistics and health information
   */
  getServiceStats() {
    return combineLatest([
      of(this.coreService.getCacheStats()),
      of(this.errorService.errorStats()),
      this.getRateLimitStatus()
    ]).pipe(
      map(([cacheStats, errorStats, rateLimitStatus]) => ({
        cache: cacheStats,
        errors: errorStats,
        rateLimits: rateLimitStatus,
        requestCount: this.coreService.requestCount(),
        uptime: this.status().lastActivity ?
          Date.now() - this.status().lastActivity!.getTime() :
          null
      }))
    );
  }

  /**
   * Update configuration at runtime
   */
  updateConfig(updates: {
    enableLogging?: boolean;
    cacheDuration?: number;
    rateLimitWarningThreshold?: number;
  }): void {
    if (updates.enableLogging !== undefined) {
      this.configService.setLogging(updates.enableLogging);
    }

    if (updates.cacheDuration !== undefined) {
      this.configService.updateConfiguration({
        cacheDuration: updates.cacheDuration
      });
    }

    if (updates.rateLimitWarningThreshold !== undefined) {
      this.configService.updateRateLimiting({
        warningThreshold: updates.rateLimitWarningThreshold
      });
    }
  }

  // Private helper methods

  private setupStateMonitoring(): void {
    // Monitor core service state and update our status
    // This would typically use effect() or similar in a real app
    setInterval(() => {
      const coreState = this.coreService.state();
      const configValidation = this.configService.validation();

      this.updateStatus({
        initialized: coreState.initialized,
        authenticated: coreState.authenticated,
        loading: coreState.loading,
        error: coreState.error || (!configValidation.isValid ? configValidation.errors[0] : null)
      });
    }, 1000);
  }

  private updateStatus(updates: Partial<ServiceStatus>): void {
    const current = this.statusSignal();
    this.statusSignal.set({ ...current, ...updates });
  }

  private isReady(): boolean {
    return this.status().initialized &&
           this.status().authenticated &&
           !this.status().error;
  }

  private handleNotReady(operation: string): Observable<any> {
    const error = new Error(
      `X API Service not ready for operation: ${operation}. Call initialize() first.`
    );

    this.updateStatus({ error: error.message });

    console.error('❌', error.message);
    return this.errorService.handleError(error, { endpoint: operation, method: 'GET' });
  }

  private handleError(error: any, operation: string): Observable<never> {
    this.updateStatus({
      loading: false,
      error: this.errorService.getUserMessage(error)
    });

    return this.errorService.handleError(error, { endpoint: operation, method: 'GET' });
  }
}