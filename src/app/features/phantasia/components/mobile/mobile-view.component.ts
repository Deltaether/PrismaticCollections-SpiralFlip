import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { CubicContainerComponent } from './components/cubic-container/cubic-container.component';
import { MobileNavigationService } from './services/mobile-navigation.service';

// 【✓】 Define interfaces for type safety
interface NavigationState {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly isTransitioning: boolean;
  readonly currentRoute: string;
  readonly previousRoute: string | null;
}

@Component({
  selector: 'app-mobile-view',
  standalone: true,
  imports: [CommonModule, RouterModule, CubicContainerComponent],
  template: `
    <div class="mobile-container">
      <app-cubic-container></app-cubic-container>
      
      <!-- Debug panel if debug mode is active -->
      <div *ngIf="isDebugMode" class="debug-panel">
        <div class="debug-info">
          <p>Current Page: {{ navigationState.currentPage }}</p>
          <p>Total Pages: {{ navigationState.totalPages }}</p>
          <p>Transitioning: {{ navigationState.isTransitioning }}</p>
          <p>Current Route: {{ navigationState.currentRoute }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mobile-container {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background: #000;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .debug-panel {
      position: fixed;
      bottom: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.7);
      color: #00ff00;
      font-family: monospace;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #00ff00;
      font-size: 12px;
      z-index: 9999;
      max-width: 300px;
      pointer-events: none;
    }
    
    .debug-info p {
      margin: 3px 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush // 【✓】 Optimize change detection
})
export class MobileViewComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  readonly isDebugMode = false; // Set to true only during development
  
  // 【✓】 Navigation state with full type safety
  navigationState: NavigationState = {
    currentPage: 0,
    totalPages: 6,
    isTransitioning: false,
    currentRoute: '/',
    previousRoute: null
  };

  constructor(
    public readonly navigationService: MobileNavigationService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  // 【✓】 Initialize component
  ngOnInit(): void {
    if (this.isDebugMode) {
      console.log('[MobileView] Initializing component');
    }

    this.setupNavigationSubscription();
    this.setupErrorHandling();
  }

  // 【✓】 Setup navigation subscription
  private setupNavigationSubscription(): void {
    this.navigationService.getNavigationState()
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('[MobileView] Error in navigation subscription:', error);
          return [];
        })
      )
      .subscribe(state => {
        if (this.isDebugMode) {
          console.log(`[MobileView] Navigation state updated:`, state);
        }
        
        this.navigationState = {
          currentPage: state.currentIndex,
          totalPages: state.totalPages,
          isTransitioning: state.isTransitioning,
          currentRoute: state.currentRoute,
          previousRoute: state.previousRoute
        };
        
        this.cdr.markForCheck();
      });
  }
  
  // 【✓】 Setup error handling
  private setupErrorHandling(): void {
    this.navigationService.getErrors()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        console.error(`[MobileView] Navigation error (${error.type}):`, error.message);
      });
  }

  // 【✓】 Handle navigation to next page
  navigateNext(): void {
    if (this.isDebugMode) {
      console.log('[MobileView] Navigating to next page');
    }
    this.navigationService.nextPage();
  }

  // 【✓】 Handle navigation to previous page
  navigatePrevious(): void {
    if (this.isDebugMode) {
      console.log('[MobileView] Navigating to previous page');
    }
    this.navigationService.previousPage();
  }

  // 【✓】 Navigate to specific page
  navigateToPage(index: number): void {
    if (this.isDebugMode) {
      console.log(`[MobileView] Navigating to page: ${index}`);
    }
    this.navigationService.navigateToPage(index);
  }

  // 【✓】 Cleanup resources
  ngOnDestroy(): void {
    if (this.isDebugMode) {
      console.log('[MobileView] Destroying component');
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
} 