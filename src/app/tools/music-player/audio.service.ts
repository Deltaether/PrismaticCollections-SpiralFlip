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

  constructor(private http: HttpClient) {
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
} 