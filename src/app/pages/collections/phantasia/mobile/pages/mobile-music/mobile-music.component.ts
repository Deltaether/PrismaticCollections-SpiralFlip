import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../../services/music-player/audio.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Track {
  readonly id: number;
  readonly title: string;
  readonly duration: string;
  readonly audioSrc: string;
}

interface AlbumInfo {
  readonly title: string;
  readonly artist: string;
  readonly coverSrc: string;
  readonly releaseYear: string;
}

interface PlayerState {
  readonly currentTrack: Track | null;
  readonly isPlaying: boolean;
  readonly progress: number;
}

@Component({
  selector: 'app-mobile-music',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="music-player-container">
      <!-- Album Info Section -->
      <div class="album-info">
        <div class="album-cover">
          <img [src]="albumInfo.coverSrc" [alt]="albumInfo.title" class="cover-image">
        </div>
        <div class="album-details">
          <h1 class="album-title">{{ albumInfo.title }}</h1>
          <h2 class="album-artist">{{ albumInfo.artist }}</h2>
          <p class="album-year">{{ albumInfo.releaseYear }}</p>
        </div>
      </div>
      
      <!-- Tracks List Section -->
      <div class="tracks-list">
        <h3 class="tracks-heading">Tracks</h3>
        
        <div class="track-item" 
             *ngFor="let track of tracks" 
             [class.active]="playerState.currentTrack?.id === track.id"
             (click)="togglePlayPause(track)">
          <div class="track-number">{{ track.id }}</div>
          <div class="track-info">
            <div class="track-title">{{ track.title }}</div>
            <div class="track-duration">{{ track.duration }}</div>
          </div>
          <div class="track-controls">
            <button class="play-button" 
                    [class.playing]="playerState.isPlaying && playerState.currentTrack?.id === track.id">
              <i class="icon" 
                 [class.play]="!(playerState.isPlaying && playerState.currentTrack?.id === track.id)" 
                 [class.pause]="playerState.isPlaying && playerState.currentTrack?.id === track.id"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Progress indicator (only visible for current track) -->
      <div class="progress-container" *ngIf="playerState.currentTrack">
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="playerState.progress"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .music-player-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: linear-gradient(to bottom, #121212, #000000);
      color: #fff;
      padding: 20px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    
    .album-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 30px;
    }
    
    .album-cover {
      width: 200px;
      height: 200px;
      margin-bottom: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      overflow: hidden;
    }
    
    .cover-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .album-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 5px;
    }
    
    .album-artist {
      font-size: 18px;
      font-weight: 400;
      color: #aaa;
      margin: 0 0 5px;
    }
    
    .album-year {
      font-size: 14px;
      color: #888;
      margin: 0;
    }
    
    .tracks-heading {
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .tracks-list {
      flex: 1;
    }
    
    .track-item {
      display: flex;
      align-items: center;
      padding: 15px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .track-item:hover, .track-item.active {
      background-color: rgba(255, 255, 255, 0.05);
    }
    
    .track-number {
      flex: 0 0 40px;
      font-size: 16px;
      text-align: center;
      color: #888;
    }
    
    .track-info {
      flex: 1;
      margin-right: 15px;
    }
    
    .track-title {
      font-size: 16px;
      margin-bottom: 5px;
    }
    
    .track-duration {
      font-size: 14px;
      color: #888;
    }
    
    .track-controls {
      flex: 0 0 40px;
    }
    
    .play-button {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.2s, background-color 0.2s;
    }
    
    .play-button:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }
    
    .play-button.playing {
      background: #1DB954;
    }
    
    .icon {
      display: inline-block;
      width: 0;
      height: 0;
      position: relative;
    }
    
    .icon.play {
      border-style: solid;
      border-width: 8px 0 8px 12px;
      border-color: transparent transparent transparent #fff;
      margin-left: 3px;
    }
    
    .icon.pause {
      width: 12px;
      height: 14px;
      border-style: solid;
      border-width: 0 4px;
      border-color: transparent #fff;
    }
    
    .progress-container {
      margin-top: 20px;
      padding: 0 10px;
    }
    
    .progress-bar {
      width: 100%;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      overflow: hidden;
    }
    
    .progress-fill {
      height: 100%;
      background: #1DB954;
      transition: width 0.2s;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileMusicComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly isDebugMode = false;
  
  readonly albumInfo: AlbumInfo = {
    title: 'Phantasia',
    artist: 'Project Phantasia',
    coverSrc: 'assets/images/album-covers/phantasia-cover.jpg',
    releaseYear: '2023'
  };
  
  playerState: PlayerState = {
    currentTrack: null,
    isPlaying: false,
    progress: 0
  };
  
  readonly tracks: readonly Track[] = [
    { id: 1, title: 'Intro - Digital Dawn', duration: '1:30', audioSrc: 'assets/audio/tracks/intro.mp3' },
    { id: 2, title: 'Neon Dreams', duration: '3:45', audioSrc: 'assets/audio/tracks/neon-dreams.mp3' },
    { id: 3, title: 'Cyber Pulse', duration: '4:12', audioSrc: 'assets/audio/tracks/cyber-pulse.mp3' },
    { id: 4, title: 'Quantum Echoes', duration: '5:20', audioSrc: 'assets/audio/tracks/quantum-echoes.mp3' },
    { id: 5, title: 'Virtual Horizon', duration: '3:58', audioSrc: 'assets/audio/tracks/virtual-horizon.mp3' },
    { id: 6, title: 'Holographic Memories', duration: '4:30', audioSrc: 'assets/audio/tracks/holographic-memories.mp3' },
    { id: 7, title: 'Synth Cascade', duration: '3:15', audioSrc: 'assets/audio/tracks/synth-cascade.mp3' },
    { id: 8, title: 'Outro - Digital Sunset', duration: '2:10', audioSrc: 'assets/audio/tracks/outro.mp3' }
  ];
  
  constructor(
    private readonly audioService: AudioService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.isDebugMode) {
      console.log('[MobileMusicComponent] Initializing component');
    }
    
    this.setupAudioServiceSubscriptions();
  }
  
  private setupAudioServiceSubscriptions(): void {
    this.audioService.currentTrack$
      .pipe(takeUntil(this.destroy$))
      .subscribe((trackUrl: string) => {
        if (this.isDebugMode) {
          console.log(`[MobileMusicComponent] Track changed: ${trackUrl}`);
        }
        
        const foundTrack = this.tracks.find(t => t.audioSrc === trackUrl);
        
        this.playerState = {
          ...this.playerState,
          currentTrack: foundTrack || null
        };
        this.cdr.markForCheck();
      });
    
    this.audioService.getCurrentState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        if (this.isDebugMode) {
          console.log(`[MobileMusicComponent] Audio state updated:`, state);
        }
        
        this.playerState = {
          ...this.playerState,
          isPlaying: state.isPlaying,
          progress: state.progress
        };
        this.cdr.markForCheck();
      });
  }
  
  togglePlayPause(track: Track): void {
    const isCurrentTrack = this.playerState.currentTrack?.id === track.id;
    
    if (this.isDebugMode) {
      console.log(`[MobileMusicComponent] Toggle play/pause for track ${track.id}. Current track: ${isCurrentTrack}`);
    }
    
    if (isCurrentTrack) {
      this.audioService.togglePlay();
    } else {
      this.audioService.playTrack(track.audioSrc);
    }
  }
  
  ngOnDestroy(): void {
    if (this.isDebugMode) {
      console.log('[MobileMusicComponent] Destroying component');
    }
    
    this.destroy$.next();
    this.destroy$.complete();
  }
} 