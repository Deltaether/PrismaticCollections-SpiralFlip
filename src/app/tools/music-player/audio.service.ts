import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PreloaderService } from '../../services/preloader.service';

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

  private audioContext: AudioContext;
  private audioElements: Map<string, AudioBuffer> = new Map();
  private currentTrack: string | null = null;

  constructor(private http: HttpClient, private preloaderService: PreloaderService) {
    this.audioContext = new AudioContext();
    this.loadAudioFiles();
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

  initializeWithPreloadedAssets(): void {
    // Get the preloaded audio files from the preloader service
    const audioFiles = [
      'assets/audio/introduction.mp3',
      'assets/audio/disc-1.mp3',
      'assets/audio/disc-2.mp3',
      'assets/audio/pv.mp3',
      'assets/audio/information.mp3'
    ];

    audioFiles.forEach(url => {
      const audioBuffer = this.preloaderService.getAudio(url);
      if (audioBuffer) {
        this.audioElements.set(url, audioBuffer);
      }
    });
  }

  setTrackForSection(section: string): void {
    const trackMap: { [key: string]: string } = {
      'introduction': 'assets/audio/introduction.mp3',
      'disc-1': 'assets/audio/disc-1.mp3',
      'disc-2': 'assets/audio/disc-2.mp3',
      'pv': 'assets/audio/pv.mp3',
      'information': 'assets/audio/information.mp3'
    };

    const trackUrl = trackMap[section];
    if (trackUrl && trackUrl !== this.currentTrack) {
      this.currentTrack = trackUrl;
      this.playTrack(trackUrl);
    }
  }

  private async playTrack(url: string): Promise<void> {
    try {
      const audioBuffer = this.audioElements.get(url);
      if (!audioBuffer) {
        console.error('Audio buffer not found for:', url);
        return;
      }

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.start(0);
    } catch (error) {
      console.error('Error playing audio:', error);
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
} 