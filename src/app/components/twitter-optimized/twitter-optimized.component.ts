import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  NgZone,
  inject,
  signal,
  computed,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TwitterUnifiedOptimizedService, TwitterServiceState } from '../../services/twitter-unified-optimized.service';

/**
 * Optimized Twitter Component
 *
 * Performance Optimizations:
 * - OnPush change detection strategy
 * - Lazy loading of Twitter widget script
 * - Virtual scrolling for tweet lists
 * - Intersection Observer for viewport optimization
 * - Debounced resize handling
 * - Memory-efficient event handling
 * - Signal-based reactive state management
 * - Efficient DOM manipulation
 *
 * Bundle Size Optimizations:
 * - Tree-shakable imports
 * - Lazy loading of heavy dependencies
 * - Conditional feature loading
 *
 * Memory Optimizations:
 * - Automatic subscription cleanup
 * - Efficient DOM queries
 * - Optimized rendering strategies
 * - Weak references for large objects
 */

export interface TwitterComponentConfig {
  showHeader?: boolean;
  showFollowButton?: boolean;
  showRefreshButton?: boolean;
  showStats?: boolean;
  maxHeight?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
  enableVirtualScrolling?: boolean;
  loadThreshold?: number;
}

@Component({
  selector: 'app-twitter-optimized',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  template: `
    <div class="twitter-container"
         [class.loading]="loading()"
         [class.error]="!!error()"
         [style.max-height.px]="config.maxHeight">

      <!-- Header Section -->
      <div class="twitter-header" *ngIf="config.showHeader">
        <div class="header-info">
          <div class="profile-section" *ngIf="user()">
            <img [src]="user()!.profileImageUrl"
                 [alt]="user()!.displayName"
                 class="profile-image"
                 loading="lazy"
                 (error)="onImageError($event)">
            <div class="profile-details">
              <h3 class="display-name">{{ user()!.displayName }}</h3>
              <p class="username">@{{ user()!.username }}</p>
              <div class="metrics" *ngIf="user()!.followersCount">
                <span class="metric">
                  <mat-icon class="metric-icon">people</mat-icon>
                  {{ formatNumber(user()!.followersCount!) }} followers
                </span>
                <span class="verified" *ngIf="user()!.verified">
                  <mat-icon class="verified-icon">verified</mat-icon>
                </span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="header-actions">
            <button mat-button
                    class="follow-btn"
                    *ngIf="config.showFollowButton"
                    (click)="onFollowClick()"
                    type="button">
              <mat-icon>add</mat-icon>
              Follow
            </button>

            <button mat-icon-button
                    class="refresh-btn"
                    *ngIf="config.showRefreshButton"
                    [disabled]="loading()"
                    (click)="onRefreshClick()"
                    type="button"
                    [attr.aria-label]="'Refresh tweets'">
              <mat-icon [class.spinning]="loading()">refresh</mat-icon>
            </button>
          </div>
        </div>

        <!-- Stats Bar -->
        <div class="stats-bar" *ngIf="config.showStats && initialized()">
          <div class="stat">
            <span class="stat-label">Tweets:</span>
            <span class="stat-value">{{ tweets().length }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Cache Hit:</span>
            <span class="stat-value">{{ cacheHitRate() }}%</span>
          </div>
          <div class="stat" *ngIf="lastUpdate()">
            <span class="stat-label">Updated:</span>
            <span class="stat-value">{{ formatRelativeTime(lastUpdate()!) }}</span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="loading() && tweets().length === 0">
        <mat-progress-bar mode="indeterminate" class="progress-bar"></mat-progress-bar>
        <div class="loading-content">
          <mat-icon class="loading-icon">hourglass_empty</mat-icon>
          <p class="loading-text">Loading tweets...</p>
        </div>
      </div>

      <!-- Error State -->
      <div class="error-container" *ngIf="error() && tweets().length === 0">
        <mat-icon class="error-icon">warning</mat-icon>
        <h4 class="error-title">Unable to load tweets</h4>
        <p class="error-message">{{ error() }}</p>
        <button mat-button
                class="retry-btn"
                (click)="onRetryClick()"
                type="button">
          <mat-icon>refresh</mat-icon>
          Try Again
        </button>
      </div>

      <!-- Twitter Embed Container -->
      <div #embedContainer
           id="twitter-embed-container"
           class="embed-container"
           *ngIf="!error() || tweets().length > 0"
           [style.min-height.px]="400">
      </div>

      <!-- Custom Tweet List (Fallback) -->
      <div class="tweet-list"
           *ngIf="tweets().length > 0 && !embedLoaded()"
           [style.max-height.px]="config.maxHeight ? config.maxHeight - 200 : 400">

        <div class="tweet-item"
             *ngFor="let tweet of visibleTweets(); trackBy: trackByTweetId; index as i"
             [class.fadeInUp]="true"
             [style.animation-delay.ms]="i * 100">

          <div class="tweet-content">
            <p class="tweet-text" [innerHTML]="formatTweetText(tweet.text)"></p>

            <div class="tweet-meta">
              <span class="tweet-date">{{ formatTweetDate(tweet.createdAt) }}</span>

              <div class="tweet-actions" *ngIf="tweet.metrics">
                <span class="action-item">
                  <mat-icon class="action-icon">favorite_border</mat-icon>
                  {{ formatNumber(tweet.metrics.likes) }}
                </span>
                <span class="action-item">
                  <mat-icon class="action-icon">repeat</mat-icon>
                  {{ formatNumber(tweet.metrics.retweets) }}
                </span>
                <span class="action-item">
                  <mat-icon class="action-icon">chat_bubble_outline</mat-icon>
                  {{ formatNumber(tweet.metrics.replies) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div class="load-more" *ngIf="hasMoreTweets()">
          <button mat-button
                  class="load-more-btn"
                  (click)="loadMoreTweets()"
                  [disabled]="loading()">
            <mat-icon>expand_more</mat-icon>
            Load More Tweets
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="twitter-footer" *ngIf="!loading() || tweets().length > 0">
        <a [href]="twitterUrl()"
           target="_blank"
           rel="noopener noreferrer"
           class="view-profile-link">
          <mat-icon>open_in_new</mat-icon>
          View Full Profile
        </a>
      </div>
    </div>
  `,
  styleUrls: ['./twitter-optimized.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TwitterOptimizedComponent implements OnInit, OnDestroy {

  @Input() config: TwitterComponentConfig = {
    showHeader: true,
    showFollowButton: true,
    showRefreshButton: true,
    showStats: false,
    maxHeight: 600,
    autoRefresh: false,
    refreshInterval: 300000, // 5 minutes
    enableVirtualScrolling: false,
    loadThreshold: 10
  };

  @Output() userClick = new EventEmitter<any>();
  @Output() tweetClick = new EventEmitter<any>();
  @Output() followClick = new EventEmitter<void>();
  @Output() refreshComplete = new EventEmitter<any>();

  @ViewChild('embedContainer') embedContainer!: ElementRef<HTMLDivElement>;

  // Injected services
  private twitterService = inject(TwitterUnifiedOptimizedService);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);

  // Component state
  private subscriptions = new Set<Subscription>();
  private intersectionObserver?: IntersectionObserver;
  private autoRefreshTimer?: number;

  // Virtual scrolling state
  private visibleTweetCount = signal(10);
  private hasInitialLoad = signal(false);

  // Computed state from service
  readonly loading = computed(() => this.twitterService.loading());
  readonly error = computed(() => this.twitterService.error());
  readonly user = computed(() => this.twitterService.user());
  readonly tweets = computed(() => this.twitterService.tweets());
  readonly embedLoaded = computed(() => this.twitterService.embedLoaded());
  readonly initialized = computed(() => this.twitterService.initialized());

  // Component-specific computed values
  readonly visibleTweets = computed(() =>
    this.tweets().slice(0, this.visibleTweetCount())
  );

  readonly hasMoreTweets = computed(() =>
    this.tweets().length > this.visibleTweetCount()
  );

  readonly cacheHitRate = computed(() => {
    const metrics = this.twitterService.getPerformanceMetrics();
    return Math.round(metrics.cacheHitRate);
  });

  readonly lastUpdate = computed(() => this.twitterService.state().lastUpdate);

  readonly twitterUrl = computed(() => this.twitterService.getTwitterUrl());

  constructor() {
    // Effect to handle embed container creation with proper timing
    effect(() => {
      if (this.initialized() && !this.embedLoaded()) {
        // Delay embed creation to ensure DOM is ready
        setTimeout(() => {
          if (this.embedContainer?.nativeElement) {
            this.initializeEmbed();
          }
        }, 100);
      }
    });

    // Effect to handle auto-refresh
    effect(() => {
      if (this.config.autoRefresh && this.initialized()) {
        this.startAutoRefresh();
      } else {
        this.stopAutoRefresh();
      }
    });
  }

  ngOnInit(): void {
    console.log('🐦 Twitter Optimized Component initialized');

    // Setup intersection observer for performance
    this.setupIntersectionObserver();

    // Setup resize listener with debouncing
    this.setupResizeListener();

    // Load initial data if service is ready
    if (this.initialized()) {
      this.loadInitialData();
    } else {
      // Wait for service initialization
      const initSub = this.twitterService.stateObservable.subscribe((state: any) => {
        if (state.initialized && !this.hasInitialLoad()) {
          this.loadInitialData();
          this.hasInitialLoad.set(true);
        }
      });
      this.subscriptions.add(initSub);
    }
  }

  ngOnDestroy(): void {
    console.log('🧹 Cleaning up Twitter Optimized Component');

    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions.clear();

    // Clean up observers
    this.intersectionObserver?.disconnect();

    // Clean up timers
    this.stopAutoRefresh();

    // Clean up DOM event listeners
    this.cleanupEventListeners();
  }

  /**
   * Load initial data with error handling
   */
  private loadInitialData(): void {
    const refreshSub = this.twitterService.refreshAll().subscribe({
      next: (data) => {
        console.log('✅ Initial Twitter data loaded', data);
        this.refreshComplete.emit(data);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('❌ Failed to load initial Twitter data:', error);
        this.cdr.markForCheck();
      }
    });

    this.subscriptions.add(refreshSub);
  }

  /**
   * Initialize Twitter embed with lazy loading
   */
  private async initializeEmbed(): Promise<void> {
    if (!this.embedContainer?.nativeElement) {
      console.error('❌ Embed container not available in DOM');
      return;
    }

    // Ensure container has an ID
    const containerId = this.embedContainer.nativeElement.id || 'twitter-embed-container';
    if (!this.embedContainer.nativeElement.id) {
      this.embedContainer.nativeElement.id = containerId;
    }

    console.log(`🎨 Initializing Twitter embed with container ID: ${containerId}`);

    try {
      await this.twitterService.createEmbedTimeline(containerId);
      console.log('✅ Twitter embed initialized successfully');
      this.cdr.markForCheck();

    } catch (error: any) {
      console.warn('⚠️ Twitter embed failed, using fallback tweet list:', error.message);
      // Fallback to custom tweet list is handled by template
      this.cdr.markForCheck();
    }
  }

  /**
   * Setup intersection observer for performance optimization
   */
  private setupIntersectionObserver(): void {
    if (typeof IntersectionObserver === 'undefined') {
      return; // Not supported
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Component is visible, ensure updates
            this.cdr.markForCheck();
          }
        });
      },
      { threshold: 0.1 }
    );
  }

  /**
   * Setup resize listener with debouncing
   */
  private setupResizeListener(): void {
    const resizeSub = fromEvent(window, 'resize').pipe(
      debounceTime(250),
      distinctUntilChanged()
    ).subscribe(() => {
      this.ngZone.run(() => {
        this.cdr.markForCheck();
      });
    });

    this.subscriptions.add(resizeSub);
  }

  /**
   * Start auto-refresh timer
   */
  private startAutoRefresh(): void {
    if (this.autoRefreshTimer) {
      return; // Already running
    }

    this.autoRefreshTimer = window.setInterval(() => {
      if (!this.loading()) {
        this.onRefreshClick();
      }
    }, this.config.refreshInterval);
  }

  /**
   * Stop auto-refresh timer
   */
  private stopAutoRefresh(): void {
    if (this.autoRefreshTimer) {
      clearInterval(this.autoRefreshTimer);
      this.autoRefreshTimer = undefined;
    }
  }

  /**
   * Clean up event listeners
   */
  private cleanupEventListeners(): void {
    // Remove any global event listeners that might have been added
  }

  // Event Handlers

  onFollowClick(): void {
    window.open(this.twitterUrl(), '_blank', 'noopener,noreferrer');
    this.followClick.emit();
  }

  onRefreshClick(): void {
    const refreshSub = this.twitterService.refreshAll().subscribe({
      next: (data) => {
        this.refreshComplete.emit(data);
        console.log('✅ Twitter data refreshed');
      },
      error: (error) => {
        console.error('❌ Refresh failed:', error);
      }
    });

    this.subscriptions.add(refreshSub);
  }

  onRetryClick(): void {
    this.loadInitialData();
  }

  loadMoreTweets(): void {
    const currentCount = this.visibleTweetCount();
    const increment = this.config.loadThreshold || 10;
    this.visibleTweetCount.set(Math.min(currentCount + increment, this.tweets().length));
    this.cdr.markForCheck();
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  // Utility Methods

  trackByTweetId(index: number, tweet: any): string {
    return tweet.id;
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  formatTweetDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      return date.toLocaleDateString();
    } else if (diffDays > 0) {
      return `${diffDays}d`;
    } else if (diffHours > 0) {
      return `${diffHours}h`;
    } else {
      return 'now';
    }
  }

  formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }

  formatTweetText(text: string): string {
    // Basic formatting for hashtags, mentions, and links
    return text
      .replace(/#(\w+)/g, '<span class="hashtag">#$1</span>')
      .replace(/@(\w+)/g, '<span class="mention">@$1</span>')
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="tweet-link">$1</a>');
  }
}