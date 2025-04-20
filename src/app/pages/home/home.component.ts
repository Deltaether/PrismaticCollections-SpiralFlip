import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Main homepage component for Prismatic Collections
 * Provides navigation to different projects and site sections
 * 【✓】
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  // Cleanup subject
  private readonly destroy$ = new Subject<void>();
  
  // Flag for debug logging
  private readonly isDebugMode = false;
  
  // Featured content sections
  readonly featuredSections = [
    {
      id: 'phantasia',
      title: 'Project Phantasia',
      description: 'A revolutionary musical experience with interactive 3D environments',
      image: 'assets/images/experience-preview.jpg',
      route: '/collections/phantasia',
      isMain: true
    },
    {
      id: 'collections',
      title: 'Music Collections',
      description: 'Browse our complete collection of albums and tracks',
      image: 'assets/images/collection-preview.jpg',
      route: '/collections',
      isMain: false
    },
    {
      id: 'mobile',
      title: 'Mobile Access',
      description: 'Access our projects through our mobile-optimized interface',
      image: 'assets/images/mobile-preview.jpg',
      route: '/mobile',
      isMain: false
    }
  ];

  constructor(private router: Router) {}

  /**
   * Initialize component 
   * 【✓】
   */
  ngOnInit(): void {
    if (this.isDebugMode) {
      console.log('[Home] Component initialized');
    }
    console.log('HOME COMPONENT LOADED - VERSION 2');
    
    // Log the featuredSections to verify the correct data
    console.log('Featured Sections:', this.featuredSections);
  }

  /**
   * Navigate to the selected section
   * 【✓】
   */
  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }

  /**
   * Clean up on component destruction
   * 【✓】
   */
  ngOnDestroy(): void {
    if (this.isDebugMode) {
      console.log('[Home] Component destroyed');
    }
    
    this.destroy$.next();
    this.destroy$.complete();
  }
}
