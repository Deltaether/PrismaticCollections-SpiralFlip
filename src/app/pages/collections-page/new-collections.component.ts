import { Component, OnInit, ChangeDetectionStrategy, ElementRef, OnDestroy, HostListener, Inject, DOCUMENT, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SiteHeaderComponent } from '../../shared/components/site-header/site-header.component';
import { SquaresAnimationComponent } from '../../shared/components/squares-animation/squares-animation.component';

/* Album/Prism Interface Definition */
interface Album {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  trackCount: number;
  year: number;
  description: string;
  tags: string[];
  featured: boolean;
  route: string;
}


/**
 * Collections Page Component
 * 
 * Displays album cards (Prisms) in a grid layout with navigation to individual albums.
 * Each album is considered a "Prism" in the Prismatic Collections terminology.
 */
@Component({
  selector: 'app-new-collections',
  standalone: true,
  imports: [CommonModule, SiteHeaderComponent, SquaresAnimationComponent],
  templateUrl: './new-collections.component.html',
  styleUrls: ['./new-collections.component.scss'],
  // Enable OnPush change detection for better performance
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewCollectionsComponent implements OnInit, OnDestroy, AfterViewInit {
  
  
  /* Albums/Prisms Data */
  albums: Album[] = [
    {
      id: 'phantasia',
      title: 'Project: Phantasia',
      artist: 'Prismatic Collections',
      coverImage: 'assets/images/phantasia_1_cover_optimized.webp',
      trackCount: 14,
      year: 2024,
      description: 'Our flagship collection featuring ethereal soundscapes, intricate rhythms, and emotional melodies.',
      tags: ['Ambient', 'Fantasy', 'Orchestral'],
      featured: false,
      route: '/phantasia'
    },
    {
      id: 'phantasia2',
      title: 'Project: Phatasia II -Blinding Dawn-', 
      artist: 'Prismatic Collections',
      coverImage: 'assets/images/project_phantasia2/album_cover.png',
      trackCount: 14,
      year: 2025,
      description: 'The highly anticipated sequel featuring expanded orchestral arrangements and deeper ambient textures.',
      tags: ['Ambient', 'Fantasy', 'Orchestral'],
      featured: true,
      route: '/phantasia/phantasia2'
    },
    {
      id: 'unknown-prism',
      title: '???',
      artist: 'CORRUPTED_DATA',
      coverImage: 'assets/images/featured/prism-unreadable.svg',
      trackCount: 0,
      year: 0,
      description: 'PRISM UNREADABLE - This prism appears to be corrupted ./restoration in progress...',
      tags: ['ERROR', 'UNREADABLE', 'CORRUPTED'],
      featured: false,
      route: '/collections/unknown'
    }
  ];

  private scrollTimer: any;
  private isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  private debugTimer: any;
  private resizeObserver?: ResizeObserver;

  constructor(
    private router: Router, 
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // Component initialization - squares now handled by SquaresAnimationComponent
    // CRITICAL FIX: Set body class for global styles to take effect
    this.document.body.classList.add('collections-page-active');
    this.setupScrollbarVisibility();
  }

  ngAfterViewInit(): void {
    // Check scrollbar necessity after view initialization
    setTimeout(() => {
      this.checkScrollbarNecessity();
      this.setupResizeObserver();
    }, 100);
  }

  ngOnDestroy(): void {
    // Clean up scroll timer
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }
    if (this.debugTimer) {
      clearInterval(this.debugTimer);
    }
    // Clean up resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    // CRITICAL FIX: Remove body class on component destroy
    this.document.body.classList.remove('collections-page-active');
  }

  /**
   * Setup scrollbar visibility for iOS devices
   * iOS Safari hides scrollbars by default, so we need to show a custom indicator
   */
  private setupScrollbarVisibility(): void {
    if (this.isIOS) {
      // Add scroll event listener for iOS devices
      this.elementRef.nativeElement.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
    }
  }

  /**
   * Handle scroll events to show/hide custom scrollbar indicator on iOS
   */
  @HostListener('scroll', ['$event'])
  onScroll(event?: Event): void {
    if (this.isIOS) {
      const element = this.elementRef.nativeElement.querySelector('.collections-page');
      if (element) {
        // Add scrolling class to show custom scrollbar indicator
        element.classList.add('scrolling');
        
        // Clear existing timer
        if (this.scrollTimer) {
          clearTimeout(this.scrollTimer);
        }
        
        // Hide scrollbar indicator after scrolling stops
        this.scrollTimer = setTimeout(() => {
          element.classList.remove('scrolling');
        }, 1500);
      }
    }
  }

  /**
   * Check if scrollbar is necessary based on number of cards and viewport overflow
   */
  private checkScrollbarNecessity(): void {
    const collectionsPage = this.elementRef.nativeElement.querySelector('.collections-page');
    if (!collectionsPage) return;

    const cardCount = this.albums.length;
    const hasOverflow = this.checkForOverflow(collectionsPage);

    // If 3 or less cards and no overflow, hide scrollbar
    if (cardCount <= 3 && !hasOverflow) {
      this.hideScrollbar(collectionsPage);
    } else {
      // If more than 3 cards OR there's overflow, show scrollbar
      this.showScrollbar(collectionsPage);
    }
  }

  /**
   * Check if content overflows the viewport
   */
  private checkForOverflow(element: HTMLElement): boolean {
    const elementRect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Check if any card extends beyond the viewport
    const cards = element.querySelectorAll('.album-card, .collection-card');
    for (let i = 0; i < cards.length; i++) {
      const cardRect = cards[i].getBoundingClientRect();
      if (cardRect.bottom > viewportHeight) {
        return true;
      }
    }

    // Also check if the overall content height exceeds viewport
    return element.scrollHeight > element.clientHeight;
  }

  /**
   * Hide scrollbar by setting overflow-y to hidden
   */
  private hideScrollbar(element: HTMLElement): void {
    element.style.overflowY = 'hidden';
    element.classList.add('no-scroll');
  }

  /**
   * Show scrollbar by setting overflow-y to auto
   */
  private showScrollbar(element: HTMLElement): void {
    element.style.overflowY = 'auto';
    element.classList.remove('no-scroll');
  }

  /**
   * Setup resize observer to recheck scrollbar necessity on viewport changes
   */
  private setupResizeObserver(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.checkScrollbarNecessity();
      });

      const collectionsPage = this.elementRef.nativeElement.querySelector('.collections-page');
      if (collectionsPage) {
        this.resizeObserver.observe(collectionsPage);
      }
    }
  }

  /**
   * Handle window resize events
   */
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    // Debounce resize checks
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }
    this.scrollTimer = setTimeout(() => {
      this.checkScrollbarNecessity();
    }, 150);
  }


  /* Navigate to Album */
  navigateToAlbum(albumId: string): void {
    const album = this.albums.find(a => a.id === albumId);
    if (album) {
      this.router.navigate([album.route]);
    }
  }

  /* TrackBy function for better ngFor performance */
  trackByAlbumId(_index: number, album: Album): string {
    return album.id;
  }
  
}