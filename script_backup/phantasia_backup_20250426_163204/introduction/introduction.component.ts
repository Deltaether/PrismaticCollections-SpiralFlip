import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CDCasesComponent } from '../../tools/cd-cases/cd-cases.component';
import { SiteVersionSelectorComponent } from '../../components/site-version-selector/site-version-selector.component';
import { DisclaimerComponent } from '../../components/disclaimer/disclaimer.component';
import { SceneLoaderComponent } from '../../tools/cd-cases/scene-loader/scene-loader.component';
import { MobileViewComponent } from '../../pages/mobile-view/mobile-view.component';

/**
 * Introduction component that shows the 3D experience and version selector
 * This is the entry point for Project Phantasia 3D experience
 * 【✓】
 */
@Component({
  selector: 'app-introduction',
  standalone: true,
  imports: [
    CommonModule,
    CDCasesComponent,
    SiteVersionSelectorComponent,
    DisclaimerComponent,
    SceneLoaderComponent,
    MobileViewComponent
  ],
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntroductionComponent implements OnInit {
  // Flag to control loading state
  isLoading = true;

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
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Check if user has already acknowledged the disclaimer
    const disclaimerAcknowledged = localStorage.getItem(this.DISCLAIMER_STORAGE_KEY);
    
    if (disclaimerAcknowledged) {
      this.showDisclaimer = false;
      
      if (this.isDebugMode) {
        console.log(`[IntroductionComponent] Disclaimer already acknowledged`);
      }
      
      // Check for version preference
      this.checkVersionPreference();
    } else {
      // Show disclaimer first
      this.showDisclaimer = true;
      if (this.isDebugMode) {
        console.log(`[IntroductionComponent] Showing disclaimer`);
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
        console.log(`[IntroductionComponent] Found saved preference: ${savedPreference}`);
      }
      
      this.isMobileView = savedPreference === 'mobile';
    } else {
      // Show version selector after disclaimer
      this.showVersionSelector = true;
      if (this.isDebugMode) {
        console.log(`[IntroductionComponent] No saved preference, showing version selector`);
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
      console.log(`[IntroductionComponent] Disclaimer acknowledged`);
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
      console.log(`[IntroductionComponent] User selected version: ${version}`);
    }
    
    // Save the user's preference
    localStorage.setItem(this.SELECTOR_STORAGE_KEY, version);
    
    this.showVersionSelector = false;
    this.isMobileView = version === 'mobile';
    this.cdr.markForCheck();
  }

  /**
   * Handle CD Cases loading change
   * 【✓】
   */
  onCDCasesLoadingChange(isLoading: boolean): void {
    if (this.isDebugMode) {
      console.log(`[IntroductionComponent] CD Cases loading state: ${isLoading}`);
    }
    
    // Update loading state
    this.isLoading = isLoading;
    this.cdr.markForCheck();
  }
}
