import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../../../tools/music-player/audio.service';

interface Track {
  id: number;
  title: string;
  duration: string;
  audioSrc: string;
}

@Component({
  selector: 'app-mobile-music',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-music.component.html',
  styleUrls: ['./mobile-music.component.scss']
})
export class MobileMusicComponent implements OnInit {
  albumTitle = 'Phantasia';
  albumArtist = 'Project Phantasia';
  albumCover = 'assets/images/album-covers/phantasia-cover.jpg';
  releaseYear = '2023';
  
  currentTrack: Track | null = null;
  isPlaying = false;
  
  tracks: Track[] = [
    { id: 1, title: 'Intro - Digital Dawn', duration: '1:30', audioSrc: 'assets/audio/tracks/intro.mp3' },
    { id: 2, title: 'Neon Dreams', duration: '3:45', audioSrc: 'assets/audio/tracks/neon-dreams.mp3' },
    { id: 3, title: 'Cyber Pulse', duration: '4:12', audioSrc: 'assets/audio/tracks/cyber-pulse.mp3' },
    { id: 4, title: 'Quantum Echoes', duration: '5:20', audioSrc: 'assets/audio/tracks/quantum-echoes.mp3' },
    { id: 5, title: 'Virtual Horizon', duration: '3:58', audioSrc: 'assets/audio/tracks/virtual-horizon.mp3' },
    { id: 6, title: 'Holographic Memories', duration: '4:30', audioSrc: 'assets/audio/tracks/holographic-memories.mp3' },
    { id: 7, title: 'Synth Cascade', duration: '3:15', audioSrc: 'assets/audio/tracks/synth-cascade.mp3' },
    { id: 8, title: 'Outro - Digital Sunset', duration: '2:10', audioSrc: 'assets/audio/tracks/outro.mp3' }
  ];
  
  constructor(private audioService: AudioService) {}

  ngOnInit(): void {
    // Initialize component (✓)
  }
  
  playTrack(track: Track): void {
    // Play the selected track (✓)
    this.currentTrack = track;
    this.isPlaying = true;
    this.audioService.playTrack(track.audioSrc);
  }
  
  pauseTrack(): void {
    // Pause the current track (✓)
    this.isPlaying = false;
    this.audioService.pauseTrack();
  }
  
  resumeTrack(): void {
    // Resume the current track (✓)
    if (!this.isPlaying && this.currentTrack) {
      this.isPlaying = true;
      this.audioService.resumeTrack();
    }
  }
  
  togglePlayPause(track: Track): void {
    // Toggle play/pause for the selected track (✓)
    this.audioService.playUISound('menu-click');
    
    if (this.currentTrack?.id === track.id) {
      if (this.isPlaying) {
        this.pauseTrack();
      } else {
        this.resumeTrack();
      }
    } else {
      this.playTrack(track);
    }
  }
} 