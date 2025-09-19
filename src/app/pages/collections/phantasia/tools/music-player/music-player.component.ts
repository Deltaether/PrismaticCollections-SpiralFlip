import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Howl } from 'howler';
import { AudioService } from './audio.service';
import { DynamicArtistService, TrackWithArtists } from '../../services/dynamic-artist.service';
import { MusicStateManagerService } from '../../../../../services/music-state-manager.service';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// 【✓】 Define interface for track data
interface Track {
  title: string;
  artist: string;
  id?: string;
  url?: string;
}

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // 【✓】 Optimize change detection
})
export class MusicPlayerComponent implements OnInit, OnDestroy {
  // 【✓】 Add proper typing for inputs
  @Input() trackTitle: string = '';
  @Input() trackArtist: string = '';
  @Input() activeTrack: Track | null = null;
  
  private audio: Howl | null = null;
  private readonly destroy$ = new Subject<void>();

  // 【✓】 Enhanced state management with proper locks and error handling
  private readonly trackLoadingMutex = new Subject<void>();
  private isTrackLoading = false;
  private audioInstances: Howl[] = []; // Track all instances for proper cleanup
  private lastLoadedTrackId: string | null = null;

  // 【✓】 Add proper typing for state with separation of concerns
  isPlaying = false;
  isLoading = true;
  currentTrack = '';
  currentTime = 0;
  duration = 0;
  volume = 0.5;

  // 【✓】 Separate mute state management to prevent conflicts
  private _isMuted = false;
  private _savedVolumeBeforeMute = 0.5;
  private _muteStateInitialized = false;

  error = '';
  currentSubtitle: string = '';

  // Enhanced state for multi-project support
  currentTrackInfo: TrackWithArtists | null = null;
  allTracks: TrackWithArtists[] = [];
  currentTrackIndex = 0;

  // Project-aware audio path
  private currentProject: 'phantasia1' | 'phantasia2' = 'phantasia1';

  // 【✓】 Seek state tracking to prevent false completion triggers
  public isUserSeeking = false;
  private lastSeekTime = 0;
  private seekCooldownMs = 1000; // Prevent completion detection for 1000ms after seek

  // 【✓】 Enhanced state persistence with better error recovery
  private hasUserInteracted = false;
  private lastSuccessfulVolume = 0.5;
  private retryCount = 0;
  private maxRetries = 3;

  // 【✓】 Audio context management and event listener tracking
  private audioContext: AudioContext | null = null;
  private eventListeners: Array<{ element: any; event: string; handler: any }> = [];
  private isAudioContextInitialized = false;

  constructor(
    private readonly audioService: AudioService,
    private readonly dynamicArtistService: DynamicArtistService,
    private readonly musicStateManager: MusicStateManagerService,
    private readonly cdr: ChangeDetectorRef
  ) {
    // Enhanced debugging for Track 8 loading issues
    this.diagnoseEnvironment();

    // 【✓】 Initialize audio context management
    this.initializeAudioContext();

    // 【✓】 Setup global event listeners for audio context resume
    this.setupGlobalEventListeners();
  }

  // 【✓】 Comprehensive environment diagnosis for debugging
  private diagnoseEnvironment(): void {
    console.group('[MusicPlayer] Environment Diagnosis');
    console.log('User Agent:', navigator.userAgent);
    console.log('Location:', window.location.href);
    console.log('Base URL:', document.baseURI);
    console.log('Protocol:', window.location.protocol);
    console.log('Host:', window.location.host);
    console.log('Port:', window.location.port);

    // Test Unicode support
    const testUnicode = '8. Evin a\u2019k - Trench.ogg';
    console.log('Unicode Test String:', testUnicode);
    console.log('Unicode Test Encoded:', encodeURIComponent(testUnicode));

    // Test Howler capabilities
    console.log('Howler Audio Support:', {
      webAudio: (window as any).Howler?.ctx !== null,
      html5: true,
      codecs: {
        ogg: (window as any).Howler?.codecs?.('audio/ogg') || 'unknown',
        mp3: (window as any).Howler?.codecs?.('audio/mpeg') || 'unknown'
      }
    });

    console.groupEnd();
  }

  // 【✓】 Get project-specific audio directory
  private getAudioDirectory(): string {
    return this.currentProject === 'phantasia1' ? 'Phantasia_1' : 'Phantasia_2';
  }

  // 【✓】 Initialize component
  ngOnInit(): void {
    this.initializeAudio();
  }

  // 【✓】 Enhanced cleanup with comprehensive resource management and seek cleanup
  ngOnDestroy(): void {
    try {
      // Signal destruction to all subscriptions
      this.destroy$.next();
      this.destroy$.complete();

      // 【✓】 Clean up seek-related operations
      this.cleanupSeekOperations();

      // 【✓】 Clean up all audio instances to prevent memory leaks
      this.cleanupAllAudioInstances();

      // 【✓】 Clear any pending track loading operations
      this.isTrackLoading = false;
      this.lastLoadedTrackId = null;

      // 【✓】 Clean up audio context and event listeners
      this.cleanupAudioContext();
      this.cleanupEventListeners();

      console.log('[MusicPlayer] Component destroyed and resources cleaned up');
    } catch (error) {
      console.error('[MusicPlayer] Error during cleanup:', error);
    }
  }

  // 【✓】 Clean up seek-related operations and timers
  private cleanupSeekOperations(): void {
    try {
      // Clear any pending seek debounce
      if (this.seekDebounceTimeout) {
        clearTimeout(this.seekDebounceTimeout);
        this.seekDebounceTimeout = null;
      }

      // Reset seek state
      this.isUserSeeking = false;
      this.seekPromise = null;
      this.pendingSeekPosition = null;

      console.log('[MusicPlayer] Seek operations cleaned up');
    } catch (error) {
      console.error('[MusicPlayer] Error cleaning up seek operations:', error);
    }
  }

  // 【✓】 Initialize audio player with multi-project support
  private initializeAudio(): void {
    // Listen to current project changes
    this.dynamicArtistService.currentProject$
      .pipe(takeUntil(this.destroy$))
      .subscribe(project => {
        this.currentProject = project;
        console.log(`[MusicPlayer] Project switched to: ${project}`);
        this.cdr.markForCheck();
      });

    // Load tracks from DynamicArtistService
    this.dynamicArtistService.tracks$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tracks => {
        this.allTracks = tracks;
        if (tracks.length > 0 && !this.currentTrackInfo) {
          this.currentTrackInfo = tracks[0];
          this.currentTrackIndex = 0;
          this.loadTrackFromInfo(this.currentTrackInfo);
          this.updateDynamicArtistTime();
        }
        this.cdr.markForCheck();
      });

    // Listen to current track changes from dynamic artist service
    this.dynamicArtistService.currentTrack$
      .pipe(takeUntil(this.destroy$))
      .subscribe(currentTrack => {
        if (currentTrack && currentTrack !== this.currentTrackInfo) {
          this.currentTrackInfo = currentTrack;
          this.currentTrackIndex = this.allTracks.findIndex(t => t.id === currentTrack.id);
          this.loadTrackFromInfo(currentTrack);
        }
        this.cdr.markForCheck();
      });
  }


  // 【✓】 Enhanced track loading with mutex protection and proper cleanup
  private async loadTrackFromInfo(trackInfo: TrackWithArtists): Promise<void> {
    // 【✓】 Implement mutex to prevent race conditions
    if (this.isTrackLoading) {
      console.log('[MusicPlayer] Track loading already in progress, waiting...');
      return;
    }

    // Check if we're trying to load the same track
    if (this.lastLoadedTrackId === trackInfo.id && !this.error) {
      console.log(`[MusicPlayer] Track ${trackInfo.id} already loaded, skipping`);
      return;
    }

    this.isTrackLoading = true;
    this.lastLoadedTrackId = trackInfo.id;
    this.retryCount = 0;

    try {
      this.isLoading = true;
      this.currentTime = 0;
      this.isPlaying = false;
      this.error = '';
      this.cdr.markForCheck();

      // 【✓】 Clean up previous audio instance properly
      await this.cleanupCurrentAudio();

      console.log(`[MusicPlayer] Starting track load: ${trackInfo.title} (${trackInfo.id})`);
    } catch (error) {
      console.error('[MusicPlayer] Error during track loading preparation:', error);
      this.handleTrackLoadError(trackInfo, error);
      return;
    }

    // Construct audio source with enhanced Unicode handling
    let audioSrc: string;
    if (trackInfo.audioFile) {
      // Handle Unicode characters specially for track 8 (Evin a'k)
      // The right single quotation mark (U+2019) needs special handling
      let processedFilename = trackInfo.audioFile;

      // Enhanced logging for debugging Unicode issues
      console.log('[MusicPlayer] Original filename:', processedFilename);
      console.log('[MusicPlayer] Filename char codes:', [...processedFilename].map(c => `${c}(${c.charCodeAt(0)})`).join(' '));

      // Try multiple encoding strategies for maximum compatibility
      const encodingStrategies = [
        // Strategy 1: Use encodeURIComponent for proper URL encoding
        () => `assets/audio/${this.getAudioDirectory()}/${encodeURIComponent(processedFilename)}`,
        // Strategy 2: Replace Unicode quotation mark with regular apostrophe first, then encode
        () => {
          const normalized = processedFilename.replace(/'/g, "'");
          return `assets/audio/${this.getAudioDirectory()}/${encodeURIComponent(normalized)}`;
        },
        // Strategy 3: Manual encoding of problematic characters
        () => {
          const manualEncoded = processedFilename
            .replace(/'/g, "%E2%80%99")  // Right single quotation mark
            .replace(/ /g, "%20")        // Spaces
            .replace(/\(/g, "%28")       // Left parenthesis
            .replace(/\)/g, "%29");      // Right parenthesis
          return `assets/audio/${this.getAudioDirectory()}/${manualEncoded}`;
        },
        // Strategy 4: Try without any encoding (direct path)
        () => `assets/audio/${this.getAudioDirectory()}/${processedFilename}`,
        // Strategy 5: Use different base URL or absolute path
        () => `/assets/audio/${this.getAudioDirectory()}/${encodeURIComponent(processedFilename)}`
      ];

      // Use the first strategy by default, but we'll add fallback logic in the error handler
      audioSrc = encodingStrategies[0]();

      // Store alternative URLs for fallback attempts
      (this as any)._fallbackUrls = encodingStrategies.slice(1).map(strategy => strategy());
      (this as any)._currentStrategyIndex = 0;
      (this as any)._trackInfo = trackInfo;  // Store for error reporting

      console.log('[MusicPlayer] Prepared fallback URLs:');
      (this as any)._fallbackUrls.forEach((url: string, index: number) => {
        console.log(`  Strategy ${index + 1}: ${url}`);
      });

    } else {
      // Fallback to track ID
      audioSrc = `assets/audio/${this.getAudioDirectory()}/${trackInfo.id}.ogg`;
      (this as any)._fallbackUrls = [];
    }

    console.log('[MusicPlayer] Loading audio (Strategy 0):', audioSrc);

    // Additional diagnostics for Track 8
    if (trackInfo.id === '8') {
      console.group('[MusicPlayer] Track 8 Diagnostics');
      console.log('Track ID:', trackInfo.id);
      console.log('Track Title:', trackInfo.title);
      console.log('Main Artist:', trackInfo.mainArtist);
      console.log('Audio File Mapping:', trackInfo.audioFile);
      console.log('Final Audio Source:', audioSrc);
      console.log('Browser Location:', window.location.href);
      console.groupEnd();
    }

    this.audio = new Howl({
      src: [audioSrc],
      html5: true,
      format: ['ogg', 'mp3'], // Prefer OGG but fallback to MP3
      volume: this.volume, // Preserve volume setting
      onload: () => {
        this.isLoading = false;
        this.duration = this.audio?.duration() || 0;
        // 【✓】 Restore volume and mute state properly
        if (this._isMuted && this.audio) {
          this.audio.volume(0);
        } else if (this.audio) {
          this.audio.volume(this.volume);
        }
        this.updateDynamicArtistTime();
        // Notify centralized state manager
        this.musicStateManager.updateDuration(this.duration);
        this.cdr.markForCheck();
      },
      onplay: () => {
        this.isPlaying = true;
        this.updateTime();
        this.updateDynamicArtistTime();
        // Notify centralized state manager
        this.musicStateManager.setPlayingState(true);
        this.cdr.markForCheck();
      },
      onpause: () => {
        this.isPlaying = false;
        // Notify centralized state manager
        this.musicStateManager.setPlayingState(false);
        this.cdr.markForCheck();
      },
      onend: () => {
        console.log('[MusicPlayer] 🎵 HOWLER ONEND EVENT (primary)');
        this.isPlaying = false;
        // Set current time to full duration to show song completed
        this.currentTime = this.audio?.duration() || this.duration;
        // Notify centralized state manager
        this.musicStateManager.setPlayingState(false);

        // Prevent auto-advancing if user just clicked/seeked near the end
        const timeSinceLastSeek = Date.now() - this.lastSeekTime;
        const isWithinSeekCooldown = timeSinceLastSeek < this.seekCooldownMs;

        console.log(`[MusicPlayer] 🛡️ ONEND PROTECTION CHECK (primary): isUserSeeking=${this.isUserSeeking}, seekPromise=${!!this.seekPromise}, timeSinceLastSeek=${timeSinceLastSeek}ms, cooldown=${this.seekCooldownMs}ms`);

        if (!this.isUserSeeking && !this.seekPromise && !isWithinSeekCooldown) {
          console.log('[MusicPlayer] ✅ ONEND AUTO-ADVANCE ALLOWED (primary)');
          // Small delay before playing next track to ensure UI updates
          setTimeout(() => {
            this.nextTrack();
          }, 50);
        } else {
          console.log('[MusicPlayer] ❌ ONEND AUTO-ADVANCE BLOCKED (primary) - recent user interaction detected');
        }
        this.cdr.markForCheck();
      },
      onloaderror: (id, error) => {
        console.error('[MusicPlayer] Error loading (Strategy ' + ((this as any)._currentStrategyIndex || 0) + '):', audioSrc, error);
        console.error('[MusicPlayer] Track info:', trackInfo);

        // Try fallback strategies for Unicode filename issues
        const fallbackUrls = (this as any)._fallbackUrls || [];
        const currentIndex = (this as any)._currentStrategyIndex || 0;

        if (currentIndex < fallbackUrls.length) {
          console.log('[MusicPlayer] Attempting fallback strategy', currentIndex + 1);
          (this as any)._currentStrategyIndex = currentIndex + 1;

          const fallbackUrl = fallbackUrls[currentIndex];
          console.log('[MusicPlayer] Trying fallback URL:', fallbackUrl);

          // Create new Howl instance with fallback URL
          if (this.audio) {
            this.audio.unload();
          }

          this.audio = new Howl({
            src: [fallbackUrl],
            html5: true,
            format: ['ogg', 'mp3'],
            volume: this.volume,
            onload: () => {
              console.log('[MusicPlayer] Fallback strategy successful!');
              this.isLoading = false;
              this.isTrackLoading = false;
              this.duration = this.audio?.duration() || 0;

              // 【✓】 Restore volume state properly
              if (this._isMuted && this.audio) {
                this.audio.volume(0);
              } else if (this.audio) {
                this.audio.volume(this.volume);
              }

              this.updateDynamicArtistTime();
              this.musicStateManager.updateDuration(this.duration);
              this.cdr.markForCheck();
            },
            onplay: () => {
              this.isPlaying = true;
              this.updateTime();
              this.updateDynamicArtistTime();
              this.cdr.markForCheck();
            },
            onpause: () => {
              this.isPlaying = false;
              this.cdr.markForCheck();
            },
            onend: () => {
              console.log('[MusicPlayer] 🎵 HOWLER ONEND EVENT (fallback)');
              this.isPlaying = false;
              // Set current time to full duration to show song completed
              this.currentTime = this.audio?.duration() || this.duration;

              // Prevent auto-advancing if user just clicked/seeked near the end
              const timeSinceLastSeek = Date.now() - this.lastSeekTime;
              const isWithinSeekCooldown = timeSinceLastSeek < this.seekCooldownMs;

              console.log(`[MusicPlayer] 🛡️ ONEND PROTECTION CHECK (fallback): isUserSeeking=${this.isUserSeeking}, seekPromise=${!!this.seekPromise}, timeSinceLastSeek=${timeSinceLastSeek}ms, cooldown=${this.seekCooldownMs}ms`);

              if (!this.isUserSeeking && !this.seekPromise && !isWithinSeekCooldown) {
                console.log('[MusicPlayer] ✅ ONEND AUTO-ADVANCE ALLOWED (fallback)');
                // Small delay before playing next track to ensure UI updates
                setTimeout(() => {
                  this.nextTrack();
                }, 50);
              } else {
                console.log('[MusicPlayer] ❌ ONEND AUTO-ADVANCE BLOCKED (fallback) - recent user interaction detected');
              }
              this.cdr.markForCheck();
            },
            onloaderror: (fallbackId, fallbackError) => {
              console.error('[MusicPlayer] Fallback also failed:', fallbackUrl, fallbackError);
              // If this was the last fallback, show final error
              if (currentIndex >= fallbackUrls.length - 1) {
                this.error = `Failed to load track "${trackInfo.title}" by ${trackInfo.mainArtist}. Tried ${fallbackUrls.length + 1} different URL encodings. Last error: ${fallbackError}`;
                this.isLoading = false;
                this.isTrackLoading = false;
                this.lastLoadedTrackId = null;
                this.cdr.markForCheck();
              } else {
                // Continue with next fallback - increment index and try next strategy
                (this as any)._currentStrategyIndex = currentIndex + 1;
                const nextFallbackUrl = fallbackUrls[currentIndex + 1];
                if (nextFallbackUrl) {
                  console.log('[MusicPlayer] Trying next fallback strategy:', currentIndex + 2);
                  this.tryLoadWithUrl(nextFallbackUrl, trackInfo);
                }
              }
            }
          });
        } else {
          // All strategies failed
          this.error = `Failed to load track "${trackInfo.title}" by ${trackInfo.mainArtist}. All ${fallbackUrls.length + 1} encoding strategies failed. Final error: ${error}`;
          this.isLoading = false;
          this.isTrackLoading = false;
          this.lastLoadedTrackId = null;
          this.cdr.markForCheck();
        }
      }
    });

    // 【✓】 Track the audio instance for cleanup
    if (this.audio) {
      this.audioInstances.push(this.audio);
      this.isTrackLoading = false;
    }
  }

  // 【✓】 Enhanced helper method for fallback URL loading with proper cleanup
  private async tryLoadWithUrl(url: string, trackInfo: TrackWithArtists): Promise<void> {
    try {
      // Clean up current audio before trying fallback
      await this.cleanupCurrentAudio();
    } catch (error) {
      console.error('[MusicPlayer] Error cleaning up before fallback:', error);
    }

    this.audio = new Howl({
      src: [url],
      html5: true,
      format: ['ogg', 'mp3'],
      volume: this.volume,
      onload: () => {
        console.log('[MusicPlayer] Fallback strategy successful!');
        this.isLoading = false;
        this.isTrackLoading = false;
        this.duration = this.audio?.duration() || 0;

        // 【✓】 Restore volume state properly
        if (this._isMuted && this.audio) {
          this.audio.volume(0);
        } else if (this.audio) {
          this.audio.volume(this.volume);
        }

        this.updateDynamicArtistTime();
        this.musicStateManager.updateDuration(this.duration);
        this.cdr.markForCheck();
      },
      onplay: () => {
        this.isPlaying = true;
        this.updateTime();
        this.updateDynamicArtistTime();
        this.cdr.markForCheck();
      },
      onpause: () => {
        this.isPlaying = false;
        this.cdr.markForCheck();
      },
      onend: () => {
        console.log('[MusicPlayer] 🎵 HOWLER ONEND EVENT (tryLoadWithUrl)');
        this.isPlaying = false;
        // Set current time to full duration to show song completed
        this.currentTime = this.audio?.duration() || this.duration;

        // Prevent auto-advancing if user just clicked/seeked near the end
        const timeSinceLastSeek = Date.now() - this.lastSeekTime;
        const isWithinSeekCooldown = timeSinceLastSeek < this.seekCooldownMs;

        console.log(`[MusicPlayer] 🛡️ ONEND PROTECTION CHECK (tryLoadWithUrl): isUserSeeking=${this.isUserSeeking}, seekPromise=${!!this.seekPromise}, timeSinceLastSeek=${timeSinceLastSeek}ms, cooldown=${this.seekCooldownMs}ms`);

        if (!this.isUserSeeking && !this.seekPromise && !isWithinSeekCooldown) {
          console.log('[MusicPlayer] ✅ ONEND AUTO-ADVANCE ALLOWED (tryLoadWithUrl)');
          // Small delay before playing next track to ensure UI updates
          setTimeout(() => {
            this.nextTrack();
          }, 50);
        } else {
          console.log('[MusicPlayer] ❌ ONEND AUTO-ADVANCE BLOCKED (tryLoadWithUrl) - recent user interaction detected');
        }
        this.cdr.markForCheck();
      },
      onloaderror: (id, error) => {
        const fallbackUrls = (this as any)._fallbackUrls || [];
        const currentIndex = (this as any)._currentStrategyIndex || 0;
        
        console.error(`[MusicPlayer] Fallback strategy ${currentIndex + 1} failed:`, url, error);
        
        if (currentIndex < fallbackUrls.length - 1) {
          (this as any)._currentStrategyIndex = currentIndex + 1;
          const nextUrl = fallbackUrls[currentIndex];
          console.log(`[MusicPlayer] Trying next fallback strategy ${currentIndex + 2}:`, nextUrl);
          this.tryLoadWithUrl(nextUrl, trackInfo);
        } else {
          this.error = `Failed to load track "${trackInfo.title}" by ${trackInfo.mainArtist}. All ${fallbackUrls.length + 1} encoding strategies failed. Final error: ${error}`;
          this.isLoading = false;
          this.isTrackLoading = false;
          this.lastLoadedTrackId = null;
          this.cdr.markForCheck();
        }
      }
    });

    // 【✓】 Track the audio instance for cleanup
    if (this.audio) {
      this.audioInstances.push(this.audio);
    }
  }

  // 【✓】 Load and play track (legacy method for backwards compatibility)
  private loadTrack(track: Track): void {
    this.isLoading = true;
    this.currentTime = 0;
    this.isPlaying = false;
    this.cdr.markForCheck();

    if (this.audio) {
      this.audio.unload();
    }

    this.audio = new Howl({
      src: [track.url || track.title], // Fallback to title if url is not provided
      html5: true,
      onload: () => {
        this.isLoading = false;
        this.duration = this.audio?.duration() || 0;
        this.cdr.markForCheck();
      },
      onplay: () => {
        this.isPlaying = true;
        this.updateTime();
        this.cdr.markForCheck();
      },
      onpause: () => {
        this.isPlaying = false;
        this.cdr.markForCheck();
      },
      onend: () => {
        console.log('[MusicPlayer] 🎵 HOWLER ONEND EVENT (legacy)');
        this.isPlaying = false;
        // Set current time to full duration to show song completed
        this.currentTime = this.audio?.duration() || this.duration;

        // Prevent auto-advancing if user just clicked/seeked near the end
        const timeSinceLastSeek = Date.now() - this.lastSeekTime;
        const isWithinSeekCooldown = timeSinceLastSeek < this.seekCooldownMs;

        console.log(`[MusicPlayer] 🛡️ ONEND PROTECTION CHECK (legacy): isUserSeeking=${this.isUserSeeking}, seekPromise=${!!this.seekPromise}, timeSinceLastSeek=${timeSinceLastSeek}ms, cooldown=${this.seekCooldownMs}ms`);

        if (!this.isUserSeeking && !this.seekPromise && !isWithinSeekCooldown) {
          console.log('[MusicPlayer] ✅ ONEND AUTO-ADVANCE ALLOWED (legacy)');
          // Small delay before playing next track to ensure UI updates
          setTimeout(() => {
            this.nextTrack();
          }, 50);
        } else {
          console.log('[MusicPlayer] ❌ ONEND AUTO-ADVANCE BLOCKED (legacy) - recent user interaction detected');
        }
        this.cdr.markForCheck();
      },
      onloaderror: (id, error) => {
        this.error = `Failed to load track: ${error}`;
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // 【✓】 Enhanced play/pause with audio context management
  async togglePlay(): Promise<void> {
    if (!this.audio) {
      console.warn('[MusicPlayer] No audio instance available for playback');
      return;
    }

    try {
      // 【✓】 Ensure audio context is ready before playback
      await this.ensureAudioContextReady();

      if (this.isPlaying) {
        this.audio.pause();
        this.isPlaying = false;
      } else {
        // Validate audio is loaded before playing
        const duration = this.audio.duration();
        if (!duration || duration === 0) {
          console.warn('[MusicPlayer] Cannot play: audio not fully loaded');
          this.error = 'Audio still loading, please wait...';
          this.cdr.markForCheck();
          return;
        }

        // Mark user interaction for audio context policies
        this.hasUserInteracted = true;

        // Clear any previous errors
        this.error = '';

        this.audio.play();
        this.isPlaying = true;
      }

      // Notify centralized state manager
      this.musicStateManager.setPlayingState(this.isPlaying);
      this.cdr.markForCheck();

      console.log(`[MusicPlayer] Playback ${this.isPlaying ? 'started' : 'paused'}`);
    } catch (error) {
      console.error('[MusicPlayer] Error toggling playback:', error);
      this.error = 'Playback error occurred';
      this.cdr.markForCheck();
    }
  }

  // 【✓】 Enhanced volume management with proper mute state separation
  setVolume(value: number): void {
    if (!this.audio) {
      // Store volume for when audio becomes available
      this.volume = Math.max(0, Math.min(1, value));
      this.lastSuccessfulVolume = this.volume;
      return;
    }

    try {
      // Validate and clamp volume
      const clampedValue = Math.max(0, Math.min(1, value));
      this.volume = clampedValue;

      // 【✓】 Only update saved volume if not currently muted and value > 0
      if (!this._isMuted && clampedValue > 0) {
        this._savedVolumeBeforeMute = clampedValue;
        this.lastSuccessfulVolume = clampedValue;
      }

      // 【✓】 Apply volume to audio instance with error handling
      this.audio.volume(clampedValue);

      // Notify centralized state manager
      this.musicStateManager.updateVolume(clampedValue);
      this.cdr.markForCheck();

      console.log(`[MusicPlayer] Volume set to ${clampedValue}, muted: ${this._isMuted}`);
    } catch (error) {
      console.error('[MusicPlayer] Error setting volume:', error);
      this.handleVolumeError(value);
    }
  }

  // 【✓】 Enhanced mute toggle with proper state isolation
  toggleMute(): void {
    if (!this.audio) {
      console.warn('[MusicPlayer] Cannot toggle mute: no audio instance available');
      return;
    }

    try {
      this.hasUserInteracted = true;

      if (!this._muteStateInitialized) {
        this._savedVolumeBeforeMute = this.volume > 0 ? this.volume : 0.5;
        this._muteStateInitialized = true;
      }

      if (this._isMuted) {
        // 【✓】 Unmute: restore saved volume without calling setVolume to avoid conflicts
        this._isMuted = false;
        const volumeToRestore = this._savedVolumeBeforeMute > 0 ? this._savedVolumeBeforeMute : 0.5;
        this.volume = volumeToRestore;
        this.audio.volume(volumeToRestore);

        // Notify state manager
        this.musicStateManager.updateVolume(volumeToRestore);

        console.log(`[MusicPlayer] Unmuted, restored volume to ${volumeToRestore}`);
      } else {
        // 【✓】 Mute: save current volume and set audio to 0
        this._isMuted = true;
        if (this.volume > 0) {
          this._savedVolumeBeforeMute = this.volume;
        }

        // Only change audio volume, keep this.volume for UI display
        this.audio.volume(0);

        // Notify state manager with 0 volume
        this.musicStateManager.updateVolume(0);

        console.log(`[MusicPlayer] Muted, saved volume ${this._savedVolumeBeforeMute}`);
      }

      this.cdr.markForCheck();
    } catch (error) {
      console.error('[MusicPlayer] Error toggling mute:', error);
      this.handleMuteError();
    }
  }

  // 【✓】 Enhanced seek method with proper asynchronous handling and state management
  private seekPromise: Promise<void> | null = null;
  private pendingSeekPosition: number | null = null;
  private seekDebounceTimeout: any = null;

  seek(value: number): void {
    const seekPosition = Math.max(0, Math.min(this.duration || 0, Number(value)));
    const percentageOfTrack = this.duration ? (seekPosition / this.duration) * 100 : 0;

    console.log(`[MusicPlayer] 🎯 SEEK REQUEST: position=${seekPosition}s, percentage=${percentageOfTrack.toFixed(1)}%, duration=${this.duration}s`);

    // Debounce rapid seek operations
    if (this.seekDebounceTimeout) {
      clearTimeout(this.seekDebounceTimeout);
    }

    this.pendingSeekPosition = seekPosition;

    this.seekDebounceTimeout = setTimeout(() => {
      this.performSeek(this.pendingSeekPosition!);
      this.pendingSeekPosition = null;
    }, 50); // 50ms debounce to handle rapid slider movements
  }

  private async performSeek(seekPosition: number): Promise<void> {
    if (!this.audio) {
      console.warn('[MusicPlayer] Cannot seek: no audio instance');
      return;
    }

    // Validate audio is loaded and ready
    const duration = this.audio.duration();
    if (!duration || duration === 0) {
      console.warn('[MusicPlayer] Cannot seek: audio not fully loaded');
      return;
    }

    // Prevent concurrent seek operations
    if (this.seekPromise) {
      console.log('[MusicPlayer] Seek already in progress, queuing new position');
      return;
    }

    // Validate seek position
    const clampedPosition = Math.max(0, Math.min(duration, seekPosition));
    const percentageOfTrack = (clampedPosition / duration) * 100;

    // Set seeking state with enhanced tracking
    this.isUserSeeking = true;
    this.lastSeekTime = Date.now();

    console.log(`[MusicPlayer] 🎯 PERFORMING SEEK: position=${clampedPosition}s (${percentageOfTrack.toFixed(1)}%) / ${duration}s`);
    console.log(`[MusicPlayer] 🔒 SEEK PROTECTION ACTIVATED: isUserSeeking=true, lastSeekTime=${this.lastSeekTime}`);

    try {
      // Create seek promise for proper async handling
      this.seekPromise = new Promise<void>((resolve, reject) => {
        try {
          // Perform the actual seek operation
          this.audio!.seek(clampedPosition);

          // Update current time immediately for UI responsiveness
          this.currentTime = clampedPosition;

          // Wait for audio to reach the seek position
          const checkSeekComplete = () => {
            if (!this.audio) {
              reject(new Error('Audio instance lost during seek'));
              return;
            }

            const actualPosition = this.audio.seek();
            const tolerance = 0.1; // 100ms tolerance

            if (Math.abs(actualPosition - clampedPosition) <= tolerance) {
              // Seek completed successfully
              console.log(`[MusicPlayer] ✅ SEEK COMPLETED: target=${clampedPosition}s, actual=${actualPosition}s`);
              resolve();
            } else {
              // Still seeking, check again
              setTimeout(checkSeekComplete, 10);
            }
          };

          // Start checking for seek completion
          setTimeout(checkSeekComplete, 10);

        } catch (error) {
          reject(error);
        }
      });

      // Wait for seek to complete
      await this.seekPromise;

      // Update dynamic artist time after successful seek
      this.updateDynamicArtistTime();

      // Trigger change detection
      this.cdr.markForCheck();

    } catch (error) {
      console.error('[MusicPlayer] Error during seek operation:', error);
      this.error = 'Seek operation failed';
    } finally {
      // CRITICAL FIX: Reset seeking state with cooldown that matches seekCooldownMs
      setTimeout(() => {
        this.isUserSeeking = false;
        console.log(`[MusicPlayer] 🔓 SEEK PROTECTION DEACTIVATED: isUserSeeking=false after ${this.seekCooldownMs}ms cooldown`);
      }, this.seekCooldownMs); // Use the same cooldown period as completion detection!

      // Clear seek promise
      this.seekPromise = null;
    }
  }

  // 【✓】 Update subtitle based on filename
  private updateSubtitleFromFilename(track: string): void {
    if (track) {
      const filename = track.split('/').pop() || '';
      const parts = filename.replace('.mp3', '').split(' - ');
      if (parts.length > 1) {
        this.currentSubtitle = parts[0];
      } else {
        this.currentSubtitle = '';
      }
    }
  }

  // 【✓】 Enhanced time update method with proper seek state awareness and throttling
  private lastTimeUpdate = 0;
  private readonly TIME_UPDATE_THROTTLE = 16; // ~60fps for smooth updates

  private updateTime(): void {
    if (!this.audio || !this.isPlaying) {
      return;
    }

    // Throttle updates for better performance
    const now = Date.now();
    if (now - this.lastTimeUpdate < this.TIME_UPDATE_THROTTLE) {
      requestAnimationFrame(() => this.updateTime());
      return;
    }
    this.lastTimeUpdate = now;

    // Only update current time if not actively seeking
    if (!this.isUserSeeking && !this.seekPromise) {
      const seek = this.audio.seek();
      const newTime = typeof seek === 'number' ? seek : 0;

      // Only update if time has actually changed (prevent unnecessary updates)
      if (Math.abs(newTime - this.currentTime) > 0.01) {
        this.currentTime = newTime;
      }
    }

    // FIXED: Enhanced completion detection with proper safeguards
    const duration = this.audio.duration();
    const timeSinceLastSeek = Date.now() - this.lastSeekTime;
    const isWithinSeekCooldown = timeSinceLastSeek < this.seekCooldownMs;

    // CRITICAL FIX: Completion detection only at EXACTLY 100% of track duration - no early triggering
    if (duration &&
        this.currentTime >= duration && // Must be at exactly 100% completion
        !isWithinSeekCooldown &&
        !this.isUserSeeking &&
        !this.seekPromise &&
        this.isPlaying) { // Only trigger completion if actually playing

      console.log(`[MusicPlayer] 🏁 NATURAL COMPLETION DETECTED: currentTime=${this.currentTime}s, duration=${duration}s`);
      console.log(`[MusicPlayer] 🛡️ PROTECTION CHECK: isUserSeeking=${this.isUserSeeking}, seekPromise=${!!this.seekPromise}, timeSinceLastSeek=${timeSinceLastSeek}ms, cooldown=${this.seekCooldownMs}ms`);
      this.handleTrackCompletion(duration);
      return;
    }

    // Update dependent services only if not seeking
    if (!this.isUserSeeking && !this.seekPromise) {
      this.updateDynamicArtistTime();
    }

    this.cdr.markForCheck();
    requestAnimationFrame(() => this.updateTime());
  }

  // 【✓】 Separate method for handling track completion
  private handleTrackCompletion(duration: number): void {
    this.currentTime = duration;
    this.isPlaying = false;
    this.musicStateManager.setPlayingState(false);

    // Small delay before auto-advancing to ensure UI updates
    setTimeout(() => {
      this.nextTrack();
    }, 100);

    this.cdr.markForCheck();
  }

  // 【✓】 Update dynamic artist service with current playback time (but not during seeks)
  private updateDynamicArtistTime(): void {
    if (this.currentTrackInfo && !this.isUserSeeking) {
      // Only update dynamic artist time during natural playback, not during user seeks
      const timeSinceLastSeek = Date.now() - this.lastSeekTime;
      const isRecentSeek = timeSinceLastSeek < this.seekCooldownMs;
      const trackDuration = this.duration || 0;

      // CRITICAL FIX: Clamp current time to prevent spilling into next track's time range
      // Use the minimum of currentTime and trackDuration to ensure we never exceed the track bounds
      const clampedCurrentTime = Math.min(this.currentTime, trackDuration);

      // Calculate absolute time with clamped position to prevent track overflow
      const absoluteTime = this.currentTrackInfo.startTime + clampedCurrentTime;

      // BULLETPROOF PROTECTION: Check if we're approaching track boundary
      const percentageComplete = trackDuration > 0 ? (clampedCurrentTime / trackDuration) : 0;
      const isNearTrackEnd = percentageComplete > 0.90; // Within 10% of track end

      // FINAL FIX: Never allow dynamic time updates when near track end if user recently seeked
      // This completely prevents the time-based track switching issue
      const shouldSkipUpdate = isRecentSeek ||
                               (isNearTrackEnd && timeSinceLastSeek < (this.seekCooldownMs * 10)) || // Extended protection for 10 seconds
                               (percentageComplete > 0.98); // Never update in last 2% of track regardless

      console.log(`[MusicPlayer] 🕒 Dynamic time update check: isRecentSeek=${isRecentSeek}, isNearEnd=${isNearTrackEnd}, percentage=${(percentageComplete * 100).toFixed(1)}%, clampedTime=${clampedCurrentTime}s/${trackDuration}s, absoluteTime=${absoluteTime}s`);

      if (!shouldSkipUpdate) {
        console.log(`[MusicPlayer] ✅ Updating dynamic time to ${absoluteTime}s (clamped from ${this.currentTime}s)`);
        this.dynamicArtistService.updateCurrentTime(absoluteTime);
      } else {
        console.log(`[MusicPlayer] ❌ BULLETPROOF PROTECTION: Skipping dynamic time update (nearEnd=${isNearTrackEnd}, recentSeek=${isRecentSeek}, percentage=${(percentageComplete * 100).toFixed(1)}%)`);
      }
    }
  }

  // 【✓】 Next track for Phantasia 2 with proper state synchronization
  nextTrack(): void {
    console.log('[MusicPlayer] 🎵 NEXT TRACK CALLED');
    console.log('[MusicPlayer] 📊 Current state:', {
      isLoading: this.isLoading,
      allTracksLength: this.allTracks.length,
      currentTime: this.currentTime,
      duration: this.duration,
      isPlaying: this.isPlaying,
      currentTrackIndex: this.currentTrackIndex
    });

    if (this.isLoading || this.allTracks.length === 0) return;

    // If nextTrack is called from onend, assume we should autoplay (wasPlaying = true)
    // For manual nextTrack calls, use the current playing state
    const wasPlaying = this.isPlaying || this.currentTime >= (this.duration - 0.2);
    const nextIndex = (this.currentTrackIndex + 1) % this.allTracks.length;
    const nextTrackInfo = this.allTracks[nextIndex];

    if (nextTrackInfo && nextTrackInfo.id !== this.currentTrackInfo?.id) {
      this.currentTrackInfo = nextTrackInfo;
      this.currentTrackIndex = nextIndex;

      // Notify dynamic artist service immediately when track changes
      this.dynamicArtistService.updateCurrentTime(nextTrackInfo.startTime);

      this.loadTrackFromInfo(nextTrackInfo);

      // Auto-play if the previous track was playing
      if (wasPlaying) {
        // Wait for track to load before playing
        const playWhenReady = () => {
          if (!this.isLoading && this.audio) {
            this.audio.play();
          } else if (!this.error) {
            setTimeout(playWhenReady, 100);
          }
        };
        playWhenReady();
      }
    }
  }

  // 【✓】 Previous track for Phantasia 2 with proper state synchronization
  previousTrack(): void {
    if (this.isLoading || this.allTracks.length === 0) return;

    // For manual previousTrack calls, preserve the current playing state
    const wasPlaying = this.isPlaying;
    const prevIndex = this.currentTrackIndex === 0
      ? this.allTracks.length - 1
      : this.currentTrackIndex - 1;
    const prevTrackInfo = this.allTracks[prevIndex];

    if (prevTrackInfo && prevTrackInfo.id !== this.currentTrackInfo?.id) {
      this.currentTrackInfo = prevTrackInfo;
      this.currentTrackIndex = prevIndex;

      // Notify dynamic artist service immediately when track changes
      this.dynamicArtistService.updateCurrentTime(prevTrackInfo.startTime);

      this.loadTrackFromInfo(prevTrackInfo);

      // Auto-play if the previous track was playing
      if (wasPlaying) {
        // Wait for track to load before playing
        const playWhenReady = () => {
          if (!this.isLoading && this.audio) {
            this.audio.play();
          } else if (!this.error) {
            setTimeout(playWhenReady, 100);
          }
        };
        playWhenReady();
      }
    }
  }

  // 【✓】 Format time with NaN handling
  formatTime(seconds: number): string {
    // Handle NaN, undefined, or invalid values
    if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) {
      return '0:00';
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // 【✓】 Get track name for Phantasia 2
  getTrackName(track?: string): string {
    // Use current track info if available
    if (this.currentTrackInfo) {
      return this.currentTrackInfo.title;
    }

    // Fallback to input parameters
    if (this.trackTitle) {
      return this.trackTitle;
    }

    // Legacy fallback for old track format
    if (track) {
      const parts = track.split('/');
      const filename = parts[parts.length - 1].replace(/\.(mp3|ogg)$/, '');
      const fileParts = filename.split(' - ');
      if (fileParts.length > 1) {
        return fileParts[1];
      }
      return filename;
    }

    return 'Unknown Track';
  }

  // 【✓】 Get artist name for Phantasia 2
  getArtistName(): string {
    // Use current track info if available
    if (this.currentTrackInfo) {
      return this.currentTrackInfo.mainArtist;
    }

    // Fallback to input parameters
    if (this.trackArtist) {
      return this.trackArtist;
    }

    // Legacy fallback
    if (this.currentTrack) {
      const filename = this.currentTrack.split('/').pop() || '';
      const parts = filename.replace(/\.(mp3|ogg)$/, '').split(' - ');
      if (parts.length > 1) {
        return parts[0];
      }
    }

    return this.currentSubtitle || 'Unknown Artist';
  }

  // 【✓】 Enhanced cleanup methods for proper resource management

  /**
   * Clean up current audio instance
   */
  private async cleanupCurrentAudio(): Promise<void> {
    if (this.audio) {
      try {
        // Stop playback if playing
        if (this.isPlaying) {
          this.audio.pause();
        }

        // Unload the audio
        this.audio.unload();

        // Remove from tracking array
        const index = this.audioInstances.indexOf(this.audio);
        if (index > -1) {
          this.audioInstances.splice(index, 1);
        }

        this.audio = null;
        console.log('[MusicPlayer] Current audio instance cleaned up');
      } catch (error) {
        console.error('[MusicPlayer] Error during audio cleanup:', error);
      }
    }
  }

  /**
   * Clean up all audio instances
   */
  private cleanupAllAudioInstances(): void {
    try {
      // Clean up current audio
      if (this.audio) {
        this.audio.unload();
        this.audio = null;
      }

      // Clean up any tracked instances
      this.audioInstances.forEach(instance => {
        try {
          instance.unload();
        } catch (error) {
          console.error('[MusicPlayer] Error unloading audio instance:', error);
        }
      });

      this.audioInstances = [];
      console.log('[MusicPlayer] All audio instances cleaned up');
    } catch (error) {
      console.error('[MusicPlayer] Error during comprehensive cleanup:', error);
    }
  }

  /**
   * Handle volume setting errors with recovery
   */
  private handleVolumeError(attemptedValue: number): void {
    console.warn(`[MusicPlayer] Volume error, attempting recovery with value ${attemptedValue}`);

    if (this.retryCount < this.maxRetries) {
      this.retryCount++;

      // Try to restore last known good volume
      setTimeout(() => {
        if (this.audio) {
          try {
            this.audio.volume(this.lastSuccessfulVolume);
            this.volume = this.lastSuccessfulVolume;
            this.cdr.markForCheck();
          } catch (retryError) {
            console.error('[MusicPlayer] Volume recovery failed:', retryError);
          }
        }
      }, 100);
    } else {
      this.error = 'Volume control temporarily unavailable';
      this.cdr.markForCheck();
    }
  }

  /**
   * Handle mute toggle errors with recovery
   */
  private handleMuteError(): void {
    console.warn('[MusicPlayer] Mute toggle error, attempting recovery');

    // Reset mute state to known good state
    this._isMuted = false;
    this._muteStateInitialized = false;

    if (this.audio) {
      try {
        this.audio.volume(this.lastSuccessfulVolume);
        this.volume = this.lastSuccessfulVolume;
      } catch (recoveryError) {
        console.error('[MusicPlayer] Mute recovery failed:', recoveryError);
        this.error = 'Mute control temporarily unavailable';
      }
    }

    this.cdr.markForCheck();
  }

  /**
   * Handle track loading errors with detailed logging
   */
  private handleTrackLoadError(trackInfo: TrackWithArtists, error: any): void {
    console.error(`[MusicPlayer] Track loading error for ${trackInfo.title}:`, error);

    this.error = `Failed to load "${trackInfo.title}" - ${error.message || error}`;
    this.isLoading = false;
    this.isTrackLoading = false;
    this.lastLoadedTrackId = null;

    // Clean up any partial audio instances
    this.cleanupCurrentAudio();

    this.cdr.markForCheck();
  }

  /**
   * Get current mute state (public accessor)
   */
  get isMuted(): boolean {
    return this._isMuted;
  }

  /**
   * Get display volume for UI (0 when muted, actual volume when not muted)
   */
  get displayVolume(): number {
    return this._isMuted ? 0 : this.volume;
  }

  /**
   * Get saved volume before mute (public accessor)
   */
  get savedVolumeBeforeMute(): number {
    return this._savedVolumeBeforeMute;
  }

  // 【✓】 Enhanced seek event handlers for better user interaction
  public onSeekStart(): void {
    const percentageOfTrack = this.duration ? (this.currentTime / this.duration) * 100 : 0;
    console.log(`[MusicPlayer] 🖱️ USER SEEK START: currentTime=${this.currentTime}s (${percentageOfTrack.toFixed(1)}%), duration=${this.duration}s`);
    this.isUserSeeking = true;
    this.lastSeekTime = Date.now();
  }

  public onSeekEnd(): void {
    const percentageOfTrack = this.duration ? (this.currentTime / this.duration) * 100 : 0;
    console.log(`[MusicPlayer] 🖱️ USER SEEK END: currentTime=${this.currentTime}s (${percentageOfTrack.toFixed(1)}%), duration=${this.duration}s`);
    // Don't immediately reset isUserSeeking - let the seek operation complete
    // The flag will be reset in the performSeek method
  }

  /**
   * Debug method to get current state
   */
  getDebugState(): any {
    return {
      isPlaying: this.isPlaying,
      isLoading: this.isLoading,
      isTrackLoading: this.isTrackLoading,
      isMuted: this._isMuted,
      volume: this.volume,
      savedVolumeBeforeMute: this._savedVolumeBeforeMute,
      currentTrackId: this.currentTrackInfo?.id,
      audioInstancesCount: this.audioInstances.length,
      lastLoadedTrackId: this.lastLoadedTrackId,
      error: this.error,
      audioContextState: this.audioContext?.state,
      eventListenersCount: this.eventListeners.length
    };
  }

  // 【✓】 Audio context management methods

  /**
   * Initialize audio context for better audio handling
   */
  private initializeAudioContext(): void {
    try {
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        this.audioContext = new AudioContext();
        this.isAudioContextInitialized = true;
        console.log('[MusicPlayer] AudioContext initialized');
      } else if (typeof window !== 'undefined' && 'webkitAudioContext' in window) {
        this.audioContext = new (window as any).webkitAudioContext();
        this.isAudioContextInitialized = true;
        console.log('[MusicPlayer] WebKit AudioContext initialized');
      } else {
        console.warn('[MusicPlayer] AudioContext not supported');
      }
    } catch (error) {
      console.error('[MusicPlayer] Error initializing AudioContext:', error);
    }
  }

  /**
   * Setup global event listeners for audio context management
   */
  private setupGlobalEventListeners(): void {
    if (typeof window === 'undefined') return;

    try {
      // 【✓】 Resume audio context on user interaction
      const resumeAudioContext = async () => {
        if (this.audioContext && this.audioContext.state === 'suspended') {
          try {
            await this.audioContext.resume();
            console.log('[MusicPlayer] AudioContext resumed');
          } catch (error) {
            console.error('[MusicPlayer] Error resuming AudioContext:', error);
          }
        }
      };

      // 【✓】 Handle visibility changes to manage audio context
      const handleVisibilityChange = () => {
        if (document.hidden) {
          // Page is hidden, suspend audio context to save resources
          if (this.audioContext && this.audioContext.state === 'running') {
            this.audioContext.suspend().catch(error => {
              console.error('[MusicPlayer] Error suspending AudioContext:', error);
            });
          }
        } else {
          // Page is visible, resume audio context
          resumeAudioContext();
        }
      };

      // 【✓】 Add event listeners with tracking
      this.addTrackedEventListener(document, 'click', resumeAudioContext, { passive: true });
      this.addTrackedEventListener(document, 'keydown', resumeAudioContext, { passive: true });
      this.addTrackedEventListener(document, 'visibilitychange', handleVisibilityChange, { passive: true });

      console.log('[MusicPlayer] Global event listeners setup completed');
    } catch (error) {
      console.error('[MusicPlayer] Error setting up global event listeners:', error);
    }
  }

  /**
   * Add event listener with tracking for cleanup
   */
  private addTrackedEventListener(
    element: any,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ): void {
    try {
      element.addEventListener(event, handler, options);
      this.eventListeners.push({ element, event, handler });
    } catch (error) {
      console.error(`[MusicPlayer] Error adding event listener for ${event}:`, error);
    }
  }

  /**
   * Clean up audio context
   */
  private cleanupAudioContext(): void {
    try {
      if (this.audioContext) {
        if (this.audioContext.state !== 'closed') {
          this.audioContext.close().catch(error => {
            console.error('[MusicPlayer] Error closing AudioContext:', error);
          });
        }
        this.audioContext = null;
        this.isAudioContextInitialized = false;
        console.log('[MusicPlayer] AudioContext cleaned up');
      }
    } catch (error) {
      console.error('[MusicPlayer] Error during AudioContext cleanup:', error);
    }
  }

  /**
   * Clean up all event listeners
   */
  private cleanupEventListeners(): void {
    try {
      this.eventListeners.forEach(({ element, event, handler }) => {
        try {
          element.removeEventListener(event, handler);
        } catch (error) {
          console.error(`[MusicPlayer] Error removing event listener for ${event}:`, error);
        }
      });
      this.eventListeners = [];
      console.log('[MusicPlayer] Event listeners cleaned up');
    } catch (error) {
      console.error('[MusicPlayer] Error during event listener cleanup:', error);
    }
  }

  /**
   * Ensure audio context is ready for playback
   */
  private async ensureAudioContextReady(): Promise<void> {
    if (!this.audioContext) {
      this.initializeAudioContext();
    }

    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
        console.log('[MusicPlayer] AudioContext resumed for playback');
      } catch (error) {
        console.error('[MusicPlayer] Error resuming AudioContext for playback:', error);
      }
    }
  }
} 