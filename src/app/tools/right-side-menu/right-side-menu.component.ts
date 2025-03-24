import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CDCase } from '../shared/interfaces';
import { MusicPlayerComponent } from '../music-player/music-player.component';
import { MenuIntegrationService } from './services/menu-integration.service';

@Component({
  selector: 'app-right-side-menu',
  standalone: true,
  imports: [CommonModule, MusicPlayerComponent],
  templateUrl: './right-side-menu.component.html',
  styleUrls: ['./right-side-menu.component.scss']
})
export class RightSideMenuComponent implements OnInit, OnDestroy {
  @Input() cdCases: CDCase[] = [];
  @Input() activeCaseIndex: number | null = null;
  @Output() trackSelected = new EventEmitter<number>();

  // Development mode properties
  isDevelopment: boolean = false;
  isDragging: boolean = false;
  startX: number = 0;
  startY: number = 0;
  currentX: number = 0;
  currentY: number = 0;
  menuPosition: { right: number, top: number } = { right: 12, top: 18.60 };

  // Track list from the CD cases
  public tracks: { title: string, artist: string }[] = [
    { title: 'SpiralFlip - Phantasia ft. Elli', artist: 'SpiralFlip' },
    { title: 'First Steps', artist: 'Bigg Milk' },
    { title: 'Altar of the Sword', artist: 'Heem' },
    { title: 'A Voyage on the Winds of Change', artist: 'Futsuunobito' },
    { title: 'Rohkeutta Etsiä', artist: 'Prower' },
    { title: 'Ivory Flowers', artist: 'AZALI & Seycara' },
    { title: 'Outer Bygone Ruins', artist: 'Qrubey' },
    { title: 'Spiral Into the Abyss', artist: 'Luscinia' },
    { title: 'Wandering Breeze', artist: 'Gardens & sleepy' },
    { title: 'Mystic Nebula', artist: 'はがね' },
    { title: 'Iris', artist: 'LucaProject' },
    { title: 'Half-Asleep in the Middle of Bumfuck Nowhere', artist: 'Mei Naganowa' },
    { title: 'The Traveller', artist: 'ratella' },
    { title: 'Childhood memories', artist: 'dystopian tanuki' }
  ];

  constructor(
    private menuService: MenuIntegrationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.applyResponsiveSizing();
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Load config once on init
    this.reloadMenuConfig();
    
    // Store initial values from config
    const config = this.menuService.getConfig();
    if (config && config.position) {
      this.menuPosition = {
        right: config.position.rightPercentage,
        top: config.position.topPercentage
      };
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  private handleResize(): void {
    this.applyResponsiveSizing();
    
    // Reapply last known position when window resizes
    this.menuService.updateMenuPosition('rightPercentage', this.menuPosition.right);
    this.menuService.updateMenuPosition('topPercentage', this.menuPosition.top);
  }

  private applyResponsiveSizing(): void {
    // This will be handled by CSS variables and responsive classes
    // No need for additional JavaScript logic
  }

  onTrackSelected(index: number): void {
    this.activeCaseIndex = index;
    this.trackSelected.emit(index);
  }

  reloadMenuConfig(): void {
    console.log('RightSideMenuComponent: Requesting menu config reload');
    this.menuService.reloadMenuConfig();
    
    // Force change detection and DOM updates
    setTimeout(() => {
      this.cdr.detectChanges();
      console.log('Change detection forced after config reload');
      
      // Apply last known position values after config reload
      setTimeout(() => {
        this.menuService.updateMenuPosition('rightPercentage', this.menuPosition.right);
        this.menuService.updateMenuPosition('topPercentage', this.menuPosition.top);
        this.cdr.detectChanges();
      }, 200);
    }, 100);
  }

  // Drag functionality
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (!this.isDevelopment) return;
    
    // Only start dragging if clicking on the menu header or debug panel
    const target = event.target as HTMLElement;
    if (!target.closest('.menu-header') && !target.closest('.debug-panel')) return;
    
    event.preventDefault(); // Prevent text selection while dragging
    
    this.isDragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    
    // Store current menu position percentages
    this.currentX = this.menuPosition.right;
    this.currentY = this.menuPosition.top;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging || !this.isDevelopment) return;
    
    // Calculate delta movement in pixels
    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;
    
    // Convert delta to percentage of viewport
    const deltaXPercent = (deltaX / window.innerWidth) * 100;
    const deltaYPercent = (deltaY / window.innerHeight) * 100;
    
    // Update position (move right when deltaX is negative)
    const newRight = Math.max(0, Math.min(95, this.currentX - deltaXPercent));
    const newTop = Math.max(0, Math.min(90, this.currentY + deltaYPercent));
    
    // Update position
    this.menuPosition = {
      right: newRight,
      top: newTop
    };
    
    // Update menu position through service
    this.menuService.updateMenuPosition('rightPercentage', this.menuPosition.right);
    this.menuService.updateMenuPosition('topPercentage', this.menuPosition.top);
    
    // Force change detection
    this.cdr.detectChanges();
  }

  @HostListener('window:mouseup')
  onMouseUp(): void {
    if (!this.isDevelopment || !this.isDragging) return;
    
    this.isDragging = false;
    
    // Log final position for copying to config
    console.log('Final menu position:', {
      rightPercentage: Number(this.menuPosition.right.toFixed(2)),
      topPercentage: Number(this.menuPosition.top.toFixed(2))
    });
  }
}
