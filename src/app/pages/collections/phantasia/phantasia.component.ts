import { Component, HostListener, ElementRef, ViewChild, AfterViewInit, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MusicPlayerComponent } from '../../../tools/music-player/music-player.component'; // Removed - now in right-side menu
import { CDCasesComponent } from '../../../tools/cd-cases/cd-cases.component';
import { AudioService } from './services/music-player/audio.service';
import { DeviceDetectionService } from '../../../services/device-detection.service';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MobileViewComponent } from './mobile/mobile-view.component';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { SiteVersionSelectorComponent } from '../../../components/site-version-selector/site-version-selector.component';
import { DisclaimerComponent } from '../../../components/disclaimer/disclaimer.component';
import { SceneLoaderComponent } from '../../../tools/cd-cases/scene-loader/scene-loader.component';
import { SiteHeaderComponent } from '../../../shared/components/site-header/site-header.component';

// 【✓】 Define interfaces for type safety
interface ViewportDimensions {
  readonly width: number;
  readonly height: number;
  readonly aspectRatio: number;
}

interface DesignDimensions {
  readonly width: 1920;
  readonly height: 1080;
}

type Section = 'introduction' | 'disc-1' | 'disc-2' | 'pv' | 'information';

/**
 * PhantasiaComponent - Handles the 3D experience of Project Phantasia
 * This is NOT the main app component anymore but specifically for the 3D experience
 * 【✓】
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    // MusicPlayerComponent, // Removed - now in right-side menu
    CDCasesComponent,
    RouterModule,
    MobileViewComponent,
    SiteVersionSelectorComponent,
    DisclaimerComponent,
    SceneLoaderComponent,
    SiteHeaderComponent
  ],
  template: `
    <!-- PhantasiaComponent - Only renders for specific routes -->
    <ng-container *ngIf="shouldShowPhantasiaContent">
      <!-- Site Header - Add for both mobile and desktop views -->
      <app-site-header></app-site-header>
      
      <!-- Global Loading Screen - highest z-index -->
      <app-scene-loader *ngIf="showLoading"></app-scene-loader>
      
      <!-- Disclaimer Screen - appears before anything else -->
      <app-disclaimer
        *ngIf="showDisclaimer"
        (acknowledged)="onDisclaimerAcknowledged()"
      ></app-disclaimer>
      
      <!-- Site Version Selector - appears after disclaimer -->
      <app-site-version-selector
        *ngIf="!showDisclaimer && showVersionSelector"
        (versionSelected)="onVersionSelected($event)"
        (selectorClosed)="onSelectorClosed()"
      ></app-site-version-selector>
      
      <!-- Main experience container - only render when not in loading state -->
      <div class="main-container" #mainContent *ngIf="!showDisclaimer && !showVersionSelector && !isMobileView && showCDCasesForRoute">
        <app-cd-cases (loadingChange)="onCDCasesLoadingChange($event)"></app-cd-cases>
      </div>
      
      <!-- Only show content when loading is complete -->
      <ng-container *ngIf="!showLoading && !showVersionSelector && !showDisclaimer">
        <ng-container *ngIf="!isMobileView; else mobileTemplate">
          <!-- Router Outlet for standard pages (except introduction which shows CD cases) -->
          <router-outlet *ngIf="!showCDCasesForRoute"></router-outlet>
        </ng-container>
        <ng-template #mobileTemplate>
          <app-mobile-view></app-mobile-view>
        </ng-template>
      </ng-container>
    </ng-container>
    
    <!-- For the home route -->
    <router-outlet *ngIf="shouldShowHomeContent"></router-outlet>
    
    <!-- For all other routes, just show the router outlet -->
    <router-outlet *ngIf="!shouldShowPhantasiaContent && !shouldShowHomeContent"></router-outlet>
  `,
  styleUrls: ['./phantasia.component.scss'],
  styles: [`
    .main-container {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background: #000;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 500;
    }
    .scene-container {
      width: 1920px;
      height: 1080px;
      position: relative;
      transform-origin: center;
      transform: scale(1);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush // 【✓】 Optimize change detection
})
export class PhantasiaComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('mainContent') private readonly mainContent!: ElementRef<HTMLElement>;
  
  private readonly destroy$ = new Subject<void>();
  private readonly SCROLL_COOLDOWN = 1000;
  private readonly DESIGN_DIMENSIONS: DesignDimensions = { width: 1920, height: 1080 };
  private readonly SELECTOR_STORAGE_KEY = 'prismatic_collections_site_version_preference';
  private readonly DISCLAIMER_STORAGE_KEY = 'prismatic_collections_disclaimer_acknowledged';
  
  readonly sections: readonly Section[] = ['introduction', 'disc-1', 'disc-2', 'pv', 'information'] as const;
  
  isAnimating = false;
  isDebugMode = true;
  isLoading = true;
  cdCasesLoading = true; // Add explicit tracking for CD cases loading state
  isMobileView = false;
  showVersionSelector = true;
  showDisclaimer = true;
  lastScrollTime = 0;
  currentSection: Section = 'introduction';
  
  private viewport: ViewportDimensions = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
  };

  constructor(
    private readonly audioService: AudioService,
    public readonly deviceDetectionService: DeviceDetectionService,
    public readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {
    // Subscribe to router events to determine when to show PhantasiaComponent content
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      // This will force recheck of shouldShowPhantasiaContent when routes change
      if (this.isDebugMode) {
        console.log(`[PhantasiaComponent] Route changed: ${this.router.url}`);
      }
      this.initializeStateBasedOnRoute();
      this.cdr.markForCheck();
    });
    
    // Initialize state based on current route
    this.initializeStateBasedOnRoute();
  }
  
  /**
   * Initialize component state based on current route
   * 【✓】
   */
  private initializeStateBasedOnRoute(): void {
    const currentUrl = this.router.url;
    
    // Skip initialization for routes that shouldn't show Phantasia content
    if (!this.shouldShowPhantasiaContent) {
      if (this.isDebugMode) {
        console.log(`[PhantasiaComponent] Not on Phantasia route, skipping initialization`);
      }
      return;
    }
    
    // Check if user has already acknowledged the disclaimer
    const disclaimerAcknowledged = localStorage.getItem(this.DISCLAIMER_STORAGE_KEY);
    
    if (disclaimerAcknowledged) {
      this.showDisclaimer = false;
      
      if (this.isDebugMode) {
        console.log(`[PhantasiaComponent] Disclaimer already acknowledged`);
      }
      
      // Check for version preference
      this.checkVersionPreference();
    } else {
      // Show disclaimer first
      this.showDisclaimer = true;
      if (this.isDebugMode) {
        console.log(`[PhantasiaComponent] Showing disclaimer`);
      }
    }
  }
  
  /**
   * Checks if user has a saved version preference
   * 【✓】
   */
  private checkVersionPreference(): void {
    const savedPreference = localStorage.getItem(this.SELECTOR_STORAGE_KEY);
    
    if (savedPreference) {
      // If preference exists, don't show selector
      this.showVersionSelector = false;
      
      if (this.isDebugMode) {
        console.log(`[PhantasiaComponent] Found saved preference: ${savedPreference}`);
      }
      
      // Initialize view based on saved preference
      this.initializeViewBasedOnPreference(savedPreference);
    } else {
      // Show version selector after disclaimer
      this.showVersionSelector = true;
      if (this.isDebugMode) {
        console.log(`[PhantasiaComponent] No saved preference, showing version selector`);
      }
    }
  }

  /**
   * Handles user acknowledgment of the disclaimer
   * Saves acknowledgment and proceeds to version selector
   * 【✓】
   */
  onDisclaimerAcknowledged(): void {
    if (this.isDebugMode) {
      console.log(`[PhantasiaComponent] Disclaimer acknowledged`);
    }
    
    // Save acknowledgment in local storage
    localStorage.setItem(this.DISCLAIMER_STORAGE_KEY, 'true');
    
    // Hide disclaimer and check version preference
    this.showDisclaimer = false;
    this.checkVersionPreference();
    this.cdr.markForCheck();
  }

  /**
   * Determines whether to show CD Cases based on current route
   * Only show for collections/phantasia route
   * 【✓】
   */
  get showCDCasesForRoute(): boolean {
    return this.router.url === '/collections/phantasia';
  }

  /**
   * Determines if PhantasiaComponent content should be shown
   * Only shows for introduction and its related routes
   * 【✓】 
   */
  get shouldShowPhantasiaContent(): boolean {
    const currentUrl = this.router.url;
    // Show Phantasia content only for these specific routes
    return currentUrl === '/collections/phantasia' || 
           currentUrl === '/disc-1' || 
           currentUrl === '/disc-2' || 
           currentUrl === '/pv' || 
           currentUrl === '/information';
  }

  /**
   * Determines if home component should be shown (for root URL)
   * 【✓】
   */
  get shouldShowHomeContent(): boolean {
    return this.router.url === '/' || this.router.url === '/home';
  }

  // Compute derived loading state that considers all loading sources
  get showLoading(): boolean {
    // Show loading when any of these conditions are true
    return this.isLoading || this.cdCasesLoading || this.showDisclaimer || this.showVersionSelector;
  }

  // 【✓】 Initialize view and handle initial routing
  private initializeView(): void {
    // Don't do anything if not on Phantasia route
    if (!this.shouldShowPhantasiaContent) {
      return;
    }
    
    // Simply set loading to false after a delay
    setTimeout(() => {
      if (this.isDebugMode) {
        console.log('[Loading] Setting isLoading state to false');
      }
      this.isLoading = false;
      this.cdr.markForCheck();
    }, 500);
  }

  // 【✓】 Initialize view based on saved preference
  private initializeViewBasedOnPreference(preference: string): void {
    // Don't do anything if not on Phantasia route
    if (!this.shouldShowPhantasiaContent) {
      // Just set loading to false and exit immediately
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }, 500);
      return;
    }
    
    if (preference === '3d') {
      this.isMobileView = false;
      if (!this.router.url.includes('/collections/phantasia')) {
        this.router.navigate(['/collections/phantasia'], { replaceUrl: true });
      }
    } else { // 'mobile'
      this.isMobileView = true;
      if (!this.router.url.includes('/mobile')) {
        this.router.navigate(['/mobile'], { replaceUrl: true });
      }
    }
    
    setTimeout(() => {
      if (this.isDebugMode) {
        console.log('[Loading] Setting loading state to false based on preference');
      }
      this.isLoading = false;
      this.cdr.markForCheck();
    }, 500);
  }

  // 【✓】 Handle version selection from selector
  onVersionSelected(version: string): void {
    if (this.isDebugMode) {
      console.log(`[PhantasiaComponent] User selected version: ${version}`);
    }
    
    // Save the user's preference
    localStorage.setItem(this.SELECTOR_STORAGE_KEY, version);
    
    this.showVersionSelector = false;
    this.initializeViewBasedOnPreference(version);
    this.cdr.markForCheck();
  }
  
  // 【✓】 Handle selector closed without selection
  onSelectorClosed(): void {
    if (this.isDebugMode) {
      console.log(`[PhantasiaComponent] Version selector closed without selection`);
    }
    
    // Just hide the selector without redirecting
    this.showVersionSelector = false;
    
    // Set loading to false after a short delay
    setTimeout(() => {
      this.isLoading = false;
      this.cdr.markForCheck();
    }, 500);
  }

  // 【✓】 Lifecycle hooks
  ngOnInit(): void {
    // Skip initialization for non-Phantasia routes
    if (!this.shouldShowPhantasiaContent) {
      if (this.isDebugMode) {
        console.log('[PhantasiaComponent] Not on Phantasia route, skipping ngOnInit');
      }
      return;
    }
    
    if (this.isDebugMode) {
      console.log('[Loading] OnInit - Current state:', {
        isLoading: this.isLoading,
        isMobileView: this.isMobileView,
        currentRoute: this.router.url
      });
    }

    this.initializeView();
    if (!this.isMobileView) {
      this.calculateViewportDimensions();
    }
  }

  ngAfterViewInit(): void {
    // Skip initialization for non-Phantasia routes
    if (!this.shouldShowPhantasiaContent) {
      if (this.isDebugMode) {
        console.log('[PhantasiaComponent] Not on Phantasia route, skipping ngAfterViewInit');
      }
      return;
    }
    
    if (this.isDebugMode) {
      console.log('[Loading] AfterViewInit - isMobileView:', this.isMobileView);
    }
    
    if (!this.isMobileView) {
      this.detectCurrentSection();
      this.updateAudioTrack(this.currentSection);
      this.calculateScaling();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // 【✓】 View management - no longer automatically detects device type
  private checkDeviceAndSetView(): void {
    // This method is now deprecated and does nothing
    // We no longer automatically detect device type
    // User explicitly chooses via the home page
    if (this.isDebugMode) {
      console.log('[View Check] Automatic device detection disabled');
    }
  }

  // 【✓】 Navigation logic
  private navigateToAppropriateView(): void {
    const currentRoute = this.router.url;
    const isMobileRoute = currentRoute.includes('/mobile');
    const isIntroRoute = currentRoute.includes('/collections/phantasia');
    
    if (this.isMobileView && !isMobileRoute) {
      if (this.isDebugMode) {
        console.log('[View Check] Switching to mobile view due to aspect ratio or device type');
      }
      this.router.navigate(['/mobile'], { replaceUrl: true });
    } else if (!this.isMobileView && !isIntroRoute) {
      if (this.isDebugMode) {
        console.log('[View Check] Switching to desktop view - aspect ratio is acceptable');
      }
      this.router.navigate(['/collections/phantasia'], { replaceUrl: true });
    }
  }
  
  // 【✓】 Viewport calculations
  private calculateViewportDimensions(): void {
    if (this.isMobileView) return;
    
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      aspectRatio: window.innerWidth / window.innerHeight
    };
    this.calculateScaling();
  }

  // 【✓】 Scene scaling
  private calculateScaling(): void {
    if (this.isMobileView) return;
    
    const mainContainer = document.querySelector('.main-container') as HTMLElement;
    const sceneContainer = document.querySelector('.scene-container') as HTMLElement;
    
    if (!mainContainer || !sceneContainer) return;
    
    const scale = Math.min(
      mainContainer.clientWidth / this.DESIGN_DIMENSIONS.width,
      mainContainer.clientHeight / this.DESIGN_DIMENSIONS.height
    );
    
    sceneContainer.style.transform = `scale(${scale})`;
    
    if (this.isDebugMode) {
      console.log('[Scaling] Container:', mainContainer.clientWidth, 'x', mainContainer.clientHeight);
      console.log('[Scaling] Scene:', this.DESIGN_DIMENSIONS.width, 'x', this.DESIGN_DIMENSIONS.height);
      console.log('[Scaling] Applied Scale:', scale);
    }
  }

  // 【✓】 Section management
  private detectCurrentSection(): void {
    const mainElement = this.mainContent?.nativeElement;
    if (!mainElement) return;

    const closestSection = this.sections.reduce((closest, section) => {
    const element = document.getElementById(section);
      if (!element) return closest;

      const distance = Math.abs(element.getBoundingClientRect().top);
      return distance < closest.distance ? { section, distance } : closest;
    }, { section: this.currentSection, distance: Infinity }).section;

    if (closestSection !== this.currentSection) {
      this.currentSection = closestSection;
      this.updateAudioTrack(closestSection);
      this.cdr.markForCheck();
    }
  }

  // 【✓】 Event handlers
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    // Only handle wheel events for Phantasia content
    if (!this.shouldShowPhantasiaContent) return;
    
    event.preventDefault();
    
    const now = Date.now();
    if (now - this.lastScrollTime < this.SCROLL_COOLDOWN) return;
    
    const direction = event.deltaY > 0 ? 1 : -1;
    const currentIndex = this.sections.indexOf(this.currentSection);
    const nextIndex = currentIndex + direction;
    
    if (nextIndex >= 0 && nextIndex < this.sections.length) {
      this.lastScrollTime = now;
      this.scrollTo(this.sections[nextIndex]);
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    // Only handle scroll events for Phantasia content
    if (!this.shouldShowPhantasiaContent) return;
    
    if (!this.isAnimating) {
      this.detectCurrentSection();
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    // Only handle resize events for Phantasia content
    if (!this.shouldShowPhantasiaContent) return;
    
    if (!this.isMobileView) {
      this.calculateViewportDimensions();
    }
  }

  @HostListener('document:contextmenu', ['$event'])
  onContextMenu(event: Event): boolean {
    // Only prevent context menu for Phantasia content
    if (!this.shouldShowPhantasiaContent) return true;
    
    event.preventDefault();
    return false;
  }

  // 【✓】 Public methods
  scrollTo(section: Section): void {
    // Only handle section scrolling for Phantasia content
    if (!this.shouldShowPhantasiaContent) return;
    
    const element = document.getElementById(section);
    if (element && !this.isAnimating) {
      this.isAnimating = true;
      this.currentSection = section;
      this.updateAudioTrack(section);
      element.scrollIntoView({ behavior: 'smooth' });
      
      setTimeout(() => {
        this.isAnimating = false;
        this.cdr.markForCheck();
      }, this.SCROLL_COOLDOWN);
    }
  }

  /**
   * Handles loading state changes from CD Cases component
   * 【✓】
   */
  onCDCasesLoadingChange(isLoading: boolean): void {
    if (this.isDebugMode) {
      console.log(`[PhantasiaComponent] CD Cases loading state: ${isLoading}`);
    }
    
    // Update the CD cases loading state
    this.cdCasesLoading = isLoading;
    
    // Force change detection to update the UI immediately
    this.cdr.markForCheck();
  }

  private updateAudioTrack(section: Section): void {
    this.audioService.setTrackForSection(section);
  }
}
