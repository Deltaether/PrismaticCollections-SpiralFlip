import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Inject, ViewChild, ElementRef, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MusicPlayerComponent } from '../../tools/music-player/music-player.component';
import { SiteHeaderComponent } from '../../../../../shared/components/site-header/site-header.component';
import { LoadingScreenComponent } from '../../../../../components/loading-screen/loading-screen.component';
import { DynamicArtistCardsComponent } from '../../components/dynamic-artist-cards/dynamic-artist-cards.component';
import { DynamicArtistService } from '../../services/dynamic-artist.service';
import { AudioService } from '../../tools/music-player/audio.service';
import { Phantasia2Debug } from './phantasia2-debug';

/**
 * Scroll indicator animation states
 */
export type ScrollIndicatorState = 'visible' | 'hidden';

/**
 * Phantasia Project II component that shows the professional album presentation
 * This is the entry point for Phantasia Project II album showcase
 * Features video background, music player integration, professional white-to-black theme,
 * smooth scroll navigation, and animated scroll indicators
 */
@Component({
  selector: 'app-phantasia2',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MusicPlayerComponent,
    SiteHeaderComponent,
    LoadingScreenComponent,
    DynamicArtistCardsComponent
  ],
  templateUrl: './phantasia2.html',
  styleUrls: ['./phantasia2.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None, // Disable view encapsulation to override global styles
  animations: [
    // Scroll indicator animation with smooth fade and bounce effects
    trigger('scrollIndicator', [
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0) translateZ(0)'
      })),
      
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(20px) translateZ(0)'
      })),
      
      transition('hidden => visible', [
        animate('600ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ]),
      
      transition('visible => hidden', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ])
    ])
  ]
})
export class Phantasia2Component implements OnInit, OnDestroy {
  @ViewChild('backgroundVideo', { static: false }) backgroundVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('titleVideo', { static: false }) titleVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('cdShowcase', { static: false }) cdShowcase!: ElementRef<HTMLElement>;

  // Loading state management
  isLoading = true;
  loadingProgress = 0;

  // Video loading and fade control
  private videoLoaded = false;
  private videoElement: HTMLVideoElement | null = null;
  private userHasInteracted = false;
  private autoplayFailed = false;
  
  // Title video control
  private titleVideoElement: HTMLVideoElement | null = null;
  private titleAutoplayFailed = false;
  
  // Scroll indicator state management
  scrollIndicatorState: ScrollIndicatorState = 'hidden';
  showScrollIndicator = signal(true);
  
  // Scroll management and section snapping
  private scrollTimeoutId: number | null = null;
  private isScrollSnapping = false;
  private lastScrollTime = 0;
  private scrollSections: HTMLElement[] = [];

  // Debug flag and comprehensive logging system
  private readonly isDebugMode = false;
  private debugSystem: Phantasia2Debug | null = null;

  // Current year for footer
  readonly currentYear = new Date().getFullYear();

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly dynamicArtistService: DynamicArtistService,
    private readonly audioService: AudioService
  ) {}

  ngOnInit(): void {
    if (this.isDebugMode) {
      console.log(`[Phantasia2Component] Current URL: ${this.router.url}`);
    }

    // Add phantasia-album-page class to html and body for album presentation styling
    this.document.documentElement.classList.add('phantasia-album-page');
    this.document.body.classList.add('phantasia-album-page');
    
    // CRITICAL FIX: Runtime horizontal scrollbar elimination
    this.forceHorizontalScrollbarRemoval();

    if (this.isDebugMode) {
      console.log(`[Phantasia2Component] Added phantasia-album-page class to body`);
    }

    // Set up user interaction detection
    this.setupUserInteractionDetection();

    // Start loading sequence
    this.startLoadingSequence();

    // Show scroll indicator after loading
    setTimeout(() => {
      this.scrollIndicatorState = 'visible';
      this.cdr.markForCheck();
    }, 2000);

    // Set up smooth scroll behavior
    this.setupSmoothScrolling();

    // Set up section snapping after a delay to ensure DOM is ready
    setTimeout(() => {
      this.setupSectionSnapping();
    }, 1000);

    // Initialize dynamic artist system
    this.initializeDynamicArtistSystem();
    
    // Start enhanced debug monitoring with DOM ready detection
    if (this.isDebugMode) {
      this.debugSystem = new Phantasia2Debug(this.document);
      // Start async monitoring that waits for DOM to be fully ready
      this.debugSystem.startDebugMonitoring().then(() => {
        console.log('[PHANTASIA2] Enhanced debug monitoring fully initialized');
      }).catch(error => {
        console.error('[PHANTASIA2] Debug monitoring initialization failed:', error);
      });
    }
  }

  /**
   * Determines if this component is inside the PhantasiaLayout
   */
  get isInsidePhantasiaLayout(): boolean {
    // The URL will be /phantasia/phantasia2 when inside the layout
    return this.router.url.includes('/phantasia/');
  }

  /**
   * Handle video loaded event for seamless background playback
   */
  onVideoLoaded(): void {
    if (this.backgroundVideo?.nativeElement) {
      this.videoElement = this.backgroundVideo.nativeElement;
      this.videoLoaded = true;
      
      // Ensure video is muted for autoplay compliance
      this.videoElement.muted = true;
      
      // Start video with fade-in effect
      this.videoElement.style.opacity = '0';
      this.attemptVideoPlay();

      // Set up seamless looping with fade transition
      this.setupVideoLoop();
    }
  }

  /**
   * Setup seamless video looping with fade transitions
   */
  private setupVideoLoop(): void {
    if (!this.videoElement) return;

    this.videoElement.addEventListener('timeupdate', () => {
      if (!this.videoElement) return;
      
      // Start fade out 1 second before video ends
      const timeRemaining = this.videoElement.duration - this.videoElement.currentTime;
      if (timeRemaining <= 1 && timeRemaining > 0.5) {
        this.videoElement.style.transition = 'opacity 1s ease-out';
        this.videoElement.style.opacity = '0.3';
      }
    });

    this.videoElement.addEventListener('ended', () => {
      if (!this.videoElement) return;
      
      // Reset and restart with fade in
      this.videoElement.currentTime = 0;
      this.videoElement.style.opacity = '0';
      
      // Only attempt to play if user has interacted or autoplay worked initially
      if (!this.autoplayFailed || this.userHasInteracted) {
        this.videoElement.play().then(() => {
          if (this.videoElement) {
            this.videoElement.style.transition = 'opacity 1.5s ease-in';
            this.videoElement.style.opacity = '1';
          }
        }).catch(error => {
          if (this.isDebugMode) {
            console.warn('[Phantasia2Component] Video replay failed:', error);
          }
        });
      }
    });
  }

  /**
   * Attempt to play video with proper error handling
   */
  private attemptVideoPlay(): void {
    if (!this.videoElement) return;

    const playPromise = this.videoElement.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Autoplay succeeded
        this.autoplayFailed = false;
        if (this.isDebugMode) {
          console.log('[Phantasia2Component] Video autoplay succeeded');
        }
        this.fadeInVideo();
      }).catch(error => {
        // Autoplay failed - this is expected in many browsers
        this.autoplayFailed = true;
        if (this.isDebugMode) {
          console.log('[Phantasia2Component] Video autoplay failed (expected):', error.name);
          console.log('[Phantasia2Component] Video will start after user interaction');
        }
        // Still show the video element but don't fade it in until user interacts
        this.showVideoWithoutPlay();
      });
    }
  }

  /**
   * Fade in video after successful play
   */
  private fadeInVideo(): void {
    if (!this.videoElement) return;
    
    setTimeout(() => {
      if (this.videoElement) {
        this.videoElement.style.transition = 'opacity 2s ease-in-out';
        this.videoElement.style.opacity = '1';
      }
    }, 100);
  }

  /**
   * Show video element without playing (fallback for autoplay failure)
   */
  private showVideoWithoutPlay(): void {
    if (!this.videoElement) return;
    
    // Show the first frame of the video
    this.videoElement.currentTime = 0;
    setTimeout(() => {
      if (this.videoElement) {
        this.videoElement.style.transition = 'opacity 1s ease-in-out';
        this.videoElement.style.opacity = '0.8'; // Slightly dimmed to indicate it's not playing
      }
    }, 100);
  }

  /**
   * Set up user interaction detection to enable video playback
   */
  private setupUserInteractionDetection(): void {
    const handleFirstInteraction = () => {
      if (!this.userHasInteracted) {
        this.userHasInteracted = true;
        if (this.isDebugMode) {
          console.log('[Phantasia2Component] User interaction detected');
        }
        
        // If autoplay failed, try to start videos now
        if (this.autoplayFailed && this.videoElement) {
          this.attemptVideoPlayAfterInteraction();
        }
        
        // If title video autoplay failed, try to start it now
        if (this.titleAutoplayFailed && this.titleVideoElement) {
          this.attemptTitleVideoPlayAfterInteraction();
        }
        
        // Remove event listeners after first interaction
        this.document.removeEventListener('click', handleFirstInteraction);
        this.document.removeEventListener('touchstart', handleFirstInteraction);
        this.document.removeEventListener('keydown', handleFirstInteraction);
      }
    };

    // Listen for user interactions
    this.document.addEventListener('click', handleFirstInteraction, { passive: true });
    this.document.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    this.document.addEventListener('keydown', handleFirstInteraction, { passive: true });
  }

  /**
   * Attempt to play video after user interaction
   */
  private attemptVideoPlayAfterInteraction(): void {
    if (!this.videoElement) return;

    this.videoElement.play().then(() => {
      if (this.isDebugMode) {
        console.log('[Phantasia2Component] Video started after user interaction');
      }
      this.fadeInVideo();
    }).catch(error => {
      if (this.isDebugMode) {
        console.warn('[Phantasia2Component] Video play failed even after user interaction:', error);
      }
    });
  }

  /**
   * Start the loading sequence with progress simulation
   */
  private startLoadingSequence(): void {
    this.isLoading = true;
    this.loadingProgress = 0;
    
    const progressInterval = setInterval(() => {
      this.loadingProgress += Math.random() * 15;
      
      if (this.loadingProgress >= 100) {
        this.loadingProgress = 100;
        clearInterval(progressInterval);
        
        // Add a small delay before hiding loading screen
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
          
          if (this.isDebugMode) {
            console.log('[Phantasia2Component] Loading complete, showing main content');
          }
        }, 500);
      }
      
      this.cdr.markForCheck();
    }, 200);
    
    if (this.isDebugMode) {
      console.log('[Phantasia2Component] Loading sequence started');
    }
  }

  /**
   * Handle title video loaded metadata
   */
  onTitleVideoLoaded(): void {
    if (this.titleVideo?.nativeElement) {
      this.titleVideoElement = this.titleVideo.nativeElement;
      this.titleVideoElement.muted = true;
      if (this.isDebugMode) {
        console.log('[Phantasia2Component] Title video loaded');
      }
    }
  }

  /**
   * Handle title video can play event
   */
  onTitleVideoCanPlay(): void {
    if (this.titleVideoElement) {
      this.attemptTitleVideoPlay();
    }
  }

  /**
   * Attempt to play title video with error handling
   */
  private attemptTitleVideoPlay(): void {
    if (!this.titleVideoElement) return;

    const playPromise = this.titleVideoElement.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.titleAutoplayFailed = false;
        if (this.isDebugMode) {
          console.log('[Phantasia2Component] Title video autoplay succeeded');
        }
      }).catch(error => {
        this.titleAutoplayFailed = true;
        if (this.isDebugMode) {
          console.log('[Phantasia2Component] Title video autoplay failed (expected):', error.name);
        }
      });
    }
  }

  /**
   * Attempt to play title video after user interaction
   */
  private attemptTitleVideoPlayAfterInteraction(): void {
    if (!this.titleVideoElement) return;

    this.titleVideoElement.play().then(() => {
      if (this.isDebugMode) {
        console.log('[Phantasia2Component] Title video started after user interaction');
      }
    }).catch(error => {
      if (this.isDebugMode) {
        console.warn('[Phantasia2Component] Title video play failed even after user interaction:', error);
      }
    });
  }

  /**
   * Handle title video ended event - keep video visible, no compacting
   */
  onTitleVideoEnded(): void {
    if (this.isDebugMode) {
      console.log('[Phantasia2Component] Title video playback completed - keeping video visible');
    }
    
    // Video stays visible, no compacting animation needed
    // All content is already visible and accessible
  }
  
  /**
   * Set up smooth scrolling behavior for the page
   */
  private setupSmoothScrolling(): void {
    // Enable smooth scrolling on the main phantasia album page container
    if (typeof document !== 'undefined') {
      const albumPage = document.querySelector('.phantasia-album-page') as HTMLElement;
      if (albumPage) {
        albumPage.style.scrollBehavior = 'smooth';
        if (this.isDebugMode) {
          console.log('[Phantasia2Component] Smooth scrolling enabled on main container');
        }
      }
    }
  }
  
  /**
   * Set up section snapping functionality
   */
  private setupSectionSnapping(): void {
    if (typeof document === 'undefined') return;
    
    // Define scroll sections in order
    const videoSection = document.querySelector('.video-title-section') as HTMLElement;
    const cdSection = this.cdShowcase?.nativeElement;
    const artistSection = document.querySelector('.artist-section') as HTMLElement;
    
    this.scrollSections = [videoSection, cdSection, artistSection].filter(section => section !== null && section !== undefined);
    
    if (this.scrollSections.length === 0) {
      if (this.isDebugMode) {
        console.warn('[Phantasia2Component] No scroll sections found for snapping');
      }
      return;
    }
    
    if (this.isDebugMode) {
      console.log('[Phantasia2Component] Section snapping set up with', this.scrollSections.length, 'sections');
    }
    
    // Add scroll event listener to the album page container
    const albumPage = document.querySelector('.phantasia-album-page') as HTMLElement;
    if (albumPage) {
      albumPage.addEventListener('scroll', this.handleSectionSnap.bind(this), { passive: false });
      
      // Also listen for wheel events for more responsive snapping
      albumPage.addEventListener('wheel', this.handleWheelSnap.bind(this), { passive: false });
      
      if (this.isDebugMode) {
        console.log('[Phantasia2Component] Scroll event listeners added for section snapping');
      }
    } else {
      // Fallback to window scroll events
      window.addEventListener('scroll', this.handleSectionSnap.bind(this), { passive: false });
      window.addEventListener('wheel', this.handleWheelSnap.bind(this), { passive: false });
      
      if (this.isDebugMode) {
        console.log('[Phantasia2Component] Window scroll event listeners added for section snapping (fallback)');
      }
    }
  }
  
  /**
   * Handle section snapping on scroll
   */
  private handleSectionSnap(): void {
    if (this.isScrollSnapping) return;
    
    // Clear existing timeout
    if (this.scrollTimeoutId) {
      clearTimeout(this.scrollTimeoutId);
    }
    
    // Debounce scroll snapping
    this.scrollTimeoutId = window.setTimeout(() => {
      this.performSectionSnap();
    }, 150); // 150ms debounce
  }
  
  /**
   * Handle wheel events for immediate snapping
   */
  private handleWheelSnap(event: WheelEvent): void {
    // Only snap on significant wheel events
    if (Math.abs(event.deltaY) < 10) return;
    
    const now = Date.now();
    
    // Throttle wheel snapping
    if (now - this.lastScrollTime < 500) return;
    
    this.lastScrollTime = now;
    
    // Determine scroll direction
    const scrollingDown = event.deltaY > 0;
    const currentSection = this.getCurrentSection();
    const currentIndex = this.scrollSections.indexOf(currentSection);
    
    if (currentIndex === -1) return;
    
    // Calculate target section
    let targetIndex = currentIndex;
    if (scrollingDown && currentIndex < this.scrollSections.length - 1) {
      targetIndex = currentIndex + 1;
    } else if (!scrollingDown && currentIndex > 0) {
      targetIndex = currentIndex - 1;
    }
    
    // Perform snapping if target changed
    if (targetIndex !== currentIndex) {
      event.preventDefault();
      this.snapToSection(this.scrollSections[targetIndex]);
      
      if (this.isDebugMode) {
        console.log('[Phantasia2Component] Wheel snap to section', targetIndex);
      }
    }
  }
  
  /**
   * Perform section snapping to the nearest section
   */
  private performSectionSnap(): void {
    if (this.isScrollSnapping || this.scrollSections.length === 0) return;
    
    const nearestSection = this.getNearestSection();
    if (nearestSection) {
      this.snapToSection(nearestSection);
    }
  }
  
  /**
   * Get the current section based on scroll position
   */
  private getCurrentSection(): HTMLElement {
    const albumPage = document.querySelector('.phantasia-album-page') as HTMLElement;
    const scrollTop = albumPage ? albumPage.scrollTop : window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const threshold = viewportHeight * 0.3; // 30% threshold
    
    for (const section of this.scrollSections) {
      const sectionRect = section.getBoundingClientRect();
      const sectionTop = albumPage ? sectionRect.top + scrollTop : section.offsetTop;
      
      if (scrollTop >= sectionTop - threshold && scrollTop < sectionTop + section.offsetHeight - threshold) {
        return section;
      }
    }
    
    return this.scrollSections[0]; // Default to first section
  }
  
  /**
   * Get the nearest section to snap to
   */
  private getNearestSection(): HTMLElement | null {
    if (this.scrollSections.length === 0) return null;
    
    const albumPage = document.querySelector('.phantasia-album-page') as HTMLElement;
    const scrollTop = albumPage ? albumPage.scrollTop : window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const snapPoint = scrollTop + viewportHeight * 0.5; // Center of viewport
    
    let nearestSection = this.scrollSections[0];
    let minDistance = Infinity;
    
    for (const section of this.scrollSections) {
      const sectionRect = section.getBoundingClientRect();
      const sectionCenter = albumPage 
        ? sectionRect.top + scrollTop + section.offsetHeight * 0.5
        : section.offsetTop + section.offsetHeight * 0.5;
      
      const distance = Math.abs(snapPoint - sectionCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestSection = section;
      }
    }
    
    return nearestSection;
  }
  
  /**
   * Snap to a specific section
   */
  private snapToSection(section: HTMLElement): void {
    if (this.isScrollSnapping) return;
    
    this.isScrollSnapping = true;
    
    const albumPage = document.querySelector('.phantasia-album-page') as HTMLElement;
    const sectionRect = section.getBoundingClientRect();
    
    let targetScrollTop: number;
    
    if (albumPage) {
      // Calculate scroll position within the album page container
      targetScrollTop = sectionRect.top + albumPage.scrollTop - (window.innerHeight * 0.1); // 10% from top
      
      albumPage.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: 'smooth'
      });
    } else {
      // Fallback to window scrolling
      targetScrollTop = section.offsetTop - (window.innerHeight * 0.1);
      
      window.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: 'smooth'
      });
    }
    
    if (this.isDebugMode) {
      console.log('[Phantasia2Component] Snapping to section at position:', targetScrollTop);
    }
    
    // Reset snapping flag after animation completes
    setTimeout(() => {
      this.isScrollSnapping = false;
    }, 1000); // Allow time for smooth scroll to complete
  }
  
  /**
   * Smooth scroll to CD showcase section with improved functionality
   */
  scrollToContent(): void {
    if (this.isDebugMode) {
      console.log('[Phantasia2Component] scrollToContent() triggered');
    }
    
    if (this.cdShowcase?.nativeElement) {
      const element = this.cdShowcase.nativeElement;
      
      // First, try scrolling within the album page container
      const albumPage = document.querySelector('.phantasia-album-page') as HTMLElement;
      if (albumPage) {
        // Calculate the exact scroll position
        const elementRect = element.getBoundingClientRect();
        const containerRect = albumPage.getBoundingClientRect();
        
        // Calculate target scroll position (center the element in viewport)
        const targetScrollTop = elementRect.top - containerRect.top + albumPage.scrollTop - (window.innerHeight * 0.2);
        
        if (this.isDebugMode) {
          console.log('[Phantasia2Component] Container scroll - Target position:', targetScrollTop);
          console.log('[Phantasia2Component] Current scroll position:', albumPage.scrollTop);
        }
        
        // Perform smooth scroll within the container
        albumPage.scrollTo({
          top: Math.max(0, targetScrollTop), // Ensure non-negative scroll
          behavior: 'smooth'
        });
        
      } else {
        if (this.isDebugMode) {
          console.log('[Phantasia2Component] Album page container not found, using window scroll');
        }
        
        // Fallback to window scrolling
        const elementTop = element.offsetTop;
        const targetPosition = elementTop - (window.innerHeight * 0.2); // 20% from top
        
        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: 'smooth'
        });
      }
      
      // Hide scroll indicator after first use
      this.hideScrollIndicatorAfterUse();
      
    } else {
      if (this.isDebugMode) {
        console.warn('[Phantasia2Component] CD showcase element not found for scrolling');
      }
    }
  }
  
  /**
   * Hide scroll indicator after user interaction
   */
  private hideScrollIndicatorAfterUse(): void {
    this.showScrollIndicator.set(false);
    this.scrollIndicatorState = 'hidden';
    this.cdr.markForCheck();

    if (this.isDebugMode) {
      console.log('[Phantasia2Component] Scroll indicator hidden after use');
    }
  }

  /**
   * Initialize the dynamic artist system
   */
  private initializeDynamicArtistSystem(): void {
    if (this.isDebugMode) {
      console.log('[Phantasia2Component] Initializing dynamic artist system');
    }

    // The services will initialize automatically through dependency injection
    // This method is here for future enhancements if needed
  }

  /**
   * CRITICAL FIX: Force removal of horizontal scrollbar at runtime
   * This method applies aggressive CSS overrides to eliminate any horizontal scrolling
   */
  private forceHorizontalScrollbarRemoval(): void {
    try {
      // Apply styles to HTML element
      const htmlElement = this.document.documentElement;
      if (htmlElement) {
        htmlElement.style.setProperty('overflow-x', 'hidden', 'important');
        htmlElement.style.setProperty('max-width', '100vw', 'important');
        htmlElement.style.setProperty('box-sizing', 'border-box', 'important');
      }

      // Apply styles to BODY element
      const bodyElement = this.document.body;
      if (bodyElement) {
        bodyElement.style.setProperty('overflow-x', 'hidden', 'important');
        bodyElement.style.setProperty('max-width', '100vw', 'important');
        bodyElement.style.setProperty('box-sizing', 'border-box', 'important');
      }

      // Removed problematic DOM injection of overflow styles

      // Removed problematic runtime horizontal scroll prevention code

    } catch (error) {
      if (this.isDebugMode) {
        console.warn('[Phantasia2Component] Error applying horizontal scrollbar fix:', error);
      }
    }
  }

  ngOnDestroy(): void {
    // Save final debug log and cleanup debug system
    if (this.debugSystem) {
      this.debugSystem.saveDebugLogToFile();
      this.debugSystem.cleanup();
      this.debugSystem = null;
    }
    
    // Remove phantasia-album-page class from html and body
    this.document.documentElement.classList.remove('phantasia-album-page');
    this.document.body.classList.remove('phantasia-album-page');
    
    // Removed cleanup for problematic DOM injection code
    
    // Clean up video elements
    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.removeEventListener('timeupdate', () => {});
      this.videoElement.removeEventListener('ended', () => {});
      this.videoElement = null;
    }
    
    // Clean up title video element
    if (this.titleVideoElement) {
      this.titleVideoElement.pause();
      this.titleVideoElement = null;
    }
    
    // Clean up scroll timeouts
    if (this.scrollTimeoutId) {
      clearTimeout(this.scrollTimeoutId);
      this.scrollTimeoutId = null;
    }
    
    // Clean up section snapping event listeners
    const albumPage = document.querySelector('.phantasia-album-page') as HTMLElement;
    if (albumPage) {
      albumPage.removeEventListener('scroll', this.handleSectionSnap.bind(this));
      albumPage.removeEventListener('wheel', this.handleWheelSnap.bind(this));
    } else {
      // Clean up window event listeners if used as fallback
      window.removeEventListener('scroll', this.handleSectionSnap.bind(this));
      window.removeEventListener('wheel', this.handleWheelSnap.bind(this));
    }

    // Clean up user interaction listeners (in case they weren't removed yet)
    const handleFirstInteraction = () => {}; // Dummy function for cleanup
    this.document.removeEventListener('click', handleFirstInteraction);
    this.document.removeEventListener('touchstart', handleFirstInteraction);
    this.document.removeEventListener('keydown', handleFirstInteraction);
    
    // Reset section snapping variables
    this.scrollSections = [];
    this.isScrollSnapping = false;
    this.lastScrollTime = 0;
    
    if (this.isDebugMode) {
      console.log(`[Phantasia2Component] Component destroyed, cleanup completed`);
    }
  }
}
