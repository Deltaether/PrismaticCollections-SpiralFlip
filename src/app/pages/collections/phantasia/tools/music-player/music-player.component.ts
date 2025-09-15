import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Howl } from 'howler';
import { AudioService } from './audio.service';
import { DynamicArtistService, TrackWithArtists } from '../../services/dynamic-artist.service';
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
  
  // 【✓】 Add proper typing for state
  isPlaying = false;
  isLoading = true;
  currentTrack = '';
  currentTime = 0;
  duration = 0;
  volume = 0.5;
  previousVolume = 0.5;
  error = '';
  currentSubtitle: string = '';

  // Enhanced state for Phantasia 2
  currentTrackInfo: TrackWithArtists | null = null;
  allTracks: TrackWithArtists[] = [];
  currentTrackIndex = 0;

  // State persistence flags
  private isMuted = false;
  private hasUserInteracted = false;

  constructor(
    private readonly audioService: AudioService,
    private readonly dynamicArtistService: DynamicArtistService,
    private readonly cdr: ChangeDetectorRef
  ) {
    // Enhanced debugging for Track 8 loading issues
    this.diagnoseEnvironment();
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

  // 【✓】 Initialize component
  ngOnInit(): void {
    this.initializeAudio();
  }

  // 【✓】 Cleanup resources
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.audio) {
      this.audio.unload();
    }
  }

  // 【✓】 Initialize audio player for Phantasia 2
  private initializeAudio(): void {
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


  // 【✓】 Load and play track from TrackWithArtists info
  private loadTrackFromInfo(trackInfo: TrackWithArtists): void {
    this.isLoading = true;
    this.currentTime = 0;
    this.isPlaying = false;
    this.error = '';
    this.cdr.markForCheck();

    if (this.audio) {
      this.audio.unload();
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
        () => `assets/audio/Phantasia_2/${encodeURIComponent(processedFilename)}`,
        // Strategy 2: Replace Unicode quotation mark with regular apostrophe first, then encode
        () => {
          const normalized = processedFilename.replace(/'/g, "'");
          return `assets/audio/Phantasia_2/${encodeURIComponent(normalized)}`;
        },
        // Strategy 3: Manual encoding of problematic characters
        () => {
          const manualEncoded = processedFilename
            .replace(/'/g, "%E2%80%99")  // Right single quotation mark
            .replace(/ /g, "%20")        // Spaces
            .replace(/\(/g, "%28")       // Left parenthesis
            .replace(/\)/g, "%29");      // Right parenthesis
          return `assets/audio/Phantasia_2/${manualEncoded}`;
        },
        // Strategy 4: Try without any encoding (direct path)
        () => `assets/audio/Phantasia_2/${processedFilename}`,
        // Strategy 5: Use different base URL or absolute path
        () => `/assets/audio/Phantasia_2/${encodeURIComponent(processedFilename)}`
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
      audioSrc = `assets/audio/Phantasia_2/${trackInfo.id}.ogg`;
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
        // Restore mute state if user had muted
        if (this.isMuted && this.audio) {
          this.audio.volume(0);
        }
        this.updateDynamicArtistTime();
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
        this.isPlaying = false;
        this.currentTime = 0;
        this.nextTrack();
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
              this.duration = this.audio?.duration() || 0;
              if (this.isMuted && this.audio) {
                this.audio.volume(0);
              }
              this.updateDynamicArtistTime();
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
              this.isPlaying = false;
              this.currentTime = 0;
              this.nextTrack();
              this.cdr.markForCheck();
            },
            onloaderror: (fallbackId, fallbackError) => {
              console.error('[MusicPlayer] Fallback also failed:', fallbackUrl, fallbackError);
              // If this was the last fallback, show final error
              if (currentIndex >= fallbackUrls.length - 1) {
                this.error = `Failed to load track "${trackInfo.title}" by ${trackInfo.mainArtist}. Tried ${fallbackUrls.length + 1} different URL encodings. Last error: ${fallbackError}`;
                this.isLoading = false;
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
          this.cdr.markForCheck();
        }
      }
    });
  }

  // Helper method for fallback URL loading
  private tryLoadWithUrl(url: string, trackInfo: TrackWithArtists): void {
    if (this.audio) {
      this.audio.unload();
    }

    this.audio = new Howl({
      src: [url],
      html5: true,
      format: ['ogg', 'mp3'],
      volume: this.volume,
      onload: () => {
        console.log('[MusicPlayer] Fallback strategy successful!');
        this.isLoading = false;
        this.duration = this.audio?.duration() || 0;
        if (this.isMuted && this.audio) {
          this.audio.volume(0);
        }
        this.updateDynamicArtistTime();
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
        this.isPlaying = false;
        this.currentTime = 0;
        this.nextTrack();
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
          this.cdr.markForCheck();
        }
      }
    });
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
        this.isPlaying = false;
        this.currentTime = 0;
        this.nextTrack();
        this.cdr.markForCheck();
      },
      onloaderror: (id, error) => {
        this.error = `Failed to load track: ${error}`;
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // 【✓】 Play/pause track
  togglePlay(): void {
    if (!this.audio) return;

    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.isPlaying = !this.isPlaying;
    this.cdr.markForCheck();
  }

  // 【✓】 Update volume with mute state tracking
  setVolume(value: number): void {
    if (!this.audio) return;

    this.volume = value;

    // Update mute state based on volume
    if (value === 0 && this.hasUserInteracted) {
      this.isMuted = true;
    } else if (value > 0) {
      this.isMuted = false;
      this.previousVolume = value;
    }

    this.audio.volume(value);
    this.cdr.markForCheck();
  }

  // 【✓】 Toggle mute/unmute with persistent state
  toggleMute(): void {
    if (!this.audio) return;

    this.hasUserInteracted = true;

    if (this.isMuted) {
      // Unmute: restore previous volume
      this.isMuted = false;
      this.setVolume(this.previousVolume);
    } else {
      // Mute: save current volume and set to 0
      this.isMuted = true;
      if (this.volume > 0) {
        this.previousVolume = this.volume;
      }
      this.setVolume(0);
    }
  }

  // 【✓】 Seek to position
  seek(value: number): void {
    if (!this.audio) return;
    this.audio.seek(value);
    this.currentTime = value;
    this.cdr.markForCheck();
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

  // 【✓】 Update time with proper continuous tracking
  private updateTime(): void {
    if (this.audio && this.isPlaying) {
      const seek = this.audio.seek();
      this.currentTime = typeof seek === 'number' ? seek : 0;
      this.updateDynamicArtistTime();
      this.cdr.markForCheck();
      requestAnimationFrame(() => this.updateTime());
    }
  }

  // 【✓】 Update dynamic artist service with current playback time
  private updateDynamicArtistTime(): void {
    if (this.currentTrackInfo) {
      // Calculate absolute time from track start time + current position
      const absoluteTime = this.currentTrackInfo.startTime + this.currentTime;
      this.dynamicArtistService.updateCurrentTime(absoluteTime);
    }
  }

  // 【✓】 Next track for Phantasia 2 with proper state synchronization
  nextTrack(): void {
    if (this.isLoading || this.allTracks.length === 0) return;

    const wasPlaying = this.isPlaying;
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
} 