import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChildren, QueryList, AfterViewInit, OnDestroy, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ScrollHelperService } from '../../../../../shared/services/scroll-helper.service';
import { CollectionHeaderFix } from './collection-header-fix';

/**
 * Collections overview page
 * Shows available music collections in the Prismatic platform
 * 【✓】
 */
@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss', './collection-scrollable.scss', './scroll-animations.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'phantasia-collection-page'
  }
})
export class CollectionComponent implements OnInit, AfterViewInit, OnDestroy {
  // Featured collection info (Phantasia)
  featuredCollection = {
    id: 'phantasia',
    title: 'Phantasia',
    artist: 'An × Feryquitous',
    releaseDate: '2020-10-28',
    trackCount: 12,
    duration: '56:32',
    genre: 'Electronic / Orchestral',
    coverImage: 'assets/graphic/jewel-case-_640.png',
    description: 'Project Phantasia is a groundbreaking album that blends electronic and orchestral elements to create an immersive sonic experience. The collaboration between An and Feryquitous showcases their unique approach to music production and composition.'
  };
  
  // All available collections
  collections: Collection[] = [
    {
      id: 'phantasia',
      title: 'Phantasia',
      artist: 'Various Artists',
      year: '2023',
      imagePath: 'assets/images/collections/phantasia-cover.jpg',
      description: 'Our flagship collection featuring a blend of orchestral and electronic music that takes listeners on a journey through dreamlike soundscapes.',
      featured: true,
      tags: ['Orchestral', 'Electronic', 'Ambient']
    },
    {
      id: 'prismatic-echoes',
      title: 'Prismatic Echoes',
      artist: 'SpiralFlip Collective',
      year: '2023',
      imagePath: 'assets/images/collections/prismatic-echoes.jpg',
      description: 'A vibrant exploration of sound through layered synthesizers and digital processing, creating an immersive audio experience.',
      featured: false,
      tags: ['Synth', 'Experimental', 'Digital']
    },
    {
      id: 'crystal-memories',
      title: 'Crystal Memories',
      artist: 'Harmonic Ensemble',
      year: '2022',
      imagePath: 'assets/images/collections/crystal-memories.jpg',
      description: 'Delicate compositions that evoke nostalgia through crystalline piano melodies and subtle electronic textures.',
      featured: false,
      tags: ['Piano', 'Minimal', 'Atmospheric']
    },
    {
      id: 'sonic-landscapes',
      title: 'Sonic Landscapes',
      artist: 'Audio Architects',
      year: '2022',
      imagePath: 'assets/images/collections/sonic-landscapes.jpg',
      description: 'Field recordings merged with modern production techniques to create immersive sonic environments that transport listeners to otherworldly places.',
      featured: false,
      tags: ['Field Recording', 'Ambient', 'Spatial']
    }
  ];
  
  // Collection categories for filtering
  categories = [
    { id: 'all', name: 'All Collections', active: true },
    { id: 'electronic', name: 'Electronic', active: false },
    { id: 'orchestral', name: 'Orchestral', active: false },
    { id: 'ambient', name: 'Ambient', active: false },
    { id: 'experimental', name: 'Experimental', active: false }
  ];
  
  // Collection sorting options
  sortOptions = [
    { id: 'newest', name: 'Newest First', active: true },
    { id: 'oldest', name: 'Oldest First', active: false },
    { id: 'az', name: 'A-Z', active: false },
    { id: 'za', name: 'Z-A', active: false }
  ];

  @ViewChildren('collectionItem') collectionItems!: QueryList<ElementRef>;
  
  // Active collection tracking
  activeCollectionIndex = 0;
  activeCollectionId = 'phantasia'; // Initialize to first collection

  @ViewChild('collectionContainer', { static: false }) collectionContainer!: ElementRef;
  @ViewChild('scrollProgress', { static: false }) scrollProgress!: ElementRef;
  @ViewChild('scrollToTopBtn', { static: false }) scrollToTopBtn!: ElementRef;

  constructor(
    private router: Router,
    private scrollHelper: ScrollHelperService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    console.log('[Collections] Component initialized');
    
    // Add class to body element for styling purposes
    document.body.classList.add('collections-page');
    
    // Apply header styles directly
    setTimeout(() => {
      CollectionHeaderFix.applyHeaderStyles();
    }, 100);
  }
  
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.updateScrollProgress();
    this.toggleScrollToTopButton();
  }

  // 【✓】 Update scroll progress indicator
  updateScrollProgress(): void {
    if (!this.scrollProgress) return;
    
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    this.renderer.setStyle(
      this.scrollProgress.nativeElement, 
      'width', 
      `${scrolled}%`
    );
  }

  // 【✓】 Show/hide scroll to top button based on scroll position
  toggleScrollToTopButton(): void {
    if (!this.scrollToTopBtn) return;
    
    if (document.documentElement.scrollTop > 300) {
      this.renderer.addClass(this.scrollToTopBtn.nativeElement, 'visible');
    } else {
      this.renderer.removeClass(this.scrollToTopBtn.nativeElement, 'visible');
    }
  }

  // 【✓】 Scroll to top of the page
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  
  ngAfterViewInit(): void {
    // 【✓】 Initialize scroll animations
    if (this.collectionContainer) {
      this.scrollHelper.initScrollAnimations(
        this.collectionContainer, 
        ['.collection-header', '.collection-description', '.collection-item']
      );
      
      // Apply staggered animation to collection items
      const collectionItems = this.collectionContainer.nativeElement.querySelectorAll('.collection-item');
      this.scrollHelper.applyStaggeredAnimation(
        collectionItems,
        'fade-in',
        0.1
      );
      
      // Apply parallax effect to header images
      const headerImages = this.collectionContainer.nativeElement.querySelectorAll('.collection-header-image');
      this.scrollHelper.applyParallaxEffect(
        headerImages
      );
    }
  }
  
  /**
   * Navigate to a specific collection detail page
   * 【✓】
   */
  navigateToCollection(collectionId: string): void {
    this.scrollHelper.scrollToElement(`collection-${collectionId}`);
  }
  
  /**
   * Filter collections by category
   * 【✓】
   */
  filterByCategory(categoryId: string): void {
    this.categories.forEach(category => {
      category.active = category.id === categoryId;
    });
    // Actual filtering would be implemented here
  }
  
  /**
   * Sort collections by selected option
   * 【✗】
   */
  sortCollections(sortId: string): void {
    this.sortOptions.forEach(option => {
      option.active = option.id === sortId;
    });
    // Actual sorting would be implemented here
  }

  /**
   * Parse collection genre string into individual tags
   * 【✓】
   */
  getCollectionTags(genreString: string): string[] {
    if (!genreString) return [];
    return genreString.split('/').map(tag => tag.trim());
  }

  /**
   * Scroll to a specific collection in the list
   * 【✓】
   */
  scrollToCollection(index: number): void {
    if (this.collectionItems && this.collectionItems.length > index) {
      const element = this.collectionItems.toArray()[index].nativeElement;
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      this.activeCollectionIndex = index;
    }
  }

  /**
   * Set active collection
   * 【✓】
   */
  setActiveCollection(id: string): void {
    this.activeCollectionId = id;
  }

  scrollToSection(sectionId: string): void {
    this.scrollHelper.scrollToElement(sectionId, -80);
  }

  // 【✓】 Scroll to specific collection item
  scrollToItem(itemId: string): void {
    this.scrollHelper.scrollToElement(itemId, -80);
  }

  ngOnDestroy(): void {
    // 【✓】 Clean up observers and event listeners
    this.scrollHelper.cleanUpObservers();
    this.scrollHelper.cleanUpParallax();
    
    // Remove body class when component is destroyed
    document.body.classList.remove('collections-page');
    CollectionHeaderFix.cleanupHeaderStyles();
  }
}

// 【✓】 Collection Interface Definition
interface Collection {
  id: string;
  title: string;
  artist: string;
  year: string;
  imagePath: string;
  description: string;
  featured: boolean;
  tags: string[];
} 