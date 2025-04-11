import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Main homepage component for Project Phantasia
 * Provides navigation to different site sections
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
      id: 'experience',
      title: 'Interactive Experience',
      description: 'Explore the full 3D music experience with interactive CD cases',
      image: 'assets/images/experience-preview.jpg',
      route: '/introduction',
      isMain: true
    },
    {
      id: 'collection',
      title: 'Music Collection',
      description: 'Browse our complete collection of albums and tracks',
      image: 'assets/images/collection-preview.jpg',
      route: '/collection',
      isMain: false
    },
    {
      id: 'mobile',
      title: 'Mobile Experience',
      description: 'Switch to our mobile-optimized experience',
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
