import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { SiteHeaderComponent } from '../../shared/components/site-header/site-header.component';
import { SquaresAnimationComponent } from '../../shared/components/squares-animation/squares-animation.component';
import { TwitterOptimizedComponent } from '../../components/twitter-optimized/twitter-optimized.component';
import { TwitterUnifiedOptimizedService } from '../../services/twitter-unified-optimized.service';
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
  imports: [CommonModule, FormsModule, MatIconModule, HttpClientModule, SiteHeaderComponent, SquaresAnimationComponent, TwitterOptimizedComponent],
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
  
  // Optimized Twitter Integration Service
  private twitterService = inject(TwitterUnifiedOptimizedService);
  private subscriptions = new Set<Subscription>();

  // Twitter state computed from optimized service
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
  
  // Optimized Twitter Integration Methods
  private initializeTwitterIntegration(): void {
    console.log('🚀 Initializing optimized Twitter integration...');

    // Load initial data with the optimized service
    // Embed creation is now handled by TwitterOptimizedComponent
    const refreshSub = this.twitterService.refreshAll().subscribe({
      next: (data) => {
        console.log(`✅ Loaded ${data.tweets.length} tweets successfully with optimized service`);
      },
      error: (error) => {
        console.warn('⚠️ Using cached/fallback data:', error.message);
      }
    });

    this.subscriptions.add(refreshSub);
  }

  private createEmbedWithDelay(): void {
    // Note: Embed creation is now handled by TwitterOptimizedComponent
    // This method is kept for backward compatibility but delegates to the component
    console.log('📝 Twitter embed creation delegated to TwitterOptimizedComponent');
  }
  
  // Optimized Twitter interaction methods
  onFollowClick(): void {
    console.log('📱 Follow button clicked - using optimized service');
    window.open(this.twitterService.getTwitterUrl(), '_blank', 'noopener,noreferrer');
  }

  retryTwitterLoad(): void {
    console.log('🔄 Retrying Twitter load with optimized service...');
    this.initializeTwitterIntegration();
  }

  refreshTwitterFeed(): void {
    console.log('🔄 Refreshing Twitter feed with optimized service...');
    const refreshSub = this.twitterService.refreshAll().subscribe({
      next: (data) => {
        console.log(`✅ Refreshed: ${data.tweets.length} tweets, cache hit rate: ${this.twitterService.getPerformanceMetrics().cacheHitRate}%`);
      },
      error: (error) => {
        console.warn('⚠️ Refresh failed, using cached data:', error.message);
      }
    });
    this.subscriptions.add(refreshSub);
  }

  // Utility methods for Twitter integration
  getTwitterUsername(): string {
    return this.twitterService.getUsername();
  }

  getTwitterUrl(): string {
    return this.twitterService.getTwitterUrl();
  }

  getLastUpdateTime(): string {
    const lastUpdate = this.twitterService.state().lastUpdate;
    if (!lastUpdate) return 'Never';

    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
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

  // Optimized Twitter integration event handlers
  onTwitterRefreshComplete(data: any): void {
    console.log('🎉 Twitter refresh completed:', data);
    const metrics = this.twitterService.getPerformanceMetrics();
    console.log('📊 Performance metrics:', metrics);
  }

  // Performance monitoring methods
  showPerformanceStats(): boolean {
    // Only show in development or when explicitly enabled
    return !environment.production || (window as any).enableTwitterStats;
  }

  getPerformanceMetrics() {
    return this.twitterService.getPerformanceMetrics();
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}
