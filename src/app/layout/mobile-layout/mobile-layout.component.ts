import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * MobileLayout component that provides a responsive layout optimized for mobile devices
 * Uses a simplified design with a mobile navigation menu
 * 【✓】
 */
@Component({
  selector: 'app-mobile-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mobile-layout.component.html',
  styleUrls: ['./mobile-layout.component.scss']
})
export class MobileLayoutComponent implements OnInit, OnDestroy {
  /**
   * Cleanup subject for managing subscriptions
   * 【✓】
   */
  private readonly destroy$ = new Subject<void>();

  /**
   * Flag to toggle debug logging
   * 【✓】
   */
  private readonly isDebugMode = false;
  
  /**
   * Flag to track menu state
   * 【✓】
   */
  isMenuOpen = false;
  
  /**
   * Current year for copyright
   * 【✓】
   */
  currentYear = new Date().getFullYear();

  constructor() {}

  /**
   * Initialize component and set up mobile detection
   * 【✓】
   */
  ngOnInit(): void {
    if (this.isDebugMode) {
      console.log('[MobileLayout] Component initialized');
    }
  }
  
  /**
   * Toggle mobile menu visibility
   * 【✓】
   */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  /**
   * Close menu when a navigation item is clicked
   * 【✓】
   */
  closeMenu(): void {
    this.isMenuOpen = false;
  }

  /**
   * Clean up resources on component destruction
   * 【✓】
   */
  ngOnDestroy(): void {
    if (this.isDebugMode) {
      console.log('[MobileLayout] Component destroyed');
    }
    
    this.destroy$.next();
    this.destroy$.complete();
  }
} 