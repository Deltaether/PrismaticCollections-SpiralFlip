import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Howl } from 'howler';
import { AudioService } from './audio.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss']
})
export class MusicPlayerComponent implements OnInit, OnDestroy {
  @Input() trackTitle: string = '';
  @Input() trackArtist: string = '';
  @Input() activeTrack: any = null;
  
  private audio: Howl | null = null;
  private trackSubscription: Subscription | null = null;
  isPlaying = false;
  isLoading = true;
  currentTrack = '';
  currentTime = 0;
  duration = 0;
  volume = 0.1;
  error = '';
  currentSubtitle: string = ''; // For storing additional track information

  constructor(private audioService: AudioService) {}

  ngOnInit() {
    this.trackSubscription = this.audioService.currentTrack$.subscribe(track => {
      if (track && track !== this.currentTrack) {
        this.currentTrack = track;
        this.initializeAudio(track);
      }
    });
  }

  ngOnDestroy() {
    if (this.audio) {
      this.audio.unload();
    }
    if (this.trackSubscription) {
      this.trackSubscription.unsubscribe();
    }
  }

  private initializeAudio(track: string) {
    if (this.audio) {
      this.audio.unload();
    }

    this.isLoading = true;
    this.error = '';
    this.currentTime = 0;
    this.duration = 0;
    
    // Extract useful information from filename for subtitle if needed
    this.updateSubtitleFromFilename(track);

    this.audio = new Howl({
      src: [track],
      html5: true,
      preload: true,
      format: ['mp3'],
      volume: this.volume,
      onload: () => {
        console.log('Audio loaded successfully');
        this.isLoading = false;
        this.duration = this.audio?.duration() || 0;
        if (this.isPlaying) {
          this.audio?.play();
        }
      },
      onloaderror: (id, error) => {
        console.error('Error loading audio:', error);
        this.error = 'Error loading audio file';
        this.isLoading = false;
      },
      onplayerror: (id, error) => {
        console.error('Error playing audio:', error);
        this.error = 'Error playing audio file';
        if (this.audio) {
          this.audio.once('unlock', () => {
            this.audio?.play();
          });
        }
      },
      onplay: () => {
        this.isPlaying = true;
        this.updateTime();
      },
      onpause: () => {
        this.isPlaying = false;
      },
      onend: () => {
        this.isPlaying = false;
        this.nextTrack();
      },
      onstop: () => {
        this.isPlaying = false;
      }
    });
  }

  // Update subtitle based on filename if other inputs aren't provided
  private updateSubtitleFromFilename(track: string) {
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

  private updateTime() {
    if (this.audio && this.isPlaying) {
      this.currentTime = this.audio.seek() as number;
      requestAnimationFrame(() => this.updateTime());
    }
  }

  togglePlay() {
    if (!this.audio || this.isLoading) return;
    
    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
  }

  nextTrack() {
    if (this.isLoading) return;
    const nextTrack = this.audioService.getNextTrack();
    if (nextTrack) {
      this.initializeAudio(nextTrack);
    }
  }

  previousTrack() {
    if (this.isLoading) return;
    const prevTrack = this.audioService.getPreviousTrack();
    if (prevTrack) {
      this.initializeAudio(prevTrack);
    }
  }

  seek(time: number) {
    if (this.audio && !this.isLoading) {
      this.audio.seek(time);
    }
  }

  setVolume(value: number) {
    this.volume = value;
    if (this.audio) {
      this.audio.volume(value);
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getTrackName(track: string): string {
    const parts = track.split('/');
    const filename = parts[parts.length - 1].replace('.mp3', '');
    
    // If we have title and artist inputs, prefer those
    if (this.trackTitle) {
      return this.trackTitle;
    }
    
    // Otherwise extract from filename
    const fileParts = filename.split(' - ');
    if (fileParts.length > 1) {
      return fileParts[1]; // Return song title part
    }
    return filename;
  }
  
  getArtistName(): string {
    if (this.trackArtist) {
      return this.trackArtist;
    }
    
    if (this.currentTrack) {
      const filename = this.currentTrack.split('/').pop() || '';
      const parts = filename.replace('.mp3', '').split(' - ');
      if (parts.length > 1) {
        return parts[0]; // Artist is usually first
      }
    }
    
    return this.currentSubtitle;
  }
} 