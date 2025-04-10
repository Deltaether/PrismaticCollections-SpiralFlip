import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Displays a professional loading screen with progress indicator
 * Shows while the application assets are loading
 * 【✓】
 */
@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingScreenComponent {
  @Input() set progress(value: number) {
    this._progress = value;
    this.progressText = `${Math.floor(value)}%`;
    this.cdr.markForCheck();
  }
  
  get progress(): number {
    return this._progress;
  }
  
  private _progress = 0;
  progressText = '0%';
  loadingMessages = [
    'Initializing 3D environment...',
    'Preparing audio assets...',
    'Loading graphical elements...',
    'Configuring interactive components...',
    'Optimizing experience...'
  ];
  currentMessageIndex = 0;
  
  constructor(private cdr: ChangeDetectorRef) {
    this.startMessageCycle();
  }
  
  /**
   * Cycles through loading messages to create dynamic experience
   * 【✓】
   */
  private startMessageCycle(): void {
    setInterval(() => {
      this.currentMessageIndex = (this.currentMessageIndex + 1) % this.loadingMessages.length;
      this.cdr.markForCheck();
    }, 3000);
  }
} 