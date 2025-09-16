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
   * 【✓】 Updated for multi-project support (Phantasia 1 & 2)
   */
  private initializeTracksMap(): void {
    // Map sections to track URLs - Default to Phantasia 1 project
    this.tracksMap.set('introduction', 'assets/audio/Phantasia_1/01. SpiralFlip - Phantasia ft. Eili.ogg');
    this.tracksMap.set('disc-1', 'assets/audio/Phantasia_1/01. SpiralFlip - Phantasia ft. Eili.ogg');
    this.tracksMap.set('disc-2', 'assets/audio/Phantasia_1/01. SpiralFlip - Phantasia ft. Eili.ogg');
    this.tracksMap.set('pv', 'assets/audio/Phantasia_1/01. SpiralFlip - Phantasia ft. Eili.ogg');
    this.tracksMap.set('information', 'assets/audio/Phantasia_1/01. SpiralFlip - Phantasia ft. Eili.ogg');
    this.tracksMap.set('phantasia', 'assets/audio/Phantasia_1/01. SpiralFlip - Phantasia ft. Eili.ogg');

    // Add all 14 Phantasia 1 tracks by track number
    for (let i = 1; i <= 14; i++) {
      const trackFilenames: Record<number, string> = {
        1: '01. SpiralFlip - Phantasia ft. Eili.ogg',
        2: '02. Bigg Milk - First Steps.ogg',
        3: '03. Heem - Altar of the Sword.ogg',
        4: '04. futsuunohito - A Voyage on the Winds of Change.ogg',
        5: '05. Prower - Rohkeutta Etsiä.ogg',
        6: '06. AZALI & Seycara  - Ivory Flowers.ogg',
        7: '07. Qyubey - Outer Bygone Ruins.ogg',
        8: '08. Luscinia - Spiral Into the Abyss!.ogg',
        9: '09. Gardens & sleepy - Wandering Breeze.ogg',
        10: '10. はがね - Mystic Nebula.ogg',
        11: '11. LucaProject - Iris.ogg',
        12: '12. Mei Naganowa - Half-Asleep in the Middle of Bumfuck Nowhere.ogg',
        13: '13. satella - The Traveller.ogg',
        14: '14. dystopian tanuki - Childhood memories.ogg'
      };

      const filename = trackFilenames[i];
      if (filename) {
        this.tracksMap.set(i.toString(), `assets/audio/Phantasia_1/${filename}`);
        this.tracksMap.set(`track-${i}`, `assets/audio/Phantasia_1/${filename}`);
        this.tracksMap.set(`p1-${i}`, `assets/audio/Phantasia_1/${filename}`);
      }
    }

    // Add all 20 Phantasia 2 tracks by track number - CRITICAL FIX FOR 20 TRACK SUPPORT
    for (let i = 1; i <= 20; i++) {
      const phantasia2Filenames: Record<number, string> = {
        1: '1. SpiralFlip - Blinding Dawn feat. eili.ogg',
        2: '2. Ariatec - Hollow Crown.ogg',
        3: '3. MB -  暁の姫 feat. Iku Hoshifuri.ogg',
        4: '4. Azali & Aloysius - Lux Nova.ogg',
        5: '5. potatoTeto - Hall of Silent Echoes.ogg',
        6: '6. Artisan - Lirica.ogg',
        7: '7. Mei Naganowa - To Defy The Beankeeper.ogg',
        8: "8. Evin a'k - Trench.ogg",
        9: '9. BilliumMoto - Blooming in the Square.ogg',
        10: '10. Elliot Hsu - Skies in Abberation.ogg',
        11: '11. Yuzuki - song of the nymphs.ogg',
        12: '12. LucaProject - Light Guardian.ogg',
        13: '13. Koway - Enso Antumbra ft. 伍.ogg',
        14: '14. Nstryder - You_re In My Way.ogg',
        15: '15. MoAE. - Remember you.ogg',
        16: '16. dystopian tanuki - Hidden passage.ogg',
        17: '17. Heem - Last Dance feat. woojinee (detune version).ogg',
        18: '18. Bigg Milk - Second Guess.ogg',
        19: '19. Gardens & Sad Keyboard Guy - Fractured Light ft. eili.ogg',
        20: '20. Futsuunohito - Beyond the Veil of Light.ogg'
      };

      const filename = phantasia2Filenames[i];
      if (filename) {
        // Add Phantasia 2 track mappings
        this.tracksMap.set(`p2-${i}`, `assets/audio/Phantasia_2/${filename}`);
        this.tracksMap.set(`phantasia2-${i}`, `assets/audio/Phantasia_2/${filename}`);
      }
    }
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