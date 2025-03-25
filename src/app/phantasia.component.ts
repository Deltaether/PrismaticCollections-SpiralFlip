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
    <ng-container *ngIf="!isMobileView; else mobileTemplate">
      <div class="main-container" #mainContent>
        <app-cd-cases *ngIf="!isMobileView"></app-cd-cases>
        <router-outlet></router-outlet>
      </div>
    </ng-container>
    <ng-template #mobileTemplate>
      <app-mobile-view></app-mobile-view>
    </ng-template>
  `,
  styleUrls: ['./phantasia.component.scss']
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
    this.isDebugMode = false; // Set to true to enable debug logging
  }

  ngAfterViewInit() {
    if (!this.isMobileView) {
      this.detectCurrentSection();
      this.updateAudioTrack(this.currentSection);
      this.calculateScaling();
    }
  }

  ngOnInit() {
    // Check device and set view mode
    this.checkDeviceAndSetView();
    // Initial calculation of viewport dimensions if not mobile
    if (!this.isMobileView) {
      this.calculateViewportDimensions();
    }
  }

  // 【✓】 Check device type and set appropriate view
  private checkDeviceAndSetView() {
    const shouldBeMobile = this.deviceDetectionService.shouldUseMobileView();
    
    // Only update if the view mode needs to change
    if (shouldBeMobile !== this.isMobileView) {
      this.isMobileView = shouldBeMobile;
      
      // Check current route to avoid unnecessary navigation
      const currentRoute = this.router.url;
      const isMobileRoute = currentRoute.includes('/mobile');
      const isIntroRoute = currentRoute.includes('/introduction');
      
      // Only navigate if we're on the wrong route type
      if (this.isMobileView && !isMobileRoute) {
        this.router.navigate(['/mobile']);
      } else if (!this.isMobileView && !isIntroRoute) {
        this.router.navigate(['/introduction']);
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
    
    // Get optimal scale for current screen size
    this.scaleRatio = this.deviceDetectionService.getOptimalScale();
    
    // Apply scaling to all scene containers to ensure consistent overflow
    const sceneContainers = document.querySelectorAll('.scene-container') as NodeListOf<HTMLElement>;
    sceneContainers.forEach(container => {
      container.style.transform = `scale(${this.scaleRatio})`;
      
      // Add debug info if needed
      if (this.isDebugMode) {
        console.log(`[Scaling] Screen Category: ${this.deviceDetectionService.getScreenCategory()}`);
        console.log(`[Scaling] Applied Scale: ${this.scaleRatio}`);
        console.log(`[Scaling] Viewport: ${this.viewportWidth}x${this.viewportHeight}`);
        console.log(`[Scaling] Aspect Ratio: ${this.aspectRatio.toFixed(2)}`);
      }
    });
    
    // Properly center the main container
    const mainContainer = document.querySelector('.main-container') as HTMLElement;
    if (mainContainer) {
      mainContainer.style.display = 'flex';
      mainContainer.style.justifyContent = 'center';
      mainContainer.style.alignItems = 'center';
      
      // Add aspect ratio correction if needed
      if (this.deviceDetectionService.needsAspectRatioCorrection()) {
        mainContainer.style.maxWidth = '100vw';
        mainContainer.style.maxHeight = '100vh';
        mainContainer.style.overflow = 'hidden';
        
        if (this.isDebugMode) {
          console.log('[Scaling] Applying aspect ratio correction');
        }
      }
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
    // Update viewport calculations on resize
    this.calculateViewportDimensions();
    
    // Check if we should switch views based on new dimensions
    this.checkDeviceAndSetView();
  }
}
