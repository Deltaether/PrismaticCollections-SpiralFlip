import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AudioService } from '../../../../tools/music-player/audio.service';
import { MobileNavigationService } from '../../services/mobile-navigation.service';

@Component({
  selector: 'app-cubic-container',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cubic-container.component.html',
  styleUrls: ['./cubic-container.component.scss']
})
export class CubicContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cube') cubeElement!: ElementRef;
  
  currentFace = 'front';
  isTransitioning = false;
  routerSubscription?: Subscription;
  currentPage = 0; // Added for page indicators
  
  // Map routes to cube faces
  routeFaceMap: { [key: string]: string } = {
    '/': 'front',
    '/music': 'right',
    '/about': 'back',
    '/contact': 'left',
    '/top': 'top',
    '/bottom': 'bottom'
  };
  
  // Store touch start position
  private touchStartX = 0;
  private touchStartY = 0;
  private touchThreshold = 50; // Minimum swipe distance to trigger navigation
  
  constructor(
    private router: Router,
    private audioService: AudioService,
    public navigationService: MobileNavigationService
  ) {}

  ngOnInit(): void {
    // Subscribe to router events to update cube face on navigation (✓)
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      const targetFace = this.getTargetFace(url);
      
      if (targetFace !== this.currentFace) {
        this.rotateCube(targetFace);
      }
    });
    
    // Subscribe to the navigation service for page changes
    this.navigationService.getCurrentPageIndex().subscribe(pageIndex => {
      this.currentPage = pageIndex;
    });
  }
  
  ngAfterViewInit(): void {
    // Set initial cube face based on current route (✓)
    const currentUrl = this.router.url;
    this.currentFace = this.getTargetFace(currentUrl);
    this.updateCubeRotation();
    this.updateCubeDimensions();
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions (✓)
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
  
  @HostListener('window:resize')
  onResize(): void {
    // Update cube dimensions on window resize (✓)
    this.updateCubeDimensions();
  }
  
  // Handle touch start event (✓)
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }
  
  // Handle touch end event for swipe navigation (✓)
  onTouchEnd(event: TouchEvent): void {
    if (this.isTransitioning) return;
    
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    
    const deltaX = this.touchStartX - touchEndX;
    const deltaY = this.touchStartY - touchEndY;
    
    // Determine swipe direction based on the larger delta
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.touchThreshold) {
      // Horizontal swipe
      if (deltaX > 0) {
        // Swipe left - navigate to the right face
        this.navigateToCubeFace('right');
      } else {
        // Swipe right - navigate to the left face
        this.navigateToCubeFace('left');
      }
    } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > this.touchThreshold) {
      // Vertical swipe
      if (deltaY > 0) {
        // Swipe up - navigate to the bottom face
        this.navigateToCubeFace('bottom');
      } else {
        // Swipe down - navigate to the top face
        this.navigateToCubeFace('top');
      }
    }
  }
  
  // Handle mouse wheel event for navigation (✓)
  onWheel(event: WheelEvent): void {
    if (this.isTransitioning) return;
    event.preventDefault();
    
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      // Vertical scroll
      if (event.deltaY > 0) {
        // Scroll down - navigate to next page
        this.navigationService.navigateToNextPage();
      } else {
        // Scroll up - navigate to previous page
        this.navigationService.navigateToPreviousPage();
      }
    } else {
      // Horizontal scroll
      if (event.deltaX > 0) {
        // Scroll right - navigate to right face
        this.navigateToCubeFace('right');
      } else {
        // Scroll left - navigate to left face
        this.navigateToCubeFace('left');
      }
    }
  }
  
  // Navigate to a cube face by its name (✓)
  navigateToCubeFace(face: string): void {
    // Get the route corresponding to the face
    const route = Object.keys(this.routeFaceMap).find(key => this.routeFaceMap[key] === face);
    if (route) {
      this.router.navigateByUrl('mobile' + route);
    }
  }
  
  private getTargetFace(url: string): string {
    // Get the cube face for a given route (✓)
    // Remove query params and hash
    const baseUrl = url.split('?')[0].split('#')[0];
    return this.routeFaceMap[baseUrl] || 'front';
  }
  
  private rotateCube(targetFace: string): void {
    // Rotate the cube to the target face (✓)
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    this.currentFace = targetFace;
    this.updateCubeRotation();
    this.audioService.playUISound('page-turn');
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      this.isTransitioning = false;
    }, 1000);
  }
  
  private updateCubeRotation(): void {
    // Update cube rotation based on current face (✓)
    if (!this.cubeElement) return;
    
    const cube = this.cubeElement.nativeElement;
    
    switch (this.currentFace) {
      case 'front':
        cube.style.transform = 'rotateY(0deg)';
        break;
      case 'right':
        cube.style.transform = 'rotateY(-90deg)';
        break;
      case 'back':
        cube.style.transform = 'rotateY(-180deg)';
        break;
      case 'left':
        cube.style.transform = 'rotateY(90deg)';
        break;
      case 'top':
        cube.style.transform = 'rotateX(-90deg)';
        break;
      case 'bottom':
        cube.style.transform = 'rotateX(90deg)';
        break;
    }
  }
  
  private updateCubeDimensions(): void {
    // Update cube dimensions to match viewport (✓)
    if (!this.cubeElement) return;
    
    const cube = this.cubeElement.nativeElement;
    const container = cube.parentElement;
    
    if (container) {
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      // Set cube size
      cube.style.width = `${width}px`;
      cube.style.height = `${height}px`;
      
      // Update transform-origin to center of cube
      cube.style.transformOrigin = `center center -${width / 2}px`;
      
      // Update face positions
      const faces = cube.querySelectorAll('.cube-face');
      faces.forEach((face: HTMLElement) => {
        face.style.width = `${width}px`;
        face.style.height = `${height}px`;
        
        if (face.classList.contains('front')) {
          face.style.transform = `translateZ(${width / 2}px)`;
        } else if (face.classList.contains('back')) {
          face.style.transform = `rotateY(180deg) translateZ(${width / 2}px)`;
        } else if (face.classList.contains('right')) {
          face.style.transform = `rotateY(90deg) translateZ(${width / 2}px)`;
        } else if (face.classList.contains('left')) {
          face.style.transform = `rotateY(-90deg) translateZ(${width / 2}px)`;
        } else if (face.classList.contains('top')) {
          face.style.transform = `rotateX(90deg) translateZ(${height / 2}px)`;
        } else if (face.classList.contains('bottom')) {
          face.style.transform = `rotateX(-90deg) translateZ(${height / 2}px)`;
        }
      });
    }
  }
}
