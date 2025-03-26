import { Component, HostListener, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MusicPlayerComponent } from './tools/music-player/music-player.component'; // Removed - now in right-side menu
import { CDCasesComponent } from './tools/cd-cases/cd-cases.component';
import { AudioService } from './tools/music-player/audio.service';
import { DeviceDetectionService } from './services/device-detection.service';
import { Router, RouterModule } from '@angular/router';
import { MobileViewComponent } from './pages/mobile-view/mobile-view.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    // MusicPlayerComponent, // Removed - now in right-side menu
    CDCasesComponent,
    RouterModule,
    MobileViewComponent
  ],
  template: `
    <ng-container *ngIf="!isLoading">
      <ng-container *ngIf="!isMobileView; else mobileTemplate">
        <div class="main-container" #mainContent>
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
      top: 0;
      left: 0;
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
  `]
})
export class PhantasiaComponent implements AfterViewInit, OnInit {
  @ViewChild('mainContent') mainContent!: ElementRef;
  
  title = 'Project Phantasia';
  currentSection = 'introduction';
  sections = ['introduction', 'disc-1', 'disc-2', 'pv', 'information'];
  isAnimating = false;
  lastScrollTime = 0;
  scrollCooldown = 1000;
  isMobileView = false;
  isDebugMode = false;
  isLoading = true;
  
  // Add viewport dimensions tracking for responsive scaling
  viewportWidth = window.innerWidth;
  viewportHeight = window.innerHeight;
  aspectRatio = this.viewportWidth / this.viewportHeight;
  
  // Scene scaling factor based on design resolution
  designWidth = 1920; // Base design width
  designHeight = 1080; // Base design height
  scaleRatio = 1;

  constructor(
    private elementRef: ElementRef,
    private audioService: AudioService,
    public deviceDetectionService: DeviceDetectionService,
    public router: Router
  ) {
    // Initialize debug mode from environment or configuration
    this.isDebugMode = true; // Enable debug mode temporarily
    
    // Force desktop view for 1920x1080 screens
    if (window.innerWidth === 1920 && window.innerHeight === 1080) {
      this.isMobileView = false;
      if (!this.router.url.includes('/introduction')) {
        this.router.navigate(['/introduction'], { replaceUrl: true });
      }
      return;
    }
    
    // Check device type synchronously before initial render
    this.isMobileView = this.deviceDetectionService.shouldUseMobileView();
    
    // Set loading to false after a short delay to ensure smooth transition
    setTimeout(() => {
      if (this.isDebugMode) {
        console.log('[Loading] Setting loading state to false');
      }
      this.isLoading = false;
    }, 500);
  }

  ngAfterViewInit() {
    if (this.isDebugMode) {
      console.log('[Loading] AfterViewInit - isMobileView:', this.isMobileView);
    }
    
    if (!this.isMobileView) {
      this.detectCurrentSection();
      this.updateAudioTrack(this.currentSection);
      this.calculateScaling();
    }
  }

  ngOnInit() {
    if (this.isDebugMode) {
      console.log('[Loading] OnInit - Current state:', {
        isLoading: this.isLoading,
        isMobileView: this.isMobileView,
        currentRoute: this.router.url
      });
    }

    // Force desktop view for 1920x1080 screens
    if (window.innerWidth === 1920 && window.innerHeight === 1080) {
      this.isMobileView = false;
      if (!this.router.url.includes('/introduction')) {
        this.router.navigate(['/introduction']);
      }
      return;
    }

    // Check device type and set appropriate view
    this.checkDeviceAndSetView();

    if (!this.isMobileView) {
      this.calculateViewportDimensions();
    }
  }

  // 【✓】 Check device type and set appropriate view
  private checkDeviceAndSetView() {
    // Force desktop view for 1920x1080 screens
    if (window.innerWidth === 1920 && window.innerHeight === 1080) {
      this.isMobileView = false;
      if (!this.router.url.includes('/introduction')) {
        this.router.navigate(['/introduction'], { replaceUrl: true });
      }
      return;
    }

    const shouldBeMobile = this.deviceDetectionService.shouldUseMobileView();
    const currentAspect = this.viewportWidth / this.viewportHeight;
    
    // Debug logging for aspect ratio and view decisions
    if (this.isDebugMode) {
      console.log(`[View Check] Current Aspect Ratio: ${currentAspect.toFixed(3)}`);
      console.log(`[View Check] Should Use Mobile: ${shouldBeMobile}`);
      console.log(`[View Check] Viewport: ${this.viewportWidth}x${this.viewportHeight}`);
      console.log(`[View Check] Screen Category: ${this.deviceDetectionService.getScreenCategory()}`);
      console.log(`[View Check] Current Route: ${this.router.url}`);
    }
    
    // Only update if the view mode needs to change
    if (shouldBeMobile !== this.isMobileView) {
      this.isMobileView = shouldBeMobile;
      
      // Check current route to avoid unnecessary navigation
      const currentRoute = this.router.url;
      const isMobileRoute = currentRoute.includes('/mobile');
      const isIntroRoute = currentRoute.includes('/introduction');
      
      // Only navigate if we're on the wrong route type
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
  }
  
  // 【✓】 Calculate and update viewport dimensions
  private calculateViewportDimensions() {
    if (this.isMobileView) return;
    
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;
    this.aspectRatio = this.viewportWidth / this.viewportHeight;
    this.calculateScaling();
  }

  // 【✓】 Calculate the appropriate scaling factor for the scene
  private calculateScaling() {
    if (this.isMobileView) return;
    
    // Get the container and scene elements
    const mainContainer = document.querySelector('.main-container') as HTMLElement;
    const sceneContainer = document.querySelector('.scene-container') as HTMLElement;
    
    if (!mainContainer || !sceneContainer) return;
    
    // Calculate the scale needed to fit the scene in the viewport
    const containerWidth = mainContainer.clientWidth;
    const containerHeight = mainContainer.clientHeight;
    const sceneWidth = 1920; // Fixed scene width
    const sceneHeight = 1080; // Fixed scene height
    
    // Calculate scale to fit while maintaining aspect ratio
    const scaleX = containerWidth / sceneWidth;
    const scaleY = containerHeight / sceneHeight;
    const scale = Math.min(scaleX, scaleY);
    
    // Apply the scale
    sceneContainer.style.transform = `scale(${scale})`;
    
    if (this.isDebugMode) {
      console.log('[Scaling] Container:', containerWidth, 'x', containerHeight);
      console.log('[Scaling] Scene:', sceneWidth, 'x', sceneHeight);
      console.log('[Scaling] Applied Scale:', scale);
    }
  }

  private updateAudioTrack(section: string) {
    this.audioService.setTrackForSection(section);
  }

  scrollTo(section: string) {
    const element = document.getElementById(section);
    if (element && !this.isAnimating) {
      this.isAnimating = true;
      this.currentSection = section;
      this.updateAudioTrack(section);
      element.scrollIntoView({ behavior: 'smooth' });
      
      setTimeout(() => {
        this.isAnimating = false;
      }, this.scrollCooldown);
    }
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    event.preventDefault();
    
    const now = Date.now();
    if (now - this.lastScrollTime < this.scrollCooldown) return;
    
    const direction = event.deltaY > 0 ? 1 : -1;
    const currentIndex = this.sections.indexOf(this.currentSection);
    const nextIndex = currentIndex + direction;
    
    if (nextIndex >= 0 && nextIndex < this.sections.length) {
      this.lastScrollTime = now;
      this.scrollTo(this.sections[nextIndex]);
    }
  }

  private detectCurrentSection() {
    const mainElement = this.mainContent?.nativeElement;
    if (!mainElement) return;

    let closestSection = this.currentSection;
    let minDistance = Infinity;

    for (const section of this.sections) {
      const element = document.getElementById(section);
      if (!element) continue;

      const rect = element.getBoundingClientRect();
      const distance = Math.abs(rect.top);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestSection = section;
      }
    }

    if (closestSection !== this.currentSection) {
      this.currentSection = closestSection;
      this.updateAudioTrack(closestSection);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (!this.isAnimating) {
      this.detectCurrentSection();
    }
  }

  @HostListener('document:contextmenu', ['$event'])
  onContextMenu(event: Event) {
    event.preventDefault();
    return false;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    if (!this.isMobileView) {
      this.calculateViewportDimensions();
    }
  }

  // Add method to handle CDCasesComponent loading state
  onCDCasesLoadingChange(isLoading: boolean) {
    if (this.isDebugMode) {
      console.log('[Phantasia] CDCases loading state changed:', isLoading);
    }
    this.isLoading = isLoading;
  }
}
