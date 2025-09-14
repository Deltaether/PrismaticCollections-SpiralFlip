/**
 * Selective Preloading Strategy
 * 
 * Preloads specific routes based on priority and user behavior
 * to improve perceived performance without bloating initial bundle
 */
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SelectivePreloadStrategy implements PreloadingStrategy {
  
  // Routes to preload immediately (high priority)
  private immediatePreload = new Set([
    'collections',
    'phantasia',
    'home'
  ]);
  
  // Routes to preload after delay (medium priority)
  private delayedPreload = new Set([
    'socials',
    'news'
  ]);
  
  // Routes to never preload (loaded only on demand)
  private noPreload = new Set([
    'test-home'
  ]);

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    const routePath = route.path || '';
    
    // Don't preload if explicitly marked as no-preload
    if (this.noPreload.has(routePath)) {
      return of(null);
    }
    
    // Immediate preload for high priority routes
    if (this.immediatePreload.has(routePath)) {
      console.log(`[Preload] Immediately preloading: ${routePath}`);
      return load();
    }
    
    // Delayed preload for medium priority routes
    if (this.delayedPreload.has(routePath)) {
      console.log(`[Preload] Scheduling delayed preload: ${routePath}`);
      return timer(2000).pipe(
        switchMap(() => {
          console.log(`[Preload] Now preloading: ${routePath}`);
          return load();
        })
      );
    }
    
    // Check if route has custom preload data
    if (route.data && route.data['preload']) {
      const preloadConfig = route.data['preload'];
      
      if (preloadConfig === true) {
        return load();
      }
      
      if (typeof preloadConfig === 'number') {
        return timer(preloadConfig).pipe(
          switchMap(() => load())
        );
      }
      
      if (preloadConfig === 'network-idle') {
        // Preload when network is idle (simplified check)
        return timer(1000).pipe(
          switchMap(() => load())
        );
      }
    }
    
    // Default: no preload
    return of(null);
  }
}