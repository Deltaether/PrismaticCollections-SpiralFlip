import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PerformancePreloadStrategy implements PreloadingStrategy {
  private connectionSpeed: 'slow' | 'medium' | 'fast' = 'fast';
  private loadedRoutes = new Set<string>();

  constructor() {
    this.detectConnectionSpeed();
  }

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Don't preload the same route twice
    if (route.path && this.loadedRoutes.has(route.path)) {
      return of(null);
    }

    // Check if this route should be preloaded based on performance
    if (!this.shouldPreload(route)) {
      return of(null);
    }

    // Add delay based on connection speed and priority
    const delay = this.getPreloadDelay(route);

    return timer(delay).pipe(
      switchMap(() => {
        if (route.path) {
          this.loadedRoutes.add(route.path);
        }
        console.log(`Preloading route: ${route.path || 'unknown'}`);
        return load();
      })
    );
  }

  private shouldPreload(route: Route): boolean {
    // High priority routes (always preload)
    const highPriorityRoutes = ['phantasia', 'collections'];
    if (route.path && highPriorityRoutes.some(p => route.path!.includes(p))) {
      return true;
    }

    // Don't preload on slow connections for non-essential routes
    if (this.connectionSpeed === 'slow') {
      const essentialRoutes = ['home', 'phantasia'];
      return route.path ? essentialRoutes.some(p => route.path!.includes(p)) : false;
    }

    // Custom preload data
    return route.data?.['preload'] !== false;
  }

  private getPreloadDelay(route: Route): number {
    // High priority routes load immediately
    const highPriorityRoutes = ['phantasia', 'home'];
    if (route.path && highPriorityRoutes.some(p => route.path!.includes(p))) {
      return 0;
    }

    // Adjust delay based on connection speed
    switch (this.connectionSpeed) {
      case 'slow':
        return 5000; // 5 second delay
      case 'medium':
        return 2000; // 2 second delay
      case 'fast':
        return 500;  // 0.5 second delay
      default:
        return 1000; // 1 second default
    }
  }

  private detectConnectionSpeed(): void {
    // Use Network Information API if available
    const connection = (navigator as any).connection ||
                      (navigator as any).mozConnection ||
                      (navigator as any).webkitConnection;

    if (connection) {
      const effectiveType = connection.effectiveType;

      switch (effectiveType) {
        case 'slow-2g':
        case '2g':
          this.connectionSpeed = 'slow';
          break;
        case '3g':
          this.connectionSpeed = 'medium';
          break;
        case '4g':
        default:
          this.connectionSpeed = 'fast';
          break;
      }
    } else {
      // Fallback: estimate based on performance timing
      this.estimateConnectionSpeed();
    }
  }

  private estimateConnectionSpeed(): void {
    if (typeof performance !== 'undefined' && performance.timing) {
      const timing = performance.timing;
      const downloadTime = timing.responseEnd - timing.responseStart;

      if (downloadTime > 2000) {
        this.connectionSpeed = 'slow';
      } else if (downloadTime > 1000) {
        this.connectionSpeed = 'medium';
      } else {
        this.connectionSpeed = 'fast';
      }
    }
  }

  // Method to manually prioritize route preloading
  prioritizeRoute(routePath: string): void {
    // Move route to high priority by removing delay
    if (!this.loadedRoutes.has(routePath)) {
      console.log(`Prioritizing route: ${routePath}`);
      // This would typically trigger immediate loading
      // Implementation depends on specific router usage
    }
  }

  // Get current connection info for debugging
  getConnectionInfo(): { speed: string; loadedRoutes: string[] } {
    return {
      speed: this.connectionSpeed,
      loadedRoutes: Array.from(this.loadedRoutes)
    };
  }
}