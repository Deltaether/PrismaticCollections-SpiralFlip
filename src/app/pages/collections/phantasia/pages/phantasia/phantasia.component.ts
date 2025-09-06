import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CDCasesComponent } from '../../tools/cd-cases/cd-cases.component';
import { SceneLoaderComponent } from '../../tools/cd-cases/scene-loader/scene-loader.component';
import { SiteHeaderComponent } from '../../../../../shared/components/site-header/site-header.component';

/**
 * Phantasia component that shows the 3D experience
 * This is the entry point for Project Phantasia 3D experience
 * 【✓】
 */
@Component({
  selector: 'app-phantasia',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    CDCasesComponent,
    SceneLoaderComponent,
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


  // Debug flag
  private readonly isDebugMode = true;
  
  // Development mode - bypass all loading screens for testing recording controls
  private readonly isDevelopmentMode = true;

  // Features data for Material cards
  features = [
    {
      title: '2 Discs',
      description: '20 original tracks spread across two themed discs',
      icon: 'album',
      color: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)'
    },
    {
      title: '160+ BPM',
      description: 'High-energy compositions that will move your soul',
      icon: 'graphic_eq',
      color: 'linear-gradient(135deg, #4facfe, #00f2fe)'
    },
    {
      title: 'Digital Art',
      description: 'Stunning visual accompaniment for each track',
      icon: 'palette',
      color: 'linear-gradient(135deg, #667eea, #764ba2)'
    }
  ];

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
   * Handle CD Cases loading change
   * 【✓】
   */
  onCDCasesLoadingChange(isLoading: boolean): void {
    if (this.isDebugMode) {
      console.log(`[PhantasiaComponent] CD Cases loading state received: ${isLoading}, current isLoading: ${this.isLoading}`);
    }
    
    // Update loading state only if CD Cases are done loading
    if (!isLoading) {
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
      console.log(`[PhantasiaComponent] Not updating loading state - isLoading: ${isLoading}`);
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
