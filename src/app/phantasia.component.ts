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
  templateUrl: './phantasia.component.html',
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
  ) {}

  ngAfterViewInit() {
    this.detectCurrentSection();
    this.updateAudioTrack(this.currentSection);
    this.calculateScaling();
  }

  ngOnInit() {
    // Check if we should redirect to the mobile view
    this.deviceDetectionService.detectMobile();
    // Initial calculation of viewport dimensions
    this.calculateViewportDimensions();
  }
  
  // 【✓】 Calculate and update viewport dimensions
  private calculateViewportDimensions() {
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;
    this.aspectRatio = this.viewportWidth / this.viewportHeight;
    this.calculateScaling();
  }

  // 【✓】 Calculate the appropriate scaling factor for the scene
  private calculateScaling() {
    // Base scaling on how the viewport differs from design resolution
    const widthRatio = this.viewportWidth / this.designWidth;
    const heightRatio = this.viewportHeight / this.designHeight;
    
    // Determine the appropriate scale based on screen size
    if (this.aspectRatio > 21/9) { // Ultra-wide screen
      this.scaleRatio = 1.1; 
    } else if (this.viewportWidth >= 2560) { // 4K and higher
      this.scaleRatio = 1.1;
    } else if (this.viewportWidth >= 1920) { // Full HD
      this.scaleRatio = 1.05;
    } else if (this.viewportWidth <= 1366) { // Smaller screens
      this.scaleRatio = 1.0;
    } else if (this.aspectRatio < 9/16) { // Very tall screen
      this.scaleRatio = 1.05;
    } else {
      // Default scaling for standard screens
      this.scaleRatio = 1.0;
    }
    
    // Apply scaling to all scene containers to ensure consistent overflow
    const sceneContainers = document.querySelectorAll('.scene-container') as NodeListOf<HTMLElement>;
    sceneContainers.forEach(container => {
      container.style.transform = `scale(${this.scaleRatio})`;
    });
    
    // Properly center the main container
    const mainContainer = document.querySelector('.main-container') as HTMLElement;
    if (mainContainer) {
      mainContainer.style.display = 'flex';
      mainContainer.style.justifyContent = 'center';
      mainContainer.style.alignItems = 'center';
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

  detectCurrentSection() {
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
    
    // Check if we should switch to mobile view, but respect route-based user choices
    // Only allow automatic switching if not explicitly in /introduction or /mobile
    if (!this.router.url.includes('/introduction') && !this.router.url.includes('/mobile')) {
      if (this.deviceDetectionService.shouldUseMobileView()) {
        this.router.navigate(['/mobile']);
      } else {
        this.router.navigate(['/introduction']);
      }
    }
  }
}
