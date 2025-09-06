import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CDCasesComponent } from '../../../../pages/collections/phantasia/tools/cd-cases/cd-cases.component';
import { SiteVersionSelectorComponent } from '../../../../../components/site-version-selector/site-version-selector.component';
import { SceneLoaderComponent } from '../../../../pages/collections/phantasia/tools/cd-cases/scene-loader/scene-loader.component';
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
    SceneLoaderComponent,
    MobileViewComponent,
    SiteHeaderComponent
  ],
  templateUrl: './phantasia.component.html',
  styleUrls: ['./phantasia.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhantasiaComponent implements OnInit {
  // Flag to control loading state
  isLoading = true;

  // Storage keys
  private readonly SELECTOR_STORAGE_KEY = 'prismatic_collections_site_version_preference';
  
  // UI state flags
  showVersionSelector = false;
  isMobileView = false;

  // Debug flag
  private readonly isDebugMode = true;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    if (this.isDebugMode) {
      console.log(`[PhantasiaComponent] Current URL: ${this.router.url}`);
    }

    // Check for version preference directly
    this.checkVersionPreference();
    
    // Add a fallback timeout to ensure loading doesn't get stuck forever
    setTimeout(() => {
      if (this.isLoading) {
        if (this.isDebugMode) {
          console.log('[PhantasiaComponent] Fallback timeout - forcing loading to false');
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    }, 5000); // 5 second fallback timeout
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
      
      // Set a timeout to ensure loading doesn't get stuck
      setTimeout(() => {
        this.isLoading = false;
        if (this.isDebugMode) {
          console.log(`[PhantasiaComponent] Loading timeout - setting isLoading to false`);
        }
        this.cdr.markForCheck();
      }, 1000); // 1 second timeout
      
    } else {
      // Show version selector
      this.showVersionSelector = true;
      if (this.isDebugMode) {
        console.log(`[PhantasiaComponent] No saved preference, showing version selector`);
      }
    }
    
    // Update the UI
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
    
    // Set a timeout to ensure loading doesn't get stuck after version selection
    setTimeout(() => {
      this.isLoading = false;
      if (this.isDebugMode) {
        console.log(`[PhantasiaComponent] Version selected - setting isLoading to false`);
      }
      this.cdr.markForCheck();
    }, 500); // 500ms timeout
    
    this.cdr.markForCheck();
  }

  /**
   * Handle CD Cases loading change
   * 【✓】
   */
  onCDCasesLoadingChange(isLoading: boolean): void {
    if (this.isDebugMode) {
      console.log(`[PhantasiaComponent] CD Cases loading state: ${isLoading}`);
    }
    
    // Update loading state only if CD Cases are done loading
    if (!isLoading) {
      this.isLoading = false;
      if (this.isDebugMode) {
        console.log(`[PhantasiaComponent] CD Cases finished loading - setting isLoading to false`);
      }
    }
    this.cdr.markForCheck();
  }
}
