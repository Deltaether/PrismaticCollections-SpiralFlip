import { Component, HostListener, ElementRef, ViewChild, AfterViewInit, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MusicPlayerComponent } from './tools/music-player/music-player.component'; // Removed - now in right-side menu
import { CDCasesComponent } from './tools/cd-cases/cd-cases.component';
import { AudioService } from './tools/music-player/audio.service';
import { DeviceDetectionService } from './services/device-detection.service';
import { Router, RouterModule } from '@angular/router';
import { MobileViewComponent } from './pages/mobile-view/mobile-view.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SiteVersionSelectorComponent } from './components/site-version-selector/site-version-selector.component';
import { HeaderComponent } from './components/header/header.component';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';

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
    HeaderComponent,
    DisclaimerComponent
  ],
  template: `
    <!-- Disclaimer (appears before anything else) -->
    <app-disclaimer
      *ngIf="showDisclaimer"
      (acknowledged)="onDisclaimerAcknowledged()"
    ></app-disclaimer>
    
    <!-- Site Version Selector (appears after disclaimer) -->
    <app-site-version-selector
      *ngIf="!showDisclaimer && showVersionSelector"
      (versionSelected)="onVersionSelected($event)"
      (selectorClosed)="onSelectorClosed()"
    ></app-site-version-selector>
    
    <ng-container *ngIf="!isLoading && !showVersionSelector && !showDisclaimer">
      <ng-container *ngIf="!isMobileView; else mobileTemplate">
        <!-- Include the header for desktop view -->
        <app-header *ngIf="!showHeaderForRoute"></app-header>
        
        <!-- Router Outlet for standard pages -->
        <router-outlet></router-outlet>
        
        <!-- 3D Container (only shown on introduction route) -->
        <div class="main-container" #mainContent *ngIf="showCDCasesForRoute">
          <app-cd-cases (loadingChange)="onCDCasesLoadingChange($event)"></app-cd-cases>
        </div>
      </ng-container>
      <ng-template #mobileTemplate>
        <app-mobile-view></app-mobile-view>
      </ng-template>
    </ng-container>
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
      z-index: 1;
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
   * Only show for introduction route
   * 【✓】
   */
  get showCDCasesForRoute(): boolean {
    return this.router.url === '/introduction';
  }
  
  /**
   * Hides header for specific routes that don't need it
   * 【✓】
   */
  get showHeaderForRoute(): boolean {
    // Hide header for mobile view or version selector
    return false; // Always show the header
  }

  // 【✓】 Initialize view and handle initial routing
  private initializeView(): void {
    const isFullHD = window.innerWidth === this.DESIGN_DIMENSIONS.width && 
                    window.innerHeight === this.DESIGN_DIMENSIONS.height;
    
    if (isFullHD) {
      this.isMobileView = false;
      if (!this.router.url.includes('/introduction')) {
        this.router.navigate(['/introduction'], { replaceUrl: true });
      }
      return;
    }
    
    this.isMobileView = this.deviceDetectionService.shouldUseMobileView();
    
    setTimeout(() => {
      if (this.isDebugMode) {
        console.log('[Loading] Setting loading state to false');
      }
      this.isLoading = false;
      this.cdr.markForCheck();
    }, 500);
  }

  // 【✓】 Initialize view based on saved preference
  private initializeViewBasedOnPreference(preference: string): void {
    if (preference === '3d') {
      this.isMobileView = false;
      if (!this.router.url.includes('/introduction')) {
        this.router.navigate(['/introduction'], { replaceUrl: true });
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
    
    this.showVersionSelector = false;
    this.initializeViewBasedOnPreference(version);
    this.cdr.markForCheck();
  }
  
  // 【✓】 Handle selector closed without selection
  onSelectorClosed(): void {
    if (this.isDebugMode) {
      console.log(`[PhantasiaComponent] Version selector closed without selection`);
    }
    
    // Default to device detection if user closes without selection
    this.showVersionSelector = false;
    this.initializeView();
    this.cdr.markForCheck();
  }

  // 【✓】 Lifecycle hooks
  ngOnInit(): void {
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

  // 【✓】 View management
  private checkDeviceAndSetView(): void {
    const isFullHD = window.innerWidth === this.DESIGN_DIMENSIONS.width && 
                    window.innerHeight === this.DESIGN_DIMENSIONS.height;
    
    if (isFullHD) {
      this.isMobileView = false;
      if (!this.router.url.includes('/introduction')) {
        this.router.navigate(['/introduction'], { replaceUrl: true });
      }
      return;
    }

    const shouldBeMobile = this.deviceDetectionService.shouldUseMobileView();
    
    if (this.isDebugMode) {
      console.log(`[View Check] Current Aspect Ratio: ${this.viewport.aspectRatio.toFixed(3)}`);
      console.log(`[View Check] Should Use Mobile: ${shouldBeMobile}`);
      console.log(`[View Check] Viewport: ${this.viewport.width}x${this.viewport.height}`);
      console.log(`[View Check] Screen Category: ${this.deviceDetectionService.getScreenCategory()}`);
      console.log(`[View Check] Current Route: ${this.router.url}`);
    }
    
    if (shouldBeMobile !== this.isMobileView) {
      this.isMobileView = shouldBeMobile;
      this.navigateToAppropriateView();
      this.cdr.markForCheck();
    }
  }

  // 【✓】 Navigation logic
  private navigateToAppropriateView(): void {
    const currentRoute = this.router.url;
    const isMobileRoute = currentRoute.includes('/mobile');
    const isIntroRoute = currentRoute.includes('/introduction');
    
    if (this.isMobileView && !isMobileRoute) {
      if (this.isDebugMode) {
        console.log('[View Check] Switching to mobile view due to aspect ratio or device type');
      }
      this.router.navigate(['/mobile'], { replaceUrl: true });
    } else if (!this.isMobileView && !isIntroRoute) {
      if (this.isDebugMode) {
        console.log('[View Check] Switching to desktop view - aspect ratio is acceptable');
      }
      this.router.navigate(['/introduction'], { replaceUrl: true });
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
    if (!this.isAnimating) {
      this.detectCurrentSection();
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (!this.isMobileView) {
      this.calculateViewportDimensions();
    }
  }

  @HostListener('document:contextmenu', ['$event'])
  onContextMenu(event: Event): boolean {
    event.preventDefault();
    return false;
  }

  // 【✓】 Public methods
  scrollTo(section: Section): void {
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

  onCDCasesLoadingChange(isLoading: boolean): void {
    if (this.isDebugMode) {
      console.log('[Phantasia] CDCases loading state changed:', isLoading);
    }
    this.isLoading = isLoading;
    this.cdr.markForCheck();
  }

  private updateAudioTrack(section: Section): void {
    this.audioService.setTrackForSection(section);
  }
}
