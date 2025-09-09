import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SiteHeaderComponent } from '../../shared/components/site-header/site-header.component';

/**
 * Main homepage component for Prismatic Collections
 * Provides navigation to different projects and site sections
 * 【✓】
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, SiteHeaderComponent],
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
      id: 'phantasia-album',
      title: 'Project Phantasia - CD Album',
      description: 'Experience our immersive musical album with 3D interactive CD cases and visual storytelling',
      image: 'assets/images/albums/phantasia-cd-cover.jpg',
      route: '/phantasia/phantasia',
      isMain: true
    },
    {
      id: 'unknown-prism',
      title: '???',
      description: 'PRISM UNREADABLE - This prism appears to be corrupted ./restoration in progress...',
      image: 'assets/images/featured/prism-unreadable.svg',
      route: '/phantasia/phantasia',
      isMain: false
    }
  ];

  constructor(private router: Router, @Inject(DOCUMENT) private document: Document) {}

  /**
   * Initialize component 
   * 【✓】
   */
  ngOnInit(): void {
    if (this.isDebugMode) {
      console.log('[Home] Component initialized');
    }
    console.log('HOME COMPONENT LOADED - VERSION 3 (Scroll Fix Applied)');
    
    // Enable scrolling for home page by adding body class only
    this.document.body.classList.add('home-page-active');
    
    // Debug scrolling setup
    setTimeout(() => {
      const body = this.document.body;
      const appRoot = this.document.querySelector('app-root') as HTMLElement;
      console.log('Body classes:', body.className);
      console.log('Body computed overflow:', getComputedStyle(body).overflow);
      console.log('App-root computed overflow:', appRoot ? getComputedStyle(appRoot).overflow : 'not found');
      console.log('Body scrollHeight vs clientHeight:', body.scrollHeight, 'vs', body.clientHeight);
    }, 100);
    
    // Log the featuredSections to verify the correct data
    console.log('Featured Sections:', this.featuredSections);
  }

  /**
   * Navigate to the selected section
   * 【✓】
   */
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }


  /**
   * Clean up on component destruction
   * 【✓】
   */
  ngOnDestroy(): void {
    if (this.isDebugMode) {
      console.log('[Home] Component destroyed');
    }
    
    // Restore original overflow settings when leaving home page
    this.document.body.classList.remove('home-page-active');
    
    this.destroy$.next();
    this.destroy$.complete();
  }
}
