import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// 【✓】 Define interfaces for type safety
interface Video {
  readonly title: string;
  readonly director: string;
  readonly duration: string;
  readonly thumbnail?: string;
  readonly videoId?: string;
}

@Component({
  selector: 'app-pv',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pv.component.html',
  styleUrls: ['./pv.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // 【✓】 Optimize change detection
})
export class PvComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly isDebugMode = false;
  
  // 【✓】 Video list with proper typing
  readonly videos: readonly Video[] = [
    {
      title: 'Incident (Official Music Video)',
      director: 'Directed by Shiftpsh',
      duration: '5:23',
      videoId: 'incident-mv'
    },
    {
      title: 'i can avoid it (Visualizer)',
      director: 'Visual Art by 1341obire',
      duration: '6:45',
      videoId: 'avoid-it-vis'
    },
    {
      title: 'Making of Project Phantasia',
      director: 'Behind the Scenes Documentary',
      duration: '15:30',
      videoId: 'making-of'
    },
    {
      title: 'Project Phantasia (Album Trailer)',
      director: 'Official Album Preview',
      duration: '2:15',
      videoId: 'album-trailer'
    }
  ];
  
  // 【✓】 Track loading states
  isLoading = false;
  selectedVideo: Video | null = null;
  
  constructor(private readonly cdr: ChangeDetectorRef) {}
  
  // 【✓】 Initialize component
  ngOnInit(): void {
    if (this.isDebugMode) {
      console.log('[PvComponent] Initializing component');
    }
  }
  
  // 【✓】 Play video handler
  playVideo(video: Video): void {
    if (this.isDebugMode) {
      console.log(`[PvComponent] Playing video: ${video.title}`);
    }
    
    this.selectedVideo = video;
    this.isLoading = true;
    this.cdr.markForCheck();
    
    // Simulate video loading (would be replaced with actual video player logic)
    setTimeout(() => {
      this.isLoading = false;
      this.cdr.markForCheck();
    }, 1000);
  }
  
  // 【✓】 Cleanup resources
  ngOnDestroy(): void {
    if (this.isDebugMode) {
      console.log('[PvComponent] Destroying component');
    }
    
    this.destroy$.next();
    this.destroy$.complete();
  }
}
