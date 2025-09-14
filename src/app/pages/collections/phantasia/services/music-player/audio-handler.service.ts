import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, merge } from 'rxjs';
import { takeUntil, distinctUntilChanged, debounceTime, map } from 'rxjs/operators';
import { Track } from '../../../../core/services/audio/audio.service';

// Types used by the AudioHandlerService
export interface AudioHandlerState {
  readonly isPlaying: boolean;
  readonly currentTrack: string | null;
  readonly volume: number;
  readonly progress: number;
  readonly loading: boolean;
}

export type AudioError = 'LOAD_ERROR' | 'PLAY_ERROR' | 'PAUSE_ERROR' | 'NETWORK_ERROR' | 'UI_SOUND_ERROR';
export type TrackEvent = 'play' | 'pause' | 'ended' | 'timeupdate' | 'error' | 'loading' | 'loaded';

export interface AudioEvent {
  type: 'play' | 'pause' | 'ended' | 'timeupdate' | 'error' | 'volumechange' | 'loading' | 'loaded';
  timestamp: number;
  position?: number;
  duration?: number;
  error?: any;
}

export interface AudioState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  buffered: number;
  isLoading: boolean;
  currentTrack: Track | null;
  error: Error | null;
}

/**
 * Core service for handling audio playback functionality
 * This service is responsible for the low-level audio manipulation
 */
@Injectable({
  providedIn: 'root'
})
export class AudioHandlerService implements OnDestroy {
  // 【✓】 Service lifecycle management
  private readonly destroy$ = new Subject<void>();
  private readonly isDebugMode = true;
  
  // 【✓】 Audio element and state
  private audio: HTMLAudioElement | null = null;
  private _isPlaying = false;
  private volume = 1;
  private progress = 0;
  private isLoading = false;
  
  // 【✓】 Observable state management
  private readonly audioStateSubject = new BehaviorSubject<AudioState>({
    isPlaying: false,
    isMuted: false,
    volume: 1,
    currentTime: 0,
    duration: 0,
    buffered: 0,
    isLoading: false,
    currentTrack: null,
    error: null
  });
  
  private readonly audioEventSubject = new BehaviorSubject<{ type: TrackEvent, data?: any }>({
    type: 'pause',
    data: null
  });
  
  private readonly errorSubject = new Subject<{ type: AudioError; message: string }>();
  
  private readonly currentTrackSubject = new BehaviorSubject<string>('');
  readonly currentTrack$ = this.currentTrackSubject.asObservable();

  constructor() {
    if (this.isDebugMode) {
      console.log('[AudioHandlerService] Initializing audio handler service');
    }
    this.initializeAudio();
  }

  // 【✓】 Initialize the audio element
  private initializeAudio(): void {
    this.audio = new Audio();
    this.setupAudioEventListeners();
  }

  // 【✓】 Set up event listeners for the audio element
  private setupAudioEventListeners(): void {
    if (!this.audio) return;

    // Handle playback ended
    this.audio.onended = () => {
      if (this.isDebugMode) {
        console.log('[AudioHandlerService] Audio playback ended');
      }
      this._isPlaying = false;
      this.updateAudioState();
      this.audioEventSubject.next({ type: 'ended' });
    };

    // Handle time updates for progress tracking
    this.audio.ontimeupdate = () => {
      if (this.audio) {
        this.progress = this.audio.currentTime / (this.audio.duration || 1);
        this.updateAudioState();
        this.audioEventSubject.next({ 
          type: 'timeupdate', 
          data: { 
            currentTime: this.audio.currentTime,
            duration: this.audio.duration,
            progress: this.progress
          } 
        });
      }
    };

    // Handle errors during playback
    this.audio.onerror = (event) => {
      const errorDetails = this.audio?.error 
        ? `Code: ${this.audio.error.code}, Message: ${this.audio.error.message}`
        : 'Unknown error';
      
      if (this.isDebugMode) {
        console.error('[AudioHandlerService] Audio error:', errorDetails);
      }
      
      this.handleError('NETWORK_ERROR', `Audio error: ${errorDetails}`);
      this.audioEventSubject.next({ type: 'error', data: errorDetails });
    };

    // Handle canplay event - track is ready to play
    this.audio.oncanplay = () => {
      if (this.isDebugMode) {
        console.log('[AudioHandlerService] Audio can play');
      }
      this.isLoading = false;
      this.updateAudioState();
      this.audioEventSubject.next({ type: 'loaded' });
    };

    // Handle loadstart event - track is starting to load
    this.audio.onloadstart = () => {
      if (this.isDebugMode) {
        console.log('[AudioHandlerService] Audio load started');
      }
      this.isLoading = true;
      this.updateAudioState();
      this.audioEventSubject.next({ type: 'loading' });
    };
  }

  // 【✓】 Update the audio state observable
  private updateAudioState(): void {
    this.audioStateSubject.next({
      ...this.audioStateSubject.value,
      isPlaying: this._isPlaying,
      currentTrack: this.currentTrackSubject.value,
      volume: this.volume,
      progress: this.progress,
      loading: this.isLoading
    });
  }

  // 【✓】 Handle errors and notify subscribers
  private handleError(type: AudioError, message: string): void {
    if (this.isDebugMode) {
      console.error(`[AudioHandlerService] ${type}: ${message}`);
    }
    this.errorSubject.next({ type, message });
  }

  // 【✓】 Load track with error handling
  loadTrack(src: string): void {
    if (!this.audio) {
      this.handleError('LOAD_ERROR', 'Audio element not initialized');
      return;
    }

    this.isLoading = true;
    this.updateAudioState();
    this.audio.src = src;
    this.currentTrackSubject.next(src);
    
    try {
      this.audio.load();
    } catch (error: unknown) {
      this.handleError('LOAD_ERROR', `Failed to load track: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 【✓】 Play audio with error handling
  play(): void {
    if (!this.audio) {
      this.handleError('PLAY_ERROR', 'Audio element not initialized');
      return;
    }

    if (!this.currentTrackSubject.value) {
      this.handleError('PLAY_ERROR', 'No track selected');
      return;
    }

    if (this.isDebugMode) {
      console.log('[AudioHandlerService] Playing audio:', this.currentTrackSubject.value);
    }

    this.audio.play()
      .then(() => {
        this._isPlaying = true;
        this.updateAudioState();
        this.audioEventSubject.next({ type: 'play' });
      })
      .catch((error: unknown) => {
        this.handleError('PLAY_ERROR', `Failed to play audio: ${error instanceof Error ? error.message : String(error)}`);
      });
  }

  // 【✓】 Pause audio with error handling
  pause(): void {
    if (!this.audio) {
      this.handleError('PAUSE_ERROR', 'Audio element not initialized');
      return;
    }

    if (this.isDebugMode) {
      console.log('[AudioHandlerService] Pausing audio');
    }

    this.audio.pause();
    this._isPlaying = false;
    this.updateAudioState();
    this.audioEventSubject.next({ type: 'pause' });
  }

  // 【✓】 Toggle play/pause with error handling
  togglePlay(): void {
    if (this._isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  // 【✓】 Set volume with validation
  setVolume(value: number): void {
    if (!this.audio) {
      this.handleError('PAUSE_ERROR', 'Audio element not initialized');
      return;
    }

    this.volume = Math.max(0, Math.min(1, value));
    this.audio.volume = this.volume;
    this.updateAudioState();
    
    if (this.isDebugMode) {
      console.log(`[AudioHandlerService] Volume set to: ${this.volume}`);
    }
  }

  // 【✓】 Seek to position with validation
  seekTo(position: number): void {
    if (!this.audio || !this.audio.duration) {
      this.handleError('PLAY_ERROR', 'Cannot seek: Audio not loaded');
      return;
    }

    const seekPosition = Math.max(0, Math.min(position, 1)) * this.audio.duration;
    this.audio.currentTime = seekPosition;
    
    if (this.isDebugMode) {
      console.log(`[AudioHandlerService] Seeking to: ${seekPosition}s (${position * 100}%)`);
    }
  }

  // 【✓】 Get current state
  getCurrentState(): Observable<AudioHandlerState> {
    return this.audioStateSubject.asObservable().pipe(
      map(state => ({
        isPlaying: state.isPlaying,
        currentTrack: state.currentTrack ? state.currentTrack.title : null,
        volume: state.volume,
        progress: state.currentTime / (state.duration || 1),
        loading: state.isLoading
      }))
    );
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

  // 【✓】 Get current track
  getCurrentTrack(): string | null {
    return this.currentTrackSubject.value;
  }

  // 【✓】 Get current duration in seconds
  getDuration(): number {
    return this.audio?.duration || 0;
  }

  // 【✓】 Get current time in seconds
  getCurrentTime(): number {
    return this.audio?.currentTime || 0;
  }

  // 【✓】 Cleanup resources properly
  ngOnDestroy(): void {
    if (this.isDebugMode) {
      console.log('[AudioHandlerService] Destroying service');
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