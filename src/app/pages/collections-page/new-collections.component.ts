import { Component, OnInit, ChangeDetectionStrategy, ElementRef, OnDestroy, HostListener, Inject, DOCUMENT } from '@angular/core';
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
export class NewCollectionsComponent implements OnInit, OnDestroy {
  
  
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

  ngOnDestroy(): void {
    // Clean up scroll timer
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }
    if (this.debugTimer) {
      clearInterval(this.debugTimer);
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