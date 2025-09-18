import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { TwitterIntegrationService, Tweet } from '../../services/twitter-integration.service';

/**
 * Twitter Feed Component
 *
 * Displays Twitter content using multiple integration strategies:
 * 1. Twitter Embed Widget (primary, no CORS issues)
 * 2. Fallback tweets (when embed fails)
 *
 * This component demonstrates the proper implementation of Twitter integration
 * while respecting CORS limitations and providing fallback content.
 */
@Component({
  selector: 'app-twitter-feed',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './twitter-feed.component.html',
  styleUrl: './twitter-feed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TwitterFeedComponent implements OnInit, OnDestroy {
  @Input() showHeader = true;
  @Input() maxTweets = 5;
  @Input() embedHeight = 600;
  @Input() theme: 'light' | 'dark' = 'dark';

  private twitterService = inject(TwitterIntegrationService);
  private subscriptions = new Set<Subscription>();

  // Computed signals from service
  readonly loading = computed(() => this.twitterService.loading());
  readonly error = computed(() => this.twitterService.error());
  readonly tweets = computed(() => this.twitterService.tweets().slice(0, this.maxTweets));
  readonly embedLoaded = computed(() => this.twitterService.embedLoaded());
  readonly lastUpdate = computed(() => this.twitterService.getLastUpdateTime());

  // Component state
  readonly showEmbedFallback = signal(false);
  readonly embedContainerId = signal(`twitter-embed-${Math.random().toString(36).substr(2, 9)}`);

  constructor() {}

  ngOnInit(): void {
    console.log('🐦 TwitterFeedComponent: Initializing Twitter feed...');
    this.initializeTwitterFeed();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions.clear();
  }

  /**
   * Initialize Twitter feed with embed widget primary strategy
   */
  private initializeTwitterFeed(): void {
    // Try embed widget first (no CORS issues)
    setTimeout(() => {
      try {
        this.twitterService.createEmbedTimeline(this.embedContainerId());
        console.log('✅ Twitter embed widget initialized');
      } catch (error) {
        console.warn('⚠️ Twitter embed failed, using fallback:', error);
        this.showEmbedFallback.set(true);
      }
    }, 1000);

    // Load fallback tweets for metadata
    const tweetsSub = this.twitterService.refreshTweets().subscribe({
      next: (tweets) => {
        console.log(`📊 Loaded ${tweets.length} fallback tweets for metadata`);
      },
      error: (error) => {
        console.log('ℹ️ Using static fallback tweets:', error.message);
        this.showEmbedFallback.set(true);
      }
    });

    this.subscriptions.add(tweetsSub);
  }

  /**
   * Retry Twitter integration
   */
  retryTwitter(): void {
    console.log('🔄 Retrying Twitter integration...');
    this.showEmbedFallback.set(false);
    this.initializeTwitterFeed();
  }

  /**
   * Refresh Twitter feed
   */
  refreshFeed(): void {
    console.log('🔄 Refreshing Twitter feed...');

    // Refresh embed widget
    if (this.embedLoaded()) {
      try {
        this.twitterService.createEmbedTimeline(this.embedContainerId());
      } catch (error) {
        console.warn('Failed to refresh embed:', error);
      }
    }

    // Refresh fallback data
    const refreshSub = this.twitterService.refreshTweets().subscribe({
      next: (tweets) => {
        console.log(`✅ Refreshed ${tweets.length} tweets`);
      },
      error: (error) => {
        console.warn('⚠️ Refresh failed:', error.message);
      }
    });

    this.subscriptions.add(refreshSub);
  }

  /**
   * Open Twitter profile
   */
  openTwitterProfile(): void {
    window.open(this.twitterService.getTwitterUrl(), '_blank', 'noopener,noreferrer');
  }

  /**
   * Open individual tweet
   */
  openTweet(tweet: Tweet): void {
    this.twitterService.openTweetUrl(tweet.id);
  }

  /**
   * Share tweet
   */
  shareTweet(tweet: Tweet): void {
    this.twitterService.shareTweet(tweet);
  }

  /**
   * Format tweet content with hashtags and mentions
   */
  formatTweetContent(content: string): string {
    return this.twitterService.formatTweetContent(content);
  }

  /**
   * Get Twitter username
   */
  getTwitterUsername(): string {
    return this.twitterService.getTwitterUsername();
  }

  /**
   * Track by function for tweets
   */
  trackByTweetId(index: number, tweet: Tweet): string {
    return tweet.id;
  }

  /**
   * Format numbers for display (K, M notation)
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
   * Get status info for debugging
   */
  getStatusInfo(): string {
    const embed = this.embedLoaded() ? '✅' : '❌';
    const fallback = this.showEmbedFallback() ? '✅' : '❌';
    const error = this.error() ? '❌' : '✅';

    return `Embed: ${embed} | Fallback: ${fallback} | Error: ${error}`;
  }
}