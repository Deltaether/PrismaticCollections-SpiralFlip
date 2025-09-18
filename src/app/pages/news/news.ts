import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SiteHeaderComponent } from '../../shared/components/site-header/site-header.component';
import { SquaresAnimationComponent } from '../../shared/components/squares-animation/squares-animation.component';
// X API V2 Integration
import { XApiService } from '../../services/x-api/x-api.service';
import { XApiUser, XApiTweet } from '../../services/x-api/interfaces/x-api.interfaces';
import { environment } from '../../../environments/environment';

interface NewsArticle {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  excerpt: string;
  publishDate: Date;
  lastUpdated?: Date;
  category: NewsCategory;
  featuredImage?: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  tags: string[];
  isPinned: boolean;
  relatedLinks?: {
    text: string;
    url: string;
    type: 'internal' | 'external';
  }[];
}

type NewsCategory = 
  | 'project-updates'
  | 'releases' 
  | 'announcements'
  | 'technical-updates'
  | 'community';

interface NewsFilter {
  category?: NewsCategory;
  searchTerm?: string;
}

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, HttpClientModule, SiteHeaderComponent, SquaresAnimationComponent],
  templateUrl: './news.html',
  styleUrl: './news.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class News implements OnInit, OnDestroy {
  // Signals for reactive state management
  private allNewsArticles = signal<NewsArticle[]>([]);
  private currentFilter = signal<NewsFilter>({});
  
  // Computed values
  filteredArticles = computed(() => {
    const articles = this.allNewsArticles();
    const filter = this.currentFilter();
    
    return articles.filter(article => {
      // Category filter
      if (filter.category && article.category !== filter.category) {
        return false;
      }
      
      // Search term filter
      if (filter.searchTerm) {
        const searchLower = filter.searchTerm.toLowerCase();
        return (
          article.title.toLowerCase().includes(searchLower) ||
          article.subtitle.toLowerCase().includes(searchLower) ||
          article.excerpt.toLowerCase().includes(searchLower) ||
          article.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    }).sort((a, b) => {
      // Pinned articles first, then by date
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.publishDate.getTime() - a.publishDate.getTime();
    });
  });
  
  featuredArticles = computed(() => 
    this.filteredArticles().filter(article => article.isPinned)
  );
  
  regularArticles = computed(() => 
    this.filteredArticles().filter(article => !article.isPinned)
  );
  
  // Enhanced Categories with colors and gradients
  readonly categories: { 
    value: NewsCategory; 
    label: string; 
    icon: string;
    color: string;
    gradient: string;
    lightBg: string;
  }[] = [
    { 
      value: 'project-updates', 
      label: 'Project Updates', 
      icon: 'rocket_launch',
      color: '#6c757d',
      gradient: 'linear-gradient(135deg, #6c757d, #495057)',
      lightBg: 'rgba(108, 117, 125, 0.1)'
    },
    { 
      value: 'releases', 
      label: 'Releases', 
      icon: 'music_note',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      lightBg: 'rgba(16, 185, 129, 0.1)'
    },
    { 
      value: 'announcements', 
      label: 'Announcements', 
      icon: 'campaign',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      lightBg: 'rgba(245, 158, 11, 0.1)'
    },
    { 
      value: 'technical-updates', 
      label: 'Technical', 
      icon: 'settings',
      color: '#495057',
      gradient: 'linear-gradient(135deg, #495057, #343a40)',
      lightBg: 'rgba(73, 80, 87, 0.1)'
    },
    { 
      value: 'community', 
      label: 'Community', 
      icon: 'group',
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
      lightBg: 'rgba(236, 72, 153, 0.1)'
    }
  ];
  
  // X API V2 Service Integration
  private readonly xApiService = inject(XApiService);
  private subscriptions = new Set<Subscription>();

  // X API V2 reactive state
  readonly xApiLoading = signal(false);
  readonly xApiError = signal<string | null>(null);
  readonly xApiTweets = signal<XApiTweet[]>([]);
  readonly xApiUser = signal<XApiUser | null>(null);
  readonly xApiInitialized = signal(false);

  // Computed properties for X API data
  readonly hasXApiData = computed(() =>
    this.xApiUser() !== null && this.xApiTweets().length > 0
  );

  readonly xApiStatus = computed(() => {
    if (this.xApiLoading()) return 'loading';
    if (this.xApiError()) return 'error';
    if (this.hasXApiData()) return 'success';
    return 'idle';
  });

  constructor(public router: Router) {}
  
  ngOnInit(): void {
    console.log('News component initialized');
    // Add body class for global scrolling support
    document.body.classList.add('news-page-active');

    this.loadNewsArticles();
    // Initialize X API V2 integration
    this.initializeXApi();
  }

  ngOnDestroy(): void {
    // Clean up body class when component is destroyed
    document.body.classList.remove('news-page-active');

    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions.clear();
  }
  
  private loadNewsArticles(): void {
    // Mock data - in real app would come from service/API
    const mockArticles: NewsArticle[] = [
      {
        id: '1',
        title: 'Project Phantasia 2.0 Launch',
        subtitle: 'Major Update with New 3D Features',
        excerpt: 'We are excited to announce the launch of Project Phantasia 2.0, featuring enhanced 3D environments, improved performance, and new interactive elements.',
        content: 'Detailed content about the Project Phantasia 2.0 launch...',
        publishDate: new Date('2024-01-15'),
        lastUpdated: new Date('2024-01-16'),
        category: 'project-updates',
        featuredImage: '/assets/videos/phantasia2/album_cover.png',
        author: {
          name: 'Deltaether',
          role: 'Lead Developer',
          avatar: '/assets/images/artists/deltaether-avatar.svg'
        },
        tags: ['phantasia', '3d', 'launch', 'update'],
        isPinned: true,
        relatedLinks: [
          { text: 'Experience Phantasia', url: '/phantasia', type: 'internal' },
          { text: 'GitHub Repository', url: 'https://github.com/deltaether/phantasia', type: 'external' }
        ]
      },
      {
        id: '2',
        title: 'New Mobile Interface Available',
        subtitle: 'Touch-Optimized Experience for All Devices',
        excerpt: 'All Prismatic Collections projects now feature a dedicated mobile interface optimized for touchscreen devices.',
        content: 'Mobile interface content...',
        publishDate: new Date('2023-12-10'),
        category: 'announcements',
        author: {
          name: 'Design Team',
          role: 'UI/UX Designers'
        },
        tags: ['mobile', 'ui', 'responsive'],
        isPinned: false
      },
      {
        id: '3',
        title: 'Performance Improvements',
        subtitle: 'Faster Loading and Smoother Animations',
        excerpt: 'Recent optimizations have improved loading times by 40% and enhanced animation smoothness across all platforms.',
        content: 'Performance improvements content...',
        publishDate: new Date('2023-11-22'),
        category: 'technical-updates',
        author: {
          name: 'Technical Team',
          role: 'Backend Engineers'
        },
        tags: ['performance', 'optimization', 'technical'],
        isPinned: false
      },
      {
        id: '4',
        title: 'Community Showcase: User Creations',
        subtitle: 'Featuring Amazing Projects from Our Community',
        excerpt: 'Discover incredible projects and remixes created by our community members using Prismatic Collections tools.',
        content: 'Community showcase content...',
        publishDate: new Date('2023-10-18'),
        category: 'community',
        author: {
          name: 'Community Team',
          role: 'Community Managers'
        },
        tags: ['community', 'showcase', 'creativity'],
        isPinned: false
      },
      {
        id: '5',
        title: 'New Music Release: Ethereal Echoes',
        subtitle: 'Latest EP Available on All Platforms',
        excerpt: 'Our latest musical creation "Ethereal Echoes" is now available across all major streaming platforms.',
        content: 'New music release content...',
        publishDate: new Date('2023-09-30'),
        category: 'releases',
        author: {
          name: 'Deltaether',
          role: 'Music Producer'
        },
        tags: ['music', 'release', 'ethereal-echoes'],
        isPinned: true
      }
    ];
    
    this.allNewsArticles.set(mockArticles);
  }
  
  /**
   * Initialize X API V2 integration with official endpoints
   */
  private initializeXApi(): void {
    console.log('🚀 Initializing X API V2 integration...');

    // Check if X API is enabled and configured
    if (!environment.xApi.enabled || !environment.xApi.bearerToken) {
      console.warn('⚠️ X API V2 not properly configured');
      this.xApiError.set('X API V2 not configured. Check environment settings.');
      return;
    }

    // Initialize the X API service
    try {
      this.xApiService.initialize(environment.xApi.bearerToken, {
        enableLogging: environment.xApi.enableLogging,
        environment: 'development'
      });

      this.xApiInitialized.set(true);
      console.log('✅ X API V2 service initialized');

      // Load user profile and tweets
      this.loadXApiData();

    } catch (error: any) {
      console.error('❌ Failed to initialize X API V2:', error);
      this.xApiError.set(`Initialization failed: ${error.message}`);
    }
  }

  /**
   * Load user profile and tweets using official X API V2 endpoints
   */
  private loadXApiData(): void {
    if (!this.xApiInitialized()) {
      console.warn('⚠️ X API not initialized');
      return;
    }

    this.xApiLoading.set(true);
    this.xApiError.set(null);

    const username = environment.xApi.username;
    console.log(`📡 Loading X API data for @${username}`);

    // Load user profile using /2/users/by/username/{username}
    const userProfileSub = this.xApiService.getUserProfile(username, {
      includeMetrics: true,
      includeVerification: true
    }).pipe(
      tap(user => {
        if (user) {
          this.xApiUser.set(user);
          console.log(`👤 Loaded user profile for @${user.username}:`, user);
        }
      }),
      catchError(error => {
        console.error(`❌ Failed to load user profile for @${username}:`, error);
        this.xApiError.set(`Failed to load user profile: ${error.message}`);
        return of(null);
      })
    ).subscribe();

    // Load user tweets using /2/users/{id}/tweets
    const tweetsSub = this.xApiService.getUserTweets(username, {
      maxResults: 10,
      includeMetrics: true,
      includeMedia: true,
      exclude: ['retweets'] // Get original content only
    }).pipe(
      tap(result => {
        this.xApiTweets.set(result.tweets);
        this.xApiLoading.set(false);
        console.log(`📋 Loaded ${result.tweets.length} tweets for @${username}:`, result);
      }),
      catchError(error => {
        console.error(`❌ Failed to load tweets for @${username}:`, error);
        this.xApiError.set(`Failed to load tweets: ${error.message}`);
        this.xApiLoading.set(false);
        return of({ tweets: [], includes: undefined, meta: undefined });
      })
    ).subscribe();

    this.subscriptions.add(userProfileSub);
    this.subscriptions.add(tweetsSub);
  }

  // X API V2 interaction methods
  onFollowClick(): void {
    const username = this.getXApiUsername();
    const url = this.getXApiUrl();
    console.log(`📱 Opening X profile: ${url}`);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  retryXApiLoad(): void {
    console.log('🔄 Retrying X API data load...');
    this.xApiError.set(null);
    this.loadXApiData();
  }

  refreshXApiFeed(): void {
    console.log('🔄 Refreshing X API feed...');
    // Clear cache and reload
    this.xApiService.clearCache();
    this.loadXApiData();
  }

  getXApiUsername(): string {
    return this.xApiUser()?.username || environment.xApi.username;
  }

  getXApiUrl(): string {
    const username = this.getXApiUsername();
    return `https://x.com/${username}`;
  }

  getLastUpdateTime(): string {
    const user = this.xApiUser();
    if (!user) return 'No data loaded';

    // Use the most recent tweet's created_at or user's account creation
    const tweets = this.xApiTweets();
    if (tweets.length > 0 && tweets[0].created_at) {
      const lastTweetDate = new Date(tweets[0].created_at);
      return this.formatDate(lastTweetDate);
    }

    if (user.created_at) {
      const userCreatedDate = new Date(user.created_at);
      return `Account created: ${this.formatDate(userCreatedDate)}`;
    }

    return 'Unknown';
  }

  /**
   * Format X API tweet text with entity parsing
   */
  formatTweetText(tweet: XApiTweet): string {
    let text = tweet.text;

    // Process URLs
    if (tweet.entities?.urls) {
      tweet.entities.urls.forEach(url => {
        if (url.display_url) {
          text = text.replace(url.url, `<a href="${url.expanded_url || url.url}" target="_blank" rel="noopener">${url.display_url}</a>`);
        }
      });
    }

    // Process hashtags
    if (tweet.entities?.hashtags) {
      tweet.entities.hashtags.forEach(hashtag => {
        const hashtagRegex = new RegExp(`#${hashtag.tag}`, 'gi');
        text = text.replace(hashtagRegex, `<a href="https://x.com/hashtag/${hashtag.tag}" target="_blank" rel="noopener">#${hashtag.tag}</a>`);
      });
    }

    // Process mentions
    if (tweet.entities?.mentions) {
      tweet.entities.mentions.forEach(mention => {
        const mentionRegex = new RegExp(`@${mention.username}`, 'gi');
        text = text.replace(mentionRegex, `<a href="https://x.com/${mention.username}" target="_blank" rel="noopener">@${mention.username}</a>`);
      });
    }

    return text;
  }

  /**
   * Get tweet engagement metrics
   */
  getTweetMetrics(tweet: XApiTweet): {
    likes: number;
    retweets: number;
    replies: number;
    quotes: number;
  } {
    const metrics = tweet.public_metrics;
    return {
      likes: metrics?.like_count || 0,
      retweets: metrics?.retweet_count || 0,
      replies: metrics?.reply_count || 0,
      quotes: metrics?.quote_count || 0
    };
  }

  /**
   * Get user metrics for profile display
   */
  getUserMetrics(): {
    followers: number;
    following: number;
    tweets: number;
  } {
    const user = this.xApiUser();
    const metrics = user?.public_metrics;
    return {
      followers: metrics?.followers_count || 0,
      following: metrics?.following_count || 0,
      tweets: metrics?.tweet_count || 0
    };
  }
  
  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  getCategoryIcon(category: NewsCategory): string {
    const categoryInfo = this.categories.find(c => c.value === category);
    return categoryInfo?.icon || 'article';
  }
  
  getCategoryLabel(category: NewsCategory): string {
    const categoryInfo = this.categories.find(c => c.value === category);
    return categoryInfo?.label || category;
  }

  getCategoryColor(category: NewsCategory): string {
    const categoryInfo = this.categories.find(c => c.value === category);
    return categoryInfo?.color || '#ff7f50';
  }

  getCategoryGradient(category: NewsCategory): string {
    const categoryInfo = this.categories.find(c => c.value === category);
    return categoryInfo?.gradient || 'linear-gradient(135deg, #ff7f50, #ff5252)';
  }

  getCategoryLightBg(category: NewsCategory): string {
    const categoryInfo = this.categories.find(c => c.value === category);
    return categoryInfo?.lightBg || 'rgba(255, 127, 80, 0.1)';
  }
  
  navigateToArticle(articleId: string): void {
    // In a real app, this would navigate to a detailed article view
    console.log('Navigate to article:', articleId);
  }
  
  openExternalLink(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // Enhanced interaction methods
  onArticleHover(articleId: string): void {
    // Add hover analytics or preview loading
    console.log('Article hovered:', articleId);
  }
  
  trackByArticleId(index: number, article: NewsArticle): string {
    return article.id;
  }

  // Placeholder event handlers for X API V2
  onXApiRefreshComplete(data: any): void {
    console.log('🎉 X API refresh completed:', data);
    // TODO: Implement performance metrics for X API V2
  }

  // Performance monitoring methods
  showPerformanceStats(): boolean {
    return false; // Disabled until X API V2 implementation
  }

  getPerformanceMetrics() {
    return {
      cacheHitRate: 0,
      requestCount: 0,
      errorCount: 0,
      averageResponseTime: 0
    }; // Placeholder metrics
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  // Additional helper methods for template

  /**
   * Track by function for tweet list
   */
  trackByTweetId(index: number, tweet: XApiTweet): string {
    return tweet.id;
  }

  /**
   * Format tweet date for display
   */
  formatTweetDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diff / (1000 * 60));
      return `${diffMinutes}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  }

  /**
   * Expose environment for template access
   */
  get environment() {
    return environment;
  }
}
