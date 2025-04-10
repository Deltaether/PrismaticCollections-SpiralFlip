import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, from } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { Howl } from 'howler';

// 【✓】 Define interfaces for type safety
interface Track {
  readonly title: string;
  readonly artist: string;
  readonly id: string;
  readonly url: string;
}

interface AudioState {
  readonly isPlaying: boolean;
  readonly currentTrack: Track | null;
  readonly volume: number;
  readonly progress: number;
  readonly loading: boolean;
}

// 【✓】 Define section types for better type checks
type Section = 'introduction' | 'disc-1' | 'disc-2' | 'pv' | 'information';

// 【✓】 Define error types
type AudioError = 'LOAD_ERROR' | 'PLAY_ERROR' | 'PAUSE_ERROR' | 'NETWORK_ERROR' | 'UI_SOUND_ERROR';

// 【✓】 Define UI sound types for better autocomplete and error prevention
type UISound = 'menu-click' | 'page-turn' | 'success' | 'error';

// 【✓】 Define track events for event emitting system
type TrackEvent = 'play' | 'pause' | 'ended' | 'timeupdate' | 'error' | 'loading' | 'loaded';

@Injectable({
  providedIn: 'root'
})
export class AudioService implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly isDebugMode = true;
  private audio: HTMLAudioElement | null = null;
  private currentTrack: Track | null = null;
  private _isPlaying = false;
  private volume = 1;
  private progress = 0;
  private isLoading = false;

  // 【✓】 Track configurations with proper typing
  private readonly TRACKS: Record<Section, Track> = {
    'introduction': {
      title: 'Introduction',
      artist: 'An',
      id: 'intro',
      url: 'assets/audio/An - Incident.mp3'
    },
    'disc-1': {
      title: 'I can avoid it',
      artist: 'Feryquitous',
      id: 'disc1',
      url: 'assets/audio/Feryquitous - i can avoid it.mp3'
    },
    'disc-2': {
      title: 'Quantum Resonance',
      artist: 'An',
      id: 'disc2',
      url: 'assets/audio/An - Quantum Resonance.mp3'
    },
    'pv': {
      title: 'Neural Network',
      artist: 'Feryquitous',
      id: 'pv',
      url: 'assets/audio/Feryquitous - Neural Network.mp3'
    },
    'information': {
      title: 'Digital Entropy',
      artist: 'An × Feryquitous',
      id: 'info',
      url: 'assets/audio/An × Feryquitous - Digital Entropy.mp3'
    }
  };

  // 【✓】 Audio state subject with proper typing
  private readonly audioStateSubject = new BehaviorSubject<AudioState>({
    isPlaying: false,
    currentTrack: null,
    volume: 1,
    progress: 0,
    loading: false
  });

  // 【✓】 Audio events subject to group all events
  private readonly audioEventSubject = new BehaviorSubject<{ type: TrackEvent, data?: any }>({
    type: 'pause'
  });

  // 【✓】 Error subject with proper typing
  private readonly errorSubject = new Subject<{ type: AudioError; message: string }>();

  // 【✓】 Track subject for sharing current track
  private readonly currentTrackSubject = new BehaviorSubject<string>('');
  readonly currentTrack$ = this.currentTrackSubject.asObservable();
  
  // 【✓】 Audio files with proper initialization
  private readonly audioFiles: string[] = [];
  
  // 【✓】 Section tracks mapping with proper typing
  private readonly sectionTracks: Record<Section, string> = {
    'introduction': 'An - Incident.mp3',
    'disc-1': 'Feryquitous - i can avoid it.mp3',
    'disc-2': 'An - Quantum Resonance.mp3',
    'pv': 'Feryquitous - Neural Network.mp3',
    'information': 'An × Feryquitous - Digital Entropy.mp3'
  };

  // 【✓】 UI sound paths with proper typing
  private readonly uiSounds: Record<UISound, string> = {
    'menu-click': 'assets/audio/ui/menu-click.mp3',
    'page-turn': 'assets/audio/ui/page-turn.mp3',
    'success': 'assets/audio/ui/success.mp3',
    'error': 'assets/audio/ui/error.mp3'
  };

  constructor(private readonly http: HttpClient) {
    this.loadAudioFiles();
    this.initializeAudio();
    if (this.isDebugMode) {
      console.log('[AudioService] Initialized');
    }
  }

  // 【✓】 Load audio files with proper typing and error handling
  private async loadAudioFiles(): Promise<void> {
    try {
      // Populate audio files array from section tracks
      this.audioFiles.push(...Object.values(this.sectionTracks).map(file => `assets/audio/${file}`));
      
      // Set initial track
      if (this.audioFiles.length > 0) {
        this.currentTrackSubject.next(this.audioFiles[0]);
      }
      
      if (this.isDebugMode) {
        console.log('[AudioService] Audio files loaded:', this.audioFiles);
      }
    } catch (error: unknown) {
      this.handleError('LOAD_ERROR', `Failed to load audio files: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 【✓】 Initialize audio element
  private initializeAudio(): void {
    this.audio = new Audio();
    this.setupAudioEventListeners();
  }

  // 【✓】 Setup audio event listeners with improved error handling
  private setupAudioEventListeners(): void {
    if (!this.audio) {
      this.handleError('LOAD_ERROR', 'Audio element not initialized');
      return;
    }

    // Time update event for tracking progress
    this.audio.addEventListener('timeupdate', () => {
      if (this.audio) {
        this.progress = this.audio.duration ? (this.audio.currentTime / this.audio.duration) * 100 : 0;
        this.updateAudioState();
        this.audioEventSubject.next({ type: 'timeupdate', data: this.progress });
      }
    });

    // Track ended event
    this.audio.addEventListener('ended', () => {
      this._isPlaying = false;
      this.updateAudioState();
      this.audioEventSubject.next({ type: 'ended' });
    });

    // Error handling
    this.audio.addEventListener('error', (event) => {
      const error = event as ErrorEvent;
      this.handleError('LOAD_ERROR', `Failed to load audio: ${error.message || 'Unknown error'}`);
      this.audioEventSubject.next({ type: 'error', data: error.message });
    });

    // Loading events
    this.audio.addEventListener('loadstart', () => {
      this.isLoading = true;
      this.updateAudioState();
      this.audioEventSubject.next({ type: 'loading' });
    });

    this.audio.addEventListener('canplay', () => {
      this.isLoading = false;
      this.updateAudioState();
      this.audioEventSubject.next({ type: 'loaded' });
    });

    // Play event
    this.audio.addEventListener('play', () => {
      this._isPlaying = true;
      this.updateAudioState();
      this.audioEventSubject.next({ type: 'play' });
    });

    // Pause event
    this.audio.addEventListener('pause', () => {
      this._isPlaying = false;
      this.updateAudioState();
      this.audioEventSubject.next({ type: 'pause' });
    });
  }

  // 【✓】 Update audio state with loading information
  private updateAudioState(): void {
    this.audioStateSubject.next({
      isPlaying: this._isPlaying,
      currentTrack: this.currentTrack,
      volume: this.volume,
      progress: this.progress,
      loading: this.isLoading
    });
  }

  // 【✓】 Handle errors with better context
  private handleError(type: AudioError, message: string): void {
    if (this.isDebugMode) {
      console.error(`[AudioService] ${type}: ${message}`);
    }
    this.errorSubject.next({ type, message });
  }

  // 【✓】 Set track for section with better type safety
  setTrackForSection(section: Section): void {
    const track = this.TRACKS[section];
    if (!track) {
      this.handleError('LOAD_ERROR', `No track found for section: ${section}`);
      return;
    }

    if (this.currentTrack?.id === track.id) {
      return;
    }

    if (this.isDebugMode) {
      console.log(`[AudioService] Setting track for section: ${section}`, track);
    }

    this.currentTrack = track;
    this.loadTrack(track);
    this.currentTrackSubject.next(track.url);
  }

  // 【✓】 Load track with better error handling
  private loadTrack(track: Track): void {
    if (!this.audio) {
      this.handleError('LOAD_ERROR', 'Audio element not initialized');
      return;
    }

    this.isLoading = true;
    this.updateAudioState();
    this.audio.src = track.url;
    
    try {
      this.audio.load();
    } catch (error: unknown) {
      this.handleError('LOAD_ERROR', `Failed to load track: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 【✓】 Play audio with better error handling
  play(): void {
    if (!this.audio) {
      this.handleError('PLAY_ERROR', 'Audio element not initialized');
      return;
    }

    if (!this.currentTrack) {
      this.handleError('PLAY_ERROR', 'No track selected');
      return;
    }

    if (this.isDebugMode) {
      console.log('[AudioService] Playing audio:', this.currentTrack.title);
    }

    this.audio.play()
      .then(() => {
        this._isPlaying = true;
        this.updateAudioState();
      })
      .catch((error: unknown) => {
        this.handleError('PLAY_ERROR', `Failed to play audio: ${error instanceof Error ? error.message : String(error)}`);
      });
  }

  // 【✓】 Pause audio with better error handling
  pause(): void {
    if (!this.audio) {
      this.handleError('PAUSE_ERROR', 'Audio element not initialized');
      return;
    }

    if (this.isDebugMode) {
      console.log('[AudioService] Pausing audio');
    }

    this.audio.pause();
    this._isPlaying = false;
    this.updateAudioState();
  }

  // 【✓】 Toggle play/pause with better error handling
  togglePlay(): void {
    if (this._isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  // 【✓】 Set volume with better validation
  setVolume(value: number): void {
    if (!this.audio) {
      this.handleError('PAUSE_ERROR', 'Audio element not initialized');
      return;
    }

    this.volume = Math.max(0, Math.min(1, value));
    this.audio.volume = this.volume;
    this.updateAudioState();
    
    if (this.isDebugMode) {
      console.log(`[AudioService] Volume set to: ${this.volume}`);
    }
  }

  // 【✓】 Get current state
  getCurrentState(): Observable<AudioState> {
    return this.audioStateSubject.asObservable();
  }

  // 【✓】 Get audio events for more granular control
  getAudioEvents(): Observable<{ type: TrackEvent, data?: any }> {
    return this.audioEventSubject.asObservable();
  }

  // 【✓】 Get play state changes for simpler integration
  onPlayStateChange(): Observable<boolean> {
    return this.getCurrentState().pipe(
      map(state => state.isPlaying)
    );
  }

  // 【✓】 Get track changes for simpler integration
  onTrackChange(): Observable<string> {
    return this.currentTrack$;
  }

  // 【✓】 Get loading state changes for UI feedback
  onLoadingStateChange(): Observable<boolean> {
    return this.getCurrentState().pipe(
      map(state => state.loading)
    );
  }

  // 【✓】 Get current progress for seeking and UI
  getProgress(): number {
    if (!this.audio || !this.audio.duration) return 0;
    return this.audio.currentTime / this.audio.duration;
  }

  // 【✓】 Get errors stream
  getErrors(): Observable<{ type: AudioError; message: string }> {
    return this.errorSubject.asObservable();
  }

  // 【✓】 Get currently playing status
  isPlaying(): boolean {
    return this._isPlaying;
  }

  // 【✓】 Get current track for UI display
  getCurrentTrack(): string | null {
    return this.currentTrackSubject.value;
  }

  // 【✓】 Get next track with better error handling
  getNextTrack(): string | null {
    const currentIndex = this.audioFiles.indexOf(this.currentTrackSubject.value);
    if (currentIndex < this.audioFiles.length - 1) {
      const nextTrack = this.audioFiles[currentIndex + 1];
      this.currentTrackSubject.next(nextTrack);
      return nextTrack;
    }
    return null;
  }

  // 【✓】 Get previous track with better error handling
  getPreviousTrack(): string | null {
    const currentIndex = this.audioFiles.indexOf(this.currentTrackSubject.value);
    if (currentIndex > 0) {
      const previousTrack = this.audioFiles[currentIndex - 1];
      this.currentTrackSubject.next(previousTrack);
      return previousTrack;
    }
    return null;
  }

  // 【✓】 Get track list for UI display
  getTrackList(): readonly string[] {
    return this.audioFiles;
  }

  // 【✓】 Get current index for UI highlight
  getCurrentIndex(): number {
    return this.audioFiles.indexOf(this.currentTrackSubject.value);
  }

  // 【✓】 Play UI sound effects with better type safety and error handling
  playUISound(soundName: UISound): void {
    if (!this.uiSounds[soundName]) {
      this.handleError('UI_SOUND_ERROR', `UI sound not found: ${soundName}`);
      return;
    }
    
    try {
      const sound = new Audio(this.uiSounds[soundName]);
      sound.volume = 0.5;
      sound.play()
        .catch((error: unknown) => {
          this.handleError('UI_SOUND_ERROR', `Error playing UI sound: ${error instanceof Error ? error.message : String(error)}`);
        });
    } catch (error: unknown) {
      this.handleError('UI_SOUND_ERROR', `Failed to create UI sound: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 【✓】 Play a track from source URL with better validation
  playTrack(src: string): void {
    if (!this.audio) {
      this.handleError('PLAY_ERROR', 'Audio element not initialized');
      return;
    }
    
    if (this.isDebugMode) {
      console.log(`[AudioService] Playing track from source: ${src}`);
    }
    
    // Update current track and start playing
    this.currentTrackSubject.next(src);
    this.isLoading = true;
    this.updateAudioState();
    
    this.audio.src = src;
    
    // Try to play the track with error handling
    this.audio.play()
      .then(() => {
        this._isPlaying = true;
        this.updateAudioState();
      })
      .catch((error: unknown) => {
        this.handleError('PLAY_ERROR', `Error playing track: ${error instanceof Error ? error.message : String(error)}`);
      });
  }

  // 【✓】 Pause the current track (alias for pause() for better API)
  pauseTrack(): void {
    this.pause();
  }

  // 【✓】 Resume the paused track (alias for play() for better API)
  resumeTrack(): void {
    this.play();
  }

  // 【✓】 Cleanup resources properly
  ngOnDestroy(): void {
    if (this.isDebugMode) {
      console.log('[AudioService] Destroying service');
    }
    
    if (this.audio) {
      // Remove all event listeners to prevent memory leaks
      this.audio.onended = null;
      this.audio.ontimeupdate = null;
      this.audio.onerror = null;
      this.audio.oncanplay = null;
      this.audio.onloadstart = null;
      
      // Stop playback and clear source
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
    
    // Complete all subjects
    this.audioStateSubject.complete();
    this.audioEventSubject.complete();
    this.currentTrackSubject.complete();
    this.errorSubject.complete();
    
    // Signal completion to any active subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }
} 