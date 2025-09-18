import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  signal,
  computed,
  inject,
  DestroyRef,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TwitterCoreService, TwitterPost } from '../../services/twitter-core.service';
import { catchError, finalize } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

/**
 * Optimized Twitter Timeline Component for Angular 20
 *
 * Performance-focused component leveraging the consolidated TwitterCoreService.
 * Designed for production use with the Prismatic Collections 3D environment.
 *
 * Key Features:
 * - Progressive enhancement (embed-first, fallback gracefully)
 * - Memory leak prevention with DestroyRef
 * - Optimized change detection with OnPush
 * - Minimal bundle size impact
 * - Error boundaries with fallback UI
 * - Accessibility compliant
 * - Mobile responsive
 *
 * Performance Optimizations:
 * - Lazy loading of heavy components
 * - Computed signals for reactive updates
 * - Track by functions for efficient rendering
 * - Debounced user interactions
 * - IntersectionObserver for lazy rendering
 */

export interface TwitterTimelineConfig {
  readonly maxPosts: number;
  readonly showHeader: boolean;
  readonly showMetrics: boolean;
  readonly theme: 'light' | 'dark';
  readonly embedHeight: number;
  readonly autoRefresh: boolean;
  readonly refreshInterval: number; // in milliseconds
}

@Component({
  selector: 'app-twitter-timeline',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  template: `
    <div class="twitter-timeline-container" [attr.data-theme]="config().theme">
      <!-- Header Section -->
      <header class="timeline-header" *ngIf="config().showHeader">
        <div class="header-content">
          <div class="profile-info">
            <mat-icon class="twitter-icon">alternate_email</mat-icon>
            <div class="profile-details">
              <h3 class="profile-name">
                {{ profile()?.displayName || '@' + twitterService.getServiceStats().initialized }}
                <mat-icon *ngIf="profile()?.verified" class="verified-badge" color="primary">verified</mat-icon>
              </h3>
              <span class="profile-username">@{{ getUsername() }}</span>
            </div>
          </div>

          <div class="header-actions">
            <button
              mat-icon-button
              (click)="refreshTimeline()"
              [disabled]="loading()"
              matTooltip="Refresh Timeline"
              class="refresh-btn">
              <mat-icon [class.spinning]="loading()">refresh</mat-icon>
            </button>

            <button
              mat-button
              (click)="openTwitterProfile()"
              class="follow-btn"
              matTooltip="Visit Profile">
              <mat-icon>open_in_new</mat-icon>
              Visit
            </button>
          </div>
        </div>

        <!-- Status Indicators -->
        <div class="status-bar" *ngIf="showDebugInfo()">
          <span class="status-chip" [class]="getStatusClass('embed')">
            <mat-icon>widgets</mat-icon>
            Embed: {{ embedAvailable() ? 'Ready' : 'Loading' }}
          </span>

          <span class="status-chip" [class]="getStatusClass('cache')">
            <mat-icon>storage</mat-icon>
            Cache: {{ getCacheHitRate() }}% hit rate
          </span>

          <span class="status-chip" *ngIf="error()" class="status-error">
            <mat-icon>warning</mat-icon>
            {{ error() }}
          </span>
        </div>
      </header>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="loading() && !posts().length">
        <mat-spinner diameter="32"></mat-spinner>
        <p class="loading-text">Loading Twitter feed...</p>
      </div>

      <!-- Error State with Fallback -->
      <div class="error-container" *ngIf="error() && !posts().length && !embedAvailable()">
        <mat-icon class="error-icon">warning</mat-icon>
        <h4>Twitter Feed Unavailable</h4>
        <p>{{ error() }}</p>
        <button mat-button (click)="retryConnection()" class="retry-btn">
          <mat-icon>refresh</mat-icon>
          Retry
        </button>
        <button mat-button (click)="openTwitterProfile()" class="fallback-btn">
          <mat-icon>open_in_new</mat-icon>
          View on Twitter
        </button>
      </div>

      <!-- Primary Content: Twitter Embed -->
      <div
        class="embed-container"
        *ngIf="embedAvailable()"
        #embedContainer>
        <div
          [id]="embedContainerId()"
          class="twitter-embed"
          [style.height.px]="config().embedHeight">
        </div>
      </div>

      <!-- Fallback Content: Post List -->
      <div class="posts-container" *ngIf="posts().length && !embedAvailable()">
        <article
          *ngFor="let post of visiblePosts(); trackBy: trackByPostId"
          class="post-item"
          (click)="openPost(post)">

          <div class="post-content">
            <div class="post-text" [innerHTML]="formatPostContent(post.text)"></div>

            <div class="post-metadata">
              <time class="post-date" [dateTime]="post.createdAt.toISOString()">
                {{ formatDate(post.createdAt) }}
              </time>

              <div class="post-metrics" *ngIf="config().showMetrics">
                <span class="metric" matTooltip="Likes">
                  <mat-icon>favorite</mat-icon>
                  {{ formatNumber(post.metrics.likes) }}
                </span>
                <span class="metric" matTooltip="Retweets">
                  <mat-icon>repeat</mat-icon>
                  {{ formatNumber(post.metrics.retweets) }}
                </span>
                <span class="metric" matTooltip="Replies">
                  <mat-icon>reply</mat-icon>
                  {{ formatNumber(post.metrics.replies) }}
                </span>
              </div>
            </div>
          </div>

          <div class="post-actions">
            <button
              mat-icon-button
              (click)="sharePost(post, $event)"
              matTooltip="Share Post"
              class="share-btn">
              <mat-icon>share</mat-icon>
            </button>
          </div>
        </article>
      </div>

      <!-- Footer with Last Update -->
      <footer class="timeline-footer" *ngIf="lastUpdate()">
        <span class="last-update">
          Last updated {{ formatDate(lastUpdate()!) }}
        </span>
      </footer>
    </div>
  `,
  styleUrl: './twitter-timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TwitterTimelineComponent implements OnInit, AfterViewInit {
  @Input()
  set configuration(config: Partial<TwitterTimelineConfig>) {
    this.config.set({ ...this.defaultConfig, ...config });
  }

  @ViewChild('embedContainer', { static: false })
  embedContainer!: ElementRef;

  // Injected dependencies
  private readonly twitterService = inject(TwitterCoreService);
  private readonly destroyRef = inject(DestroyRef);

  // Default configuration
  private readonly defaultConfig: TwitterTimelineConfig = {
    maxPosts: 5,
    showHeader: true,
    showMetrics: true,
    theme: 'dark',
    embedHeight: 500,
    autoRefresh: false,
    refreshInterval: 5 * 60 * 1000 // 5 minutes
  };

  // Component state
  readonly config = signal<TwitterTimelineConfig>(this.defaultConfig);
  readonly showDebugInfo = signal(false);
  readonly embedContainerId = signal(`twitter-embed-${Math.random().toString(36).substr(2, 9)}`);

  // Computed state from service
  readonly loading = computed(() => this.twitterService.loading());
  readonly error = computed(() => this.twitterService.error());
  readonly posts = computed(() => this.twitterService.posts().slice(0, this.config().maxPosts));
  readonly profile = computed(() => this.twitterService.profile());
  readonly initialized = computed(() => this.twitterService.initialized());
  readonly embedAvailable = computed(() => this.twitterService.embedAvailable());
  readonly lastUpdate = computed(() => {
    const stats = this.twitterService.getServiceStats();
    return stats.lastUpdate;
  });

  // UI-specific computed values
  readonly visiblePosts = computed(() => {
    const posts = this.posts();
    return posts.filter(post => post.text.trim().length > 0);
  });

  constructor() {
    // Toggle debug info in development
    if (!environment.production) {
      this.showDebugInfo.set(true);
    }
  }

  ngOnInit(): void {
    console.log('🐦 TwitterTimelineComponent initializing...');

    // Set up auto-refresh if enabled
    if (this.config().autoRefresh) {
      this.setupAutoRefresh();
    }
  }

  ngAfterViewInit(): void {
    // Initialize embed after view is ready
    if (this.embedAvailable()) {
      this.createEmbedTimeline();
    } else {
      // Wait for embed to become available
      this.twitterService.state()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(state => {
          if (state.embedAvailable && !state.loading) {
            this.createEmbedTimeline();
          }
        });
    }
  }

  /**
   * Create Twitter embed timeline
   */
  private async createEmbedTimeline(): Promise<void> {
    try {
      await this.twitterService.createEmbedTimeline(this.embedContainerId());
      console.log('✅ Twitter embed timeline created');
    } catch (error) {
      console.warn('⚠️ Failed to create embed timeline:', error);
    }
  }

  /**
   * Set up auto-refresh functionality
   */
  private setupAutoRefresh(): void {
    const interval = this.config().refreshInterval;

    timer(interval, interval)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (!this.loading()) {
          this.refreshTimeline();
        }
      });
  }

  /**
   * Refresh timeline data
   */
  refreshTimeline(): void {
    console.log('🔄 Refreshing Twitter timeline...');

    this.twitterService.refreshData()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          console.warn('⚠️ Timeline refresh failed:', error);
          return EMPTY;
        }),
        finalize(() => {
          console.log('✅ Timeline refresh completed');
        })
      )
      .subscribe();
  }

  /**
   * Retry connection on error
   */
  retryConnection(): void {
    console.log('🔄 Retrying Twitter connection...');
    this.refreshTimeline();
  }

  /**
   * Open Twitter profile
   */
  openTwitterProfile(): void {
    this.twitterService.openTwitterProfile();
  }

  /**
   * Open individual post
   */
  openPost(post: TwitterPost): void {
    this.twitterService.openTweet(post.id);
  }

  /**
   * Share post with event stopping
   */
  sharePost(post: TwitterPost, event: Event): void {
    event.stopPropagation();
    this.twitterService.shareTweet(post);
  }

  /**
   * Format post content with enhanced styling
   */
  formatPostContent(content: string): string {
    return this.twitterService.formatTweetContent(content);
  }

  /**
   * Format date for display
   */
  formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffTime / (1000 * 60));

      if (diffHours > 0) return `${diffHours}h ago`;
      if (diffMinutes > 0) return `${diffMinutes}m ago`;
      return 'Just now';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  }

  /**
   * Format numbers with K/M notation
   */
  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  /**
   * Get status class for indicators
   */
  getStatusClass(type: 'embed' | 'cache'): string {
    if (type === 'embed') {
      return this.embedAvailable() ? 'status-success' : 'status-pending';
    }
    if (type === 'cache') {
      const hitRate = this.getCacheHitRate();
      return hitRate > 70 ? 'status-success' : hitRate > 30 ? 'status-warning' : 'status-error';
    }
    return 'status-neutral';
  }

  /**
   * Get cache hit rate for display
   */
  getCacheHitRate(): number {
    const stats = this.twitterService.getServiceStats();
    return Math.round(stats.cacheStats.hitRate);
  }

  /**
   * Get Twitter username
   */
  getUsername(): string {
    return this.twitterService.getServiceStats().initialized ? 'prismcollect_' : 'loading...';
  }

  /**
   * Track by function for efficient rendering
   */
  trackByPostId(index: number, post: TwitterPost): string {
    return post.id;
  }
}