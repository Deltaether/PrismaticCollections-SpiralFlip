import { Component, OnInit, OnDestroy, AfterViewInit, Input, ElementRef, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TriangleConfig {
  id: number;
  left: number;
  width: number;
  height: number;
  animationDuration: number;
  animationDelay: number;
  element?: HTMLElement;
  fillElement?: HTMLElement;
  animationId?: number;
  fillAnimationId?: number;
  startTime?: number;
  isActive?: boolean;
}

interface ColorRGB {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface AnimationState {
  position: number;
  visibility: number;
  fillProgress: number;
  fillColor1: ColorRGB;
  fillColor2: ColorRGB;
  innerTriangleProgress: number;
}

@Component({
  selector: 'app-triangles-animation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="triangle-container" #triangleContainer>
      <div
        *ngFor="let triangle of triangles; trackBy: trackByTriangleId"
        class="triangle"
        [attr.data-triangle-id]="triangle.id"
        [style.left.%]="triangle.left"
        [style.width.px]="triangle.width"
        [style.height.px]="triangle.height"
      >
        <div class="triangle-base" 
             [style.width.px]="triangle.width"
             [style.height.px]="triangle.height"></div>
        <div class="triangle-fill"
             [style.width.px]="triangle.width"
             [style.height.px]="triangle.height"></div>
      </div>
    </div>
  `,
  styles: [`
    .triangle-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
      will-change: transform;
      backface-visibility: hidden;
      perspective: 1000px;
    }

    .triangle {
      position: absolute;
      visibility: hidden;
      opacity: 0;
      will-change: transform, visibility, opacity;
      transform: translateZ(0);
      backface-visibility: hidden;
    }

    .triangle-base {
      position: absolute;
      top: 0;
      left: 0;
      background: linear-gradient(135deg, rgba(75, 82, 84, 0.85) 0%, rgba(56, 56, 56, 0.95) 100%);
      clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
      z-index: 1;
      will-change: clip-path;
      filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.2));
      transform: translateZ(0);
      backface-visibility: hidden;
    }

    .triangle-fill {
      position: absolute;
      top: 0;
      left: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 240, 0.98) 100%);
      clip-path: polygon(50% 100%, 0% 100%, 100% 100%);
      z-index: 2;
      will-change: clip-path, background, transform;
      filter: drop-shadow(0 0 0 2px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 0 3px rgba(0, 0, 0, 0.6));
      transform: translateZ(0);
      backface-visibility: hidden;
    }

  `],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TrianglesAnimationComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() count: number = 25; // Default count, can be overridden
  @Input() enabled: boolean = true; // Allow disabling animations

  triangles: TriangleConfig[] = [];
  private animationRunning = false;
  private resizeObserver: ResizeObserver | null = null;
  private masterAnimationId: number | null = null;
  private frameCount = 0;
  private lastFrameTime = 0;
  private targetFPS = 60;
  private frameInterval = 1000 / this.targetFPS;
  private currentViewportHeight = 0;

  // Predefined triangle configurations for consistency with original SCSS
  private readonly triangleConfigs = [
    { left: 4.2, width: 70, height: 60, duration: 8, delay: 1.5 },
    { left: 14.7, width: 56, height: 48, duration: 9, delay: 1.75 },
    { left: 24.1, width: 80, height: 70, duration: 10, delay: 2 },
    { left: 33.8, width: 64, height: 56, duration: 8.5, delay: 2.25 },
    { left: 46.3, width: 76, height: 65, duration: 9.5, delay: 2.5 },
    { left: 55, width: 60, height: 52, duration: 10.5, delay: 2.75 },
    { left: 65, width: 84, height: 72, duration: 8, delay: 3 },
    { left: 75, width: 68, height: 58, duration: 9, delay: 3.25 },
    { left: 85, width: 72, height: 62, duration: 10, delay: 3.5 },
    { left: 95, width: 58, height: 50, duration: 8.5, delay: 3.75 },
    { left: 10, width: 66, height: 57, duration: 9.5, delay: 4 },
    { left: 20, width: 74, height: 64, duration: 10, delay: 4.25 },
    { left: 30, width: 62, height: 54, duration: 8, delay: 4.5 },
    { left: 40, width: 78, height: 68, duration: 9, delay: 4.75 },
    { left: 50, width: 70, height: 60, duration: 10.5, delay: 1.6 },
    { left: 60, width: 82, height: 71, duration: 8.5, delay: 1.85 },
    { left: 70, width: 66, height: 57, duration: 9.5, delay: 2.1 },
    { left: 80, width: 76, height: 66, duration: 10, delay: 2.35 },
    { left: 90, width: 64, height: 55, duration: 8, delay: 2.6 },
    { left: 12, width: 72, height: 63, duration: 9, delay: 2.85 },
    { left: 8, width: 65, height: 58, duration: 8.5, delay: 3.1 },
    { left: 18, width: 70, height: 62, duration: 9.2, delay: 3.35 },
    { left: 28, width: 58, height: 50, duration: 10.2, delay: 3.6 },
    { left: 38, width: 75, height: 67, duration: 8.8, delay: 3.85 },
    { left: 48, width: 63, height: 55, duration: 9.8, delay: 4.1 },
    // Extended configurations for larger counts (26-50)
    { left: 58, width: 68, height: 60, duration: 8.3, delay: 4.35 },
    { left: 68, width: 73, height: 65, duration: 9.5, delay: 1.7 },
    { left: 78, width: 60, height: 53, duration: 10.5, delay: 1.95 },
    { left: 88, width: 67, height: 59, duration: 8.7, delay: 2.2 },
    { left: 3, width: 71, height: 64, duration: 9.3, delay: 2.45 },
    { left: 13, width: 59, height: 52, duration: 10.7, delay: 2.7 },
    { left: 23, width: 76, height: 68, duration: 8.1, delay: 2.95 },
    { left: 33, width: 62, height: 56, duration: 9.9, delay: 3.2 },
    { left: 43, width: 69, height: 61, duration: 8.6, delay: 3.45 },
    { left: 53, width: 74, height: 66, duration: 9.1, delay: 3.7 },
    { left: 63, width: 61, height: 54, duration: 10.3, delay: 3.95 },
    { left: 6.5, width: 66, height: 57, duration: 9.7, delay: 4.2 },
    { left: 16.3, width: 72, height: 63, duration: 8.9, delay: 4.45 },
    { left: 26.7, width: 59, height: 51, duration: 10.8, delay: 1.8 },
    { left: 37.2, width: 77, height: 69, duration: 8.4, delay: 2.05 },
    { left: 47.8, width: 64, height: 56, duration: 9.4, delay: 2.3 },
    { left: 57.1, width: 70, height: 62, duration: 8.7, delay: 2.55 },
    { left: 67.4, width: 75, height: 66, duration: 10.1, delay: 2.8 },
    { left: 77.9, width: 62, height: 55, duration: 9.6, delay: 3.05 },
    { left: 11.2, width: 68, height: 60, duration: 8.2, delay: 3.3 },
    { left: 21.6, width: 73, height: 65, duration: 9.8, delay: 3.55 },
    { left: 31.4, width: 61, height: 53, duration: 10.9, delay: 3.8 },
    { left: 41.8, width: 76, height: 68, duration: 8.6, delay: 4.05 },
    { left: 52.3, width: 65, height: 58, duration: 9.2, delay: 4.3 },
    { left: 72.7, width: 69, height: 61, duration: 10.4, delay: 1.65 }
  ];

  constructor(private ngZone: NgZone, private elementRef: ElementRef, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.generateTriangles();
  }

  ngAfterViewInit(): void {
    this.currentViewportHeight = window.innerHeight;
    
    if (this.enabled) {
      // Wait for DOM to be ready, then start animations
      setTimeout(() => {
        this.initializeTriangleElements();
        this.startAnimations();
      }, 100);
    }

    // Set up resize observer for responsive behavior
    this.setupResizeObserver();
  }

  ngOnDestroy(): void {
    this.stopAnimations();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  trackByTriangleId(index: number, triangle: TriangleConfig): number {
    return triangle.id;
  }

  private generateTriangles(): void {
    this.triangles = [];
    const actualCount = Math.min(this.count, this.triangleConfigs.length);
    
    for (let i = 0; i < actualCount; i++) {
      const config = this.triangleConfigs[i];
      this.triangles.push({
        id: i + 1,
        left: config.left,
        width: config.width,
        height: config.height,
        animationDuration: config.duration * 1000, // Convert to milliseconds
        animationDelay: config.delay * 1000
      });
    }
  }

  private initializeTriangleElements(): void {
    const triangleElements = this.elementRef.nativeElement.querySelectorAll('[data-triangle-id]');
    
    triangleElements.forEach((element: HTMLElement, index: number) => {
      const triangleId = parseInt(element.getAttribute('data-triangle-id') || '0', 10);
      const triangle = this.triangles.find(t => t.id === triangleId);
      
      if (triangle) {
        triangle.element = element;
        triangle.fillElement = element.querySelector('.triangle-fill') as HTMLElement;
      }
    });
  }

  private startAnimations(): void {
    if (!this.enabled || this.animationRunning) return;
    
    this.animationRunning = true;
    this.frameCount = 0;
    this.lastFrameTime = performance.now();
    
    // Initialize all triangles with their start times
    this.triangles.forEach((triangle) => {
      if (triangle.element && triangle.fillElement) {
        triangle.startTime = performance.now() + triangle.animationDelay;
        triangle.isActive = false;
        this.initializeTriangleState(triangle);
      }
    });
    
    // Start the master animation loop
    this.runMasterAnimationLoop();
  }

  private stopAnimations(): void {
    this.animationRunning = false;
    
    if (this.masterAnimationId) {
      cancelAnimationFrame(this.masterAnimationId);
      this.masterAnimationId = null;
    }
    
    // Clean up individual triangle animation IDs
    this.triangles.forEach((triangle) => {
      triangle.animationId = undefined;
      triangle.fillAnimationId = undefined;
      triangle.isActive = false;
    });
  }

  private initializeTriangleState(triangle: TriangleConfig): void {
    if (!triangle.element || !triangle.fillElement) return;

    // Set initial state with better precision
    triangle.element.style.transform = `translate3d(0, ${this.currentViewportHeight}px, 0)`;
    triangle.element.style.visibility = 'hidden';
    triangle.element.style.opacity = '0';

    // Initialize fill element - start from bottom with white color and border
    const borderSize = 8; // 8% border all around
    const leftX = borderSize;
    const rightX = 100 - borderSize;
    const bottomY = 100 - borderSize;
    triangle.fillElement.style.clipPath = `polygon(50% 100%, ${leftX}% ${bottomY}%, ${rightX}% ${bottomY}%)`;
    triangle.fillElement.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 240, 0.98) 100%)';
    triangle.fillElement.style.filter = 'drop-shadow(0 0 0 2px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 0 3px rgba(0, 0, 0, 0.6))';
  }

  private runMasterAnimationLoop(): void {
    if (!this.animationRunning) return;

    const currentTime = performance.now();
    
    // Frame rate control for consistent 60fps
    const deltaTime = currentTime - this.lastFrameTime;
    if (deltaTime < this.frameInterval) {
      this.masterAnimationId = requestAnimationFrame(() => this.runMasterAnimationLoop());
      return;
    }
    
    this.lastFrameTime = currentTime - (deltaTime % this.frameInterval);
    this.frameCount++;

    // Update all triangles in a single pass
    this.triangles.forEach((triangle) => {
      if (triangle.element && triangle.fillElement && triangle.startTime) {
        this.updateTriangleAnimation(triangle, currentTime);
      }
    });

    this.masterAnimationId = requestAnimationFrame(() => this.runMasterAnimationLoop());
  }

  private updateTriangleAnimation(triangle: TriangleConfig, currentTime: number): void {
    if (!triangle.startTime || !triangle.element || !triangle.fillElement) return;

    const elapsed = currentTime - triangle.startTime;
    
    if (elapsed < 0) {
      // Animation hasn't started yet
      return;
    }

    const duration = triangle.animationDuration;
    let progress = elapsed / duration;

    // Handle looping with seamless transitions
    if (progress >= 1) {
      const cycles = Math.floor(progress);
      progress = progress - cycles;
      triangle.startTime = currentTime - (progress * duration);
    }

    // Get smooth animation state
    const state = this.calculateSmoothAnimationState(progress);

    // Apply smooth transformations
    this.applyTriangleTransform(triangle, state);
    this.updateTriangleFill(triangle.fillElement!, state.fillProgress);
    if (triangle.fillElement) {
      this.applyInnerTriangleAnimation(triangle.fillElement, state);
    }
  }

  private calculateSmoothAnimationState(progress: number): AnimationState {
    // Advanced easing function (custom bezier curve for ultra-smooth motion)
    const easeInOutSine = (t: number): number => {
      return -(Math.cos(Math.PI * t) - 1) / 2;
    };
    
    // Custom easing that accelerates slower towards the top (for better appreciation)
    const customSlowTopEasing = (t: number): number => {
      if (t < 0.5) {
        // Normal acceleration for first half
        return 2 * t * t;
      } else {
        // Much slower deceleration for second half (towards top)
        const adjusted = (t - 0.5) * 2; // Map 0.5-1.0 to 0-1
        return 0.5 + 0.5 * (1 - Math.pow(1 - adjusted, 3)); // Gentle cubic curve
      }
    };

    const smoothProgress = customSlowTopEasing(progress);

    // Smooth position calculation
    this.currentViewportHeight = window.innerHeight; // Update for responsive behavior
    const startY = this.currentViewportHeight;
    const endY = -this.currentViewportHeight;
    const position = startY + (smoothProgress * (endY - startY));

    // Smooth visibility with gentle fade transitions
    let visibility: number;
    if (progress < 0.03) {
      visibility = 0;
    } else if (progress < 0.08) {
      // Smooth fade in
      visibility = easeInOutSine((progress - 0.03) / 0.05);
    } else if (progress < 0.92) {
      visibility = 1;
    } else if (progress < 0.97) {
      // Smooth fade out
      visibility = 1 - easeInOutSine((progress - 0.92) / 0.05);
    } else {
      visibility = 0;
    }

    // Smooth fill progress with continuous interpolation
    const fillProgress = Math.max(0, Math.min(1, progress));

    // Smooth color interpolation
    const fillColor1 = this.interpolateColor(
      { r: 56, g: 56, b: 56, a: 0.95 },
      { r: 255, g: 255, b: 255, a: 0.95 },
      fillProgress
    );
    
    const fillColor2 = this.interpolateColor(
      { r: 75, g: 82, b: 84, a: 0.85 },
      { r: 248, g: 249, b: 250, a: 0.90 },
      fillProgress
    );

    return {
      position,
      visibility,
      fillProgress,
      fillColor1,
      fillColor2,
      innerTriangleProgress: fillProgress
    };
  }

  private applyTriangleTransform(triangle: TriangleConfig, state: AnimationState): void {
    if (!triangle.element) return;

    // Use translate3d for hardware acceleration and sub-pixel precision
    triangle.element.style.transform = `translate3d(0, ${state.position.toFixed(2)}px, 0)`;
    
    // Smooth opacity transition
    triangle.element.style.opacity = state.visibility.toFixed(3);
    triangle.element.style.visibility = state.visibility > 0.01 ? 'visible' : 'hidden';
  }

  private applySmoothFillAnimation(fillElement: HTMLElement, state: AnimationState): void {
    // Calculate fill progress based on triangle position and timing
    // Make the white triangle grow from bottom to top until it completely fills the black triangle
    const heightFromBottom = this.currentViewportHeight - state.position;
    const targetFillHeight = this.currentViewportHeight * 0.7; // Start filling when triangle reaches 70% of screen height
    
    let fillProgress = 0;
    if (heightFromBottom > 0 && heightFromBottom <= targetFillHeight) {
      // Calculate fill progress: 0 when triangle is at bottom, 1 when triangle reaches 70% height
      fillProgress = Math.min(1, heightFromBottom / targetFillHeight);
    } else if (heightFromBottom > targetFillHeight) {
      // Triangle has passed 70% mark, keep fully filled
      fillProgress = 1;
    }
    
    // Create inner triangle with border - adjust clip-path to leave space for border
    const borderSize = 8; // 8% border all around
    const fillTop = 100 - (fillProgress * (100 - borderSize * 2)) - borderSize; // Account for top and bottom borders
    const leftX = borderSize; // Left border
    const rightX = 100 - borderSize; // Right border
    const bottomY = 100 - borderSize; // Bottom border
    
    // Smooth clip-path interpolation - grow from bottom to top with border
    fillElement.style.clipPath = `polygon(50% ${fillTop.toFixed(2)}%, ${leftX.toFixed(2)}% ${bottomY.toFixed(2)}%, ${rightX.toFixed(2)}% ${bottomY.toFixed(2)}%)`;

    // Keep grey gradient with enhanced visibility  
    fillElement.style.background = `linear-gradient(135deg, ${this.colorToRGBA(state.fillColor1)} 0%, ${this.colorToRGBA(state.fillColor2)} 100%)`;
    fillElement.style.filter = 'drop-shadow(0 0 0 2px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 0 3px rgba(0, 0, 0, 0.6))';
  }


  private interpolateColor(color1: ColorRGB, color2: ColorRGB, progress: number): ColorRGB {
    // Smooth color interpolation with gamma correction for better visual results
    const gamma = 2.2;
    const invGamma = 1 / gamma;
    
    // Convert to gamma space for better interpolation
    const r1 = Math.pow(color1.r / 255, gamma);
    const g1 = Math.pow(color1.g / 255, gamma);
    const b1 = Math.pow(color1.b / 255, gamma);
    
    const r2 = Math.pow(color2.r / 255, gamma);
    const g2 = Math.pow(color2.g / 255, gamma);
    const b2 = Math.pow(color2.b / 255, gamma);
    
    // Interpolate in gamma space
    const r = r1 + (r2 - r1) * progress;
    const g = g1 + (g2 - g1) * progress;
    const b = b1 + (b2 - b1) * progress;
    const a = color1.a + (color2.a - color1.a) * progress;
    
    // Convert back to sRGB space
    return {
      r: Math.round(Math.pow(r, invGamma) * 255),
      g: Math.round(Math.pow(g, invGamma) * 255),
      b: Math.round(Math.pow(b, invGamma) * 255),
      a: Math.round(a * 1000) / 1000 // Round alpha to 3 decimal places
    };
  }

  private colorToRGBA(color: ColorRGB): string {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  }

  private getRGBAString(r1: number, g1: number, b1: number, a1: number, r2: number, g2: number, b2: number, a2: number): string {
    return `linear-gradient(135deg, rgba(${r1}, ${g1}, ${b1}, ${a1}) 0%, rgba(${r2}, ${g2}, ${b2}, ${a2}) 100%)`;
  }

  private setupResizeObserver(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        // Update viewport height
        this.currentViewportHeight = window.innerHeight;
        
        // Smoothly adjust to new viewport dimensions without restarting
        if (this.animationRunning) {
          // Update all triangles with new viewport dimensions in the next frame
          requestAnimationFrame(() => {
            this.triangles.forEach((triangle) => {
              if (triangle.element && !triangle.startTime) {
                this.initializeTriangleState(triangle);
              }
            });
          });
        }
      });

      this.resizeObserver.observe(this.elementRef.nativeElement);
    }
  }

  // Public methods for external control
  public pauseAnimations(): void {
    this.stopAnimations();
  }

  public resumeAnimations(): void {
    if (this.enabled) {
      this.startAnimations();
    }
  }

  public setTriangleCount(count: number): void {
    this.count = count;
    this.stopAnimations();
    this.generateTriangles();
    
    // Re-initialize after Angular change detection with smooth transition
    requestAnimationFrame(() => {
      this.initializeTriangleElements();
      if (this.enabled) {
        // Stagger the restart slightly for smoother visual transition
        setTimeout(() => {
          this.startAnimations();
        }, 16); // Wait for next frame
      }
    });
  }

  // Debug method to check animation performance
  public getPerformanceStats(): { fps: number, frameCount: number } {
    const fps = this.frameCount > 0 ? Math.round(this.frameCount / ((performance.now() - this.lastFrameTime) / 1000)) : 0;
    return { fps, frameCount: this.frameCount };
  }

  private updateTriangleFill(fillElement: HTMLElement, progress: number): void {
    // Basic fill update - this replaces updateTriangleFillExact
    const borderSize = 8;
    const fillTop = 100 - (progress * (100 - borderSize * 2)) - borderSize;
    const leftX = borderSize;
    const rightX = 100 - borderSize;
    const bottomY = 100 - borderSize;
    
    fillElement.style.clipPath = `polygon(50% ${fillTop.toFixed(2)}%, ${leftX.toFixed(2)}% ${bottomY.toFixed(2)}%, ${rightX.toFixed(2)}% ${bottomY.toFixed(2)}%)`;
  }

  private applyInnerTriangleAnimation(fillElement: HTMLElement, state: AnimationState): void {
    // Apply inner triangle animation based on state
    const progress = state.innerTriangleProgress;
    this.updateTriangleFill(fillElement, progress);
  }
}