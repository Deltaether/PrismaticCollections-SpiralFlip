import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Service for handling audio playback in the Phantasia project
 * Provides functionality for playing, pausing, and controlling tracks
 * 【✓】
 */
@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private readonly audioElement: HTMLAudioElement;
  private readonly tracksMap = new Map<string, string>();
  
  // BehaviorSubject to track the audio state
  private readonly audioStateSubject = new BehaviorSubject<AudioState>({
    isPlaying: false,
    currentTrack: null,
    currentTime: 0,
    duration: 0,
    volume: 0.5
  });
  
  // Observable that components can subscribe to
  readonly audioState$: Observable<AudioState> = this.audioStateSubject.asObservable();
  
  constructor() {
    // Create audio element
    this.audioElement = new Audio();
    
    // Initialize tracks map
    this.initializeTracksMap();
    
    // Set up event listeners
    this.setupEventListeners();
  }
  
  /**
   * Initialize tracks for each section
   * 【✓】
   */
  private initializeTracksMap(): void {
    // Map sections to track URLs
    this.tracksMap.set('introduction', 'assets/audio/intro.mp3');
    this.tracksMap.set('disc-1', 'assets/audio/disc1.mp3');
    this.tracksMap.set('disc-2', 'assets/audio/disc2.mp3');
    this.tracksMap.set('pv', 'assets/audio/pv.mp3');
    this.tracksMap.set('information', 'assets/audio/info.mp3');
  }
  
  /**
   * Set up audio element event listeners
   * 【✓】
   */
  private setupEventListeners(): void {
    // Update time
    this.audioElement.addEventListener('timeupdate', () => {
      this.updateAudioState({
        currentTime: this.audioElement.currentTime
      });
    });
    
    // Update duration when metadata loaded
    this.audioElement.addEventListener('loadedmetadata', () => {
      this.updateAudioState({
        duration: this.audioElement.duration
      });
    });
    
    // Handle end of track
    this.audioElement.addEventListener('ended', () => {
      this.updateAudioState({
        isPlaying: false,
        currentTime: 0
      });
      this.audioElement.currentTime = 0;
    });
    
    // Handle errors
    this.audioElement.addEventListener('error', (error) => {
      console.error('[AudioService] Error playing audio:', error);
      this.updateAudioState({
        isPlaying: false,
        currentTrack: null
      });
    });
  }
  
  /**
   * Update the audio state and notify subscribers
   * 【✓】
   */
  private updateAudioState(partialState: Partial<AudioState>): void {
    const currentState = this.audioStateSubject.getValue();
    const newState = { ...currentState, ...partialState };
    this.audioStateSubject.next(newState);
  }
  
  /**
   * Play a specific track
   * 【✓】
   */
  playTrack(trackId: string): void {
    const trackUrl = this.tracksMap.get(trackId);
    
    if (!trackUrl) {
      console.error(`[AudioService] Track not found: ${trackId}`);
      return;
    }
    
    // If different track, load new one
    if (this.audioStateSubject.getValue().currentTrack !== trackId) {
      this.audioElement.src = trackUrl;
      this.audioElement.load();
      
      this.updateAudioState({
        currentTrack: trackId,
        currentTime: 0
      });
    }
    
    // Play and update state
    this.audioElement.play()
      .then(() => {
        this.updateAudioState({ isPlaying: true });
      })
      .catch(error => {
        console.error('[AudioService] Error playing track:', error);
      });
  }
  
  /**
   * Pause the current track
   * 【✓】
   */
  pause(): void {
    this.audioElement.pause();
    this.updateAudioState({ isPlaying: false });
  }
  
  /**
   * Toggle play/pause
   * 【✓】
   */
  togglePlayPause(): void {
    const currentState = this.audioStateSubject.getValue();
    
    if (currentState.isPlaying) {
      this.pause();
    } else if (currentState.currentTrack) {
      this.playTrack(currentState.currentTrack);
    }
  }
  
  /**
   * Set volume (0-1)
   * 【✓】
   */
  setVolume(volume: number): void {
    const clampedVolume = Math.min(1, Math.max(0, volume));
    this.audioElement.volume = clampedVolume;
    this.updateAudioState({ volume: clampedVolume });
  }
  
  /**
   * Seek to a specific time
   * 【✓】
   */
  seekTo(time: number): void {
    if (this.audioElement.readyState > 0) {
      const clampedTime = Math.min(
        this.audioElement.duration, 
        Math.max(0, time)
      );
      
      this.audioElement.currentTime = clampedTime;
      this.updateAudioState({ currentTime: clampedTime });
    }
  }
  
  /**
   * Set track for a specific section
   * 【✓】
   */
  setTrackForSection(section: string): void {
    const currentState = this.audioStateSubject.getValue();
    const trackForSection = this.tracksMap.get(section);
    
    if (trackForSection && currentState.currentTrack !== section) {
      this.playTrack(section);
    }
  }
}

/**
 * Interface for audio state
 * 【✓】
 */
export interface AudioState {
  isPlaying: boolean;
  currentTrack: string | null;
  currentTime: number;
  duration: number;
  volume: number;
} 