import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Inject, ViewChild, ElementRef, signal, HostBinding } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MusicPlayerComponent } from '../../tools/music-player/music-player.component';
import { SiteHeaderComponent } from '../../../../../shared/components/site-header/site-header.component';
import { LoadingScreenComponent } from '../../../../../components/loading-screen/loading-screen.component';
import { DynamicArtistCardsComponent } from '../../../../../components/dynamic-artist-cards/dynamic-artist-cards.component';
import { SpecialMentionsComponent } from '../../../../../components/special-mentions/special-mentions.component';
import { PhantasiaFooterComponent, PhantasiaFooterConfig } from '../../../../../shared/components/phantasia-footer/phantasia-footer.component';
import { AudioService, AudioState } from '../../../../../pages/collections/phantasia/services/audio.service';
import { DynamicArtistService } from '../../services/dynamic-artist.service';
import { ArtistCreditService, ProjectMetadata } from '../../../../../services/artist-credit.service';

/**
 * Scroll indicator animation states
 */
export type ScrollIndicatorState = 'visible' | 'hidden';

/**
 * Phantasia Project 1 component - The Original Fantasy Compilation
 * Features the same professional presentation as Phantasia2 but with original Phantasia1 data
 * Includes video background, music player integration, two-state scroll system, and 15+ artists
 */
@Component({
  selector: 'app-phantasia',
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
    DynamicArtistCardsComponent,
    SpecialMentionsComponent,
    PhantasiaFooterComponent
  ],
  templateUrl: './phantasia.component.html',
  styleUrls: ['./phantasia.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    // Scroll indicator animation - only animate opacity to preserve CSS centering
    trigger('scrollIndicator', [
      state('visible', style({
        opacity: 1
      })),
      state('hidden', style({
        opacity: 0
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
export class PhantasiaComponent implements OnInit, OnDestroy {
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

  // Two-state scroll system management
  private scrollState: 'top' | 'content' = 'top';
  private isAutoScrolling = false;
  private scrollLocked = false;
  private scrollThreshold = 50; // Pixels from top to trigger auto-scroll
  private contentScrollThreshold = 200; // Pixels from cd-showcase to trigger return to top

  // Scroll event management
  private scrollTimeoutId: number | null = null;
  private wheelTimeoutId: number | null = null;
  private lastScrollY = 0;
  private lastWheelTime = 0;
  private scrollDirection: 'up' | 'down' | null = null;

  // Touch gesture tracking
  private touchStartY = 0;
  private touchEndY = 0;

  // Debug flag
  private readonly isDebugMode = false;

  // Host binding for component-specific styling
  @HostBinding('class.phantasia-component') componentClass = true;
  @HostBinding('class.loading-active') get loadingActive() { return this.isLoading; }
  @HostBinding('class.phantasia-album-page') albumPageClass = true;

  // Current year for footer
  readonly currentYear = new Date().getFullYear();

  // Footer configuration for Phantasia 1
  readonly footerConfig: PhantasiaFooterConfig = {
    logoSrc: 'assets/images/logos/prismcoll_logox.svg',
    logoAlt: 'Prismatic Collections',
    linkGroups: [
      {
        title: 'Explore',
        links: [
          { label: 'Collections', routerLink: '/collections' },
          { label: 'About', routerLink: '/phantasia/phantasia' }
        ]
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy Policy', href: '#' },
          { label: 'Terms of Use', href: '#' }
        ]
      }
    ],
    copyrightText: 'Prismatic Collections. All rights reserved.'
  };

  // Artist display mode management
  artistDisplayMode = signal<'showcase' | 'currently-playing' | 'all'>('showcase');

  // Project metadata
  projectMetadata: ProjectMetadata | null = null;
  totalTracks = 14;
  albumDuration = '45 Minutes';

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly audioService: AudioService,
    private readonly dynamicArtistService: DynamicArtistService,
    private readonly artistCreditService: ArtistCreditService
  ) {}

  ngOnInit(): void {
    if (this.isDebugMode) {
      console.log(`[PhantasiaComponent] Current URL: ${this.router.url}`);
    }

    // Add phantasia-album-page class to body for global styles
    if (typeof document !== 'undefined') {
      document.body.classList.add('phantasia-album-page');
      if (this.isDebugMode) {
        console.log(`[PhantasiaComponent] Added phantasia-album-page class to body`);
      }
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

    // Initialize two-state scroll system
    this.initializeTwoStateScroll();

    // Ensure we start at the top on page load
    this.resetToTop();

    // Switch to Phantasia1 project
    this.switchToPhantasia1Project();

    // Initialize dynamic artist system
    this.initializeDynamicArtistSystem();

    // Set up artist display mode switching
    this.setupArtistDisplayModeLogic();
  }

  /**
   * Determines if this component is inside the PhantasiaLayout
   */
  get isInsidePhantasiaLayout(): boolean {
    // The URL will be /phantasia/phantasia when inside the layout
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
            console.warn('[PhantasiaComponent] Video replay failed:', error);
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
          console.log('[PhantasiaComponent] Video autoplay succeeded');
        }
        this.fadeInVideo();
      }).catch(error => {
        // Autoplay failed - this is expected in many browsers
        this.autoplayFailed = true;
        if (this.isDebugMode) {
          console.log('[PhantasiaComponent] Video autoplay failed (expected):', error.name);
          console.log('[PhantasiaComponent] Video will start after user interaction');
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
          console.log('[PhantasiaComponent] User interaction detected');
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
        console.log('[PhantasiaComponent] Video started after user interaction');
      }
      this.fadeInVideo();
    }).catch(error => {
      if (this.isDebugMode) {
        console.warn('[PhantasiaComponent] Video play failed even after user interaction:', error);
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
            console.log('[PhantasiaComponent] Loading complete, showing main content');
          }
        }, 500);
      }

      this.cdr.markForCheck();
    }, 200);

    if (this.isDebugMode) {
      console.log('[PhantasiaComponent] Loading sequence started');
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
        console.log('[PhantasiaComponent] Title video loaded');
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
          console.log('[PhantasiaComponent] Title video autoplay succeeded');
        }
      }).catch(error => {
        this.titleAutoplayFailed = true;
        if (this.isDebugMode) {
          console.log('[PhantasiaComponent] Title video autoplay failed (expected):', error.name);
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
        console.log('[PhantasiaComponent] Title video started after user interaction');
      }
    }).catch(error => {
      if (this.isDebugMode) {
        console.warn('[PhantasiaComponent] Title video play failed even after user interaction:', error);
      }
    });
  }

  /**
   * Handle title video ended event - keep video visible, no compacting
   */
  onTitleVideoEnded(): void {
    if (this.isDebugMode) {
      console.log('[PhantasiaComponent] Title video playback completed - keeping video visible');
    }
  }

  /**
   * Set up smooth scrolling behavior for the page
   */
  private setupSmoothScrolling(): void {
    // Enable smooth scrolling on the html element for consistent behavior
    if (typeof document !== 'undefined') {
      document.documentElement.style.scrollBehavior = 'smooth';
      if (this.isDebugMode) {
        console.log('[PhantasiaComponent] Smooth scrolling enabled globally');
      }
    }
  }

  /**
   * Initialize the two-state scroll system
   */
  private initializeTwoStateScroll(): void {
    if (typeof window === 'undefined') return;

    // Bind event handlers to preserve context
    this.handleScroll = this.handleScroll.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.handleKeyboard = this.handleKeyboard.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);

    // Add scroll event listeners
    window.addEventListener('scroll', this.handleScroll, { passive: false });
    window.addEventListener('wheel', this.handleWheel, { passive: false });
    window.addEventListener('keydown', this.handleKeyboard, { passive: false });
    window.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    window.addEventListener('touchend', this.handleTouchEnd, { passive: false });

    // Initialize scroll position tracking
    this.lastScrollY = window.scrollY;
    this.updateScrollState();

    if (this.isDebugMode) {
      console.log('[PhantasiaComponent] Two-state scroll system initialized');
      console.log('[PhantasiaComponent] Initial scroll state:', this.scrollState);
    }
  }

  /**
   * Handle scroll events for two-state system
   */
  private handleScroll(event: Event): void {
    if (this.isAutoScrolling || this.scrollLocked) return;

    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - this.lastScrollY;

    // Determine scroll direction
    if (Math.abs(scrollDelta) > 5) {
      this.scrollDirection = scrollDelta > 0 ? 'down' : 'up';
    }

    // Check if we need to trigger auto-scroll
    this.checkScrollTriggers(currentScrollY);

    this.lastScrollY = currentScrollY;
  }

  /**
   * Handle wheel events for immediate response
   */
  private handleWheel(event: WheelEvent): void {
    if (this.isAutoScrolling || this.scrollLocked) {
      event.preventDefault();
      return;
    }

    const now = Date.now();

    // Throttle wheel events
    if (now - this.lastWheelTime < 50) return;
    this.lastWheelTime = now;

    const scrollingDown = event.deltaY > 0;
    const currentScrollY = window.scrollY;

    // If at top and scrolling down, trigger scroll to content
    if (this.scrollState === 'top' && scrollingDown && Math.abs(event.deltaY) > 10) {
      event.preventDefault();
      this.scrollToContent();
      return;
    }

    // If in content area and scrolling up past threshold
    if (this.scrollState === 'content' && !scrollingDown) {
      const cdShowcase = this.cdShowcase?.nativeElement;
      if (cdShowcase) {
        const showcaseRect = cdShowcase.getBoundingClientRect();
        if (showcaseRect.top > this.contentScrollThreshold) {
          event.preventDefault();
          this.scrollToTop();
          return;
        }
      }
    }
  }

  /**
   * Handle keyboard navigation
   */
  private handleKeyboard(event: KeyboardEvent): void {
    if (this.isAutoScrolling || this.scrollLocked) {
      // Block navigation keys during auto-scroll
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) {
        event.preventDefault();
      }
      return;
    }

    const currentScrollY = window.scrollY;

    switch (event.key) {
      case 'ArrowDown':
      case 'PageDown':
      case ' ': // Spacebar
        if (this.scrollState === 'top') {
          event.preventDefault();
          this.scrollToContent();
        }
        break;

      case 'ArrowUp':
      case 'PageUp':
        if (this.scrollState === 'content') {
          const cdShowcase = this.cdShowcase?.nativeElement;
          if (cdShowcase) {
            const showcaseRect = cdShowcase.getBoundingClientRect();
            if (showcaseRect.top > this.contentScrollThreshold) {
              event.preventDefault();
              this.scrollToTop();
            }
          }
        }
        break;

      case 'Home':
        event.preventDefault();
        this.scrollToTop();
        break;

      case 'End':
        if (this.scrollState === 'top') {
          event.preventDefault();
          this.scrollToContent();
        }
        break;
    }
  }

  /**
   * Handle touch start for mobile gestures
   */
  private handleTouchStart(event: TouchEvent): void {
    this.touchStartY = event.touches[0].clientY;
  }

  /**
   * Handle touch end for mobile gestures
   */
  private handleTouchEnd(event: TouchEvent): void {
    if (this.isAutoScrolling || this.scrollLocked) {
      event.preventDefault();
      return;
    }

    this.touchEndY = event.changedTouches[0].clientY;
    const swipeDistance = this.touchStartY - this.touchEndY;
    const swipeThreshold = 50; // Minimum swipe distance

    // Swipe up (scroll down)
    if (swipeDistance > swipeThreshold && this.scrollState === 'top') {
      event.preventDefault();
      this.scrollToContent();
    }

    // Swipe down (scroll up)
    if (swipeDistance < -swipeThreshold && this.scrollState === 'content') {
      const cdShowcase = this.cdShowcase?.nativeElement;
      if (cdShowcase) {
        const showcaseRect = cdShowcase.getBoundingClientRect();
        if (showcaseRect.top > this.contentScrollThreshold) {
          event.preventDefault();
          this.scrollToTop();
        }
      }
    }
  }

  /**
   * Check if auto-scroll should be triggered based on current position
   */
  private checkScrollTriggers(currentScrollY: number): void {
    // Update scroll state
    this.updateScrollState();

    // If user is in the "dead zone" between sections, auto-scroll to nearest
    if (currentScrollY > this.scrollThreshold && this.scrollState === 'top') {
      // User started scrolling from top, go to content
      this.scrollToContent();
    } else if (this.scrollState === 'content') {
      // Check if user is scrolling up from content area
      const cdShowcase = this.cdShowcase?.nativeElement;
      if (cdShowcase && this.scrollDirection === 'up') {
        const showcaseRect = cdShowcase.getBoundingClientRect();
        if (showcaseRect.top > this.contentScrollThreshold) {
          // User is scrolling up and content is moving down, return to top
          this.scrollToTop();
        }
      }
    }
  }

  /**
   * Update the current scroll state based on position
   */
  private updateScrollState(): void {
    const currentScrollY = window.scrollY;
    const cdShowcase = this.cdShowcase?.nativeElement;

    if (currentScrollY <= this.scrollThreshold) {
      this.scrollState = 'top';
    } else if (cdShowcase) {
      const showcaseRect = cdShowcase.getBoundingClientRect();
      // We're in content state if cd-showcase is at or above the threshold
      if (showcaseRect.top <= this.contentScrollThreshold) {
        this.scrollState = 'content';
      }
    }

    if (this.isDebugMode) {
      console.log('[PhantasiaComponent] Scroll state updated:', this.scrollState, 'at position:', currentScrollY);
    }
  }

  /**
   * Auto-scroll to the top of the page
   */
  private scrollToTop(): void {
    if (this.isAutoScrolling) return;

    this.isAutoScrolling = true;
    this.scrollLocked = true;

    // Apply scroll lock to prevent interference
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    if (this.isDebugMode) {
      console.log('[PhantasiaComponent] Auto-scrolling to top');
    }

    // Perform smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Show scroll indicator when back at top
    this.showScrollIndicator.set(true);
    this.scrollIndicatorState = 'visible';
    this.cdr.markForCheck();

    // Unlock after animation completes
    setTimeout(() => {
      this.isAutoScrolling = false;
      this.scrollLocked = false;
      this.scrollState = 'top';
      this.lastScrollY = 0;

      // Remove scroll lock
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';

      if (this.isDebugMode) {
        console.log('[PhantasiaComponent] Arrived at top, scroll unlocked');
      }
    }, 1000);
  }

  /**
   * Reset scroll position to top on initial load
   */
  private resetToTop(): void {
    if (typeof window !== 'undefined') {
      // Immediate jump to top without animation
      window.scrollTo(0, 0);
      this.scrollState = 'top';
      this.lastScrollY = 0;

      if (this.isDebugMode) {
        console.log('[PhantasiaComponent] Reset to top position');
      }
    }
  }

  /**
   * Smooth scroll to CD showcase section with two-state system
   */
  scrollToContent(): void {
    if (this.isAutoScrolling) return;

    this.isAutoScrolling = true;
    this.scrollLocked = true;

    // Apply scroll lock to prevent interference
    const currentScrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${currentScrollY}px`;

    if (this.isDebugMode) {
      console.log('[PhantasiaComponent] Auto-scrolling to content section');
    }

    // First try to find the album presentation section (parent of CD showcase)
    const albumPresentation = document.querySelector('.album-presentation') as HTMLElement;
    const cdShowcase = this.cdShowcase?.nativeElement;

    let targetPosition = 0;

    if (albumPresentation) {
      // Use album presentation's position as it's the proper container
      targetPosition = albumPresentation.offsetTop - 100; // Account for header
      if (this.isDebugMode) {
        console.log('[PhantasiaComponent] Using album presentation position:', albumPresentation.offsetTop);
      }
    } else if (cdShowcase) {
      // Fallback: calculate absolute position of CD showcase
      let element = cdShowcase;
      let offsetTop = 0;
      while (element) {
        offsetTop += element.offsetTop;
        element = element.offsetParent as HTMLElement;
      }
      targetPosition = offsetTop - 100; // Account for header
      if (this.isDebugMode) {
        console.log('[PhantasiaComponent] Using calculated CD showcase absolute position:', offsetTop);
      }
    } else {
      // Final fallback: use viewport height to get past video section
      targetPosition = window.innerHeight - 90;
      if (this.isDebugMode) {
        console.warn('[PhantasiaComponent] Using fallback viewport-based position');
      }
    }

    // Reset body position before scrolling
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, currentScrollY);

    // Perform smooth scroll
    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: 'smooth'
    });

    // Hide scroll indicator after scrolling to content
    this.hideScrollIndicatorAfterUse();

    // Unlock after animation completes
    setTimeout(() => {
      this.isAutoScrolling = false;
      this.scrollLocked = false;
      this.scrollState = 'content';
      this.lastScrollY = window.scrollY;

      // Remove scroll lock
      document.body.style.overflow = '';
      document.body.style.width = '';

      if (this.isDebugMode) {
        console.log('[PhantasiaComponent] Arrived at content, scroll unlocked');
      }
    }, 1200);
  }

  /**
   * Hide scroll indicator after user interaction
   */
  private hideScrollIndicatorAfterUse(): void {
    this.showScrollIndicator.set(false);
    this.scrollIndicatorState = 'hidden';
    this.cdr.markForCheck();

    if (this.isDebugMode) {
      console.log('[PhantasiaComponent] Scroll indicator hidden after use');
    }
  }

  /**
   * Switch to Phantasia1 project data
   */
  private switchToPhantasia1Project(): void {
    // Switch both services to Phantasia1
    this.dynamicArtistService.setCurrentProject('phantasia1');
    this.artistCreditService.setCurrentProject('phantasia1');

    // Load project metadata
    this.projectMetadata = this.artistCreditService.getProjectMetadata('phantasia1');
    if (this.projectMetadata) {
      this.totalTracks = this.projectMetadata.totalTracks;
    }

    if (this.isDebugMode) {
      console.log('[PhantasiaComponent] Switched to Phantasia1 project data');
      console.log('[PhantasiaComponent] Project metadata:', this.projectMetadata);
    }
  }

  /**
   * Initialize the dynamic artist system
   */
  private initializeDynamicArtistSystem(): void {
    if (this.isDebugMode) {
      console.log('[PhantasiaComponent] Initializing dynamic artist system for Phantasia1');
    }

    // The services will initialize automatically through dependency injection
    // This method is here for future enhancements if needed
  }

  /**
   * Set up artist display mode switching logic
   * Default: showcase mode (all 15+ Phantasia1 artists)
   * When music plays: switch to currently-playing mode (track-specific artists)
   */
  private setupArtistDisplayModeLogic(): void {
    // Listen to audio service for play/pause state changes
    this.audioService.audioState$.subscribe((audioState: AudioState) => {
      if (audioState.isPlaying && audioState.currentTrack) {
        // Switch to currently-playing mode when music starts
        this.artistDisplayMode.set('currently-playing');
        if (this.isDebugMode) {
          console.log('[PhantasiaComponent] Switched to currently-playing mode for track:', audioState.currentTrack);
        }
      } else {
        // Switch back to showcase mode when music stops or no track
        this.artistDisplayMode.set('showcase');
        if (this.isDebugMode) {
          console.log('[PhantasiaComponent] Switched to showcase mode (music stopped or no track)');
        }
      }
      this.cdr.markForCheck();
    });

    if (this.isDebugMode) {
      console.log('[PhantasiaComponent] Artist display mode logic initialized - starting in showcase mode');
    }
  }

  /**
   * Open YouTube video in new tab
   */
  openYouTube(url: string): void {
    window.open(url, '_blank');
  }

  ngOnDestroy(): void {
    // Clean up two-state scroll event listeners
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('wheel', this.handleWheel);
      window.removeEventListener('keydown', this.handleKeyboard);
      window.removeEventListener('touchstart', this.handleTouchStart);
      window.removeEventListener('touchend', this.handleTouchEnd);
    }

    // Clear any pending timeouts
    if (this.wheelTimeoutId) {
      clearTimeout(this.wheelTimeoutId);
      this.wheelTimeoutId = null;
    }

    // Remove phantasia-album-page class from body
    if (typeof document !== 'undefined') {
      document.body.classList.remove('phantasia-album-page');
      if (this.isDebugMode) {
        console.log(`[PhantasiaComponent] Removed phantasia-album-page class from body`);
      }
    }

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

    // Clean up user interaction listeners
    const handleFirstInteraction = () => {};
    this.document.removeEventListener('click', handleFirstInteraction);
    this.document.removeEventListener('touchstart', handleFirstInteraction);
    this.document.removeEventListener('keydown', handleFirstInteraction);

    if (this.isDebugMode) {
      console.log(`[PhantasiaComponent] Component destroyed, cleanup completed`);
    }
  }
}