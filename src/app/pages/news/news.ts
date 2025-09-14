import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SiteHeaderComponent } from '../../shared/components/site-header/site-header.component';
import { SquaresAnimationComponent } from '../../shared/components/squares-animation/squares-animation.component';

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
  imports: [CommonModule, FormsModule, MatIconModule, SiteHeaderComponent, SquaresAnimationComponent],
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
  
  // Twitter Integration Properties
  twitterLoading = signal<boolean>(true);
  twitterError = signal<boolean>(false);
  twitterEmbedHtml = signal<string>('');
  
  // Fallback tweet data when embed fails
  fallbackTweets = signal<Array<{
    id: string;
    content: string;
    date: Date;
    url: string;
    media?: string;
  }>>([]);
  
  constructor(public router: Router) {}
  
  ngOnInit(): void {
    console.log('News component initialized');
    // Add body class for global scrolling support
    document.body.classList.add('news-page-active');
    
    this.loadNewsArticles();
    this.initializeTwitterFeed();
  }
  
  ngOnDestroy(): void {
    // Clean up body class when component is destroyed
    document.body.classList.remove('news-page-active');
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
  private initializeTwitterFeed(): void {
    // Set loading state
    this.twitterLoading.set(true);
    this.twitterError.set(false);
    
    // Load fallback tweets immediately
    this.loadFallbackTweets();
    
    // Try to load Twitter embed (simulate API call)
    setTimeout(() => {
      try {
        // In a real implementation, this would call Twitter API or embed script
        // For now, we'll use fallback tweets with a simulated load
        this.twitterLoading.set(false);
        
        // Simulate occasional network errors for demo
        if (Math.random() > 0.9) {
          this.twitterError.set(true);
        }
      } catch (error) {
        this.twitterLoading.set(false);
        this.twitterError.set(true);
        console.error('Failed to load Twitter feed:', error);
      }
    }, 2000); // Simulate 2 second load time
  }
  
  private loadFallbackTweets(): void {
    const tweets = [
      {
        id: '1',
        content: '🚀 Just launched Project Phantasia 2.0! Experience the future of interactive 3D environments with enhanced performance and stunning visuals. #Phantasia #3D #Launch',
        date: new Date('2024-01-15'),
        url: 'https://x.com/prismcollect_/status/1',
        media: '/assets/videos/phantasia2/album_cover.png'
      },
      {
        id: '2', 
        content: '🎵 New music release alert! "Ethereal Echoes" is now live on all streaming platforms. Dive into the ethereal soundscapes that inspired our latest collection. #Music #EtherealEchoes #Release',
        date: new Date('2023-12-20'),
        url: 'https://x.com/prismcollect_/status/2'
      },
      {
        id: '3',
        content: '📱 Mobile users, rejoice! Our new touch-optimized interface is rolling out across all Prismatic Collections experiences. Smoother, faster, and more intuitive. #Mobile #UI #Update',
        date: new Date('2023-12-10'),
        url: 'https://x.com/prismcollect_/status/3'
      },
      {
        id: '4',
        content: '⚡ Performance update: We\'ve reduced loading times by 40% and enhanced animation smoothness across all platforms. Better experiences for everyone! #Performance #Optimization #TechnicalUpdate',
        date: new Date('2023-11-22'),
        url: 'https://x.com/prismcollect_/status/4'
      },
      {
        id: '5',
        content: '🌟 Community spotlight! Amazing creations from our talented community members continue to inspire us. Keep sharing your incredible work! #Community #Creativity #Showcase',
        date: new Date('2023-10-18'),
        url: 'https://x.com/prismcollect_/status/5'
      }
    ];
    
    this.fallbackTweets.set(tweets);
  }
  
  onFollowClick(): void {
    // Analytics tracking for follow button
    console.log('Follow button clicked - Twitter');
  }
  
  retryTwitterLoad(): void {
    this.initializeTwitterFeed();
  }
  
  refreshTwitterFeed(): void {
    this.initializeTwitterFeed();
  }
  
  openTweetUrl(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  
  shareTweet(tweet: any): void {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out this tweet from @prismcollect_: ' + tweet.content.substring(0, 100) + '...')}&url=${encodeURIComponent(tweet.url)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  }
  
  formatTweetDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      return diffHours > 0 ? `${diffHours}h` : 'now';
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }
  
  formatTweetContent(content: string): string {
    // Convert hashtags and mentions to styled spans
    return content
      .replace(/#(\w+)/g, '<span class="tweet-hashtag">#$1</span>')
      .replace(/@(\w+)/g, '<span class="tweet-mention">@$1</span>');
  }
  
  trackByTweetId(index: number, tweet: any): string {
    return tweet.id;
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
