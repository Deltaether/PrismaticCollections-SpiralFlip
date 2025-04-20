import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * PhantasiaLayout component that provides the layout for Prismatic Collections pages
 * Implements an immersive layout with animated transitions
 * 【✓】
 */
@Component({
  selector: 'app-phantasia-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './phantasia-layout.component.html',
  styleUrls: ['./phantasia-layout.component.scss']
})
export class PhantasiaLayoutComponent implements OnInit, OnDestroy {
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
   * Current year for copyright notice
   * 【✓】
   */
  currentYear = new Date().getFullYear();

  constructor() {}

  /**
   * Initialize component and set up animations
   * 【✓】
   */
  ngOnInit(): void {
    if (this.isDebugMode) {
      console.log('[PhantasiaLayout] Component initialized');
    }
  }

  /**
   * Clean up resources on component destruction
   * 【✓】
   */
  ngOnDestroy(): void {
    if (this.isDebugMode) {
      console.log('[PhantasiaLayout] Component destroyed');
    }
    
    this.destroy$.next();
    this.destroy$.complete();
  }
} 