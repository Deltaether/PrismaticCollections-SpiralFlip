import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, timer, EMPTY, of } from 'rxjs';
import { catchError, retry, tap, map, switchMap, takeUntil, shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ProfileImageService } from './profile-image.service';

// Tweet interfaces
export interface Tweet {
  tweetId: string;
  text: string;
  authorUsername: string;
  authorDisplayName: string;
  authorProfileImageUrl?: string;
  authorVerified: boolean;
  createdAt: Date;
  scrapedAt: Date;
  updatedAt?: Date;

  // Engagement metrics
  likeCount: number;
  retweetCount: number;
  replyCount: number;
  quoteCount: number;

  // Tweet metadata
  language?: string;
  isRetweet: boolean;
  isQuote: boolean;
  isReply: boolean;
  conversationId?: string;
  inReplyToUserId?: string;
  inReplyToTweetId?: string;

  // Media and content
  mediaUrls: string[];
  mediaTypes: string[];
  hashtags: string[];
  mentions: string[];
  urls: string[];

  // Source tweet for retweets/quotes
  sourceTweetId?: string;
  sourceTweetText?: string;
  sourceAuthorUsername?: string;
}

export interface TwitterUser {
  userId: string;
  username: string;
  displayName: string;
  description?: string;
  profileImageUrl?: string;
  bannerImageUrl?: string;
  verified: boolean;
  followersCount: number;
  followingCount: number;
  tweetCount: number;
  createdAt: Date;
  scrapedAt: Date;
  updatedAt?: Date;
  location?: string;
  website?: string;
}

export interface TweetResponse {
  data: Tweet[];
  meta: {
    resultCount: number;
    totalCount: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface ScraperStatus {
  isRunning: boolean;
  lastScrapedAt?: Date;
  totalTweetsStored: number;
  currentSession?: any;
  consecutiveFailures: number;
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}

export interface TweetFilters {
  includeRetweets: boolean;
  includeReplies: boolean;
  searchTerm?: string;
  hashtags?: string[];
  mediaOnly: boolean;
  sortBy: 'newest' | 'oldest' | 'engagement';
  startDate?: Date;
  endDate?: Date;
}

export interface LoadingState {
  isLoading: boolean;
  operation?: 'initial' | 'refresh' | 'loadMore' | 'search';
  progress?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TwitterDataService {
  private readonly http = inject(HttpClient);
  private readonly profileImageService = inject(ProfileImageService);
  private readonly apiUrl = `${environment.api.baseUrl}/twitter`;

  // Reactive state using signals
  private readonly _tweets = signal<Tweet[]>([]);
  private readonly _user = signal<TwitterUser | null>(null);
  private readonly _scraperStatus = signal<ScraperStatus>({
    isRunning: false,
    totalTweetsStored: 0,
    consecutiveFailures: 0
  });
  private readonly _filters = signal<TweetFilters>({
    includeRetweets: true,
    includeReplies: true,
    mediaOnly: false,
    sortBy: 'newest'
  });
  private readonly _loadingState = signal<LoadingState>({ isLoading: false });
  private readonly _error = signal<string | null>(null);
  private readonly _hasMoreTweets = signal<boolean>(true);
  private readonly _currentPage = signal<number>(0);
  private readonly _pageSize = signal<number>(20);
  private readonly _totalCount = signal<number>(0);

  // Public readonly signals
  readonly tweets = this._tweets.asReadonly();
  readonly user = this._user.asReadonly();
  readonly scraperStatus = this._scraperStatus.asReadonly();
  readonly filters = this._filters.asReadonly();
  readonly loadingState = this._loadingState.asReadonly();
  readonly error = this._error.asReadonly();
  readonly hasMoreTweets = this._hasMoreTweets.asReadonly();

  // Computed pagination info
  readonly paginationInfo = computed((): PaginationInfo => ({
    currentPage: this._currentPage(),
    pageSize: this._pageSize(),
    totalCount: this._totalCount(),
    totalPages: Math.ceil(this._totalCount() / this._pageSize()),
    hasMore: this._hasMoreTweets()
  }));

  // Computed signals for derived state
  readonly filteredTweets = computed(() => {
    const tweets = this._tweets();
    const filters = this._filters();

    return tweets.filter(tweet => {
      // Apply filters
      if (!filters.includeRetweets && tweet.isRetweet) return false;
      if (!filters.includeReplies && tweet.isReply) return false;
      if (filters.mediaOnly && (!tweet.mediaUrls || tweet.mediaUrls.length === 0)) return false;

      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        if (!tweet.text.toLowerCase().includes(searchLower)) return false;
      }

      if (filters.hashtags && filters.hashtags.length > 0) {
        const hasHashtag = filters.hashtags.some(hashtag =>
          tweet.hashtags.some(tweetHashtag =>
            tweetHashtag.toLowerCase().includes(hashtag.toLowerCase())
          )
        );
        if (!hasHashtag) return false;
      }

      if (filters.startDate && new Date(tweet.createdAt) < filters.startDate) return false;
      if (filters.endDate && new Date(tweet.createdAt) > filters.endDate) return false;

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'engagement':
          const aEngagement = a.likeCount + a.retweetCount;
          const bEngagement = b.likeCount + b.retweetCount;
          return bEngagement - aEngagement;
        default:
          return 0;
      }
    });
  });

  readonly tweetStats = computed(() => {
    const tweets = this._tweets();
    return {
      total: tweets.length,
      retweets: tweets.filter(t => t.isRetweet).length,
      replies: tweets.filter(t => t.isReply).length,
      withMedia: tweets.filter(t => t.mediaUrls && t.mediaUrls.length > 0).length,
      totalEngagement: tweets.reduce((sum, t) =>
        sum + t.likeCount + t.retweetCount, 0
      )
    };
  });

  readonly isOnline = signal<boolean>(navigator.onLine);

  // Cache for performance
  private tweetCache = new Map<string, Tweet>();
  private lastFetchTime = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    // Monitor online status
    window.addEventListener('online', () => this.isOnline.set(true));
    window.addEventListener('offline', () => this.isOnline.set(false));

    // Initialize with cached data if available
    this.loadFromCache();

    // Set up periodic status polling and data loading based on feature flags
    if (environment.features.twitterDataEnabled) {
      this.startStatusPolling();
      // Initialize with real data from API
      this.initialize();
    } else {
      // For development without data service, load mock data
      this.loadMockData();
    }
  }

  /**
   * Initialize service with user data and initial tweets
   */
  async initialize(): Promise<void> {
    try {
      this._loadingState.set({ isLoading: true, operation: 'initial' });
      this._error.set(null);

      // Load user profile and initial tweets in parallel
      const [userResponse, tweetsResponse] = await Promise.all([
        this.fetchUserProfile().toPromise(),
        this.fetchTweets(0, 20).toPromise()
      ]);

      if (userResponse) {
        this._user.set(userResponse);
      }

      if (tweetsResponse) {
        const tweets = this.parseTweetDates(tweetsResponse.data);
        this._tweets.set(tweets);
        this._hasMoreTweets.set(tweetsResponse.meta.hasMore);
        this._totalCount.set(tweetsResponse.meta.totalCount);
        this.cacheToLocalStorage();

        // Preload profile images for better UX
        this.preloadProfileImages(tweets);
      }

    } catch (error) {
      this.handleError('Failed to initialize Twitter data', error);
    } finally {
      this._loadingState.set({ isLoading: false });
    }
  }

  /**
   * Refresh tweets from server
   */
  refreshTweets(): Observable<Tweet[]> {
    if (!this.isOnline()) {
      return of(this._tweets());
    }

    this._loadingState.set({ isLoading: true, operation: 'refresh' });
    this._error.set(null);
    this._currentPage.set(0);

    return this.fetchTweets(0, this._pageSize()).pipe(
      tap(response => {
        const tweets = this.parseTweetDates(response.data);
        this._tweets.set(tweets);
        this._hasMoreTweets.set(response.meta.hasMore);
        this._totalCount.set(response.meta.totalCount);
        this.cacheToLocalStorage();
        this._loadingState.set({ isLoading: false });

        // Preload profile images for new tweets
        this.preloadProfileImages(tweets);
      }),
      map(response => response.data),
      catchError(error => {
        this.handleError('Failed to refresh tweets', error);
        return of(this._tweets());
      })
    );
  }

  /**
   * Load more tweets (infinite scroll)
   */
  loadMoreTweets(): Observable<Tweet[]> {
    if (!this._hasMoreTweets() || this._loadingState().isLoading || !this.isOnline()) {
      return of([]);
    }

    const nextPage = this._currentPage() + 1;
    this._loadingState.set({ isLoading: true, operation: 'loadMore' });

    return this.fetchTweets(nextPage, 20).pipe(
      tap(response => {
        const currentTweets = this._tweets();
        const newTweets = this.parseTweetDates(response.data).filter(tweet =>
          !currentTweets.some(existing => existing.tweetId === tweet.tweetId)
        );

        this._tweets.set([...currentTweets, ...newTweets]);
        this._hasMoreTweets.set(response.meta.hasMore);
        this._currentPage.set(nextPage);
        this.cacheToLocalStorage();
        this._loadingState.set({ isLoading: false });

        // Preload profile images for new tweets
        this.preloadProfileImages(newTweets);
      }),
      map(response => response.data),
      catchError(error => {
        this.handleError('Failed to load more tweets', error);
        return of([]);
      })
    );
  }

  /**
   * Navigate to a specific page
   */
  goToPage(page: number, pageSize?: number): Observable<Tweet[]> {
    if (!this.isOnline()) {
      return of(this._tweets());
    }

    // Update page size if provided
    if (pageSize && pageSize !== this._pageSize()) {
      this._pageSize.set(pageSize);
    }

    this._loadingState.set({ isLoading: true, operation: 'refresh' });
    this._error.set(null);
    this._currentPage.set(page);

    return this.fetchTweets(page, this._pageSize()).pipe(
      tap(response => {
        const tweets = this.parseTweetDates(response.data);
        this._tweets.set(tweets); // Replace tweets instead of appending
        this._hasMoreTweets.set(response.meta.hasMore);
        this._totalCount.set(response.meta.totalCount);
        this.cacheToLocalStorage();
        this._loadingState.set({ isLoading: false });

        // Preload profile images for new tweets
        this.preloadProfileImages(tweets);
      }),
      map(response => response.data),
      catchError(error => {
        this.handleError('Failed to load page', error);
        return of([]);
      })
    );
  }

  /**
   * Update filters and trigger data refresh if needed
   */
  updateFilters(newFilters: Partial<TweetFilters>): void {
    const currentFilters = this._filters();
    const updatedFilters = { ...currentFilters, ...newFilters };
    this._filters.set(updatedFilters);

    // Save filters to localStorage
    localStorage.setItem('twitter-filters', JSON.stringify(updatedFilters));
  }

  /**
   * Search tweets by term
   */
  searchTweets(searchTerm: string): void {
    this.updateFilters({ searchTerm });
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this._filters.set({
      includeRetweets: true,
      includeReplies: true,
      mediaOnly: false,
      sortBy: 'newest'
    });
    localStorage.removeItem('twitter-filters');
  }

  /**
   * Get tweet by ID
   */
  getTweetById(id: string): Tweet | undefined {
    return this._tweets().find(tweet => tweet.tweetId === id) || this.tweetCache.get(id);
  }

  /**
   * Clear current error state
   */
  dismissError(): void {
    this._error.set(null);
  }


  // Private methods

  private fetchTweets(page: number, limit: number): Observable<TweetResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('username', 'prismcollect_')
      .set('includeRetweets', this._filters().includeRetweets.toString())
      .set('includeReplies', this._filters().includeReplies.toString());

    return this.http.get<TweetResponse>(`${this.apiUrl}/tweets`, { params }).pipe(
      retry({ count: 3, delay: (_, retryIndex) => timer(1000 * Math.pow(2, retryIndex)) }),
      shareReplay(1)
    );
  }

  private fetchUserProfile(): Observable<TwitterUser> {
    return this.http.get<{ data: TwitterUser }>(`${this.apiUrl}/user/prismcollect_`).pipe(
      map(response => response.data),
      retry({ count: 2, delay: 1000 }),
      shareReplay(1)
    );
  }

  private startStatusPolling(): void {
    // Poll scraper status every 30 seconds
    timer(0, 30000).pipe(
      switchMap(() => {
        if (!this.isOnline()) return EMPTY;
        return this.http.get<ScraperStatus>(`${this.apiUrl}/scraper/status`).pipe(
          catchError(() => EMPTY)
        );
      })
    ).subscribe(status => {
      this._scraperStatus.set(status);
    });
  }


  private parseTweetDates(tweets: any[]): Tweet[] {
    return tweets.map(tweet => ({
      ...tweet,
      createdAt: new Date(tweet.createdAt),
      scrapedAt: new Date(tweet.scrapedAt),
      updatedAt: tweet.updatedAt ? new Date(tweet.updatedAt) : undefined
    }));
  }

  private loadFromCache(): void {
    try {
      const cachedTweets = localStorage.getItem('twitter-tweets');
      const cachedUser = localStorage.getItem('twitter-user');
      const cachedFilters = localStorage.getItem('twitter-filters');
      const cachedTimestamp = localStorage.getItem('twitter-cache-timestamp');

      if (cachedTimestamp && Date.now() - parseInt(cachedTimestamp) < this.CACHE_DURATION) {
        if (cachedTweets) {
          const tweets = JSON.parse(cachedTweets);
          this._tweets.set(this.parseTweetDates(tweets));
          tweets.forEach((tweet: Tweet) => this.tweetCache.set(tweet.tweetId, tweet));
        }

        if (cachedUser) {
          const user = JSON.parse(cachedUser);
          this._user.set({
            ...user,
            createdAt: new Date(user.createdAt),
            scrapedAt: new Date(user.scrapedAt),
            updatedAt: user.updatedAt ? new Date(user.updatedAt) : undefined
          });
        }

        if (cachedFilters) {
          this._filters.set(JSON.parse(cachedFilters));
        }
      }
    } catch (error) {
      console.warn('Failed to load Twitter data from cache:', error);
    }
  }

  private cacheToLocalStorage(): void {
    try {
      localStorage.setItem('twitter-tweets', JSON.stringify(this._tweets()));
      localStorage.setItem('twitter-user', JSON.stringify(this._user()));
      localStorage.setItem('twitter-cache-timestamp', Date.now().toString());
    } catch (error) {
      console.warn('Failed to cache Twitter data:', error);
    }
  }

  /**
   * Load mock data for development/testing
   */
  private loadMockData(): void {
    console.log('Loading mock Twitter data for development...');

    // Mock user data
    const mockUser: TwitterUser = {
      userId: 'mock_user_123',
      username: 'prismcollect_',
      displayName: 'Prismatic Collections',
      description: 'Interactive digital experiences and music productions. Creating immersive worlds through code, sound, and visual art.',
      profileImageUrl: '/assets/images/artists/deltaether-avatar.svg',
      verified: false,
      followersCount: 2847,
      followingCount: 321,
      tweetCount: 51,
      createdAt: new Date('2020-03-15'),
      scrapedAt: new Date(),
      location: 'Digital Realm',
      website: 'https://prismaticcollections.com'
    };

    // Mock tweets data
    const mockTweets: Tweet[] = [
      {
        tweetId: 'mock_1',
        text: 'Just released a new interactive experience! Check out the latest updates to Project Phantasia with enhanced 3D environments and improved performance. The immersive audio design really brings the digital world to life 🎵✨',
        authorUsername: 'prismcollect_',
        authorDisplayName: 'Prismatic Collections',
        authorProfileImageUrl: '/assets/images/artists/deltaether-avatar.svg',
        authorVerified: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        scrapedAt: new Date(),
        likeCount: 47,
        retweetCount: 12,
        replyCount: 8,
        quoteCount: 3,
        language: 'en',
        isRetweet: false,
        isQuote: false,
        isReply: false,
        mediaUrls: [],
        mediaTypes: [],
        hashtags: ['phantasia', 'interactive', '3d', 'immersive'],
        mentions: [],
        urls: ['https://prismaticcollections.com/phantasia']
      },
      {
        tweetId: 'mock_2',
        text: 'Working on some new audio compositions tonight. The creative process behind digital soundscapes is fascinating - each layer tells a different part of the story 🎼',
        authorUsername: 'prismcollect_',
        authorDisplayName: 'Prismatic Collections',
        authorProfileImageUrl: '/assets/images/artists/deltaether-avatar.svg',
        authorVerified: false,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        scrapedAt: new Date(),
        likeCount: 23,
        retweetCount: 5,
        replyCount: 4,
        quoteCount: 1,
        language: 'en',
        isRetweet: false,
        isQuote: false,
        isReply: false,
        mediaUrls: [],
        mediaTypes: [],
        hashtags: ['audio', 'composition', 'music', 'digital'],
        mentions: [],
        urls: []
      },
      {
        tweetId: 'mock_3',
        text: 'Behind the scenes: Optimizing WebGL shaders for better performance across different devices. The challenge is maintaining visual quality while ensuring smooth 60fps on mobile 📱⚡',
        authorUsername: 'prismcollect_',
        authorDisplayName: 'Prismatic Collections',
        authorProfileImageUrl: '/assets/images/artists/deltaether-avatar.svg',
        authorVerified: false,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        scrapedAt: new Date(),
        likeCount: 31,
        retweetCount: 7,
        replyCount: 6,
        quoteCount: 2,
        language: 'en',
        isRetweet: false,
        isQuote: false,
        isReply: false,
        mediaUrls: [],
        mediaTypes: [],
        hashtags: ['webgl', 'performance', 'development', 'optimization'],
        mentions: [],
        urls: []
      },
      {
        tweetId: 'mock_4',
        text: 'The intersection of technology and art continues to amaze me. Every line of code is a brushstroke, every algorithm a creative decision. Building digital worlds is truly an art form 🎨',
        authorUsername: 'prismcollect_',
        authorDisplayName: 'Prismatic Collections',
        authorProfileImageUrl: '/assets/images/artists/deltaether-avatar.svg',
        authorVerified: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        scrapedAt: new Date(),
        likeCount: 89,
        retweetCount: 23,
        replyCount: 15,
        quoteCount: 8,
        language: 'en',
        isRetweet: false,
        isQuote: false,
        isReply: false,
        mediaUrls: [],
        mediaTypes: [],
        hashtags: ['technology', 'art', 'creativity', 'digital'],
        mentions: [],
        urls: []
      },
      {
        tweetId: 'mock_5',
        text: 'New blog post is live! "Creating Immersive Audio Experiences for Web Applications" - diving deep into spatial audio, Web Audio API, and the magic of 3D sound design 🔊',
        authorUsername: 'prismcollect_',
        authorDisplayName: 'Prismatic Collections',
        authorProfileImageUrl: '/assets/images/artists/deltaether-avatar.svg',
        authorVerified: false,
        createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 days ago
        scrapedAt: new Date(),
        likeCount: 52,
        retweetCount: 18,
        replyCount: 11,
        quoteCount: 4,
        language: 'en',
        isRetweet: false,
        isQuote: false,
        isReply: false,
        mediaUrls: [],
        mediaTypes: [],
        hashtags: ['audio', 'webdev', 'spatial', 'tutorial'],
        mentions: [],
        urls: ['https://prismaticcollections.com/blog/immersive-audio']
      }
    ];

    // Set the mock data
    this._user.set(mockUser);
    this._tweets.set(mockTweets);
    this._hasMoreTweets.set(false); // No more mock data to load
    this._scraperStatus.set({
      isRunning: false,
      lastScrapedAt: new Date(),
      totalTweetsStored: mockTweets.length,
      consecutiveFailures: 0
    });

    console.log(`Loaded ${mockTweets.length} mock tweets for development`);
  }

  private preloadProfileImages(tweets: Tweet[]): void {
    const usernames = [...new Set(tweets.map(tweet => tweet.authorUsername))].filter(Boolean);
    this.profileImageService.preloadProfileImages(usernames);
  }

  private handleError(context: string, error: any): void {
    console.error(`${context}:`, error);

    let errorMessage = 'An unexpected error occurred';
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.status === 429) {
        errorMessage = 'Rate limit exceeded. Please wait before trying again.';
      } else {
        errorMessage = error.error?.message || `Server responded with ${error.status}`;
      }
    }

    this._error.set(errorMessage);
    this._loadingState.set({ isLoading: false });

    // Update scraper status on error
    const currentStatus = this._scraperStatus();
    this._scraperStatus.set({
      ...currentStatus,
      consecutiveFailures: currentStatus.consecutiveFailures + 1
    });
  }
}