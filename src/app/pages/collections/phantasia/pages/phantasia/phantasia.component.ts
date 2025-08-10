import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { CDCasesComponent } from '../../tools/cd-cases/cd-cases.component';
import { SiteVersionSelectorComponent } from '../../../../../components/site-version-selector/site-version-selector.component';
import { DisclaimerComponent } from '../../../../../components/disclaimer/disclaimer.component';
import { SceneLoaderComponent } from '../../tools/cd-cases/scene-loader/scene-loader.component';
import { MobileViewComponent } from '../../mobile/mobile-view.component';
import { SiteHeaderComponent } from '../../../../../shared/components/site-header/site-header.component';

/**
 * Phantasia component that shows the 3D experience and version selector
 * This is the entry point for Project Phantasia 3D experience
 * 【✓】
 */
@Component({
  selector: 'app-phantasia',
  standalone: true,
  imports: [
    CommonModule,
    CDCasesComponent,
    SiteVersionSelectorComponent,
    DisclaimerComponent,
    SceneLoaderComponent,
    MobileViewComponent,
    SiteHeaderComponent
  ],
  templateUrl: './phantasia.component.html',
  styleUrls: ['./phantasia.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhantasiaComponent implements OnInit, OnDestroy {
  // Flag to control loading state
  isLoading = true;

  // Track when loading started for minimum display time
  private loadingStartTime = Date.now();
  private readonly MINIMUM_LOADING_TIME = 3000; // 3 seconds minimum for aesthetic

  // Storage keys
  private readonly SELECTOR_STORAGE_KEY = 'prismatic_collections_site_version_preference';
  private readonly DISCLAIMER_STORAGE_KEY = 'prismatic_collections_disclaimer_acknowledged';
  
  // UI state flags
  showVersionSelector = false;
  showDisclaimer = false;
  isMobileView = false;

  // Debug flag
  private readonly isDebugMode = true;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  ngOnInit(): void {
    if (this.isDebugMode) {
      console.log(`[PhantasiaComponent] Current URL: ${this.router.url}`);
    }

    // Add phantasia-3d-page class to body to prevent scrolling during 3D experience
    this.document.body.classList.add('phantasia-3d-page');
    
    if (this.isDebugMode) {
      console.log(`[PhantasiaComponent] Added phantasia-3d-page class to body`);
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
    
    // Add a reasonable fallback timeout to prevent infinite loading
    setTimeout(() => {
      if (this.isLoading) {
        if (this.isDebugMode) {
          console.warn('[PhantasiaComponent] Fallback timeout - forcing loading to false after 10 seconds');
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    }, 10000); // 10 second fallback timeout
  }

  /**
   * Determines if this component is inside the PhantasiaLayout
   * 【✓】
   */
  get isInsidePhantasiaLayout(): boolean {
    // The URL will be /phantasia/phantasia when inside the layout
    // It will be /collections/phantasia when using the direct route
    return this.router.url.includes('/phantasia/');
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
      
      this.isMobileView = savedPreference === 'mobile';
      
      // For mobile view, ensure minimum loading time for aesthetic
      if (this.isMobileView) {
        const loadingDuration = Date.now() - this.loadingStartTime;
        const remainingTime = Math.max(0, this.MINIMUM_LOADING_TIME - loadingDuration);
        
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }, remainingTime);
      }
      // For desktop, wait for CD Cases to load
      
    } else {
      // Show version selector after disclaimer
      this.showVersionSelector = true;
      if (this.isDebugMode) {
        console.log(`[PhantasiaComponent] No saved preference, showing version selector`);
      }
    }
    
    // Update the UI
    this.cdr.markForCheck();
  }

  /**
   * Handles user acknowledgment of the disclaimer
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
   * Handle version selection
   * 【✓】
   */
  onVersionSelected(version: string): void {
    if (this.isDebugMode) {
      console.log(`[PhantasiaComponent] User selected version: ${version}`);
    }
    
    // Save the user's preference
    localStorage.setItem(this.SELECTOR_STORAGE_KEY, version);
    
    this.showVersionSelector = false;
    this.isMobileView = version === 'mobile';
    
    // For mobile view, ensure minimum loading time for aesthetic
    if (this.isMobileView) {
      const loadingDuration = Date.now() - this.loadingStartTime;
      const remainingTime = Math.max(0, this.MINIMUM_LOADING_TIME - loadingDuration);
      
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }, remainingTime);
    }
    // For desktop, wait for CD Cases to load
    
    this.cdr.markForCheck();
  }

  /**
   * Handle CD Cases loading change
   * 【✓】
   */
  onCDCasesLoadingChange(isLoading: boolean): void {
    if (this.isDebugMode) {
      console.log(`[PhantasiaComponent] CD Cases loading state received: ${isLoading}, current isLoading: ${this.isLoading}, isMobileView: ${this.isMobileView}`);
    }
    
    // Update loading state only if CD Cases are done loading
    if (!isLoading && !this.isMobileView) {
      // Calculate how long loading has been shown
      const loadingDuration = Date.now() - this.loadingStartTime;
      const remainingTime = Math.max(0, this.MINIMUM_LOADING_TIME - loadingDuration);
      
      if (remainingTime > 0) {
        // Wait for the remaining time to ensure minimum display duration
        if (this.isDebugMode) {
          console.log(`[PhantasiaComponent] Waiting ${remainingTime}ms to maintain minimum loading display time (3s aesthetic)`);
        }
        setTimeout(() => {
          this.isLoading = false;
          if (this.isDebugMode) {
            console.log(`[PhantasiaComponent] Loading screen shown for aesthetic minimum time - hiding now`);
          }
          this.cdr.markForCheck();
        }, remainingTime);
      } else {
        // Already shown for minimum time, hide immediately
        this.isLoading = false;
        if (this.isDebugMode) {
          console.log(`[PhantasiaComponent] CD Cases finished loading - setting isLoading to false`);
        }
        this.cdr.markForCheck();
      }
    } else if (this.isDebugMode) {
      console.log(`[PhantasiaComponent] Not updating loading state - isLoading: ${isLoading}, isMobileView: ${this.isMobileView}`);
    }
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    // Remove phantasia-3d-page class from body to restore normal scrolling
    this.document.body.classList.remove('phantasia-3d-page');
    
    if (this.isDebugMode) {
      console.log(`[PhantasiaComponent] Removed phantasia-3d-page class from body - scrolling restored`);
    }
  }
}
