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
  
  // Debug logging system
  public debugLogs: string[] = [];
  public showDebugPanel = false;
  
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
    },
    // CRITICAL FIX: Additional albums to ensure scrolling is required for testing scrollbar visibility
    {
      id: 'ethereal-dreams',
      title: 'Ethereal Dreams',
      artist: 'Prismatic Collections',
      coverImage: 'assets/images/phantasia_1_cover_optimized.webp',
      trackCount: 12,
      year: 2024,
      description: 'A dreamscape journey through ambient soundscapes and ethereal melodies.',
      tags: ['Ambient', 'Ethereal', 'Dreams'],
      featured: false,
      route: '/collections/ethereal-dreams'
    },
    {
      id: 'digital-horizons',
      title: 'Digital Horizons',
      artist: 'Prismatic Collections',
      coverImage: 'assets/images/phantasia_1_cover_optimized.webp',
      trackCount: 10,
      year: 2024,
      description: 'Electronic compositions exploring the intersection of digital and organic sounds.',
      tags: ['Electronic', 'Digital', 'Ambient'],
      featured: false,
      route: '/collections/digital-horizons'
    },
    {
      id: 'cosmic-wanderer',
      title: 'Cosmic Wanderer',
      artist: 'Prismatic Collections',
      coverImage: 'assets/images/phantasia_1_cover_optimized.webp',
      trackCount: 8,
      year: 2025,
      description: 'Space-inspired ambient music for interstellar journeys.',
      tags: ['Space', 'Ambient', 'Cosmic'],
      featured: false,
      route: '/collections/cosmic-wanderer'
    },
    {
      id: 'neon-nights',
      title: 'Neon Nights',
      artist: 'Prismatic Collections',
      coverImage: 'assets/images/phantasia_1_cover_optimized.webp',
      trackCount: 11,
      year: 2024,
      description: 'Synthwave and cyberpunk-inspired electronic compositions.',
      tags: ['Synthwave', 'Electronic', 'Cyberpunk'],
      featured: false,
      route: '/collections/neon-nights'
    },
    {
      id: 'forest-whispers',
      title: 'Forest Whispers',
      artist: 'Prismatic Collections',
      coverImage: 'assets/images/phantasia_1_cover_optimized.webp',
      trackCount: 9,
      year: 2024,
      description: 'Nature-inspired ambient music capturing the essence of ancient forests.',
      tags: ['Nature', 'Ambient', 'Organic'],
      featured: false,
      route: '/collections/forest-whispers'
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
    
    // Initialize debug logging
    this.initializeDebugLogging();
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
  
  // Debug logging system
  private initializeDebugLogging(): void {
    this.log('=== SCROLLBAR DEBUG LOGGING INITIALIZED ===');
    this.log(`Timestamp: ${new Date().toISOString()}`);
    this.log(`User Agent: ${navigator.userAgent}`);
    this.log(`Is iOS: ${this.isIOS}`);
    this.log(`Screen Size: ${window.screen.width}x${window.screen.height}`);
    this.log(`Viewport Size: ${window.innerWidth}x${window.innerHeight}`);
    
    // Initial analysis
    setTimeout(() => {
      this.analyzeScrollbarSetup();
      // Start periodic monitoring
      this.debugTimer = setInterval(() => {
        this.monitorScrollState();
      }, 2000);
    }, 1000);
  }
  
  private log(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    this.debugLogs.push(logMessage);
    console.log('🔍 SCROLLBAR DEBUG:', logMessage);
  }
  
  public analyzeScrollbarSetup(): void {
    this.log('\n--- INITIAL SCROLLBAR ANALYSIS ---');
    
    const collectionsPage = this.document.querySelector('.collections-page') as HTMLElement;
    if (collectionsPage) {
      this.log('✅ Collections page element found');
      
      // Get computed styles
      const computed = window.getComputedStyle(collectionsPage);
      this.log(`Overflow-X: ${computed.overflowX}`);
      this.log(`Overflow-Y: ${computed.overflowY}`);
      this.log(`Height: ${computed.height}`);
      this.log(`Max-Height: ${computed.maxHeight}`);
      this.log(`Position: ${computed.position}`);
      
      // Check dimensions
      const rect = collectionsPage.getBoundingClientRect();
      this.log(`Element dimensions: ${rect.width}x${rect.height}`);
      this.log(`Scroll dimensions: ${collectionsPage.scrollWidth}x${collectionsPage.scrollHeight}`);
      this.log(`Client dimensions: ${collectionsPage.clientWidth}x${collectionsPage.clientHeight}`);
      
      // Check if scrollable
      const isVerticallyScrollable = collectionsPage.scrollHeight > collectionsPage.clientHeight;
      const isHorizontallyScrollable = collectionsPage.scrollWidth > collectionsPage.clientWidth;
      this.log(`Is vertically scrollable: ${isVerticallyScrollable}`);
      this.log(`Is horizontally scrollable: ${isHorizontallyScrollable}`);
      
      // Check scrollbar styles
      this.log('\n--- CSS SCROLLBAR PROPERTIES ---');
      const scrollbarWidth = computed.getPropertyValue('--webkit-scrollbar-width') || 'not set';
      this.log(`Webkit scrollbar width: ${scrollbarWidth}`);
      
      // Check for webkit scrollbar support
      const supportsWebkitScrollbar = 'WebkitAppearance' in document.documentElement.style;
      this.log(`Supports webkit scrollbar: ${supportsWebkitScrollbar}`);
      
      // Check scrollbar color properties
      this.log(`Scrollbar-width: ${computed.scrollbarWidth}`);
      this.log(`Scrollbar-color: ${computed.scrollbarColor}`);
      
    } else {
      this.log('❌ Collections page element NOT found');
    }
    
    // Check body and html overflow
    const body = this.document.body;
    const html = this.document.documentElement;
    const bodyStyles = window.getComputedStyle(body);
    const htmlStyles = window.getComputedStyle(html);
    
    this.log('\n--- BODY & HTML OVERFLOW ---');
    this.log(`Body overflow: ${bodyStyles.overflow}, ${bodyStyles.overflowX}, ${bodyStyles.overflowY}`);
    this.log(`HTML overflow: ${htmlStyles.overflow}, ${htmlStyles.overflowX}, ${htmlStyles.overflowY}`);
    this.log(`Body height: ${bodyStyles.height}, Body max-height: ${bodyStyles.maxHeight}`);
    this.log(`HTML height: ${htmlStyles.height}, HTML max-height: ${htmlStyles.maxHeight}`);
  }
  
  private monitorScrollState(): void {
    const collectionsPage = this.document.querySelector('.collections-page') as HTMLElement;
    if (collectionsPage) {
      const scrollTop = collectionsPage.scrollTop;
      const scrollLeft = collectionsPage.scrollLeft;
      const maxScrollTop = collectionsPage.scrollHeight - collectionsPage.clientHeight;
      const maxScrollLeft = collectionsPage.scrollWidth - collectionsPage.clientWidth;
      
      if (scrollTop > 0 || scrollLeft > 0) {
        this.log(`Scroll position: top=${scrollTop}/${maxScrollTop}, left=${scrollLeft}/${maxScrollLeft}`);
      }
    }
  }
  
  // Public methods for UI interaction
  toggleDebugPanel(): void {
    this.showDebugPanel = !this.showDebugPanel;
    this.log(`Debug panel ${this.showDebugPanel ? 'opened' : 'closed'}`);
  }
  
  downloadLogs(): void {
    const logData = this.debugLogs.join('\n');
    const blob = new Blob([logData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = this.document.createElement('a');
    a.href = url;
    a.download = `scrollbar-debug-${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    this.log('Debug logs downloaded');
  }
  
  forceScrollTest(): void {
    this.log('\n--- FORCE SCROLL TEST ---');
    const collectionsPage = this.document.querySelector('.collections-page') as HTMLElement;
    if (collectionsPage) {
      // Try to scroll programmatically
      collectionsPage.scrollTop = 100;
      setTimeout(() => {
        this.log(`After force scroll - scrollTop: ${collectionsPage.scrollTop}`);
        this.analyzeScrollbarSetup();
      }, 100);
    }
  }
  
  inspectElement(): void {
    this.log('\n--- ELEMENT INSPECTION ---');
    const collectionsPage = this.document.querySelector('.collections-page') as HTMLElement;
    if (collectionsPage) {
      // Log all applied CSS classes
      this.log(`CSS Classes: ${collectionsPage.className}`);
      
      // Log all inline styles
      this.log(`Inline styles: ${collectionsPage.style.cssText || 'none'}`);
      
      // Check parent element
      const parent = collectionsPage.parentElement;
      if (parent) {
        const parentStyles = window.getComputedStyle(parent);
        this.log(`Parent tag: ${parent.tagName}`);
        this.log(`Parent overflow: ${parentStyles.overflow}, ${parentStyles.overflowX}, ${parentStyles.overflowY}`);
        this.log(`Parent height: ${parentStyles.height}`);
      }
      
      // Check all child elements that might affect scrolling
      const children = Array.from(collectionsPage.children);
      children.forEach((child, index) => {
        if (child instanceof HTMLElement) {
          const childStyles = window.getComputedStyle(child);
          this.log(`Child ${index} (${child.tagName}): position=${childStyles.position}, height=${childStyles.height}`);
        }
      });
    }
  }
}