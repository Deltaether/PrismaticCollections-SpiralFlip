import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  componentRenders: number;
  artistLookups: number;
  cacheHits: number;
  cacheSize: number;
  memoryUsage: number;
  averageRenderTime: number;
  lastUpdateTime: number;
  frameRate: number;
}

/**
 * Performance monitoring service for dynamic artist cards system
 *
 * Tracks key performance indicators to optimize the artist cards experience:
 * - Component render frequency and timing
 * - Cache hit rates and efficiency
 * - Memory usage patterns
 * - Animation frame rates
 * - Service call frequencies
 */
@Injectable({
  providedIn: 'root'
})
export class PerformanceMonitorService {
  private readonly metrics: PerformanceMetrics = {
    componentRenders: 0,
    artistLookups: 0,
    cacheHits: 0,
    cacheSize: 0,
    memoryUsage: 0,
    averageRenderTime: 0,
    lastUpdateTime: 0,
    frameRate: 0
  };

  private readonly metricsSubject = new BehaviorSubject<PerformanceMetrics>(this.metrics);
  private renderTimes: number[] = [];
  private frameRateHistory: number[] = [];
  private lastFrameTime = 0;
  private isMonitoring = false;

  public readonly metrics$ = this.metricsSubject.asObservable();

  /**
   * Start performance monitoring
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.resetMetrics();
    this.startFrameRateMonitoring();

    console.log('[PerformanceMonitor] Monitoring started');
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    console.log('[PerformanceMonitor] Final metrics:', this.metrics);
  }

  /**
   * Record component render with timing
   */
  recordComponentRender(renderTime: number): void {
    if (!this.isMonitoring) return;

    this.metrics.componentRenders++;
    this.renderTimes.push(renderTime);

    // Keep only last 50 render times for average calculation
    if (this.renderTimes.length > 50) {
      this.renderTimes.shift();
    }

    this.metrics.averageRenderTime = this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length;
    this.metrics.lastUpdateTime = Date.now();

    this.updateMetrics();
  }

  /**
   * Record artist lookup operation
   */
  recordArtistLookup(wasCacheHit: boolean): void {
    if (!this.isMonitoring) return;

    this.metrics.artistLookups++;
    if (wasCacheHit) {
      this.metrics.cacheHits++;
    }

    this.updateMetrics();
  }

  /**
   * Update cache size metrics
   */
  updateCacheSize(size: number): void {
    if (!this.isMonitoring) return;

    this.metrics.cacheSize = size;
    this.updateMetrics();
  }

  /**
   * Record memory usage (approximation)
   */
  recordMemoryUsage(): void {
    if (!this.isMonitoring) return;

    // Rough memory estimation based on performance.memory if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
    }

    this.updateMetrics();
  }

  /**
   * Get current cache hit rate
   */
  getCacheHitRate(): number {
    return this.metrics.artistLookups > 0 ? this.metrics.cacheHits / this.metrics.artistLookups : 0;
  }

  /**
   * Get performance summary for debugging
   */
  getPerformanceSummary(): {
    cacheEfficiency: string;
    renderPerformance: string;
    memoryUsage: string;
    frameRate: string;
  } {
    const cacheHitRate = (this.getCacheHitRate() * 100).toFixed(1);
    const avgRender = this.metrics.averageRenderTime.toFixed(2);
    const memory = this.metrics.memoryUsage.toFixed(1);
    const fps = this.metrics.frameRate.toFixed(1);

    return {
      cacheEfficiency: `${cacheHitRate}% hit rate (${this.metrics.cacheHits}/${this.metrics.artistLookups})`,
      renderPerformance: `${avgRender}ms avg render (${this.metrics.componentRenders} renders)`,
      memoryUsage: `${memory}MB heap used`,
      frameRate: `${fps} FPS`
    };
  }

  /**
   * Check if performance is optimal
   */
  isPerformanceOptimal(): {
    isOptimal: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    // Check cache hit rate
    if (this.getCacheHitRate() < 0.8) {
      issues.push('Low cache hit rate - consider increasing cache size');
    }

    // Check render times
    if (this.metrics.averageRenderTime > 16) {
      issues.push('Slow render times - consider reducing DOM complexity');
    }

    // Check frame rate
    if (this.metrics.frameRate < 55) {
      issues.push('Low frame rate - animations may appear choppy');
    }

    // Check memory usage
    if (this.metrics.memoryUsage > 100) {
      issues.push('High memory usage - check for memory leaks');
    }

    return {
      isOptimal: issues.length === 0,
      issues
    };
  }

  /**
   * Reset all metrics
   */
  private resetMetrics(): void {
    Object.assign(this.metrics, {
      componentRenders: 0,
      artistLookups: 0,
      cacheHits: 0,
      cacheSize: 0,
      memoryUsage: 0,
      averageRenderTime: 0,
      lastUpdateTime: Date.now(),
      frameRate: 0
    });

    this.renderTimes = [];
    this.frameRateHistory = [];
  }

  /**
   * Update metrics observable
   */
  private updateMetrics(): void {
    this.metricsSubject.next({ ...this.metrics });
  }

  /**
   * Monitor frame rate for animation performance
   */
  private startFrameRateMonitoring(): void {
    const measureFrameRate = (timestamp: number) => {
      if (!this.isMonitoring) return;

      if (this.lastFrameTime > 0) {
        const deltaTime = timestamp - this.lastFrameTime;
        const fps = 1000 / deltaTime;

        this.frameRateHistory.push(fps);

        // Keep only last 60 frame measurements
        if (this.frameRateHistory.length > 60) {
          this.frameRateHistory.shift();
        }

        // Calculate average FPS
        this.metrics.frameRate = this.frameRateHistory.reduce((a, b) => a + b, 0) / this.frameRateHistory.length;
      }

      this.lastFrameTime = timestamp;
      requestAnimationFrame(measureFrameRate);
    };

    requestAnimationFrame(measureFrameRate);
  }

  /**
   * Create a render timer for measuring component render time
   */
  createRenderTimer(): {
    start: () => void;
    end: () => void;
  } {
    let startTime = 0;

    return {
      start: () => {
        startTime = performance.now();
      },
      end: () => {
        const renderTime = performance.now() - startTime;
        this.recordComponentRender(renderTime);
      }
    };
  }

  /**
   * Log performance metrics to console (for debugging)
   */
  logMetrics(): void {
    const summary = this.getPerformanceSummary();
    const performance = this.isPerformanceOptimal();

    console.group('[PerformanceMonitor] Current Metrics');
    console.log('Cache Efficiency:', summary.cacheEfficiency);
    console.log('Render Performance:', summary.renderPerformance);
    console.log('Memory Usage:', summary.memoryUsage);
    console.log('Frame Rate:', summary.frameRate);

    if (!performance.isOptimal) {
      console.warn('Performance Issues:', performance.issues);
    } else {
      console.log('✅ Performance is optimal');
    }

    console.groupEnd();
  }
}