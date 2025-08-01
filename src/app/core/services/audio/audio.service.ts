import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, merge } from 'rxjs';
import { catchError, map, takeUntil, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Howl } from 'howler';

/**
 * Consolidated audio service combining functionality from all previous audio services
 * Handles both music playback and UI sounds using Howler.js and HTML5 Audio
 * Features: Track management, volume control, progress tracking, error handling
 */

// Core type definitions for better type safety and maintainability
export interface Track {
  readonly title: string;
  readonly artist: string;
  readonly id: string;
  readonly url: string;
  readonly duration?: number;
}

export interface AudioState {
  readonly isPlaying: boolean;
  readonly isMuted: boolean;
  readonly currentTrack: Track | null;
  readonly volume: number;
  readonly progress: number;
  readonly currentTime: number;
  readonly duration: number;
  readonly loading: boolean;
}

export interface AudioEvent {
  readonly type: TrackEvent;
  readonly timestamp: number;
  readonly position?: number;
  readonly duration?: number;
  readonly error?: any;
}

export type Section = 'introduction' | 'disc-1' | 'disc-2' | 'pv' | 'information';
export type AudioError = 'LOAD_ERROR' | 'PLAY_ERROR' | 'PAUSE_ERROR' | 'NETWORK_ERROR' | 'UI_SOUND_ERROR';
export type UISound = 'menu-click' | 'page-turn' | 'success' | 'error';
export type TrackEvent = 'play' | 'pause' | 'ended' | 'timeupdate' | 'error' | 'loading' | 'loaded' | 'volumechange';

@Injectable({
  providedIn: 'root'
})
export class AudioService implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly isDebugMode = false; // Set to true for development
  
  // Audio playback instances
  private audioElement: HTMLAudioElement | null = null;
  private uiSounds: Map<UISound, Howl> = new Map();
  
  // Track management
  private readonly tracksMap = new Map<string, Track>();
  
  // Audio state management with BehaviorSubject for reactive programming
  private readonly audioStateSubject = new BehaviorSubject<AudioState>({
    isPlaying: false,
    isMuted: false,
    currentTrack: null,
    volume: 0.7,
    progress: 0,
    currentTime: 0,
    duration: 0,
    loading: false
  });
  
  // Event emission for components that need to react to audio events
  private readonly audioEventSubject = new Subject<AudioEvent>();
  
  // Public observables for components to subscribe to
  public readonly audioState$: Observable<AudioState> = this.audioStateSubject.asObservable();
  public readonly audioEvents$: Observable<AudioEvent> = this.audioEventSubject.asObservable();
  
  // Predefined track configurations for Phantasia sections
  private readonly TRACKS: Record<Section, Track> = {
    'introduction': {
      title: 'An Incident',
      artist: 'Unknown Artist',
      id: 'track-intro',
      url: 'assets/audio/An - Incident.mp3'
    },
    'disc-1': {
      title: 'Star☆Crusher',
      artist: '¿¿¿¿',
      id: 'track-disc1',
      url: 'assets/audio/¿¿¿¿ - Star☆Crusher.mp3'
    },
    'disc-2': {
      title: 'i can avoid it',
      artist: 'Feryquitous',
      id: 'track-disc2',
      url: 'assets/audio/Feryquitous - i can avoid it.mp3'
    },
    'pv': {
      title: 'PV Track',
      artist: 'Unknown Artist',
      id: 'track-pv',
      url: 'assets/audio/An - Incident.mp3'
    },
    'information': {
      title: 'Information Track',
      artist: 'Unknown Artist',
      id: 'track-info',
      url: 'assets/audio/An - Incident.mp3'
    }
  };

  constructor(private readonly http: HttpClient) {
    this.initializeService();
    this.loadTracks();
    this.initializeUISounds();
  }

  ngOnDestroy(): void {
    this.cleanup();
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize the audio service and set up event listeners
   */
  private initializeService(): void {
    this.audioElement = new Audio();
    this.setupAudioEventListeners();
    
    if (this.isDebugMode) {
      console.log('AudioService initialized successfully');
    }
  }

  /**
   * Load predefined tracks into the tracks map
   */
  private loadTracks(): void {
    Object.values(this.TRACKS).forEach(track => {
      this.tracksMap.set(track.id, track);
    });
    
    if (this.isDebugMode) {
      console.log(`Loaded ${this.tracksMap.size} tracks`);
    }
  }

  /**
   * Initialize UI sound effects using Howler.js for better performance
   */
  private initializeUISounds(): void {
    const uiSoundConfigs: Record<UISound, string> = {
      'menu-click': 'assets/audio/ui/menu-click.mp3',
      'page-turn': 'assets/audio/ui/page-turn.mp3',
      'success': 'assets/audio/ui/success.mp3',
      'error': 'assets/audio/ui/error.mp3'
    };

    Object.entries(uiSoundConfigs).forEach(([sound, url]) => {
      try {
        const howl = new Howl({
          src: [url],
          volume: 0.3,
          preload: true
        });
        this.uiSounds.set(sound as UISound, howl);
      } catch (error) {
        console.warn(`Failed to load UI sound: ${sound}`, error);
      }
    });
  }

  /**
   * Set up event listeners for the audio element
   */
  private setupAudioEventListeners(): void {
    if (!this.audioElement) return;

    const events: (keyof HTMLMediaElementEventMap)[] = [
      'play', 'pause', 'ended', 'timeupdate', 'loadstart', 
      'loadeddata', 'error', 'volumechange'
    ];

    events.forEach(eventType => {
      this.audioElement?.addEventListener(eventType, (event) => {
        this.handleAudioEvent(eventType as TrackEvent, event);
      });
    });
  }

  /**
   * Handle audio events and update state accordingly
   */
  private handleAudioEvent(eventType: TrackEvent, event: Event): void {
    const currentState = this.audioStateSubject.value;
    let newState: AudioState = { ...currentState };

    switch (eventType) {
      case 'play':
        newState.isPlaying = true;
        newState.loading = false;
        break;
      case 'pause':
        newState.isPlaying = false;
        break;
      case 'ended':
        newState.isPlaying = false;
        newState.progress = 0;
        newState.currentTime = 0;
        break;
      case 'timeupdate':
        if (this.audioElement) {
          newState.currentTime = this.audioElement.currentTime;
          newState.duration = this.audioElement.duration || 0;
          newState.progress = newState.duration > 0 ? 
            (newState.currentTime / newState.duration) * 100 : 0;
        }
        break;
      case 'loadstart':
        newState.loading = true;
        break;
      case 'loadeddata':
        newState.loading = false;
        if (this.audioElement) {
          newState.duration = this.audioElement.duration || 0;
        }
        break;
      case 'volumechange':
        if (this.audioElement) {
          newState.volume = this.audioElement.volume;
          newState.isMuted = this.audioElement.muted;
        }
        break;
      case 'error':
        newState.loading = false;
        this.emitAudioEvent('error', { error: event });
        console.error('Audio playback error:', event);
        break;
    }

    this.audioStateSubject.next(newState);
    this.emitAudioEvent(eventType);
  }

  /**
   * Emit audio events for components to react to
   */
  private emitAudioEvent(type: TrackEvent, additionalData: Partial<AudioEvent> = {}): void {
    const event: AudioEvent = {
      type,
      timestamp: Date.now(),
      position: this.audioElement?.currentTime,
      duration: this.audioElement?.duration,
      ...additionalData
    };
    
    this.audioEventSubject.next(event);
  }

  // Public API methods for music playback
  
  /**
   * Play a track by section identifier
   */
  public playTrackBySection(section: Section): Observable<boolean> {
    const track = this.TRACKS[section];
    return this.playTrack(track);
  }

  /**
   * Play a specific track
   */
  public playTrack(track: Track): Observable<boolean> {
    return new Observable(observer => {
      try {
        if (!this.audioElement) {
          observer.error('Audio element not initialized');
          return;
        }

        // Update current track in state
        const currentState = this.audioStateSubject.value;
        this.audioStateSubject.next({
          ...currentState,
          currentTrack: track,
          loading: true
        });

        // Set audio source and play
        this.audioElement.src = track.url;
        this.audioElement.load();
        
        const playPromise = this.audioElement.play();
        
        if (playPromise) {
          playPromise
            .then(() => {
              observer.next(true);
              observer.complete();
            })
            .catch(error => {
              console.error('Playback failed:', error);
              observer.error(error);
            });
        } else {
          observer.next(true);
          observer.complete();
        }
      } catch (error) {
        observer.error(error);
      }
    });
  }

  /**
   * Pause current track
   */
  public pause(): void {
    if (this.audioElement && !this.audioElement.paused) {
      this.audioElement.pause();
    }
  }

  /**
   * Resume current track
   */
  public resume(): void {
    if (this.audioElement && this.audioElement.paused) {
      this.audioElement.play().catch(error => {
        console.error('Resume failed:', error);
      });
    }
  }

  /**
   * Stop current track and reset position
   */
  public stop(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
  }

  /**
   * Set volume (0.0 to 1.0)
   */
  public setVolume(volume: number): void {
    if (this.audioElement) {
      this.audioElement.volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Seek to specific position (in seconds)
   */
  public seekTo(position: number): void {
    if (this.audioElement && this.audioElement.duration) {
      this.audioElement.currentTime = Math.max(0, Math.min(this.audioElement.duration, position));
    }
  }

  /**
   * Toggle mute state
   */
  public toggleMute(): void {
    if (this.audioElement) {
      this.audioElement.muted = !this.audioElement.muted;
    }
  }

  // UI Sound methods

  /**
   * Play UI sound effect
   */
  public playUISound(sound: UISound): void {
    const howl = this.uiSounds.get(sound);
    if (howl) {
      howl.play();
    } else if (this.isDebugMode) {
      console.warn(`UI sound not found: ${sound}`);
    }
  }

  /**
   * Set UI sounds volume
   */
  public setUISoundsVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.uiSounds.forEach(howl => howl.volume(clampedVolume));
  }

  // Utility methods

  /**
   * Get current audio state snapshot
   */
  public getCurrentState(): AudioState {
    return this.audioStateSubject.value;
  }

  /**
   * Check if a track is currently playing
   */
  public isTrackPlaying(trackId: string): boolean {
    const state = this.audioStateSubject.value;
    return state.isPlaying && state.currentTrack?.id === trackId;
  }

  /**
   * Get track by ID
   */
  public getTrack(trackId: string): Track | undefined {
    return this.tracksMap.get(trackId);
  }

  /**
   * Get all available tracks
   */
  public getAllTracks(): Track[] {
    return Array.from(this.tracksMap.values());
  }

  /**
   * Clean up resources
   */
  private cleanup(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
      this.audioElement = null;
    }

    this.uiSounds.forEach(howl => howl.unload());
    this.uiSounds.clear();

    if (this.isDebugMode) {
      console.log('AudioService cleanup completed');
    }
  }
}