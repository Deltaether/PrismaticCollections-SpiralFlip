import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MusicPlayerComponent } from '../../tools/music-player/music-player.component';
import { SiteHeaderComponent } from '../../../../../shared/components/site-header/site-header.component';
import { LoadingScreenComponent } from '../../../../../components/loading-screen/loading-screen.component';

/**
 * Phantasia component that shows the professional album presentation
 * This is the entry point for Project Phantasia I album showcase
 * Features video background, music player integration, and professional white-to-black theme
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
    LoadingScreenComponent
  ],
  templateUrl: './phantasia.component.html',
  styleUrls: ['./phantasia.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhantasiaComponent implements OnInit, OnDestroy {
  @ViewChild('baseVideo', { static: false }) baseVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('backgroundVideo', { static: false }) backgroundVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('titleVideo', { static: false }) titleVideo!: ElementRef<HTMLVideoElement>;

  // Loading state management
  isLoading = true;
  loadingProgress = 0;

  // Video loading and fade control
  private videoLoaded = false;
  private baseVideoElement: HTMLVideoElement | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private titleVideoElement: HTMLVideoElement | null = null;
  private userHasInteracted = false;
  private autoplayFailed = false;
  private titleAutoplayFailed = false;

  // Debug flag
  private readonly isDebugMode = true;

  // Current year for footer
  readonly currentYear = new Date().getFullYear();

  // Album features for the professional presentation
  albumFeatures = [
    {
      title: 'Professional Production',
      description: 'Carefully crafted with studio-quality precision and clarity',
      icon: 'headphones',
      gradient: 'linear-gradient(135deg, #343a40, #212529)'
    },
    {
      title: 'Orchestral Excellence',
      description: 'Rich symphonic arrangements with pristine audio engineering',
      icon: 'piano',
      gradient: 'linear-gradient(135deg, #495057, #343a40)'
    },
    {
      title: 'Artist Collaboration',
      description: 'An × Feryquitous bring their unique vision to life',
      icon: 'group',
      gradient: 'linear-gradient(135deg, #6c757d, #495057)'
    },
    {
      title: 'Meticulous Detail',
      description: 'Every element crafted with professional attention to detail',
      icon: 'precision_manufacturing',
      gradient: 'linear-gradient(135deg, #212529, #000000)'
    }
  ];

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  ngOnInit(): void {
    if (this.isDebugMode) {
      console.log(`[PhantasiaComponent] Current URL: ${this.router.url}`);
    }

    // Add phantasia-album-page class to body for album presentation styling
    this.document.body.classList.add('phantasia-album-page');
    
    if (this.isDebugMode) {
      console.log(`[PhantasiaComponent] Added phantasia-album-page class to body`);
    }

    // Set up user interaction detection
    this.setupUserInteractionDetection();

    // Start loading sequence
    this.startLoadingSequence();
  }

  /**
   * Determines if this component is inside the PhantasiaLayout
   */
  get isInsidePhantasiaLayout(): boolean {
    // The URL will be /phantasia/phantasia when inside the layout
    // It will be /collections/phantasia when using the direct route
    return this.router.url.includes('/phantasia/');
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
   * Handle base video loaded event for seamless background playback
   */
  onBaseVideoLoaded(): void {
    if (this.baseVideo?.nativeElement) {
      this.baseVideoElement = this.baseVideo.nativeElement;
      
      // Ensure video is muted for autoplay compliance
      this.baseVideoElement.muted = true;
      
      // Start video with fade-in effect
      this.baseVideoElement.style.opacity = '0';
      this.attemptBaseVideoPlay();

      // Set up seamless looping with fade transitions
      this.setupBaseVideoLoop();
    }
  }

  /**
   * Handle filter video loaded event for seamless background playback
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
   * Setup seamless base video looping with enhanced reliability
   */
  private setupBaseVideoLoop(): void {
    if (!this.baseVideoElement) return;

    // Set video properties for reliable looping
    this.baseVideoElement.loop = true;
    this.baseVideoElement.muted = true;
    this.baseVideoElement.playsInline = true;

    // Add event listeners for seamless looping
    this.baseVideoElement.addEventListener('loadstart', () => {
      if (this.isDebugMode) {
        console.log('[PhantasiaComponent] Base video loading started');
      }
    });

    this.baseVideoElement.addEventListener('canplaythrough', () => {
      if (this.isDebugMode) {
        console.log('[PhantasiaComponent] Base video can play through');
      }
    });

    // Handle video seeking for seamless loop
    this.baseVideoElement.addEventListener('timeupdate', () => {
      if (!this.baseVideoElement) return;
      
      // Ensure video doesn't get stuck at the end
      if (this.baseVideoElement.currentTime >= this.baseVideoElement.duration - 0.1) {
        this.baseVideoElement.currentTime = 0;
      }
    });

    // Backup loop handling
    this.baseVideoElement.addEventListener('ended', () => {
      if (!this.baseVideoElement) return;
      
      if (this.isDebugMode) {
        console.log('[PhantasiaComponent] Base video ended, restarting loop');
      }
      
      // Immediate restart for seamless loop
      this.baseVideoElement.currentTime = 0;
      
      // Only attempt to play if user has interacted or autoplay worked initially
      if (!this.autoplayFailed || this.userHasInteracted) {
        this.baseVideoElement.play().catch(error => {
          if (this.isDebugMode) {
            console.warn('[PhantasiaComponent] Base video replay failed:', error);
          }
        });
      }
    });

    // Handle video errors
    this.baseVideoElement.addEventListener('error', (e) => {
      if (this.isDebugMode) {
        console.error('[PhantasiaComponent] Base video error:', e);
      }
    });
  }

  /**
   * Setup seamless filter video looping with enhanced reliability
   */
  private setupVideoLoop(): void {
    if (!this.videoElement) return;

    // Set video properties for reliable looping
    this.videoElement.loop = true;
    this.videoElement.muted = true;
    this.videoElement.playsInline = true;

    // Add event listeners for seamless looping
    this.videoElement.addEventListener('loadstart', () => {
      if (this.isDebugMode) {
        console.log('[PhantasiaComponent] Video loading started');
      }
    });

    this.videoElement.addEventListener('canplaythrough', () => {
      if (this.isDebugMode) {
        console.log('[PhantasiaComponent] Video can play through');
      }
    });

    // Handle video seeking for seamless loop
    this.videoElement.addEventListener('timeupdate', () => {
      if (!this.videoElement) return;
      
      // Ensure video doesn't get stuck at the end
      if (this.videoElement.currentTime >= this.videoElement.duration - 0.1) {
        this.videoElement.currentTime = 0;
      }
      
      // Ensure filter video opacity stays at 0.2 throughout playback
      if (this.videoElement.style.opacity !== '0.2' && this.videoElement.style.opacity !== '0' && this.videoElement.style.opacity !== '0.16') {
        this.videoElement.style.opacity = '0.2';
      }
    });

    // Backup loop handling
    this.videoElement.addEventListener('ended', () => {
      if (!this.videoElement) return;
      
      if (this.isDebugMode) {
        console.log('[PhantasiaComponent] Filter video ended, restarting loop');
      }
      
      // Immediate restart for seamless loop
      this.videoElement.currentTime = 0;
      
      // Ensure filter video maintains 20% opacity after restart
      this.videoElement.style.opacity = '0.2';
      
      // Only attempt to play if user has interacted or autoplay worked initially
      if (!this.autoplayFailed || this.userHasInteracted) {
        this.videoElement.play().catch(error => {
          if (this.isDebugMode) {
            console.warn('[PhantasiaComponent] Filter video replay failed:', error);
          }
        });
      }
    });

    // Handle video errors
    this.videoElement.addEventListener('error', (e) => {
      if (this.isDebugMode) {
        console.error('[PhantasiaComponent] Video error:', e);
      }
    });

    // Handle video stalling
    this.videoElement.addEventListener('stalled', () => {
      if (this.isDebugMode) {
        console.warn('[PhantasiaComponent] Video stalled');
      }
    });

    // Handle video waiting
    this.videoElement.addEventListener('waiting', () => {
      if (this.isDebugMode) {
        console.log('[PhantasiaComponent] Video waiting for data');
      }
    });
  }

  /**
   * Attempt to play base video with proper error handling
   */
  private attemptBaseVideoPlay(): void {
    if (!this.baseVideoElement) return;

    const playPromise = this.baseVideoElement.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Autoplay succeeded
        if (this.isDebugMode) {
          console.log('[PhantasiaComponent] Base video autoplay succeeded');
        }
        this.fadeInBaseVideo();
      }).catch(error => {
        // Autoplay failed - this is expected in many browsers
        if (this.isDebugMode) {
          console.log('[PhantasiaComponent] Base video autoplay failed (expected):', error.name);
          console.log('[PhantasiaComponent] Base video will start after user interaction');
        }
        // Still show the video element but don't fade it in until user interacts
        this.showBaseVideoWithoutPlay();
      });
    }
  }

  /**
   * Attempt to play filter video with proper error handling
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
   * Fade in base video after successful play
   */
  private fadeInBaseVideo(): void {
    if (!this.baseVideoElement) return;
    
    setTimeout(() => {
      if (this.baseVideoElement) {
        this.baseVideoElement.style.transition = 'opacity 2s ease-in-out';
        this.baseVideoElement.style.opacity = '1';
      }
    }, 100);
  }

  /**
   * Show base video element without playing (fallback for autoplay failure)
   */
  private showBaseVideoWithoutPlay(): void {
    if (!this.baseVideoElement) return;
    
    // Show the first frame of the video
    this.baseVideoElement.currentTime = 0;
    setTimeout(() => {
      if (this.baseVideoElement) {
        this.baseVideoElement.style.transition = 'opacity 1s ease-in-out';
        this.baseVideoElement.style.opacity = '0.8'; // Slightly dimmed to indicate it's not playing
      }
    }, 100);
  }

  /**
   * Fade in filter video after successful play (maintain 20% opacity for filter effect)
   */
  private fadeInVideo(): void {
    if (!this.videoElement) return;
    
    setTimeout(() => {
      if (this.videoElement) {
        this.videoElement.style.transition = 'opacity 2s ease-in-out';
        this.videoElement.style.opacity = '0.2'; // Keep at 20% opacity for filter effect
      }
    }, 100);
  }

  /**
   * Show filter video element without playing (fallback for autoplay failure)
   */
  private showVideoWithoutPlay(): void {
    if (!this.videoElement) return;
    
    // Show the first frame of the video
    this.videoElement.currentTime = 0;
    setTimeout(() => {
      if (this.videoElement) {
        this.videoElement.style.transition = 'opacity 1s ease-in-out';
        this.videoElement.style.opacity = '0.16'; // 20% of 0.8 = 0.16 for filter effect when not playing
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
        if (this.autoplayFailed && this.baseVideoElement) {
          this.attemptBaseVideoPlayAfterInteraction();
        }
        if (this.autoplayFailed && this.videoElement) {
          this.attemptVideoPlayAfterInteraction();
        }
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
   * Attempt to play base video after user interaction
   */
  private attemptBaseVideoPlayAfterInteraction(): void {
    if (!this.baseVideoElement) return;

    this.baseVideoElement.play().then(() => {
      if (this.isDebugMode) {
        console.log('[PhantasiaComponent] Base video started after user interaction');
      }
      this.fadeInBaseVideo();
    }).catch(error => {
      if (this.isDebugMode) {
        console.warn('[PhantasiaComponent] Base video play failed even after user interaction:', error);
      }
    });
  }

  /**
   * Attempt to play filter video after user interaction
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

  ngOnDestroy(): void {
    // Remove phantasia-album-page class from body
    this.document.body.classList.remove('phantasia-album-page');
    
    // Clean up video elements
    if (this.baseVideoElement) {
      this.baseVideoElement.pause();
      this.baseVideoElement.removeEventListener('timeupdate', () => {});
      this.baseVideoElement.removeEventListener('ended', () => {});
      this.baseVideoElement = null;
    }
    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.removeEventListener('timeupdate', () => {});
      this.videoElement.removeEventListener('ended', () => {});
      this.videoElement = null;
    }
    if (this.titleVideoElement) {
      this.titleVideoElement.pause();
      this.titleVideoElement = null;
    }

    // Clean up user interaction listeners (in case they weren't removed yet)
    const handleFirstInteraction = () => {}; // Dummy function for cleanup
    this.document.removeEventListener('click', handleFirstInteraction);
    this.document.removeEventListener('touchstart', handleFirstInteraction);
    this.document.removeEventListener('keydown', handleFirstInteraction);
    
    if (this.isDebugMode) {
      console.log(`[PhantasiaComponent] Component destroyed, cleanup completed`);
    }
  }
}
