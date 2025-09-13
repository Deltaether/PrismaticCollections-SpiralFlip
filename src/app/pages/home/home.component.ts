import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, Inject, computed } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SiteHeaderComponent } from '../../shared/components/site-header/site-header.component';
import { SquaresAnimationComponent } from '../../shared/components/squares-animation/squares-animation.component';
import { ResponsiveService } from '../../shared/services/responsive.service';
import { ResponsiveFromDirective, ResponsiveToDirective } from '../../shared/directives/responsive.directive';

/**
 * Main homepage component for Prismatic Collections
 * Provides navigation to different projects and site sections
 * 【✓】
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    SiteHeaderComponent, 
    SquaresAnimationComponent,
    ResponsiveFromDirective,
    ResponsiveToDirective
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  // Cleanup subject
  private readonly destroy$ = new Subject<void>();
  
  // Flag for debug logging
  private readonly isDebugMode = false;
  
  // Responsive service integration
  public readonly screenInfo = this.responsiveService.screenInfo;
  public readonly isMobile = this.responsiveService.isMobile;
  public readonly isTablet = this.responsiveService.isTablet;
  public readonly isDesktop = this.responsiveService.isDesktop;
  public readonly isTouchDevice = this.responsiveService.isTouchDevice;
  
  // Computed layout properties
  public readonly gridColumns = computed(() => this.responsiveService.getGridColumns());
  public readonly contentMaxWidth = computed(() => this.responsiveService.getContentMaxWidth());
  
  
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

  constructor(
    private router: Router, 
    @Inject(DOCUMENT) private document: Document,
    public responsiveService: ResponsiveService
  ) {}

  /**
   * Initialize component 
   * 【✓】
   */
  ngOnInit(): void {
    // Enable scrolling for home page by adding body class only
    this.document.body.classList.add('home-page-active');
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
    
    // Restore original overflow settings when leaving home page
    this.document.body.classList.remove('home-page-active');
    
    this.destroy$.next();
    this.destroy$.complete();
  }
}
