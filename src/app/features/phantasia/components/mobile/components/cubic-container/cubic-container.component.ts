import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { AudioService } from '../../../services/music-player/audio.service';
import { MobileNavigationService } from '../../services/mobile-navigation.service';

// 【✓】 Define interfaces for type safety
interface CubeDimensions {
  width: number;
  height: number;
  depth: number;
}

interface CubeFace {
  readonly name: string;
  readonly route: string;
}

@Component({
  selector: 'app-cubic-container',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cube-container" #cube>
      <div class="cube" [class.transitioning]="isTransitioning">
        <div class="face front" [class.active]="currentFace === 'front'"></div>
        <div class="face right" [class.active]="currentFace === 'right'"></div>
        <div class="face back" [class.active]="currentFace === 'back'"></div>
        <div class="face left" [class.active]="currentFace === 'left'"></div>
        <div class="face top" [class.active]="currentFace === 'top'"></div>
        <div class="face bottom" [class.active]="currentFace === 'bottom'"></div>
      </div>
    </div>
  `,
  styles: [`
    .cube-container {
      width: 100%;
      height: 100%;
      perspective: 1000px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .cube {
      width: 100%;
      height: 100%;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 0.5s ease;
    }

    .cube.transitioning {
      transition: transform 0.5s ease;
    }

    .face {
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: center;
      align-items: center;
      backface-visibility: hidden;
    }

    .face.active {
      background: rgba(0, 0, 0, 0.9);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .front { transform: translateZ(50%); }
    .right { transform: rotateY(90deg) translateZ(50%); }
    .back { transform: rotateY(180deg) translateZ(50%); }
    .left { transform: rotateY(-90deg) translateZ(50%); }
    .top { transform: rotateX(90deg) translateZ(50%); }
    .bottom { transform: rotateX(-90deg) translateZ(50%); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush // 【✓】 Optimize change detection
})
export class CubicContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cube') private readonly cubeElement!: ElementRef<HTMLDivElement>;
  
  private readonly destroy$ = new Subject<void>();
  private readonly isDebugMode = true;
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private currentPage: number = 0;
  private readonly totalPages: number = 6;
  
  cubeDimensions: CubeDimensions = {
    width: 0,
    height: 0,
    depth: 0
  };

  currentFace = 'front';
  isTransitioning = false;
  routerSubscription?: Subscription;
  
  // 【✓】 Map routes to cube faces
  private readonly routeFaceMap: Record<string, string> = {
    '/': 'front',
    '/music': 'right',
    '/about': 'back',
    '/contact': 'left',
    '/top': 'top',
    '/bottom': 'bottom'
  };
  
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly audioService: AudioService,
    public readonly navigationService: MobileNavigationService
  ) {}

  // 【✓】 Initialize component
  ngOnInit(): void {
    if (this.isDebugMode) {
      console.log('[CubicContainer] Initializing component');
    }
    this.initializeComponent();
  }

  // 【✓】 After view initialization
  ngAfterViewInit(): void {
    if (this.isDebugMode) {
      console.log('[CubicContainer] After view init');
    }
    this.updateCubeDimensions();
  }

  // 【✓】 Cleanup resources
  ngOnDestroy(): void {
    if (this.isDebugMode) {
      console.log('[CubicContainer] Destroying component');
    }
    this.destroy$.next();
    this.destroy$.complete();
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // 【✓】 Initialize component
  private initializeComponent(): void {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      const targetFace = this.getTargetFace(url);
      
      if (targetFace !== this.currentFace) {
        this.rotateCube(targetFace);
      }
    });
    
    this.navigationService.getCurrentPageIndex()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageIndex => {
        this.currentPage = pageIndex;
        this.cdr.markForCheck();
      });
  }

  // 【✓】 Handle window resize
  @HostListener('window:resize')
  private handleResize(): void {
    this.updateCubeDimensions();
    this.cdr.markForCheck();
  }

  // 【✓】 Handle touch start
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  // 【✓】 Handle touch move
  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (this.isTransitioning) return;

    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;
    const deltaX = touchX - this.touchStartX;
    const deltaY = touchY - this.touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 50) {
        this.navigationService.previousPage();
      } else if (deltaX < -50) {
        this.navigationService.nextPage();
      }
    }
  }

  // 【✓】 Handle wheel events
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    event.preventDefault();
    
    if (this.isTransitioning) return;
    
    if (event.deltaY > 0) {
      this.navigationService.nextPage();
    } else {
      this.navigationService.previousPage();
    }
  }

  // 【✓】 Update cube dimensions
  private updateCubeDimensions(): void {
    if (!this.cubeElement) return;

    const container = this.cubeElement.nativeElement;
    const rect = container.getBoundingClientRect();
    
    this.cubeDimensions = {
      width: rect.width,
      height: rect.height,
      depth: Math.min(rect.width, rect.height) / 2
    };

    if (this.isDebugMode) {
      console.log('[CubicContainer] Cube dimensions updated:', this.cubeDimensions);
    }
  }

  // 【✓】 Rotate cube to target face
  private rotateCube(targetFace: string): void {
    if (this.isDebugMode) {
      console.log(`[CubicContainer] Rotating cube to face: ${targetFace}`);
    }

    this.isTransitioning = true;
    this.currentFace = targetFace;
    this.cdr.markForCheck();

    setTimeout(() => {
      this.isTransitioning = false;
      this.cdr.markForCheck();
    }, 500);
  }

  // 【✓】 Get target face from URL
  private getTargetFace(url: string): string {
    const baseUrl = url.split('?')[0].split('#')[0];
    return this.routeFaceMap[baseUrl] || 'front';
  }
}
