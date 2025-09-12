import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Defines position and animation properties for rune elements
 * Controls appearance and movement of magical rune symbols
 */
interface RunePosition {
  x: number;
  y: number;
  scale: number;
  delay: number;
  opacity: number;
  moveX: number;
  moveY: number;
  rotationOffset: number;
  clockwise: boolean;
}

/**
 * Creates an animated loading screen with magical effects
 * Displays during application loading and initialization
 * Provides visual feedback and sets atmosphere for the application
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
export class LoadingScreenComponent implements OnInit {
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
  runes: RunePosition[] = [];
  
  constructor(private cdr: ChangeDetectorRef) {}
  
  /**
   * Initializes the loading screen and generates rune positions
   * Creates randomized magical elements with varied animations
   * 【✓】
   */
  ngOnInit() {
    this.generateRunePositions();
  }

  /**
   * Creates random positions and properties for rune elements
   * Generates visually interesting magical symbols with varied behavior
   * 【✓】
   */
  private generateRunePositions() {
    const numRunes = 48;
    this.runes = Array.from({ length: numRunes }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: 0.6 + Math.random() * 1.4,
      delay: Math.random() * 8,
      opacity: 0.3 + Math.random() * 0.5,
      moveX: 15 + Math.random() * 20,
      moveY: 15 + Math.random() * 20,
      rotationOffset: Math.random() * 360,
      clockwise: Math.random() < 0.5
    }));
  }
} 