import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Howl } from 'howler';
import { AudioService } from './audio.service';
import { Subject } from 'rxjs';
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
  imports: [CommonModule],
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
  volume = 0.1;
  error = '';
  currentSubtitle: string = '';

  constructor(
    private readonly audioService: AudioService,
    private readonly cdr: ChangeDetectorRef
  ) {}

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

  // 【✓】 Initialize audio player
  private initializeAudio(): void {
    this.audioService.currentTrack$
      .pipe(takeUntil(this.destroy$))
      .subscribe(track => {
        if (track) {
          // 【✓】 Convert string track to Track object
          const trackObj: Track = {
            title: this.getTrackName(track),
            artist: this.getArtistName(),
            url: track
          };
          this.loadTrack(trackObj);
        }
      });
  }

  // 【✓】 Load and play track
  private loadTrack(track: Track): void {
    this.isLoading = true;
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

  // 【✓】 Update volume
  setVolume(value: number): void {
    if (!this.audio) return;
    this.volume = value;
    this.audio.volume(value);
    this.cdr.markForCheck();
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

  // 【✓】 Update time
  private updateTime(): void {
    if (this.audio && this.isPlaying) {
      this.currentTime = this.audio.seek() as number;
      requestAnimationFrame(() => this.updateTime());
    }
  }

  // 【✓】 Next track
  nextTrack(): void {
    if (this.isLoading) return;
    const nextTrack = this.audioService.getNextTrack();
    if (nextTrack) {
      // 【✓】 Convert string track to Track object
      const trackObj: Track = {
        title: this.getTrackName(nextTrack),
        artist: this.getArtistName(),
        url: nextTrack
      };
      this.loadTrack(trackObj);
    }
  }

  // 【✓】 Previous track
  previousTrack(): void {
    if (this.isLoading) return;
    const prevTrack = this.audioService.getPreviousTrack();
    if (prevTrack) {
      // 【✓】 Convert string track to Track object
      const trackObj: Track = {
        title: this.getTrackName(prevTrack),
        artist: this.getArtistName(),
        url: prevTrack
      };
      this.loadTrack(trackObj);
    }
  }

  // 【✓】 Format time
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // 【✓】 Get track name
  getTrackName(track: string): string {
    const parts = track.split('/');
    const filename = parts[parts.length - 1].replace('.mp3', '');
    
    if (this.trackTitle) {
      return this.trackTitle;
    }
    
    const fileParts = filename.split(' - ');
    if (fileParts.length > 1) {
      return fileParts[1];
    }
    return filename;
  }
  
  // 【✓】 Get artist name
  getArtistName(): string {
    if (this.trackArtist) {
      return this.trackArtist;
    }
    
    if (this.currentTrack) {
      const filename = this.currentTrack.split('/').pop() || '';
      const parts = filename.replace('.mp3', '').split(' - ');
      if (parts.length > 1) {
        return parts[0];
      }
    }
    
    return this.currentSubtitle;
  }
} 