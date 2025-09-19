import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Tweet } from '../../services/twitter-data.service';
import { ProfileImageComponent } from '../profile-image/profile-image.component';

@Component({
  selector: 'app-tweet-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatChipsModule, ProfileImageComponent],
  template: `
    <article class="tweet-card" [class.is-retweet]="tweet.isRetweet" [class.is-reply]="tweet.isReply">
      <!-- Tweet Type Indicator -->
      <div class="tweet-type" *ngIf="tweet.isRetweet || tweet.isReply">
        <mat-icon>{{tweet.isRetweet ? 'repeat' : 'reply'}}</mat-icon>
        <span>{{tweet.isRetweet ? 'Retweeted' : 'Replied'}}</span>
      </div>

      <!-- Author Info -->
      <header class="tweet-header">
        <app-profile-image
          [username]="tweet.authorUsername"
          [displayName]="tweet.authorDisplayName"
          [size]="48"
          [verified]="tweet.authorVerified"
          [clickable]="true"
          shape="circle"
          [tooltip]="tweet.authorDisplayName + ' (@' + tweet.authorUsername + ')'"
          (imageClick)="userClick.emit($event)"
          class="author-avatar"
        ></app-profile-image>
        <div class="author-info">
          <h4 class="author-name" (click)="userClick.emit(tweet.authorUsername)">
            {{tweet.authorDisplayName}}
            <mat-icon class="verified-badge" *ngIf="tweet.authorVerified">verified</mat-icon>
          </h4>
          <p class="author-username">@{{tweet.authorUsername}}</p>
        </div>
        <time class="tweet-time" [dateTime]="tweet.createdAt.toISOString()">
          {{formatRelativeTime(tweet.createdAt)}}
        </time>
      </header>

      <!-- Tweet Content -->
      <div class="tweet-content">
        <p class="tweet-text" [innerHTML]="processedTweetText()"></p>

        <!-- Media Grid -->
        <div class="media-grid" *ngIf="tweet.mediaUrls && tweet.mediaUrls.length > 0"
             [class]="'media-count-' + tweet.mediaUrls.length">
          <div
            class="media-item"
            *ngFor="let mediaUrl of tweet.mediaUrls; let i = index; trackBy: trackByMediaUrl"
            [class.video]="tweet.mediaTypes && tweet.mediaTypes[i] === 'video'"
          >
            <img
              *ngIf="!tweet.mediaTypes || tweet.mediaTypes[i] === 'image'"
              [src]="mediaUrl"
              [alt]="'Media from tweet'"
              loading="lazy"
              (error)="onMediaError($event)"
              (click)="openMediaModal(mediaUrl)"
            />

            <div class="video-container" *ngIf="tweet.mediaTypes && tweet.mediaTypes[i] === 'video'">
              <img
                [src]="mediaUrl"
                [alt]="'Video thumbnail'"
                loading="lazy"
                class="video-thumbnail"
              />
              <div class="video-overlay" (click)="openMediaModal(mediaUrl)">
                <mat-icon>play_circle_filled</mat-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- Hashtags -->
        <div class="tweet-entities" *ngIf="tweet.hashtags.length > 0">
          <mat-chip-set>
            <mat-chip *ngFor="let hashtag of tweet.hashtags" class="hashtag-chip">
              #{{hashtag}}
            </mat-chip>
          </mat-chip-set>
        </div>
      </div>

      <!-- Engagement Metrics -->
      <footer class="tweet-engagement">
        <div class="engagement-stats">
          <span class="stat" [class.has-engagement]="tweet.likeCount > 0">
            <mat-icon>favorite</mat-icon>
            {{formatEngagementCount(tweet.likeCount)}}
          </span>
          <span class="stat" [class.has-engagement]="tweet.retweetCount > 0">
            <mat-icon>repeat</mat-icon>
            {{formatEngagementCount(tweet.retweetCount)}}
          </span>
          <span class="stat" [class.has-engagement]="tweet.replyCount > 0">
            <mat-icon>chat_bubble_outline</mat-icon>
            {{formatEngagementCount(tweet.replyCount)}}
          </span>
          <span class="stat" [class.has-engagement]="tweet.quoteCount > 0">
            <mat-icon>format_quote</mat-icon>
            {{formatEngagementCount(tweet.quoteCount)}}
          </span>
        </div>

        <button
          mat-icon-button
          class="view-tweet-btn"
          (click)="tweetClick.emit(tweet)"
          [title]="'View on X'"
        >
          <mat-icon>open_in_new</mat-icon>
        </button>
      </footer>

      <!-- Scraped Time -->
      <div class="scraped-info" *ngIf="showScrapedInfo">
        <small>Collected {{formatRelativeTime(tweet.scrapedAt)}}</small>
      </div>
    </article>
  `,
  styleUrls: ['./tweet-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TweetCardComponent {
  @Input({ required: true }) tweet!: Tweet;
  @Input() showScrapedInfo: boolean = false;
  @Output() tweetClick = new EventEmitter<Tweet>();
  @Output() userClick = new EventEmitter<string>();

  readonly processedTweetText = computed(() => {
    let text = this.tweet.text;

    // Convert URLs to links
    this.tweet.urls.forEach(url => {
      const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="tweet-link">${this.shortenUrl(url)}</a>`;
      text = text.replace(url, linkHtml);
    });

    // Convert hashtags to styled spans
    this.tweet.hashtags.forEach(hashtag => {
      const hashtagRegex = new RegExp(`#${hashtag}\\b`, 'gi');
      text = text.replace(hashtagRegex, `<span class="hashtag">#${hashtag}</span>`);
    });

    // Convert mentions to styled spans
    this.tweet.mentions.forEach(mention => {
      const mentionRegex = new RegExp(`@${mention}\\b`, 'gi');
      text = text.replace(mentionRegex, `<span class="mention">@${mention}</span>`);
    });

    return text;
  });

  onMediaError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/media-error.svg';
    img.alt = 'Media could not be loaded';
  }

  openMediaModal(mediaUrl: string): void {
    // Open media in new tab for now
    window.open(mediaUrl, '_blank', 'noopener,noreferrer');
  }

  trackByMediaUrl = (index: number, mediaUrl: string): string => mediaUrl;

  formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }

  formatEngagementCount(count: number): string {
    if (count === 0) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  }

  private shortenUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      let domain = urlObj.hostname.replace('www.', '');
      if (domain.length > 20) {
        domain = domain.substring(0, 17) + '...';
      }
      return domain;
    } catch {
      return url.length > 25 ? url.substring(0, 22) + '...' : url;
    }
  }
}