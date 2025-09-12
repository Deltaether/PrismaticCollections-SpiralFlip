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
    LoadingScreenComponent
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
  
  // Scroll management
  private scrollTimeoutId: number | null = null;

  // Debug flag
  private readonly isDebugMode = true;

  // Current year for footer
  readonly currentYear = new Date().getFullYear();

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  ngOnInit(): void {
    if (this.isDebugMode) {
      console.log(`[Phantasia2Component] Current URL: ${this.router.url}`);
    }

    // Add phantasia-album-page class to body for album presentation styling
    this.document.body.classList.add('phantasia-album-page');
    
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
   * Smooth scroll to CD showcase section
   */
  scrollToContent(): void {
    if (this.cdShowcase?.nativeElement) {
      const element = this.cdShowcase.nativeElement;
      
      // Use smooth scrolling on the main phantasia album page container
      const albumPage = document.querySelector('.phantasia-album-page') as HTMLElement;
      if (albumPage) {
        // Get element position relative to the album page container
        const containerRect = albumPage.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const scrollTop = elementRect.top - containerRect.top + albumPage.scrollTop - 100; // Account for header offset
        
        albumPage.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
        
        if (this.isDebugMode) {
          console.log('[Phantasia2Component] Smooth scrolling to CD showcase section at position:', scrollTop);
        }
      } else {
        // Fallback to window scrolling if container not found
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        if (this.isDebugMode) {
          console.log('[Phantasia2Component] Using fallback window scrolling');
        }
      }
      
      // Hide scroll indicator after first use
      this.hideScrollIndicatorAfterUse();
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

  ngOnDestroy(): void {
    // Remove phantasia-album-page class from body
    this.document.body.classList.remove('phantasia-album-page');
    
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

    // Clean up user interaction listeners (in case they weren't removed yet)
    const handleFirstInteraction = () => {}; // Dummy function for cleanup
    this.document.removeEventListener('click', handleFirstInteraction);
    this.document.removeEventListener('touchstart', handleFirstInteraction);
    this.document.removeEventListener('keydown', handleFirstInteraction);
    
    if (this.isDebugMode) {
      console.log(`[Phantasia2Component] Component destroyed, cleanup completed`);
    }
  }
}
