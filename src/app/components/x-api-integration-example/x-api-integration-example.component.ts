import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, catchError, of } from 'rxjs';

import {
  XApiService,
  XApiUser,
  XApiTweet,
  UserTweetsResponse,
  ProcessedXApiError
} from '../../services/x-api';

/**
 * X API Integration Example Component with OAuth 1.0a
 *
 * Demonstrates proper integration patterns for the new official X API V2 service
 * with OAuth 1.0a authentication to eliminate CORS issues.
 *
 * Key Features:
 * - Official X API V2 integration
 * - OAuth 1.0a authentication (no CORS issues!)
 * - Proper error handling with user feedback
 * - Rate limit awareness
 * - Responsive loading states
 * - Component-level caching
 *
 * Usage Patterns:
 * 1. User Profile Display
 * 2. Tweet Timeline Display
 * 3. Project-specific Tweet Feed
 * 4. Error Handling and Recovery
 * 5. Rate Limit Management
 * 6. OAuth 1.0a Authentication Demo
 */

interface ComponentState {
  loading: boolean;
  error: string | null;
  userProfile: XApiUser | null;
  tweets: XApiTweet[] | null;
  rateLimitWarning: boolean;
}

@Component({
  selector: 'app-x-api-integration-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="x-api-integration">
      <!-- Service Status Display -->
      <div class="service-status" [class]="serviceStatusClass()">
        <h3>X API Service Status</h3>
        <div class="status-grid">
          <div class="status-item">
            <span class="label">Ready:</span>
            <span class="value">{{ xApiService.isReady() ? 'Yes' : 'No' }}</span>
          </div>
          <div class="status-item">
            <span class="label">Loading:</span>
            <span class="value">{{ xApiService.isLoading() ? 'Yes' : 'No' }}</span>
          </div>
          <div class="status-item">
            <span class="label">Rate Limit:</span>
            <span class="value">{{ xApiService.rateLimitStatus() }}</span>
          </div>
        </div>

        @if (xApiService.hasError()) {
          <div class="error-banner">
            <strong>Service Error:</strong> {{ xApiService.status().error }}
          </div>
        }
      </div>

      <!-- User Profile Section -->
      <div class="user-profile-section">
        <h3>User Profile Example</h3>
        <div class="controls">
          <button
            (click)="loadUserProfile('prismcollect_')"
            [disabled]="state().loading || !xApiService.isReady()"
            class="load-button">
            Load @prismcollect_ Profile
          </button>
          <button
            (click)="loadUserProfile('elonmusk')"
            [disabled]="state().loading || !xApiService.isReady()"
            class="load-button">
            Load @elonmusk Profile
          </button>
        </div>

        @if (state().loading && !state().userProfile) {
          <div class="loading-spinner">Loading user profile...</div>
        }

        @if (state().userProfile; as user) {
          <div class="user-card">
            <img [src]="user.profile_image_url" [alt]="user.name" class="profile-image">
            <div class="user-info">
              <h4>{{ user.name }}</h4>
              <p class="username">@{{ user.username }}</p>
              @if (user.description) {
                <p class="description">{{ user.description }}</p>
              }
              @if (user.verified) {
                <span class="verified-badge">✓ Verified</span>
              }
              @if (user.public_metrics) {
                <div class="metrics">
                  <span>{{ user.public_metrics.followers_count | number }} followers</span>
                  <span>{{ user.public_metrics.tweet_count | number }} tweets</span>
                </div>
              }
            </div>
          </div>
        }
      </div>

      <!-- User Tweets Section -->
      <div class="user-tweets-section">
        <h3>User Tweets Example</h3>
        <div class="controls">
          <button
            (click)="loadUserTweets('prismcollect_', 5)"
            [disabled]="state().loading || !xApiService.isReady()"
            class="load-button">
            Load Recent Tweets (5)
          </button>
          <button
            (click)="loadUserTweets('prismcollect_', 10)"
            [disabled]="state().loading || !xApiService.isReady()"
            class="load-button">
            Load More Tweets (10)
          </button>
        </div>

        @if (state().loading && !state().tweets) {
          <div class="loading-spinner">Loading tweets...</div>
        }

        @if (state().tweets; as tweets) {
          <div class="tweets-container">
            @for (tweet of tweets; track tweet.id) {
              <div class="tweet-card">
                <div class="tweet-header">
                  <span class="tweet-id">{{ tweet.id }}</span>
                  @if (tweet.created_at) {
                    <span class="tweet-date">{{ formatDate(tweet.created_at) }}</span>
                  }
                </div>
                <div class="tweet-content">
                  {{ tweet.text }}
                </div>
                @if (tweet.public_metrics) {
                  <div class="tweet-metrics">
                    <span>{{ tweet.public_metrics.like_count }} likes</span>
                    <span>{{ tweet.public_metrics.retweet_count }} retweets</span>
                    <span>{{ tweet.public_metrics.reply_count }} replies</span>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>

      <!-- Project-Specific Integration Example -->
      <div class="project-integration-section">
        <h3>Project Integration Example</h3>
        <p>Optimized for project accounts like @prismcollect_</p>
        <button
          (click)="loadProjectTweets('prismcollect_')"
          [disabled]="state().loading || !xApiService.isReady()"
          class="load-button">
          Load Project Updates
        </button>
      </div>

      <!-- Error Handling Example -->
      @if (state().error) {
        <div class="error-section">
          <h3>Error Handling</h3>
          <div class="error-message">
            {{ state().error }}
          </div>
          <button (click)="clearError()" class="clear-button">
            Clear Error
          </button>
        </div>
      }

      <!-- Rate Limit Warning -->
      @if (state().rateLimitWarning) {
        <div class="rate-limit-warning">
          <h3>Rate Limit Warning</h3>
          <p>API usage is high. Requests may be delayed to avoid hitting limits.</p>
          <button (click)="clearRateLimitWarning()" class="clear-button">
            Dismiss
          </button>
        </div>
      }

      <!-- Debug Information -->
      <div class="debug-section">
        <h3>Debug Information</h3>
        <button (click)="showServiceStats()" class="debug-button">
          Show Service Stats
        </button>
        <button (click)="clearCache()" class="debug-button">
          Clear Cache
        </button>
        <button (click)="toggleLogging()" class="debug-button">
          Toggle Logging
        </button>
      </div>
    </div>
  `,
  styles: [`
    .x-api-integration {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .service-status {
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
      border: 2px solid;
    }

    .service-status.ready {
      background-color: #f0f9f0;
      border-color: #28a745;
    }

    .service-status.error {
      background-color: #fdf2f2;
      border-color: #dc3545;
    }

    .service-status.loading {
      background-color: #fff8e1;
      border-color: #ffc107;
    }

    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
      margin: 12px 0;
    }

    .status-item {
      display: flex;
      justify-content: space-between;
    }

    .label {
      font-weight: 600;
    }

    .value {
      color: #666;
    }

    .error-banner {
      background-color: #f8d7da;
      color: #721c24;
      padding: 12px;
      border-radius: 4px;
      margin-top: 12px;
    }

    .user-profile-section,
    .user-tweets-section,
    .project-integration-section,
    .error-section,
    .rate-limit-warning,
    .debug-section {
      margin-bottom: 32px;
      padding: 20px;
      border: 1px solid #e1e5e9;
      border-radius: 8px;
    }

    .controls {
      margin: 16px 0;
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .load-button,
    .clear-button,
    .debug-button {
      padding: 8px 16px;
      border: 1px solid #007bff;
      background-color: #007bff;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .load-button:hover:not(:disabled),
    .clear-button:hover,
    .debug-button:hover {
      background-color: #0056b3;
    }

    .load-button:disabled {
      background-color: #6c757d;
      border-color: #6c757d;
      cursor: not-allowed;
    }

    .loading-spinner {
      text-align: center;
      padding: 20px;
      color: #666;
    }

    .user-card {
      display: flex;
      gap: 16px;
      padding: 16px;
      border: 1px solid #e1e5e9;
      border-radius: 8px;
      background-color: #f8f9fa;
    }

    .profile-image {
      width: 64px;
      height: 64px;
      border-radius: 50%;
    }

    .user-info h4 {
      margin: 0 0 4px 0;
      font-size: 18px;
    }

    .username {
      color: #666;
      margin: 0 0 8px 0;
    }

    .description {
      margin: 8px 0;
      line-height: 1.4;
    }

    .verified-badge {
      background-color: #1da1f2;
      color: white;
      padding: 2px 6px;
      border-radius: 12px;
      font-size: 12px;
    }

    .metrics {
      display: flex;
      gap: 16px;
      margin-top: 8px;
      font-size: 14px;
      color: #666;
    }

    .tweets-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .tweet-card {
      padding: 16px;
      border: 1px solid #e1e5e9;
      border-radius: 8px;
      background-color: white;
    }

    .tweet-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 12px;
      color: #666;
    }

    .tweet-content {
      line-height: 1.4;
      margin-bottom: 12px;
    }

    .tweet-metrics {
      display: flex;
      gap: 16px;
      font-size: 14px;
      color: #666;
    }

    .error-section,
    .rate-limit-warning {
      background-color: #fdf2f2;
      border-color: #dc3545;
    }

    .error-message {
      background-color: white;
      padding: 12px;
      border-radius: 4px;
      margin: 12px 0;
      color: #721c24;
    }

    .debug-section {
      background-color: #f8f9fa;
    }

    @media (max-width: 600px) {
      .x-api-integration {
        padding: 12px;
      }

      .user-card {
        flex-direction: column;
        text-align: center;
      }

      .controls {
        flex-direction: column;
      }
    }
  `]
})
export class XApiIntegrationExampleComponent implements OnInit, OnDestroy {
  private readonly xApiService = inject(XApiService);
  private readonly destroy$ = new Subject<void>();

  // Component state management
  private stateSignal = signal<ComponentState>({
    loading: false,
    error: null,
    userProfile: null,
    tweets: null,
    rateLimitWarning: false
  });

  readonly state = this.stateSignal.asReadonly();

  // Computed properties for template
  readonly serviceStatusClass = computed(() => {
    if (this.xApiService.hasError()) return 'error';
    if (this.xApiService.isLoading()) return 'loading';
    if (this.xApiService.isReady()) return 'ready';
    return 'loading';
  });

  ngOnInit(): void {
    // X API service with OAuth 1.0a is automatically initialized from environment
    // No manual initialization needed - OAuth credentials are loaded automatically!

    console.log('🚀 X API Integration Example Component with OAuth 1.0a');

    // Check if service is ready
    if (this.xApiService.serviceReady()) {
      console.log('✅ X API service ready with OAuth 1.0a authentication');
    } else {
      const status = this.xApiService.status();
      console.warn('⚠️ X API service not ready:', status.error);
      this.updateState({ error: status.error || 'OAuth 1.0a authentication not ready' });
    }

    // Monitor rate limit status
    this.xApiService.getRateLimitStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(rateLimitStatus => {
        const warning = rateLimitStatus.overall === 'warning' || rateLimitStatus.overall === 'critical';
        this.updateState({ rateLimitWarning: warning });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load user profile example
   */
  loadUserProfile(username: string): void {
    this.updateState({ loading: true, error: null });

    this.xApiService.getUserProfile(username, {
      includeMetrics: true,
      includeVerification: true
    })
    .pipe(
      takeUntil(this.destroy$),
      catchError((error: ProcessedXApiError) => {
        this.updateState({
          loading: false,
          error: error.userMessage
        });
        return of(null);
      })
    )
    .subscribe(user => {
      this.updateState({
        loading: false,
        userProfile: user
      });
    });
  }

  /**
   * Load user tweets example
   */
  loadUserTweets(username: string, maxResults: number): void {
    this.updateState({ loading: true, error: null });

    this.xApiService.getUserTweets(username, {
      maxResults,
      includeMetrics: true,
      includeMedia: true,
      exclude: ['retweets']
    })
    .pipe(
      takeUntil(this.destroy$),
      catchError((error: ProcessedXApiError) => {
        this.updateState({
          loading: false,
          error: error.userMessage
        });
        return of({ tweets: [], includes: undefined, meta: undefined });
      })
    )
    .subscribe((result: UserTweetsResponse) => {
      this.updateState({
        loading: false,
        tweets: result.tweets
      });
    });
  }

  /**
   * Project-specific tweet loading example
   */
  loadProjectTweets(projectUsername: string): void {
    this.updateState({ loading: true, error: null });

    this.xApiService.getProjectTweets(projectUsername, 5)
      .pipe(
        takeUntil(this.destroy$),
        catchError((error: ProcessedXApiError) => {
          this.updateState({
            loading: false,
            error: error.userMessage
          });
          return of({ tweets: [], includes: undefined, meta: undefined });
        })
      )
      .subscribe((result: UserTweetsResponse) => {
        this.updateState({
          loading: false,
          tweets: result.tweets
        });
      });
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.updateState({ error: null });
  }

  /**
   * Clear rate limit warning
   */
  clearRateLimitWarning(): void {
    this.updateState({ rateLimitWarning: false });
  }

  /**
   * Show service statistics
   */
  showServiceStats(): void {
    this.xApiService.getServiceStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => {
        console.log('📊 X API Service Statistics:', stats);
        alert('Service stats logged to console. Check developer tools.');
      });
  }

  /**
   * Clear service cache
   */
  clearCache(): void {
    this.xApiService.clearCache();
    this.updateState({
      userProfile: null,
      tweets: null
    });
  }

  /**
   * Toggle debug logging
   */
  toggleLogging(): void {
    // This would typically read current state and toggle
    this.xApiService.updateConfig({
      enableLogging: !this.xApiService.status().error // Simple toggle logic
    });
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  /**
   * Update component state
   */
  private updateState(updates: Partial<ComponentState>): void {
    const current = this.stateSignal();
    this.stateSignal.set({ ...current, ...updates });
  }
}