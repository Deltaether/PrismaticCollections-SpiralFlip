import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Defines position and animation properties for square elements
 * Controls appearance and space-like movement of square symbols
 */
interface SquarePosition {
  x: number;
  y: number;
  scale: number;
  delay: number;
  opacity: number;
  moveX: number;
  moveY: number;
  rotationOffset: number;
  clockwise: boolean;
  size: number;
  speedMultiplier: number;
}

/**
 * Creates an animated background with space-like moving squares
 * Inspired by the Now Loading component's rune animation system and original triangles component
 * Features dual-layer design: outer squares (grey) and inner squares (white) with borders
 * Provides dynamic visual effects with random movement patterns
 */
@Component({
  selector: 'app-squares-animation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="squares-container" #squareContainer>
      <div
        *ngFor="let square of squares; trackBy: trackBySquareId"
        class="square"
        [class.clockwise]="square.clockwise"
        [class.counter-clockwise]="!square.clockwise"
        [style.left]="square.x + 'vw'"
        [style.top]="square.y + 'vh'"
        [style.--move-x]="square.moveX + 'px'"
        [style.--move-y]="square.moveY + 'px'"
        [style.--scale]="square.scale"
        [style.--base-opacity]="square.opacity"
        [style.--rotation-offset]="square.rotationOffset"
        [style.--delay]="square.delay"
        [style.--size]="square.size + 'px'"
        [style.--speed]="square.speedMultiplier"
      >
        <div class="square-outer"></div>
        <div class="square-inner"></div>
      </div>
    </div>
  `,
  styles: [`
    .squares-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 0;
      overflow: visible;
      will-change: transform;
      backface-visibility: hidden;
      perspective: 1000px;
    }

    .square {
      position: absolute;
      width: var(--size);
      height: var(--size);
      transform-origin: center center;
      transform: translate(0, 0) scale(var(--scale)) rotate(calc(var(--rotation-offset) * 1deg));
      opacity: var(--base-opacity);
      will-change: transform, opacity;
      animation: none;
    }

    .square.clockwise {
      animation: square-move-clockwise calc(8s / var(--speed)) infinite linear;
      animation-delay: calc(var(--delay) * -1s);
    }

    .square.counter-clockwise {
      animation: square-move-counterclockwise calc(8s / var(--speed)) infinite linear;
      animation-delay: calc(var(--delay) * -1s);
    }

    .square-outer {
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, 
        rgba(248, 249, 250, 0.85) 0%, 
        rgba(255, 255, 255, 0.95) 100%
      );
      border-radius: 2px;
      transform: translateZ(0);
      backface-visibility: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      z-index: 1;
      will-change: transform;
    }

    .square-inner {
      position: absolute;
      width: calc(100% - 6px);
      height: calc(100% - 6px);
      top: 3px;
      left: 3px;
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.95) 0%, 
        rgba(240, 240, 240, 0.98) 100%
      );
      border-radius: 1px;
      transform: translateZ(0);
      backface-visibility: hidden;
      box-shadow: 
        0 0 0 2px rgba(255, 255, 255, 0.8), 
        0 0 0 3px rgba(0, 0, 0, 0.6),
        inset 0 1px 2px rgba(0, 0, 0, 0.1);
      z-index: 2;
      will-change: transform;
      position: relative;
    }

    .square-inner::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.6));
      mix-blend-mode: screen;
      animation: sparkle calc(4s * var(--speed)) infinite linear;
      border-radius: 1px;
    }

    .square-inner::after {
      content: '';
      position: absolute;
      width: 140%;
      height: 140%;
      top: -20%;
      left: -20%;
      background: radial-gradient(circle at center,
        rgba(120, 200, 255, 0.15) 0%,
        rgba(70, 150, 255, 0.1) 30%,
        transparent 70%
      );
      mix-blend-mode: screen;
      opacity: 0.5;
      border-radius: 50%;
    }

    @keyframes square-move-clockwise {
      0% {
        transform: translate(0, 0) scale(var(--scale)) rotate(calc(var(--rotation-offset) * 1deg));
      }
      25% {
        transform: translate(var(--move-x), var(--move-y)) scale(var(--scale)) rotate(calc((90 + var(--rotation-offset)) * 1deg));
      }
      50% {
        transform: translate(0, var(--move-y)) scale(var(--scale)) rotate(calc((180 + var(--rotation-offset)) * 1deg));
      }
      75% {
        transform: translate(calc(var(--move-x) * -1), 0) scale(var(--scale)) rotate(calc((270 + var(--rotation-offset)) * 1deg));
      }
      100% {
        transform: translate(0, 0) scale(var(--scale)) rotate(calc((360 + var(--rotation-offset)) * 1deg));
      }
    }

    @keyframes square-move-counterclockwise {
      0% {
        transform: translate(0, 0) scale(var(--scale)) rotate(calc(var(--rotation-offset) * 1deg));
      }
      25% {
        transform: translate(var(--move-x), var(--move-y)) scale(var(--scale)) rotate(calc((var(--rotation-offset) - 90) * 1deg));
      }
      50% {
        transform: translate(0, var(--move-y)) scale(var(--scale)) rotate(calc((var(--rotation-offset) - 180) * 1deg));
      }
      75% {
        transform: translate(calc(var(--move-x) * -1), 0) scale(var(--scale)) rotate(calc((var(--rotation-offset) - 270) * 1deg));
      }
      100% {
        transform: translate(0, 0) scale(var(--scale)) rotate(calc((var(--rotation-offset) - 360) * 1deg));
      }
    }

    @keyframes sparkle {
      0%, 100% {
        opacity: 0.4;
        transform: scale(1);
      }
      50% {
        opacity: 0.8;
        transform: scale(1.1);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SquaresAnimationComponent implements OnInit, OnDestroy {
  @Input() count: number = 48; // Default count inspired by loading screen
  @Input() enabled: boolean = true; // Allow disabling animations

  squares: SquarePosition[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  /**
   * Initializes the squares animation component
   * Creates randomized square positions with varied animations
   */
  ngOnInit(): void {
    this.generateSquarePositions();
  }

  ngOnDestroy(): void {
    // Clean up if needed
  }

  trackBySquareId(index: number, square: SquarePosition): number {
    return index;
  }

  /**
   * Creates random positions and properties for square elements
   * Generates visually interesting squares with varied space-like behavior
   * Inspired by the Now Loading component's rune system
   */
  private generateSquarePositions(): void {
    this.squares = Array.from({ length: this.count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: 0.4 + Math.random() * 1.2,
      delay: Math.random() * 8,
      opacity: 0.2 + Math.random() * 0.4,
      moveX: 10 + Math.random() * 30,
      moveY: 10 + Math.random() * 30,
      rotationOffset: Math.random() * 360,
      clockwise: Math.random() < 0.5,
      size: 8 + Math.random() * 16, // Square size between 8px and 24px
      speedMultiplier: 0.5 + Math.random() * 1.5 // Varied animation speeds
    }));
  }

  // Public methods for external control
  public setSquareCount(count: number): void {
    this.count = count;
    this.generateSquarePositions();
    this.cdr.markForCheck();
  }

  public regenerateSquares(): void {
    this.generateSquarePositions();
    this.cdr.markForCheck();
  }
}