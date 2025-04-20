import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * MainLayout component that provides the default layout for standard pages
 * Implements a clean, minimalist design for general content
 * 【✓】
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
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
   * Initialize component and set up subscriptions
   * 【✓】
   */
  ngOnInit(): void {
    if (this.isDebugMode) {
      console.log('[MainLayout] Component initialized');
    }
  }

  /**
   * Clean up resources on component destruction
   * 【✓】
   */
  ngOnDestroy(): void {
    if (this.isDebugMode) {
      console.log('[MainLayout] Component destroyed');
    }
    
    this.destroy$.next();
    this.destroy$.complete();
  }
} 