import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private currentTrackSubject = new BehaviorSubject<string>('');
  currentTrack$ = this.currentTrackSubject.asObservable();
  
  private audioFiles: string[] = [];
  private sectionTracks: { [key: string]: string } = {
    'introduction': 'An - Incident.mp3',
    'disc-1': 'Feryquitous - i can avoid it.mp3',
    'disc-2': 'An - Quantum Resonance.mp3',
    'pv': 'Feryquitous - Neural Network.mp3',
    'information': 'An × Feryquitous - Digital Entropy.mp3'
  };

  // UI sound paths
  private uiSounds: { [key: string]: string } = {
    'menu-click': 'assets/audio/ui/menu-click.mp3',
    'page-turn': 'assets/audio/ui/page-turn.mp3',
    'success': 'assets/audio/ui/success.mp3',
    'error': 'assets/audio/ui/error.mp3'
  };

  // Audio element for playing tracks
  private audioElement: HTMLAudioElement | null = null;

  constructor(private http: HttpClient) {
    this.loadAudioFiles();
    this.initAudioElement();
  }

  private async loadAudioFiles() {
    try {
      // In a real implementation, you might want to fetch this list from your server
      this.audioFiles = Object.values(this.sectionTracks).map(file => `assets/audio/${file}`);
      // Set initial track
      if (this.audioFiles.length > 0) {
        this.currentTrackSubject.next(this.audioFiles[0]);
      }
    } catch (error) {
      console.error('Error loading audio files:', error);
    }
  }

  private initAudioElement() {
    // Create audio element for playing music
    this.audioElement = new Audio();
    this.audioElement.volume = 0.7;
  }

  setTrackForSection(section: string) {
    const trackFile = this.sectionTracks[section];
    if (trackFile) {
      const trackPath = `assets/audio/${trackFile}`;
      this.currentTrackSubject.next(trackPath);
    } else {
      console.warn(`No track found for section: ${section}`);
    }
  }

  getCurrentTrack(): string {
    return this.currentTrackSubject.value;
  }

  getNextTrack(): string | null {
    const currentIndex = this.audioFiles.indexOf(this.currentTrackSubject.value);
    if (currentIndex < this.audioFiles.length - 1) {
      const nextTrack = this.audioFiles[currentIndex + 1];
      this.currentTrackSubject.next(nextTrack);
      return nextTrack;
    }
    return null;
  }

  getPreviousTrack(): string | null {
    const currentIndex = this.audioFiles.indexOf(this.currentTrackSubject.value);
    if (currentIndex > 0) {
      const previousTrack = this.audioFiles[currentIndex - 1];
      this.currentTrackSubject.next(previousTrack);
      return previousTrack;
    }
    return null;
  }

  getTrackList(): string[] {
    return this.audioFiles;
  }

  getCurrentIndex(): number {
    return this.audioFiles.indexOf(this.currentTrackSubject.value);
  }

  // New methods to fix TypeScript errors

  // 【✓】 Play UI sound effects for interactions
  playUISound(soundName: string): void {
    if (this.uiSounds[soundName]) {
      const sound = new Audio(this.uiSounds[soundName]);
      sound.volume = 0.5;
      sound.play().catch(error => console.warn('Error playing UI sound:', error));
    } else {
      console.warn(`UI sound not found: ${soundName}`);
    }
  }

  // 【✓】 Play a music track from source URL
  playTrack(src: string): void {
    if (!this.audioElement) return;
    
    // Update current track and start playing
    this.currentTrackSubject.next(src);
    this.audioElement.src = src;
    this.audioElement.play().catch(error => console.warn('Error playing track:', error));
  }

  // 【✓】 Pause the currently playing track
  pauseTrack(): void {
    if (this.audioElement && !this.audioElement.paused) {
      this.audioElement.pause();
    }
  }

  // 【✓】 Resume the paused track
  resumeTrack(): void {
    if (this.audioElement && this.audioElement.paused) {
      this.audioElement.play().catch(error => console.warn('Error resuming track:', error));
    }
  }
} 