import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwitterEnhancedService, TwitterServiceStats } from '../../services/twitter-enhanced.service';
import { GelDbTwitterUser, GelDbTwitterTweet } from '../../core/services/geldb-integration.service';

/**
 * Twitter Integration Test Component
 *
 * This component provides a testing interface for the Twitter integration.
 * It allows developers to:
 * - Test OAuth 1.0a authentication
 * - Verify API calls work correctly
 * - Monitor API usage and caching
 * - Test cache functionality
 * - View service statistics
 *
 * IMPORTANT: This component is for development/testing only.
 * Use it to verify the integration works before implementing in production components.
 */

interface TestResult {
  success: boolean;
  user?: GelDbTwitterUser;
  tweets?: GelDbTwitterTweet[];
  error?: string;
  apiCallsUsed: number;
  timestamp: Date;
}

@Component({
  selector: 'app-twitter-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="twitter-test-container">
      <h2>🐦 Twitter Integration Test Panel</h2>

      <!-- Status Section -->
      <div class="status-section">
        <h3>📊 Service Status</h3>
        <div class="status-grid">
          <div class="status-item">
            <span class="label">Loading:</span>
            <span class="value" [class.loading]="twitterService.loading()">
              {{ twitterService.loading() ? 'Yes' : 'No' }}
            </span>
          </div>
          <div class="status-item">
            <span class="label">Error:</span>
            <span class="value error">{{ twitterService.error() || 'None' }}</span>
          </div>
          <div class="status-item">
            <span class="label">Conservative Mode:</span>
            <span class="value">{{ twitterService.conservativeMode() ? 'ON (1 tweet max)' : 'OFF' }}</span>
          </div>
        </div>
      </div>

      <!-- Statistics Section -->
      <div class="stats-section" *ngIf="stats()">
        <h3>📈 API Statistics</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="label">Monthly API Calls Used:</span>
            <span class="value">{{ stats()!.totalApiCalls }}/100</span>
          </div>
          <div class="stat-item">
            <span class="label">Remaining Calls:</span>
            <span class="value" [class.warning]="stats()!.monthlyRemaining < 10">
              {{ stats()!.monthlyRemaining }}
            </span>
          </div>
          <div class="stat-item">
            <span class="label">Success Rate:</span>
            <span class="value">{{ stats()!.successRate.toFixed(1) }}%</span>
          </div>
          <div class="stat-item">
            <span class="label">Cache Hit Rate:</span>
            <span class="value">{{ stats()!.cacheHitRate.toFixed(1) }}%</span>
          </div>
          <div class="stat-item">
            <span class="label">Cached Users:</span>
            <span class="value">{{ stats()!.cachedUsers }}</span>
          </div>
          <div class="stat-item">
            <span class="label">Cached Tweets:</span>
            <span class="value">{{ stats()!.cachedTweets }}</span>
          </div>
        </div>
      </div>

      <!-- Test Controls -->
      <div class="controls-section">
        <h3>🧪 Test Controls</h3>
        <div class="button-group">
          <button
            (click)="runIntegrationTest()"
            [disabled]="twitterService.loading()"
            class="test-button primary">
            {{ twitterService.loading() ? 'Testing...' : 'Run Integration Test' }}
          </button>

          <button
            (click)="getUserData()"
            [disabled]="twitterService.loading()"
            class="test-button secondary">
            Get @prismcollect_ User
          </button>

          <button
            (click)="getTweets()"
            [disabled]="twitterService.loading()"
            class="test-button secondary">
            Get Tweets (Conservative)
          </button>

          <button
            (click)="refreshStats()"
            class="test-button neutral">
            Refresh Stats
          </button>

          <button
            (click)="clearCache()"
            class="test-button danger">
            Clear Cache
          </button>
        </div>
      </div>

      <!-- Test Results -->
      <div class="results-section" *ngIf="testResults().length > 0">
        <h3>📋 Test Results</h3>
        <div class="results-list">
          <div *ngFor="let result of testResults()" class="result-item" [class.success]="result.success" [class.error]="!result.success">
            <div class="result-header">
              <span class="timestamp">{{ result.timestamp.toLocaleTimeString() }}</span>
              <span class="status">{{ result.success ? '✅ Success' : '❌ Failed' }}</span>
              <span class="api-calls">API Calls: {{ result.apiCallsUsed }}</span>
            </div>

            <div class="result-content" *ngIf="result.success">
              <div class="user-info" *ngIf="result.user">
                <h4>User: @{{ result.user.username }}</h4>
                <p>Name: {{ result.user.display_name }}</p>
                <p>Followers: {{ result.user.followers_count || 'N/A' }}</p>
                <p>Verified: {{ result.user.verified ? 'Yes' : 'No' }}</p>
              </div>

              <div class="tweets-info" *ngIf="result.tweets && result.tweets.length > 0">
                <h4>Tweets ({{ result.tweets.length }}):</h4>
                <div *ngFor="let tweet of result.tweets" class="tweet-item">
                  <p class="tweet-text">{{ tweet.text.substring(0, 200) }}{{ tweet.text.length > 200 ? '...' : '' }}</p>
                  <div class="tweet-meta">
                    <span>❤️ {{ tweet.like_count || 0 }}</span>
                    <span>🔄 {{ tweet.retweet_count || 0 }}</span>
                    <span>💬 {{ tweet.reply_count || 0 }}</span>
                    <span>{{ formatDate(tweet.created_at) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="result-error" *ngIf="!result.success">
              <p>Error: {{ result.error }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Important Notes -->
      <div class="notes-section">
        <h3>⚠️ Important Notes</h3>
        <ul>
          <li><strong>Conservative Mode:</strong> Limited to 1 tweet fetch to preserve API calls</li>
          <li><strong>Free Tier Limit:</strong> 100 API calls per month total</li>
          <li><strong>Caching:</strong> Data is cached for 24 hours to minimize API usage</li>
          <li><strong>Testing Strategy:</strong> Always check cache first, API only when necessary</li>
          <li><strong>Rate Limiting:</strong> Service automatically respects Twitter rate limits</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .twitter-test-container {
      max-width: 1200px;
      margin: 20px auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8f9fa;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    h2 {
      color: #1da1f2;
      text-align: center;
      margin-bottom: 30px;
    }

    h3 {
      color: #333;
      border-bottom: 2px solid #1da1f2;
      padding-bottom: 5px;
      margin-bottom: 15px;
    }

    .status-section, .stats-section, .controls-section, .results-section, .notes-section {
      background: white;
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 6px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .status-grid, .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }

    .status-item, .stat-item {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 4px;
    }

    .label {
      font-weight: 600;
      color: #666;
    }

    .value {
      font-weight: 500;
      color: #333;
    }

    .value.loading {
      color: #1da1f2;
      animation: pulse 1s infinite;
    }

    .value.error {
      color: #e74c3c;
    }

    .value.warning {
      color: #f39c12;
      font-weight: bold;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .button-group {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .test-button {
      padding: 12px 20px;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .test-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .test-button.primary {
      background: #1da1f2;
      color: white;
    }

    .test-button.primary:hover:not(:disabled) {
      background: #0d8bd9;
    }

    .test-button.secondary {
      background: #17a2b8;
      color: white;
    }

    .test-button.secondary:hover:not(:disabled) {
      background: #138496;
    }

    .test-button.neutral {
      background: #6c757d;
      color: white;
    }

    .test-button.neutral:hover:not(:disabled) {
      background: #545b62;
    }

    .test-button.danger {
      background: #dc3545;
      color: white;
    }

    .test-button.danger:hover:not(:disabled) {
      background: #c82333;
    }

    .results-list {
      max-height: 600px;
      overflow-y: auto;
    }

    .result-item {
      border: 1px solid #dee2e6;
      border-radius: 6px;
      margin-bottom: 15px;
      overflow: hidden;
    }

    .result-item.success {
      border-left: 4px solid #28a745;
    }

    .result-item.error {
      border-left: 4px solid #dc3545;
    }

    .result-header {
      background: #f8f9fa;
      padding: 10px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      font-weight: 600;
    }

    .result-content {
      padding: 15px;
    }

    .user-info, .tweets-info {
      margin-bottom: 15px;
    }

    .user-info h4, .tweets-info h4 {
      color: #1da1f2;
      margin-bottom: 10px;
    }

    .user-info p {
      margin: 5px 0;
      color: #666;
    }

    .tweet-item {
      background: #f8f9fa;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 10px;
    }

    .tweet-text {
      margin-bottom: 8px;
      line-height: 1.4;
      color: #333;
    }

    .tweet-meta {
      display: flex;
      gap: 15px;
      font-size: 12px;
      color: #666;
    }

    .result-error {
      padding: 15px;
      color: #dc3545;
      font-weight: 500;
    }

    .notes-section ul {
      color: #666;
      line-height: 1.6;
    }

    .notes-section li {
      margin-bottom: 8px;
    }

    .notes-section strong {
      color: #333;
    }
  `]
})
export class TwitterTestComponent implements OnInit {

  stats = signal<TwitterServiceStats | null>(null);
  testResults = signal<TestResult[]>([]);

  constructor(
    public twitterService: TwitterEnhancedService
  ) {}

  ngOnInit(): void {
    this.refreshStats();
    console.log('🧪 Twitter Test Component initialized');
  }

  /**
   * Run comprehensive integration test
   */
  runIntegrationTest(): void {
    console.log('🚀 Running comprehensive Twitter integration test...');

    this.twitterService.testIntegration().subscribe({
      next: (result) => {
        const testResult: TestResult = {
          ...result,
          timestamp: new Date()
        };

        this.addTestResult(testResult);
        this.refreshStats();

        if (result.success) {
          console.log('✅ Integration test completed successfully');
          console.log(`📊 API calls used: ${result.apiCallsUsed}`);
          console.log(`👤 User: @${result.user?.username}`);
          console.log(`📝 Tweets fetched: ${result.tweets?.length || 0}`);
        } else {
          console.error('❌ Integration test failed:', result.error);
        }
      },
      error: (error) => {
        console.error('❌ Integration test error:', error);
        this.addTestResult({
          success: false,
          error: error.message,
          apiCallsUsed: 0,
          timestamp: new Date()
        });
      }
    });
  }

  /**
   * Test user data retrieval
   */
  getUserData(): void {
    console.log('👤 Testing user data retrieval...');

    this.twitterService.getPrismCollectUser().subscribe({
      next: (user) => {
        const result: TestResult = {
          success: !!user,
          user: user || undefined,
          error: user ? undefined : 'User not found',
          apiCallsUsed: 1, // Estimate
          timestamp: new Date()
        };

        this.addTestResult(result);
        this.refreshStats();

        if (user) {
          console.log('✅ User data retrieved successfully:', user);
        } else {
          console.warn('⚠️ User data not found');
        }
      },
      error: (error) => {
        console.error('❌ User data error:', error);
        this.addTestResult({
          success: false,
          error: error.message,
          apiCallsUsed: 1,
          timestamp: new Date()
        });
      }
    });
  }

  /**
   * Test tweet retrieval
   */
  getTweets(): void {
    console.log('📝 Testing tweet retrieval...');

    this.twitterService.getPrismCollectTweets().subscribe({
      next: (tweets) => {
        const result: TestResult = {
          success: true,
          tweets,
          apiCallsUsed: 1, // Estimate
          timestamp: new Date()
        };

        this.addTestResult(result);
        this.refreshStats();

        console.log(`✅ Retrieved ${tweets.length} tweets`);
      },
      error: (error) => {
        console.error('❌ Tweet retrieval error:', error);
        this.addTestResult({
          success: false,
          error: error.message,
          apiCallsUsed: 1,
          timestamp: new Date()
        });
      }
    });
  }

  /**
   * Refresh service statistics
   */
  refreshStats(): void {
    this.twitterService.getServiceStats().subscribe(stats => {
      this.stats.set(stats);
      console.log('📊 Stats refreshed:', stats);
    });
  }

  /**
   * Clear cache and reset
   */
  clearCache(): void {
    if (confirm('Are you sure you want to clear the Twitter cache? This will remove all cached users and tweets.')) {
      this.twitterService.clearCache();
      this.testResults.set([]);
      this.refreshStats();
      console.log('🗑️ Cache cleared and test results reset');
    }
  }

  /**
   * Add test result to the list
   */
  private addTestResult(result: TestResult): void {
    const currentResults = this.testResults();
    this.testResults.set([result, ...currentResults.slice(0, 9)]); // Keep last 10 results
  }

  formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  }
}