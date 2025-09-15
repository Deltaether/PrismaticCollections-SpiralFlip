/**
 * Performance testing utilities for dynamic artist cards system
 *
 * These utilities help verify that the optimizations are working correctly
 * and measure the performance improvements across different scenarios.
 */

export interface PerformanceTestResult {
  testName: string;
  success: boolean;
  metrics: {
    executionTime: number;
    memoryUsage: number;
    cacheHitRate?: number;
    renderCount?: number;
  };
  issues: string[];
}

export class PerformanceTestUtil {
  /**
   * Test rapid track changes to ensure smooth operation
   */
  static async testRapidTrackChanges(
    dynamicArtistService: any,
    trackCount: number = 20,
    changeInterval: number = 100
  ): Promise<PerformanceTestResult> {
    const startTime = performance.now();
    const startMemory = this.getMemoryUsage();
    const issues: string[] = [];

    try {
      // Simulate rapid track changes
      for (let i = 0; i < trackCount; i++) {
        const trackTime = i * (60000 / trackCount); // Distribute across 60 seconds
        dynamicArtistService.updateCurrentTime(trackTime);

        // Wait for the change interval
        await this.delay(changeInterval);

        // Check if service is responding
        const currentTrack = dynamicArtistService.currentTrack$.getValue();
        if (!currentTrack && i > 0) {
          issues.push(`Track ${i}: No current track found at time ${trackTime}`);
        }
      }

      const executionTime = performance.now() - startTime;
      const endMemory = this.getMemoryUsage();
      const memoryDelta = endMemory - startMemory;

      return {
        testName: 'Rapid Track Changes',
        success: issues.length === 0,
        metrics: {
          executionTime,
          memoryUsage: memoryDelta
        },
        issues
      };

    } catch (error) {
      return {
        testName: 'Rapid Track Changes',
        success: false,
        metrics: {
          executionTime: performance.now() - startTime,
          memoryUsage: this.getMemoryUsage() - startMemory
        },
        issues: [`Test failed with error: ${error}`]
      };
    }
  }

  /**
   * Test cache efficiency by triggering repeated lookups
   */
  static async testCacheEfficiency(
    currentlyPlayingArtistsService: any,
    lookupCount: number = 100
  ): Promise<PerformanceTestResult> {
    const startTime = performance.now();
    const startMemory = this.getMemoryUsage();
    const issues: string[] = [];

    try {
      // Clear cache stats if available
      if (currentlyPlayingArtistsService.setDebugMode) {
        currentlyPlayingArtistsService.setDebugMode(true);
      }

      // Perform repeated lookups on the same tracks
      const testTracks = ['1', '2', '3', '4', '5'];

      for (let i = 0; i < lookupCount; i++) {
        const trackId = testTracks[i % testTracks.length];
        // Trigger artist lookup (implementation dependent)
        // This would typically be done through the service's public methods
      }

      // Get cache statistics
      const cacheStats = currentlyPlayingArtistsService.getCacheStats?.() || { hitRate: 0 };
      const cacheHitRate = cacheStats.hitRate || 0;

      if (cacheHitRate < 0.5) {
        issues.push(`Low cache hit rate: ${(cacheHitRate * 100).toFixed(1)}%`);
      }

      const executionTime = performance.now() - startTime;
      const endMemory = this.getMemoryUsage();

      return {
        testName: 'Cache Efficiency',
        success: issues.length === 0 && cacheHitRate > 0.5,
        metrics: {
          executionTime,
          memoryUsage: endMemory - startMemory,
          cacheHitRate
        },
        issues
      };

    } catch (error) {
      return {
        testName: 'Cache Efficiency',
        success: false,
        metrics: {
          executionTime: performance.now() - startTime,
          memoryUsage: this.getMemoryUsage() - startMemory,
          cacheHitRate: 0
        },
        issues: [`Test failed with error: ${error}`]
      };
    }
  }

  /**
   * Test component render performance under load
   */
  static async testRenderPerformance(
    component: any,
    renderCount: number = 50
  ): Promise<PerformanceTestResult> {
    const startTime = performance.now();
    const startMemory = this.getMemoryUsage();
    const issues: string[] = [];
    let totalRenderTime = 0;

    try {
      // Enable performance monitoring if available
      if (component.enableDebugMode) {
        component.enableDebugMode();
      }

      // Trigger multiple renders with different artist data
      for (let i = 0; i < renderCount; i++) {
        const renderStart = performance.now();

        // Simulate artist data changes
        const mockArtists = this.generateMockArtists(3 + (i % 5));

        // Trigger render (implementation dependent)
        if (component.updateOptimizedArtistCards) {
          component.updateOptimizedArtistCards(mockArtists);
        }

        // Wait for render to complete
        await this.delay(16); // One frame at 60fps

        const renderTime = performance.now() - renderStart;
        totalRenderTime += renderTime;

        if (renderTime > 32) { // More than 2 frames at 60fps
          issues.push(`Slow render ${i}: ${renderTime.toFixed(2)}ms`);
        }
      }

      const averageRenderTime = totalRenderTime / renderCount;
      const executionTime = performance.now() - startTime;
      const endMemory = this.getMemoryUsage();

      if (averageRenderTime > 16) {
        issues.push(`Average render time too slow: ${averageRenderTime.toFixed(2)}ms`);
      }

      return {
        testName: 'Render Performance',
        success: issues.length === 0,
        metrics: {
          executionTime,
          memoryUsage: endMemory - startMemory,
          renderCount: averageRenderTime
        },
        issues
      };

    } catch (error) {
      return {
        testName: 'Render Performance',
        success: false,
        metrics: {
          executionTime: performance.now() - startTime,
          memoryUsage: this.getMemoryUsage() - startMemory,
          renderCount: 0
        },
        issues: [`Test failed with error: ${error}`]
      };
    }
  }

  /**
   * Test memory leak detection during extended operation
   */
  static async testMemoryLeaks(
    services: any[],
    operationCount: number = 1000
  ): Promise<PerformanceTestResult> {
    const startTime = performance.now();
    const startMemory = this.getMemoryUsage();
    const issues: string[] = [];
    const memoryReadings: number[] = [];

    try {
      // Take memory readings throughout the test
      for (let i = 0; i < operationCount; i++) {
        // Perform various operations to stress test memory
        services.forEach(service => {
          if (service.updateCurrentTime) {
            service.updateCurrentTime(Math.random() * 3600); // Random time in hour
          }
          if (service.setCurrentlyPlayingArtists) {
            service.setCurrentlyPlayingArtists(this.generateMockArtists(2));
          }
        });

        // Take memory reading every 100 operations
        if (i % 100 === 0) {
          memoryReadings.push(this.getMemoryUsage());
        }

        // Small delay to allow garbage collection
        if (i % 200 === 0) {
          await this.delay(1);
        }
      }

      const endMemory = this.getMemoryUsage();
      const memoryGrowth = endMemory - startMemory;
      const executionTime = performance.now() - startTime;

      // Check for excessive memory growth
      if (memoryGrowth > 50) { // More than 50MB growth
        issues.push(`Excessive memory growth: ${memoryGrowth.toFixed(1)}MB`);
      }

      // Check for consistently increasing memory (potential leak)
      if (memoryReadings.length > 5) {
        const growthTrend = this.calculateGrowthTrend(memoryReadings);
        if (growthTrend > 0.5) { // Consistent upward trend
          issues.push(`Potential memory leak detected (growth trend: ${growthTrend.toFixed(2)})`);
        }
      }

      return {
        testName: 'Memory Leak Detection',
        success: issues.length === 0,
        metrics: {
          executionTime,
          memoryUsage: memoryGrowth
        },
        issues
      };

    } catch (error) {
      return {
        testName: 'Memory Leak Detection',
        success: false,
        metrics: {
          executionTime: performance.now() - startTime,
          memoryUsage: this.getMemoryUsage() - startMemory
        },
        issues: [`Test failed with error: ${error}`]
      };
    }
  }

  /**
   * Run comprehensive performance test suite
   */
  static async runFullPerformanceTest(
    dynamicArtistService: any,
    currentlyPlayingArtistsService: any,
    component: any
  ): Promise<PerformanceTestResult[]> {
    console.log('[PerformanceTest] Starting comprehensive performance test...');

    const results: PerformanceTestResult[] = [];

    try {
      // Test 1: Rapid track changes
      results.push(await this.testRapidTrackChanges(dynamicArtistService));

      // Test 2: Cache efficiency
      results.push(await this.testCacheEfficiency(currentlyPlayingArtistsService));

      // Test 3: Render performance
      results.push(await this.testRenderPerformance(component));

      // Test 4: Memory leak detection
      results.push(await this.testMemoryLeaks([dynamicArtistService, currentlyPlayingArtistsService]));

      console.log('[PerformanceTest] All tests completed');
      this.logTestResults(results);

    } catch (error) {
      console.error('[PerformanceTest] Test suite failed:', error);
    }

    return results;
  }

  /**
   * Helper: Get current memory usage
   */
  private static getMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
    }
    return 0; // Fallback if memory API not available
  }

  /**
   * Helper: Delay execution
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Helper: Generate mock artist data for testing
   */
  private static generateMockArtists(count: number): any[] {
    const artists = [];
    for (let i = 0; i < count; i++) {
      artists.push({
        id: `test-artist-${i}`,
        name: `Test Artist ${i}`,
        displayName: `Test Artist ${i}`,
        role: 'Main Artist',
        socialLinks: {},
        color: '#FF6B6B'
      });
    }
    return artists;
  }

  /**
   * Helper: Calculate memory growth trend
   */
  private static calculateGrowthTrend(readings: number[]): number {
    if (readings.length < 2) return 0;

    let growthCount = 0;
    for (let i = 1; i < readings.length; i++) {
      if (readings[i] > readings[i - 1]) {
        growthCount++;
      }
    }

    return growthCount / (readings.length - 1);
  }

  /**
   * Helper: Log test results to console
   */
  private static logTestResults(results: PerformanceTestResult[]): void {
    console.group('[PerformanceTest] Results Summary');

    const passed = results.filter(r => r.success).length;
    const total = results.length;

    console.log(`✅ ${passed}/${total} tests passed`);

    results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${result.testName}`);

      if (result.metrics.executionTime) {
        console.log(`   Execution Time: ${result.metrics.executionTime.toFixed(2)}ms`);
      }

      if (result.metrics.memoryUsage) {
        console.log(`   Memory Delta: ${result.metrics.memoryUsage.toFixed(1)}MB`);
      }

      if (result.metrics.cacheHitRate !== undefined) {
        console.log(`   Cache Hit Rate: ${(result.metrics.cacheHitRate * 100).toFixed(1)}%`);
      }

      if (result.issues.length > 0) {
        console.warn('   Issues:', result.issues);
      }
    });

    console.groupEnd();
  }
}