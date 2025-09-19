import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  signal,
  computed,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subject, fromEvent, takeUntil } from 'rxjs';

import { TwitterDataService, Tweet, TweetFilters } from '../../services/twitter-data.service';
import { TweetCardComponent } from './tweet-card.component';

@Component({
  selector: 'app-twitter-timeline',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatPaginatorModule,
    TweetCardComponent
  ],
  template: `
    <div class="twitter-timeline-container">


      <!-- Error Display -->
      <div class="error-banner" *ngIf="error()">
        <mat-icon>error</mat-icon>
        <span>{{error()}}</span>
        <button mat-icon-button (click)="dismissError()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="loadingState().isLoading && filteredTweets().length === 0">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Loading tweets...</p>
      </div>

      <!-- Tweet List -->
      <div class="tweets-container" *ngIf="filteredTweets().length > 0">
        <div class="tweets-grid">
          <app-tweet-card
            *ngFor="let tweet of filteredTweets(); trackBy: trackByTweetId"
            [tweet]="tweet"
            (tweetClick)="onTweetClick($event)"
            (userClick)="onUserClick($event)"
          ></app-tweet-card>
        </div>

        <!-- Pagination -->
        <div class="pagination-container" *ngIf="paginationInfo().totalCount > 0">
          <mat-paginator
            [length]="paginationInfo().totalCount"
            [pageSize]="paginationInfo().pageSize"
            [pageIndex]="paginationInfo().currentPage"
            [pageSizeOptions]="[10, 20, 50]"
            [showFirstLastButtons]="true"
            [disabled]="loadingState().isLoading"
            (page)="onPageChange($event)"
            aria-label="Select page of tweets"
          ></mat-paginator>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="filteredTweets().length === 0 && !loadingState().isLoading">
        <mat-icon>auto_awesome</mat-icon>
        <h3>Tweets are updating automatically</h3>
        <p>Our automated system collects the latest tweets regularly. New content will appear here as it becomes available.</p>
        <div class="auto-update-info">
          <mat-icon>schedule</mat-icon>
          <span>Updates every few minutes</span>
        </div>
      </div>

      <!-- Offline Notice -->
      <div class="offline-notice" *ngIf="!isOnline()">
        <mat-icon>wifi_off</mat-icon>
        <span>You're offline. Showing cached tweets.</span>
      </div>
    </div>
  `,
  styleUrls: ['./twitter-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TwitterTimelineComponent implements OnInit, OnDestroy {
  private readonly twitterService = inject(TwitterDataService);
  private readonly destroy$ = new Subject<void>();

  // Expose service signals
  readonly tweets = this.twitterService.tweets;
  readonly filteredTweets = this.twitterService.filteredTweets;
  readonly user = this.twitterService.user;
  readonly scraperStatus = this.twitterService.scraperStatus;
  readonly filters = this.twitterService.filters;
  readonly loadingState = this.twitterService.loadingState;
  readonly error = this.twitterService.error;
  readonly hasMoreTweets = this.twitterService.hasMoreTweets;
  readonly tweetStats = this.twitterService.tweetStats;
  readonly isOnline = this.twitterService.isOnline;
  readonly paginationInfo = this.twitterService.paginationInfo;

  ngOnInit(): void {
    // Initialize the service
    this.twitterService.initialize();

    // Set up visibility change detection for refresh
    this.setupVisibilityRefresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refreshTweets(): void {
    this.twitterService.refreshTweets().subscribe();
  }

  onPageChange(event: PageEvent): void {
    this.twitterService.goToPage(event.pageIndex, event.pageSize).subscribe();
  }


  onTweetClick(tweet: Tweet): void {
    // Open tweet on X/Twitter
    const tweetUrl = `https://x.com/${tweet.authorUsername}/status/${tweet.tweetId}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  }

  onUserClick(username: string): void {
    // Open user profile on X/Twitter
    const userUrl = `https://x.com/${username}`;
    window.open(userUrl, '_blank', 'noopener,noreferrer');
  }

  dismissError(): void {
    this.twitterService.dismissError();
  }

  trackByTweetId = (index: number, tweet: Tweet): string => tweet.tweetId;

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  private setupVisibilityRefresh(): void {
    // Refresh when page becomes visible and it's been more than 5 minutes
    fromEvent(document, 'visibilitychange').pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (!document.hidden && this.isOnline()) {
        const lastRefresh = localStorage.getItem('twitter-last-refresh');
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);

        if (!lastRefresh || parseInt(lastRefresh) < fiveMinutesAgo) {
          this.refreshTweets();
          localStorage.setItem('twitter-last-refresh', Date.now().toString());
        }
      }
    });
  }
}