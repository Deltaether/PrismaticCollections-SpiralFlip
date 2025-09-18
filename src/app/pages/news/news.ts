import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { SiteHeaderComponent } from '../../shared/components/site-header/site-header.component';
import { SquaresAnimationComponent } from '../../shared/components/squares-animation/squares-animation.component';
import { TwitterIntegrationService, Tweet } from '../../services/twitter-integration.service';

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
  
  // Twitter Integration Service
  private twitterService = inject(TwitterIntegrationService);
  private subscriptions = new Set<Subscription>();

  // Twitter state computed from service
  readonly twitterLoading = computed(() => this.twitterService.loading());
  readonly twitterError = computed(() => this.twitterService.error());
  readonly twitterTweets = computed(() => this.twitterService.tweets());
  readonly twitterUser = computed(() => this.twitterService.user());
  readonly embedLoaded = computed(() => this.twitterService.embedLoaded());

  constructor(public router: Router) {}
  
  ngOnInit(): void {
    console.log('News component initialized');
    // Add body class for global scrolling support
    document.body.classList.add('news-page-active');

    this.loadNewsArticles();
    this.initializeTwitterIntegration();
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
  
  // Twitter Integration Methods
  private initializeTwitterIntegration(): void {
    console.log('Initializing Twitter integration...');

    // Try to create embed timeline first (no API key needed)
    setTimeout(() => {
      this.twitterService.createEmbedTimeline('twitter-embed-container');
    }, 1000);

    // Also try to fetch via API if available, or use fallback
    const tweetsSub = this.twitterService.refreshTweets().subscribe({
      next: (tweets) => {
        console.log(`Loaded ${tweets.length} tweets successfully`);
      },
      error: (error) => {
        console.warn('Twitter API fallback used:', error.message);
      }
    });

    this.subscriptions.add(tweetsSub);
  }
  
  // Twitter interaction methods (delegated to service)
  onFollowClick(): void {
    console.log('Follow button clicked - Twitter');
    window.open(this.twitterService.getTwitterUrl(), '_blank', 'noopener,noreferrer');
  }

  retryTwitterLoad(): void {
    console.log('Retrying Twitter load...');
    this.initializeTwitterIntegration();
  }

  refreshTwitterFeed(): void {
    console.log('Refreshing Twitter feed...');
    const refreshSub = this.twitterService.refreshTweets().subscribe({
      next: (tweets) => {
        console.log(`Refreshed ${tweets.length} tweets`);
      },
      error: (error) => {
        console.warn('Refresh failed, using fallback:', error.message);
      }
    });
    this.subscriptions.add(refreshSub);
  }

  openTweetUrl(tweetId: string): void {
    this.twitterService.openTweetUrl(tweetId);
  }

  shareTweet(tweet: Tweet): void {
    this.twitterService.shareTweet(tweet);
  }

  formatTweetDate(dateString: string): string {
    const date = new Date(dateString);
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

  formatTweetContent(content: string): string {
    return this.twitterService.formatTweetContent(content);
  }

  trackByTweetId(index: number, tweet: Tweet): string {
    return tweet.id;
  }

  // Utility methods for Twitter integration
  getTwitterUsername(): string {
    return this.twitterService.getTwitterUsername();
  }

  getTwitterUrl(): string {
    return this.twitterService.getTwitterUrl();
  }

  getLastUpdateTime(): string {
    return this.twitterService.getLastUpdateTime();
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
}
