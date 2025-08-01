import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { map, filter, takeUntil, catchError, tap } from 'rxjs/operators';

// 【✓】 Define interfaces for type safety
interface NavigationConfig {
  readonly routes: readonly string[];
  readonly defaultRoute: string;
}

interface NavigationState {
  readonly currentIndex: number;
  readonly totalPages: number;
  readonly isTransitioning: boolean;
  readonly currentRoute: string;
  readonly previousRoute: string | null;
}

// 【✓】 Define error types
type NavigationError = 'ROUTE_ERROR' | 'INDEX_ERROR' | 'STATE_ERROR';

@Injectable({
  providedIn: 'root'
})
export class MobileNavigationService implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly isDebugMode = true;
  
  // 【✓】 Navigation configuration with route definitions
  // 【✓】 Mobile credits component now added
  private readonly navigationConfig: NavigationConfig = {
    routes: ['/', '/music', '/about', '/contact', '/credits', '/top', '/bottom'] as const,
    defaultRoute: '/'
  };

  // 【✓】 Navigation state with BehaviorSubject
  private readonly navigationState$ = new BehaviorSubject<NavigationState>({
    currentIndex: 0,
    totalPages: this.navigationConfig.routes.length,
    isTransitioning: false,
    currentRoute: this.navigationConfig.defaultRoute,
    previousRoute: null
  });

  // 【✓】 Error subject with proper typing
  private readonly errorSubject = new Subject<{ type: NavigationError; message: string }>();

  constructor(private readonly router: Router) {
    if (this.isDebugMode) {
      console.log('[MobileNavigation] Service initialized');
      console.log('[MobileNavigation] Available routes:', this.navigationConfig.routes);
    }
    
    this.initializeRouteListener();
    this.syncCurrentRouteWithState();
  }

  // 【✓】 Initialize route listener to keep track of route changes
  private initializeRouteListener(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      const fullRoute = event.urlAfterRedirects;
      // Extract the part after '/mobile' if it exists
      const route = fullRoute.startsWith('/mobile') 
        ? fullRoute.substring('/mobile'.length) || '/' 
        : fullRoute;
        
      this.updateStateFromRoute(route);
      
      if (this.isDebugMode) {
        console.log(`[MobileNavigation] Route changed to: ${route}`);
        console.log(`[MobileNavigation] Current state:`, this.navigationState$.value);
      }
    });
  }

  // 【✓】 Sync current route with navigation state on initialization
  private syncCurrentRouteWithState(): void {
    const fullRoute = this.router.url;
    // Extract the part after '/mobile' if it exists
    const route = fullRoute.startsWith('/mobile') 
      ? fullRoute.substring('/mobile'.length) || '/' 
      : fullRoute;
      
    this.updateStateFromRoute(route);
    
    if (this.isDebugMode) {
      console.log(`[MobileNavigation] Initial route: ${route}`);
      console.log(`[MobileNavigation] Initial state:`, this.navigationState$.value);
    }
  }

  // 【✓】 Update state based on current route
  private updateStateFromRoute(route: string): void {
    const routeIndex = this.navigationConfig.routes.findIndex(r => r === route);
    
    if (routeIndex !== -1) {
      const currentState = this.navigationState$.value;
      this.navigationState$.next({
        ...currentState,
        currentIndex: routeIndex,
        previousRoute: currentState.currentRoute,
        currentRoute: route
      });
    } else if (this.isDebugMode) {
      console.warn(`[MobileNavigation] Route not found in config: ${route}`);
    }
  }

  // 【✓】 Handle navigation errors
  private handleError(type: NavigationError, message: string): void {
    if (this.isDebugMode) {
      console.error(`[MobileNavigation] ${type}: ${message}`);
    }
    this.errorSubject.next({ type, message });
  }

  // 【✓】 Get current page index
  getCurrentPageIndex(): Observable<number> {
    return this.navigationState$.pipe(
      map(state => state.currentIndex),
      catchError(error => {
        this.handleError('STATE_ERROR', `Error getting current page index: ${error}`);
        return of(0); // Default to index 0 on error
      })
    );
  }

  // 【✓】 Get current route
  getCurrentRoute(): Observable<string> {
    return this.navigationState$.pipe(
      map(state => state.currentRoute),
      catchError(error => {
        this.handleError('STATE_ERROR', `Error getting current route: ${error}`);
        return of(this.navigationConfig.defaultRoute); // Default to home route on error
      })
    );
  }

  // 【✓】 Navigate to next page
  nextPage(): void {
    try {
      const currentState = this.navigationState$.value;
      
      if (currentState.isTransitioning) {
        if (this.isDebugMode) {
          console.log('[MobileNavigation] Already transitioning, ignoring nextPage request');
        }
        return;
      }
      
      const nextIndex = (currentState.currentIndex + 1) % currentState.totalPages;
      
      if (this.isDebugMode) {
        console.log(`[MobileNavigation] Navigating to next page: ${nextIndex}`);
      }
      
      this.navigateToPage(nextIndex);
    } catch (error: unknown) {
      this.handleError('STATE_ERROR', `Error navigating to next page: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 【✓】 Navigate to previous page
  previousPage(): void {
    try {
      const currentState = this.navigationState$.value;
      
      if (currentState.isTransitioning) {
        if (this.isDebugMode) {
          console.log('[MobileNavigation] Already transitioning, ignoring previousPage request');
        }
        return;
      }
      
      const prevIndex = (currentState.currentIndex - 1 + currentState.totalPages) % currentState.totalPages;
      
      if (this.isDebugMode) {
        console.log(`[MobileNavigation] Navigating to previous page: ${prevIndex}`);
      }
      
      this.navigateToPage(prevIndex);
    } catch (error: unknown) {
      this.handleError('STATE_ERROR', `Error navigating to previous page: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 【✓】 Navigate to specific page
  navigateToPage(index: number): void {
    try {
      if (index < 0 || index >= this.navigationConfig.routes.length) {
        this.handleError('INDEX_ERROR', `Invalid page index: ${index}`);
        return;
      }

      const currentState = this.navigationState$.value;
      
      if (currentState.isTransitioning) {
        if (this.isDebugMode) {
          console.log('[MobileNavigation] Already transitioning, ignoring navigateToPage request');
        }
        return;
      }
      
      if (index === currentState.currentIndex) {
        if (this.isDebugMode) {
          console.log(`[MobileNavigation] Already on page ${index}, ignoring navigation`);
        }
        return;
      }

      const route = this.navigationConfig.routes[index];
      
      if (this.isDebugMode) {
        console.log(`[MobileNavigation] Navigating to route: ${route} (index: ${index})`);
      }

      this.setTransitioning(true);
      this.router.navigate(['/mobile' + route])
        .then(() => {
          this.updateCurrentIndex(index, route);
          // Add a slight delay to allow transitions to complete
          setTimeout(() => {
            this.setTransitioning(false);
          }, 500);
        })
        .catch((error: unknown) => {
          this.handleError('ROUTE_ERROR', `Error navigating to route ${route}: ${error instanceof Error ? error.message : String(error)}`);
          this.setTransitioning(false);
        });
    } catch (error: unknown) {
      this.handleError('STATE_ERROR', `Error in navigateToPage: ${error instanceof Error ? error.message : String(error)}`);
      this.setTransitioning(false);
    }
  }

  // 【✓】 Update current index and route
  private updateCurrentIndex(index: number, route: string): void {
    try {
      const currentState = this.navigationState$.value;
      this.navigationState$.next({
        ...currentState,
        currentIndex: index,
        previousRoute: currentState.currentRoute,
        currentRoute: route
      });
      
      if (this.isDebugMode) {
        console.log(`[MobileNavigation] Updated current index to ${index} and route to ${route}`);
      }
    } catch (error: unknown) {
      this.handleError('STATE_ERROR', `Error updating current index: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 【✓】 Set transitioning state
  private setTransitioning(isTransitioning: boolean): void {
    try {
      const currentState = this.navigationState$.value;
      
      if (currentState.isTransitioning === isTransitioning) {
        return; // No change needed
      }
      
      this.navigationState$.next({
        ...currentState,
        isTransitioning
      });
      
      if (this.isDebugMode) {
        console.log(`[MobileNavigation] Set transitioning state to ${isTransitioning}`);
      }
    } catch (error: unknown) {
      this.handleError('STATE_ERROR', `Error setting transitioning state: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 【✓】 Get navigation state
  getNavigationState(): Observable<NavigationState> {
    return this.navigationState$.asObservable().pipe(
      catchError(error => {
        this.handleError('STATE_ERROR', `Error getting navigation state: ${error}`);
        return of({
          currentIndex: 0,
          totalPages: this.navigationConfig.routes.length,
          isTransitioning: false,
          currentRoute: this.navigationConfig.defaultRoute,
          previousRoute: null
        });
      })
    );
  }

  // 【✓】 Get error stream
  getErrors(): Observable<{ type: NavigationError; message: string }> {
    return this.errorSubject.asObservable();
  }

  // 【✓】 Check if user can navigate (not in transition)
  canNavigate(): Observable<boolean> {
    return this.navigationState$.pipe(
      map(state => !state.isTransitioning),
      catchError(error => {
        this.handleError('STATE_ERROR', `Error checking navigation availability: ${error}`);
        return of(false); // Default to not allowing navigation on error
      })
    );
  }

  // 【✓】 Reset navigation
  resetNavigation(): void {
    try {
      if (this.isDebugMode) {
        console.log('[MobileNavigation] Resetting navigation');
      }
      this.navigateToPage(0);
    } catch (error: unknown) {
      this.handleError('STATE_ERROR', `Error resetting navigation: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 【✓】 Cleanup resources
  ngOnDestroy(): void {
    if (this.isDebugMode) {
      console.log('[MobileNavigation] Destroying service');
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
