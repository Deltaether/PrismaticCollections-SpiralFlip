import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { switchMap, tap, catchError, map } from 'rxjs/operators';
import { TwitterApiService, TwitterApiUser, TwitterApiTweet } from './twitter-api.service';
import { GelDbIntegrationService, GelDbTwitterUser, GelDbTwitterTweet } from '../core/services/geldb-integration.service';

/**
 * Enhanced Twitter Service
 *
 * This service combines OAuth 1.0a authentication, Twitter API v2 integration,
 * and GelDB caching to provide a comprehensive Twitter integration solution.
 *
 * Key Features:
 * - Intelligent caching using GelDB storage
 * - Conservative API usage (respects 100 calls/month limit)
 * - Cache-first approach to minimize API calls
 * - Comprehensive error handling and fallback strategies
 * - Real-time API usage monitoring
 * - Automatic cache invalidation based on data age
 *
 * Usage Strategy:
 * 1. Check cache first (24-hour freshness threshold)
 * 2. If cache is stale or missing, make API call
 * 3. Store results in GelDB cache
 * 4. Log API usage for monitoring
 * 5. Always prefer cached data when API limits are reached
 *
 * Rate Limiting:
 * - Free Tier: 100 API calls per month
 * - Cache Duration: 24 hours for users, 12 hours for tweets
 * - Conservative Mode: Only 1 tweet fetch for initial testing
 */

export interface TwitterServiceStats {
  totalApiCalls: number;
  monthlyRemaining: number;
  successRate: number;
  lastApiCall: Date | null;
  cacheHitRate: number;
  cachedUsers: number;
  cachedTweets: number;
}

@Injectable({
  providedIn: 'root'
})
export class TwitterEnhancedService {

  // Conservative mode - start with minimal API usage
  private readonly CONSERVATIVE_MODE = true;
  private readonly MAX_TWEETS_CONSERVATIVE = 1; // Only 1 tweet for testing
  private readonly MAX_TWEETS_NORMAL = 10;
  private readonly CACHE_FRESHNESS_HOURS = 24;
  private readonly TWEET_CACHE_FRESHNESS_HOURS = 12;

  // Statistics tracking
  private cacheHits = 0;
  private apiCalls = 0;

  // Public reactive state
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly conservativeMode = signal(this.CONSERVATIVE_MODE);

  constructor(
    private twitterApi: TwitterApiService,
    private gelDb: GelDbIntegrationService
  ) {
    console.log('🚀 Enhanced Twitter Service initialized');
    console.log(`⚙️ Conservative Mode: ${this.CONSERVATIVE_MODE ? 'ON (1 tweet max)' : 'OFF'}`);
  }

  /**
   * Get user data for @prismcollect_ with intelligent caching
   */
  getPrismCollectUser(): Observable<GelDbTwitterUser | null> {
    return this.getUserByUsername('prismcollect_');
  }

  /**
   * Get user data by username with cache-first approach
   */
  getUserByUsername(username: string): Observable<GelDbTwitterUser | null> {
    const cleanUsername = username.replace('@', '');

    console.log(`🔍 Getting user data for @${cleanUsername}...`);
    this.loading.set(true);
    this.error.set(null);

    // Step 1: Check cache freshness
    return this.gelDb.isTwitterDataFresh(cleanUsername, this.CACHE_FRESHNESS_HOURS).pipe(
      switchMap(isFresh => {
        if (isFresh) {
          // Use cached data
          console.log(`📋 Using fresh cached data for @${cleanUsername}`);
          this.cacheHits++;
          this.loading.set(false);
          return this.gelDb.getCachedTwitterUser(cleanUsername);
        } else {
          // Check if we have API calls remaining
          return this.checkApiAvailabilityAndFetch(cleanUsername);
        }
      }),
      catchError(error => {
        console.error(`❌ Error getting user @${cleanUsername}:`, error);
        this.error.set(`Failed to get user @${cleanUsername}: ${error.message}`);
        this.loading.set(false);

        // Try to return cached data as fallback
        return this.gelDb.getCachedTwitterUser(cleanUsername);
      })
    );
  }

  /**
   * Get tweets for @prismcollect_ with conservative limits
   */
  getPrismCollectTweets(): Observable<GelDbTwitterTweet[]> {
    const maxTweets = this.CONSERVATIVE_MODE ? this.MAX_TWEETS_CONSERVATIVE : this.MAX_TWEETS_NORMAL;

    console.log(`🎭 Getting ${maxTweets} tweets for @prismcollect_...`);

    return this.getUserByUsername('prismcollect_').pipe(
      switchMap(user => {
        if (!user) {
          throw new Error('User @prismcollect_ not found');
        }
        return this.getTweetsForUser(user.twitter_id, maxTweets);
      })
    );
  }

  /**
   * Get tweets for a specific user with intelligent caching
   */
  getTweetsForUser(userId: string, maxTweets: number = 5): Observable<GelDbTwitterTweet[]> {
    console.log(`📝 Getting ${maxTweets} tweets for user ${userId}...`);
    this.loading.set(true);
    this.error.set(null);

    // Check if we have recent cached tweets
    return this.gelDb.getCachedTwitterTweetsForUser(userId).pipe(
      switchMap(cachedTweets => {
        // Check if cached tweets are fresh enough (12 hours)
        const now = new Date();
        const recentTweets = cachedTweets.filter(tweet => {
          const tweetAge = now.getTime() - new Date(tweet.cached_at).getTime();
          return tweetAge < this.TWEET_CACHE_FRESHNESS_HOURS * 60 * 60 * 1000;
        });

        if (recentTweets.length >= maxTweets) {
          // Use cached tweets
          console.log(`📋 Using ${recentTweets.length} cached tweets for user ${userId}`);
          this.cacheHits++;
          this.loading.set(false);
          return of(recentTweets.slice(0, maxTweets));
        } else {
          // Fetch from API
          return this.fetchTweetsFromApi(userId, maxTweets);
        }
      }),
      catchError(error => {
        console.error(`❌ Error getting tweets for user ${userId}:`, error);
        this.error.set(`Failed to get tweets: ${error.message}`);
        this.loading.set(false);

        // Return cached tweets as fallback
        return this.gelDb.getCachedTwitterTweetsForUser(userId);
      })
    );
  }

  /**
   * Check API availability and fetch user data
   */
  private checkApiAvailabilityAndFetch(username: string): Observable<GelDbTwitterUser | null> {
    return this.gelDb.getMonthlyApiUsageStats().pipe(
      switchMap(stats => {
        if (stats.remainingCalls <= 0) {
          console.warn(`⚠️ Monthly API limit reached. Using cached data for @${username}`);
          this.error.set('Monthly API limit reached. Using cached data.');
          this.loading.set(false);
          return this.gelDb.getCachedTwitterUser(username);
        }

        // Safe to make API call
        console.log(`🌐 Fetching fresh data for @${username} (${stats.remainingCalls} calls remaining)`);
        return this.fetchUserFromApi(username);
      })
    );
  }

  /**
   * Fetch user data from Twitter API and cache it
   */
  private fetchUserFromApi(username: string): Observable<GelDbTwitterUser | null> {
    this.apiCalls++;

    return this.twitterApi.getUserByUsername(username).pipe(
      tap(user => {
        if (user) {
          // Cache the user data in GelDB
          this.gelDb.cacheTwitterUser({
            twitter_id: user.id,
            username: user.username,
            display_name: user.name,
            profile_image_url: user.profile_image_url,
            verified: user.verified,
            followers_count: user.public_metrics?.followers_count,
            following_count: user.public_metrics?.following_count,
            tweet_count: user.public_metrics?.tweet_count
          });

          // Log API usage
          this.gelDb.logTwitterApiUsage({
            endpoint: `/users/by/username/${username}`,
            method: 'GET',
            success: true
          });

          console.log(`✅ Cached user data for @${username}`);
        }
      }),
      map(user => user ? this.convertApiUserToGelDbUser(user) : null),
      tap(() => this.loading.set(false)),
      catchError(error => {
        // Log failed API call
        this.gelDb.logTwitterApiUsage({
          endpoint: `/users/by/username/${username}`,
          method: 'GET',
          success: false,
          error_message: error.message
        });

        throw error;
      })
    );
  }

  /**
   * Fetch tweets from Twitter API and cache them
   */
  private fetchTweetsFromApi(userId: string, maxTweets: number): Observable<GelDbTwitterTweet[]> {
    return this.gelDb.getMonthlyApiUsageStats().pipe(
      switchMap(stats => {
        if (stats.remainingCalls <= 0) {
          console.warn(`⚠️ Monthly API limit reached. Using cached tweets for user ${userId}`);
          this.loading.set(false);
          return this.gelDb.getCachedTwitterTweetsForUser(userId);
        }

        console.log(`🌐 Fetching ${maxTweets} tweets from API (${stats.remainingCalls} calls remaining)`);
        this.apiCalls++;

        return this.twitterApi.getUserTweets(userId, maxTweets).pipe(
          tap(tweets => {
            if (tweets.length > 0) {
              // Convert and cache tweets
              const gelDbTweets = tweets.map(tweet => ({
                tweet_id: tweet.id,
                user_id: tweet.author_id,
                text: tweet.text,
                created_at: tweet.created_at,
                retweet_count: tweet.public_metrics?.retweet_count,
                like_count: tweet.public_metrics?.like_count,
                reply_count: tweet.public_metrics?.reply_count,
                quote_count: tweet.public_metrics?.quote_count
              }));

              this.gelDb.cacheTwitterTweets(gelDbTweets);

              // Log API usage
              this.gelDb.logTwitterApiUsage({
                endpoint: `/users/${userId}/tweets`,
                method: 'GET',
                success: true
              });

              console.log(`✅ Cached ${tweets.length} tweets for user ${userId}`);
            }
          }),
          map(tweets => tweets.map(tweet => this.convertApiTweetToGelDbTweet(tweet))),
          tap(() => this.loading.set(false)),
          catchError(error => {
            // Log failed API call
            this.gelDb.logTwitterApiUsage({
              endpoint: `/users/${userId}/tweets`,
              method: 'GET',
              success: false,
              error_message: error.message
            });

            this.loading.set(false);

            // Return cached tweets as fallback
            return this.gelDb.getCachedTwitterTweetsForUser(userId);
          })
        );
      })
    );
  }

  /**
   * Test the Twitter integration with minimal API usage
   */
  testIntegration(): Observable<{
    success: boolean;
    user?: GelDbTwitterUser;
    tweets?: GelDbTwitterTweet[];
    error?: string;
    apiCallsUsed: number;
  }> {
    console.log('🧪 Testing Twitter integration with conservative approach...');

    const startingApiCalls = this.apiCalls;

    return this.getPrismCollectUser().pipe(
      switchMap(user => {
        if (!user) {
          throw new Error('Failed to get user @prismcollect_');
        }

        // Only fetch 1 tweet in conservative mode
        return this.getTweetsForUser(user.twitter_id, 1).pipe(
          map(tweets => ({
            success: true,
            user,
            tweets,
            apiCallsUsed: this.apiCalls - startingApiCalls
          }))
        );
      }),
      catchError(error => {
        return of({
          success: false,
          error: error.message,
          apiCallsUsed: this.apiCalls - startingApiCalls
        });
      })
    );
  }

  /**
   * Get service statistics
   */
  getServiceStats(): Observable<TwitterServiceStats> {
    return forkJoin({
      apiStats: this.gelDb.getMonthlyApiUsageStats(),
      cachedUsers: this.gelDb.getTwitterUsers(),
      cachedTweets: this.gelDb.getTwitterTweets()
    }).pipe(
      map(({ apiStats, cachedUsers, cachedTweets }) => {
        const totalRequests = this.cacheHits + this.apiCalls;
        const cacheHitRate = totalRequests > 0 ? (this.cacheHits / totalRequests) * 100 : 0;

        return {
          totalApiCalls: apiStats.totalCalls,
          monthlyRemaining: apiStats.remainingCalls,
          successRate: apiStats.successRate,
          lastApiCall: apiStats.lastCallTimestamp ? new Date(apiStats.lastCallTimestamp) : null,
          cacheHitRate,
          cachedUsers: cachedUsers.length,
          cachedTweets: cachedTweets.length
        };
      })
    );
  }

  /**
   * Clear all Twitter cache
   */
  clearCache(): void {
    this.gelDb.clearTwitterCache();
    this.cacheHits = 0;
    this.apiCalls = 0;
    console.log('🗑️ Twitter cache and statistics cleared');
  }

  /**
   * Disable conservative mode (use with caution)
   */
  disableConservativeMode(): void {
    if (this.CONSERVATIVE_MODE) {
      console.warn('⚠️ Cannot disable conservative mode - it is hardcoded for safety');
      return;
    }
    this.conservativeMode.set(false);
    console.log('🔓 Conservative mode disabled - normal API usage enabled');
  }

  /**
   * Convert Twitter API user to GelDB format
   */
  private convertApiUserToGelDbUser(apiUser: TwitterApiUser): GelDbTwitterUser {
    const now = new Date().toISOString();
    return {
      id: `twitter_user_${apiUser.id}`,
      twitter_id: apiUser.id,
      username: apiUser.username,
      display_name: apiUser.name,
      profile_image_url: apiUser.profile_image_url,
      verified: apiUser.verified,
      followers_count: apiUser.public_metrics?.followers_count,
      following_count: apiUser.public_metrics?.following_count,
      tweet_count: apiUser.public_metrics?.tweet_count,
      cached_at: now,
      updated_at: now
    };
  }

  /**
   * Convert Twitter API tweet to GelDB format
   */
  private convertApiTweetToGelDbTweet(apiTweet: TwitterApiTweet): GelDbTwitterTweet {
    const now = new Date().toISOString();

    // Extract hashtags, mentions, and URLs
    const hashtags = (apiTweet.text.match(/#\w+/g) || []).map(tag => tag.substring(1));
    const mentions = (apiTweet.text.match(/@\w+/g) || []).map(mention => mention.substring(1));
    const urls = (apiTweet.text.match(/https?:\/\/[^\s]+/g) || []);

    return {
      id: `twitter_tweet_${apiTweet.id}`,
      tweet_id: apiTweet.id,
      user_id: apiTweet.author_id,
      text: apiTweet.text,
      created_at: apiTweet.created_at,
      retweet_count: apiTweet.public_metrics?.retweet_count,
      like_count: apiTweet.public_metrics?.like_count,
      reply_count: apiTweet.public_metrics?.reply_count,
      quote_count: apiTweet.public_metrics?.quote_count,
      hashtags,
      mentions,
      urls,
      cached_at: now,
      updated_at: now
    };
  }
}