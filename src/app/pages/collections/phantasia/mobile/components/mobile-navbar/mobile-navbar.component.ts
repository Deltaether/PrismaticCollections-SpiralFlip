import { Component, HostListener, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AudioService } from '../../../../tools/music-player/audio.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// 【✓】 Define interfaces for type safety
interface NavbarState {
  readonly isScrolled: boolean;
  readonly isMenuOpen: boolean;
}

interface NavItem {
  readonly label: string;
  readonly route: string;
  readonly icon: string;
}

@Component({
  selector: 'app-mobile-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="mobile-navbar" [class.scrolled]="navbarState.isScrolled">
      <div class="logo" (click)="navigateHome()">
        <span class="logo-text">Phantasia</span>
      </div>
      
      <button class="menu-toggle" (click)="toggleMenu()" aria-label="Toggle menu">
        <span class="bar" [class.open]="navbarState.isMenuOpen"></span>
        <span class="bar" [class.open]="navbarState.isMenuOpen"></span>
        <span class="bar" [class.open]="navbarState.isMenuOpen"></span>
      </button>
      
      <div class="mobile-menu" [class.open]="navbarState.isMenuOpen">
        <div class="menu-backdrop" (click)="closeMenu()"></div>
        <div class="menu-content">
          <ul class="menu-items">
            <li *ngFor="let item of navItems" 
                class="menu-item"
                [class.active]="isActiveRoute(item.route)"
                (click)="navigateTo(item.route)">
              <i class="menu-icon" [class]="item.icon"></i>
              <span class="menu-label">{{ item.label }}</span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .mobile-navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      z-index: 1000;
      transition: background-color 0.3s ease;
    }
    
    .scrolled {
      background: rgba(0, 0, 0, 0.95);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
    
    .logo {
      cursor: pointer;
    }
    
    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    
    .menu-toggle {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 30px;
      height: 20px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      z-index: 1001;
    }
    
    .bar {
      width: 100%;
      height: 2px;
      background-color: #fff;
      transition: all 0.3s ease;
    }
    
    .bar.open:nth-child(1) {
      transform: translateY(9px) rotate(45deg);
    }
    
    .bar.open:nth-child(2) {
      opacity: 0;
    }
    
    .bar.open:nth-child(3) {
      transform: translateY(-9px) rotate(-45deg);
    }
    
    .mobile-menu {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.3s ease, visibility 0s linear 0.3s;
      z-index: 999;
    }
    
    .mobile-menu.open {
      visibility: visible;
      opacity: 1;
      transition: opacity 0.3s ease, visibility 0s linear;
    }
    
    .menu-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
    }
    
    .menu-content {
      position: absolute;
      top: 0;
      right: 0;
      width: 80%;
      max-width: 350px;
      height: 100%;
      background: #121212;
      box-shadow: -5px 0 15px rgba(0, 0, 0, 0.3);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      display: flex;
      flex-direction: column;
      padding: 80px 0 20px;
    }
    
    .mobile-menu.open .menu-content {
      transform: translateX(0);
    }
    
    .menu-items {
      list-style: none;
      padding: 0;
      margin: 0;
      overflow-y: auto;
    }
    
    .menu-item {
      padding: 15px 25px;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: background-color 0.2s ease;
    }
    
    .menu-item:hover, .menu-item.active {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .menu-icon {
      margin-right: 15px;
      font-size: 1.1rem;
      width: 20px;
      text-align: center;
    }
    
    .menu-label {
      font-size: 1rem;
      letter-spacing: 1px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush // 【✓】 Optimize change detection
})
export class MobileNavbarComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly isDebugMode = false; // Set to true only during development
  private scrollThreshold = 10;
  
  // 【✓】 Navigation items with proper typing
  readonly navItems: readonly NavItem[] = [
    { label: 'Home', route: '/mobile', icon: 'fas fa-home' },
    { label: 'Music', route: '/mobile/music', icon: 'fas fa-music' },
    { label: 'About', route: '/mobile/about', icon: 'fas fa-info-circle' },
    { label: 'Contact', route: '/mobile/contact', icon: 'fas fa-envelope' },
    { label: 'Credits', route: '/mobile/credits', icon: 'fas fa-users' }
  ];
  
  // 【✓】 Component state with proper typing
  navbarState: NavbarState = {
    isScrolled: false,
    isMenuOpen: false
  };
  
  constructor(
    private readonly router: Router,
    private readonly audioService: AudioService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  // 【✓】 Initialize component
  ngOnInit(): void {
    if (this.isDebugMode) {
      console.log('[MobileNavbar] Initializing component');
    }
    
    // Check initial scroll position
    this.checkScrollPosition();
  }

  // 【✓】 Check for scroll position
  private checkScrollPosition(): void {
    this.updateScrollState(window.scrollY > this.scrollThreshold);
  }

  // 【✓】 Update scroll state
  private updateScrollState(isScrolled: boolean): void {
    if (this.navbarState.isScrolled !== isScrolled) {
      this.navbarState = {
        ...this.navbarState,
        isScrolled
      };
      this.cdr.markForCheck();
      
      if (this.isDebugMode) {
        console.log(`[MobileNavbar] Scroll state changed to: ${isScrolled}`);
      }
    }
  }

  // 【✓】 Toggle menu state
  toggleMenu(): void {
    const newState = !this.navbarState.isMenuOpen;
    
    this.navbarState = {
      ...this.navbarState,
      isMenuOpen: newState
    };
    
    this.playUISound('menu-click');
    
    // Prevent body scrolling when menu is open
    document.body.style.overflow = newState ? 'hidden' : '';
    
    this.cdr.markForCheck();
    
    if (this.isDebugMode) {
      console.log(`[MobileNavbar] Menu toggled: ${newState}`);
    }
  }
  
  // 【✓】 Close menu
  closeMenu(): void {
    if (!this.navbarState.isMenuOpen) return;
    
    this.navbarState = {
      ...this.navbarState,
      isMenuOpen: false
    };
    
    // Restore body scrolling
    document.body.style.overflow = '';
    
    this.cdr.markForCheck();
    
    if (this.isDebugMode) {
      console.log('[MobileNavbar] Menu closed');
    }
  }

  // 【✓】 Navigate to specified route
  navigateTo(route: string): void {
    this.closeMenu();
    
    // Play sound and navigate
    this.playUISound('menu-click');
    this.router.navigate([route]);
    
    if (this.isDebugMode) {
      console.log(`[MobileNavbar] Navigating to: ${route}`);
    }
  }
  
  // 【✓】 Navigate to home
  navigateHome(): void {
    this.navigateTo('/mobile');
  }
  
  // 【✓】 Check if route is active
  isActiveRoute(route: string): boolean {
    return this.router.url === route || 
           (route === '/mobile' && this.router.url === '/mobile/');
  }

  // 【✓】 Play UI sound
  private playUISound(soundName: string): void {
    this.audioService.playUISound(soundName);
  }

  // 【✓】 Handle scroll event
  @HostListener('window:scroll')
  onScroll(): void {
    this.updateScrollState(window.scrollY > this.scrollThreshold);
  }
  
  // 【✓】 Handle escape key to close menu
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeMenu();
  }
  
  // 【✓】 Handle clicks outside menu
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const menu = document.querySelector('.mobile-menu .menu-content');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (!this.navbarState.isMenuOpen) return;
    
    if (menu && 
        menuToggle && 
        !menu.contains(event.target as Node) && 
        !menuToggle.contains(event.target as Node)) {
      this.closeMenu();
    }
  }

  // 【✓】 Cleanup resources
  ngOnDestroy(): void {
    if (this.isDebugMode) {
      console.log('[MobileNavbar] Destroying component');
    }
    
    // Ensure body scrolling is restored when component is destroyed
    document.body.style.overflow = '';
    
    this.destroy$.next();
    this.destroy$.complete();
  }
}
