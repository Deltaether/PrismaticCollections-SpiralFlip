import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { interval, Subscription } from 'rxjs';
import {
  TwitterPerformanceMonitorService,
  PerformanceMetrics,
  PerformanceAlert,
  OptimizationRecommendation
} from '../../services/twitter-performance-monitor.service';

/**
 * Twitter Performance Dashboard Component
 *
 * Real-time performance monitoring and optimization tracking for Twitter integration.
 * Shows bundle size reduction, memory optimization, cache efficiency, and more.
 */

@Component({
  selector: 'app-twitter-performance-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatChipsModule,
    MatTabsModule
  ],
  template: `
    <div class="performance-dashboard">

      <!-- Header -->
      <div class="dashboard-header">
        <div class="header-info">
          <h2 class="dashboard-title">
            <mat-icon class="title-icon">analytics</mat-icon>
            Twitter Performance Dashboard
          </h2>
          <p class="dashboard-subtitle">
            Real-time monitoring of Twitter integration optimizations
          </p>
        </div>
        <div class="header-actions">
          <button mat-button
                  (click)="refreshMetrics()"
                  [disabled]="isRefreshing()"
                  class="refresh-btn">
            <mat-icon [class.spinning]="isRefreshing()">refresh</mat-icon>
            Refresh
          </button>
          <button mat-button
                  (click)="exportReport()"
                  class="export-btn">
            <mat-icon>download</mat-icon>
            Export Report
          </button>
        </div>
      </div>

      <!-- Overall Score -->
      <div class="score-section">
        <mat-card class="score-card">
          <div class="score-content">
            <div class="score-circle" [attr.data-score]="overallScore()">
              <div class="score-value">{{ overallScore() }}</div>
              <div class="score-label">Performance Score</div>
            </div>
            <div class="score-details">
              <div class="score-item">
                <span class="score-metric">Bundle Reduction:</span>
                <span class="score-data success">{{ formatBytes(metrics().bundleSizeReduction) }}</span>
              </div>
              <div class="score-item">
                <span class="score-metric">Memory Savings:</span>
                <span class="score-data success">{{ metrics().memoryReduction }}%</span>
              </div>
              <div class="score-item">
                <span class="score-metric">Performance Gain:</span>
                <span class="score-data success">{{ metrics().performanceGain }}%</span>
              </div>
              <div class="score-item">
                <span class="score-metric">Cache Efficiency:</span>
                <span class="score-data success">{{ metrics().cacheEfficiency }}%</span>
              </div>
            </div>
          </div>
        </mat-card>
      </div>

      <!-- Alerts -->
      <div class="alerts-section" *ngIf="alerts().length > 0">
        <h3 class="section-title">
          <mat-icon class="section-icon warning">warning</mat-icon>
          Active Performance Alerts ({{ alerts().length }})
        </h3>
        <div class="alerts-grid">
          <div *ngFor="let alert of alerts()"
               class="alert-card"
               [class]="'alert-' + alert.severity">
            <div class="alert-header">
              <mat-icon class="alert-icon">{{ getAlertIcon(alert.type) }}</mat-icon>
              <span class="alert-metric">{{ alert.metric }}</span>
              <span class="alert-severity">{{ alert.severity.toUpperCase() }}</span>
            </div>
            <p class="alert-message">{{ alert.message }}</p>
            <div class="alert-details">
              <span class="alert-value">Current: {{ formatMetricValue(alert.metric, alert.value) }}</span>
              <span class="alert-threshold">Threshold: {{ formatMetricValue(alert.metric, alert.threshold) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Metrics Tabs -->
      <mat-tab-group class="metrics-tabs">

        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="metrics-grid">

            <!-- Bundle Size -->
            <mat-card class="metric-card">
              <div class="metric-header">
                <mat-icon class="metric-icon">inventory_2</mat-icon>
                <h4 class="metric-title">Bundle Size</h4>
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ formatBytes(metrics().bundleSize) }}</div>
                <div class="metric-comparison">
                  <span class="comparison-label">Savings:</span>
                  <span class="comparison-value success">-{{ formatBytes(metrics().bundleSizeReduction) }}</span>
                </div>
                <mat-progress-bar
                  mode="determinate"
                  [value]="getBundleEfficiency()"
                  class="metric-progress">
                </mat-progress-bar>
              </div>
            </mat-card>

            <!-- Memory Usage -->
            <mat-card class="metric-card">
              <div class="metric-header">
                <mat-icon class="metric-icon">memory</mat-icon>
                <h4 class="metric-title">Memory Usage</h4>
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ formatBytes(metrics().memoryUsage) }}</div>
                <div class="metric-comparison">
                  <span class="comparison-label">Reduction:</span>
                  <span class="comparison-value success">{{ metrics().memoryReduction }}%</span>
                </div>
                <mat-progress-bar
                  mode="determinate"
                  [value]="getMemoryEfficiency()"
                  class="metric-progress">
                </mat-progress-bar>
              </div>
            </mat-card>

            <!-- Cache Hit Rate -->
            <mat-card class="metric-card">
              <div class="metric-header">
                <mat-icon class="metric-icon">cached</mat-icon>
                <h4 class="metric-title">Cache Hit Rate</h4>
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ metrics().cacheHitRate.toFixed(1) }}%</div>
                <div class="metric-comparison">
                  <span class="comparison-label">Target:</span>
                  <span class="comparison-value">85%+</span>
                </div>
                <mat-progress-bar
                  mode="determinate"
                  [value]="metrics().cacheHitRate"
                  class="metric-progress">
                </mat-progress-bar>
              </div>
            </mat-card>

            <!-- API Efficiency -->
            <mat-card class="metric-card">
              <div class="metric-header">
                <mat-icon class="metric-icon">api</mat-icon>
                <h4 class="metric-title">API Efficiency</h4>
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ metrics().apiEfficiency.toFixed(1) }}%</div>
                <div class="metric-comparison">
                  <span class="comparison-label">Calls:</span>
                  <span class="comparison-value">{{ metrics().apiCallsTotal }}</span>
                </div>
                <mat-progress-bar
                  mode="determinate"
                  [value]="metrics().apiEfficiency"
                  class="metric-progress">
                </mat-progress-bar>
              </div>
            </mat-card>

            <!-- Load Time -->
            <mat-card class="metric-card">
              <div class="metric-header">
                <mat-icon class="metric-icon">schedule</mat-icon>
                <h4 class="metric-title">Load Time</h4>
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ formatTime(metrics().loadTime) }}</div>
                <div class="metric-comparison">
                  <span class="comparison-label">Target:</span>
                  <span class="comparison-value">< 3s</span>
                </div>
                <mat-progress-bar
                  mode="determinate"
                  [value]="getLoadTimeEfficiency()"
                  class="metric-progress">
                </mat-progress-bar>
              </div>
            </mat-card>

            <!-- Error Rate -->
            <mat-card class="metric-card">
              <div class="metric-header">
                <mat-icon class="metric-icon">error_outline</mat-icon>
                <h4 class="metric-title">Error Rate</h4>
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ metrics().errorRate.toFixed(1) }}%</div>
                <div class="metric-comparison">
                  <span class="comparison-label">Target:</span>
                  <span class="comparison-value">< 5%</span>
                </div>
                <mat-progress-bar
                  mode="determinate"
                  [value]="100 - metrics().errorRate"
                  class="metric-progress">
                </mat-progress-bar>
              </div>
            </mat-card>

          </div>
        </mat-tab>

        <!-- Optimizations Tab -->
        <mat-tab label="Optimizations">
          <div class="optimizations-section">
            <div class="optimization-progress">
              <h4 class="progress-title">Optimization Progress</h4>
              <div class="progress-bar-container">
                <mat-progress-bar
                  mode="determinate"
                  [value]="optimizationProgress()"
                  class="progress-bar-main">
                </mat-progress-bar>
                <span class="progress-text">{{ optimizationProgress() }}% Complete</span>
              </div>
            </div>

            <div class="recommendations-list">
              <h4 class="recommendations-title">Optimization Recommendations</h4>
              <div class="recommendation-item"
                   *ngFor="let rec of optimizations()"
                   [class.implemented]="rec.implemented">
                <div class="recommendation-header">
                  <div class="recommendation-info">
                    <mat-icon class="recommendation-icon"
                              [class.success]="rec.implemented">
                      {{ rec.implemented ? 'check_circle' : 'radio_button_unchecked' }}
                    </mat-icon>
                    <h5 class="recommendation-title">{{ rec.title }}</h5>
                    <mat-chip-set class="recommendation-chips">
                      <mat-chip class="category-chip" [class]="'chip-' + rec.category">
                        {{ rec.category.toUpperCase() }}
                      </mat-chip>
                      <mat-chip class="impact-chip" [class]="'chip-' + rec.impact">
                        {{ rec.impact.toUpperCase() }} IMPACT
                      </mat-chip>
                      <mat-chip class="effort-chip" [class]="'chip-' + rec.effort">
                        {{ rec.effort.toUpperCase() }} EFFORT
                      </mat-chip>
                    </mat-chip-set>
                  </div>
                  <div class="recommendation-priority">
                    Priority: {{ rec.priority }}
                  </div>
                </div>
                <p class="recommendation-description">{{ rec.description }}</p>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Technical Details Tab -->
        <mat-tab label="Technical Details">
          <div class="technical-details">
            <div class="details-grid">

              <div class="detail-section">
                <h4 class="detail-title">Performance Metrics</h4>
                <div class="detail-items">
                  <div class="detail-item">
                    <span class="detail-label">Time to First Tweet:</span>
                    <span class="detail-value">{{ formatTime(metrics().timeToFirstTweet) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Average Response Time:</span>
                    <span class="detail-value">{{ formatTime(metrics().averageResponseTime) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Interaction Delay:</span>
                    <span class="detail-value">{{ formatTime(metrics().interactionDelay) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Init Time:</span>
                    <span class="detail-value">{{ formatTime(metrics().initTime) }}</span>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <h4 class="detail-title">API Statistics</h4>
                <div class="detail-items">
                  <div class="detail-item">
                    <span class="detail-label">Total API Calls:</span>
                    <span class="detail-value">{{ metrics().apiCallsTotal }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Successful Calls:</span>
                    <span class="detail-value success">{{ metrics().apiCallsSuccessful }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Failed Calls:</span>
                    <span class="detail-value error">{{ metrics().apiCallsFailed }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Success Rate:</span>
                    <span class="detail-value">{{ getSuccessRate().toFixed(1) }}%</span>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <h4 class="detail-title">Memory Details</h4>
                <div class="detail-items">
                  <div class="detail-item">
                    <span class="detail-label">Current Usage:</span>
                    <span class="detail-value">{{ formatBytes(metrics().memoryUsage) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Peak Usage:</span>
                    <span class="detail-value">{{ formatBytes(metrics().memoryPeak) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Cache Size:</span>
                    <span class="detail-value">{{ formatBytes(metrics().cacheSize) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">GC Count:</span>
                    <span class="detail-value">{{ metrics().garbageCollectionCount }}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </mat-tab>

      </mat-tab-group>

    </div>
  `,
  styleUrl: './twitter-performance-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TwitterPerformanceDashboardComponent implements OnInit, OnDestroy {

  private performanceService = inject(TwitterPerformanceMonitorService);
  private refreshSubscription?: Subscription;

  // Component state
  readonly isRefreshing = signal(false);

  // Performance data from service
  readonly metrics = computed(() => this.performanceService.metrics());
  readonly alerts = computed(() => this.performanceService.alerts());
  readonly optimizations = computed(() => this.performanceService.optimizations());
  readonly overallScore = computed(() => this.performanceService.overallScore());
  readonly optimizationProgress = computed(() => this.performanceService.optimizationProgress());

  ngOnInit(): void {
    console.log('📊 Twitter Performance Dashboard initialized');
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  private startAutoRefresh(): void {
    // Auto-refresh every 30 seconds
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.refreshMetrics();
    });
  }

  private stopAutoRefresh(): void {
    this.refreshSubscription?.unsubscribe();
  }

  refreshMetrics(): void {
    this.isRefreshing.set(true);

    // Simulate refresh delay
    setTimeout(() => {
      this.isRefreshing.set(false);
      console.log('📊 Performance metrics refreshed');
    }, 1000);
  }

  exportReport(): void {
    const report = this.performanceService.exportReport();
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `twitter-performance-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
    console.log('📊 Performance report exported');
  }

  // Utility Methods

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  formatTime(ms: number): string {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  }

  formatMetricValue(metric: string, value: number): string {
    if (metric.includes('Size') || metric.includes('Usage')) {
      return this.formatBytes(value);
    }
    if (metric.includes('Time')) {
      return this.formatTime(value);
    }
    if (metric.includes('Rate')) {
      return `${value.toFixed(1)}%`;
    }
    return value.toString();
  }

  getAlertIcon(type: string): string {
    const icons = {
      warning: 'warning',
      error: 'error',
      info: 'info'
    };
    return icons[type as keyof typeof icons] || 'info';
  }

  getBundleEfficiency(): number {
    const current = this.metrics().bundleSize;
    const original = current + this.metrics().bundleSizeReduction;
    return Math.max(0, 100 - (current / original) * 100);
  }

  getMemoryEfficiency(): number {
    return Math.min(100, 100 - this.metrics().memoryReduction);
  }

  getLoadTimeEfficiency(): number {
    const maxTime = 3000; // 3 seconds max
    return Math.max(0, 100 - (this.metrics().loadTime / maxTime) * 100);
  }

  getSuccessRate(): number {
    const total = this.metrics().apiCallsTotal;
    if (total === 0) return 100;
    return (this.metrics().apiCallsSuccessful / total) * 100;
  }
}