import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef, HostListener, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CDCase } from '../shared/interfaces';
import { MusicPlayerComponent } from '../music-player/music-player.component';
import { MenuIntegrationService } from './services/menu-integration.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MenuService } from './services/menu.service';

// 【✓】 Define interfaces for type safety
interface MenuPosition {
  readonly right: number;
  readonly top: number;
}

interface MenuConfig {
  readonly position: MenuPosition;
  readonly isVisible: boolean;
}

// 【✓】 Define interface for track data
interface Track {
  readonly title: string;
  readonly artist: string;
}

@Component({
  selector: 'app-right-side-menu',
  standalone: true,
  imports: [CommonModule, MusicPlayerComponent],
  templateUrl: './right-side-menu.component.html',
  styleUrls: ['./right-side-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // 【✓】 Optimize change detection
})
export class RightSideMenuComponent implements OnInit, OnDestroy {
  // 【✓】 Add proper typing for inputs and outputs
  @Input() cdCases: readonly CDCase[] = [];
  @Input() activeCaseIndex: number | null = null;
  @Output() trackSelected = new EventEmitter<number>();

  // 【✓】 Development mode properties
  readonly isDevelopment: boolean = false;
  private isDragging: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private currentX: number = 0;
  private currentY: number = 0;
  private readonly destroy$ = new Subject<void>();
  
  // 【✓】 Menu position with proper typing
  menuPosition: MenuPosition = {
    right: 20,
    top: 10
  };

  // 【✓】 Track list with proper typing
  readonly tracks: readonly Track[] = [
    { title: 'SpiralFlip - Phantasia ft. Elli', artist: 'SpiralFlip' },
    { title: 'First Steps', artist: 'Bigg Milk' },
    { title: 'Altar of the Sword', artist: 'Heem' },
    { title: 'A Voyage on the Winds of Change', artist: 'Futsuunobito' },
    { title: 'Rohkeutta Etsiä', artist: 'Prower' },
    { title: 'Ivory Flowers', artist: 'AZALI & Seycara' },
    { title: 'Outer Bygone Ruins', artist: 'Qrubey' },
    { title: 'Spiral Into the Abyss', artist: 'Luscinia' },
    { title: 'Wandering Breeze', artist: 'Gardens & sleepless' },
    { title: 'Mystic Nebula', artist: 'はがね' },
    { title: 'Iris', artist: 'LucaProject' },
    { title: 'Half-Asleep in the Middle of Bumfuck Nowhere', artist: 'Mei Naganowa' },
    { title: 'The Traveller', artist: 'ratella' },
    { title: 'Childhood memories', artist: 'dystopian tanuki' }
  ];

  currentTrack: Track | null = null;

  constructor(
    private readonly menuService: MenuService,
    private readonly menuIntegrationService: MenuIntegrationService,
    private readonly elementRef: ElementRef,
    private readonly cdr: ChangeDetectorRef
  ) {}

  // 【✓】 Initialize component
  ngOnInit(): void {
    if (this.isDevelopment) {
      console.log('[RightSideMenu] Initializing component');
    }

    this.applyResponsiveSizing();
    this.setupEventListeners();
    this.loadMenuConfig();
    
    // Check for active track
    this.updateCurrentTrack();
  }

  // 【✓】 Cleanup resources
  ngOnDestroy(): void {
    if (this.isDevelopment) {
      console.log('[RightSideMenu] Destroying component');
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  // 【✓】 Setup event listeners
  private setupEventListeners(): void {
    this.menuService.getMenuConfig()
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        if (this.isDevelopment) {
          console.log('[RightSideMenu] Menu config updated:', config);
        }
        this.menuPosition = {
          right: config.position.rightPercentage * window.innerWidth / 100,
          top: config.position.topPercentage * window.innerHeight / 100
        };
        this.cdr.markForCheck();
      });
      
    // Subscribe to menu integration service visibility updates
    this.menuIntegrationService.menuVisibilityState
      .pipe(takeUntil(this.destroy$))
      .subscribe(isVisible => {
        if (this.isDevelopment) {
          console.log(`[RightSideMenu] Menu visibility changed: ${isVisible}`);
        }
        
        // Apply any special handling when visibility changes
        if (isVisible) {
          this.onMenuShown();
        } else {
          this.onMenuHidden();
        }
        
        this.cdr.markForCheck();
      });
  }
  
  // 【✓】 Handle menu shown event
  private onMenuShown(): void {
    // Reapply responsive sizing when menu becomes visible
    this.applyResponsiveSizing();
    
    // Force change detection when menu is shown
    setTimeout(() => {
      this.cdr.markForCheck();
    }, 50);
  }
  
  // 【✓】 Handle menu hidden event
  private onMenuHidden(): void {
    // Perform any cleanup when menu is hidden
  }

  // 【✓】 Load menu configuration
  private loadMenuConfig(): void {
    const config = this.menuService.getConfig();
    if (config?.position) {
      this.menuPosition = {
        right: config.position.rightPercentage * window.innerWidth / 100,
        top: config.position.topPercentage * window.innerHeight / 100
      };
      this.cdr.markForCheck();
    }
  }

  // 【✓】 Handle window resize
  @HostListener('window:resize')
  private handleResize(): void {
    this.applyResponsiveSizing();
    this.cdr.markForCheck();
  }

  // 【✓】 Apply responsive sizing
  private applyResponsiveSizing(): void {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    if (this.isDevelopment) {
      console.log(`[RightSideMenu] Viewport dimensions: ${viewportWidth}x${viewportHeight}`);
    }

    // Adjust menu position based on viewport size
    this.menuPosition = {
      right: viewportWidth > 1920 ? 5 : 20,
      top: viewportHeight > 1080 ? 5 : 20
    };
    this.cdr.markForCheck();
  }

  // 【✓】 Update current track information
  private updateCurrentTrack(): void {
    if (this.activeCaseIndex !== null && this.activeCaseIndex >= 0 && this.activeCaseIndex < this.tracks.length) {
      this.currentTrack = this.tracks[this.activeCaseIndex];
    } else {
      this.currentTrack = null;
    }
    this.cdr.markForCheck();
  }

  // 【✓】 Handle track selection
  onTrackSelected(index: number): void {
    if (this.isDevelopment) {
      console.log(`[RightSideMenu] Track selected: ${index}`);
    }
    this.trackSelected.emit(index);
    this.activeCaseIndex = index;
    this.updateCurrentTrack();
  }

  // 【✓】 Handle drag start
  @HostListener('mousedown', ['$event'])
  onDragStart(event: MouseEvent): void {
    if (!this.isDevelopment) return;
    
    // Only initiate drag on parent container, not on interactive elements
    const target = event.target as HTMLElement;
    const isInteractive = 
      target.classList.contains('track-item') || 
      target.closest('.track-item') || 
      target.classList.contains('music-player-container') ||
      target.closest('.music-player-container') ||
      target.tagName.toLowerCase() === 'button' ||
      target.closest('button');
      
    if (isInteractive) return;
    
    this.isDragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.currentX = this.menuPosition.right;
    this.currentY = this.menuPosition.top;
    
    // Add dragstart class to improve UX
    this.elementRef.nativeElement.classList.add('dragging');
    
    // Prevent text selection during drag
    event.preventDefault();
  }

  // 【✓】 Handle drag move
  @HostListener('document:mousemove', ['$event'])
  onDragMove(event: MouseEvent): void {
    if (!this.isDragging) return;

    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;

    this.menuPosition = {
      right: Math.max(0, this.currentX - deltaX),
      top: Math.max(0, this.currentY + deltaY)
    };
    this.cdr.markForCheck();
  }

  // 【✓】 Handle drag end
  @HostListener('document:mouseup')
  onDragEnd(): void {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    
    // Remove dragstart class
    this.elementRef.nativeElement.classList.remove('dragging');
    
    // Calculate and save percentages
    const rightPercentage = (this.menuPosition.right / window.innerWidth) * 100;
    const topPercentage = (this.menuPosition.top / window.innerHeight) * 100;
    
    this.menuService.updatePosition(rightPercentage, topPercentage);
  }
}

