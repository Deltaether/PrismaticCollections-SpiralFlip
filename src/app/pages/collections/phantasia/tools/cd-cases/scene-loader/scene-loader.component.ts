import { Component, Input, OnInit } from '@angular/core';
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
 * Displays during CD case model loading and initialization
 * Provides visual feedback and sets atmosphere for the application
 */
@Component({
  selector: 'app-scene-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-container" [class.visible]="isVisible || devMode">
      <div class="magical-circle outer"></div>
      <div class="magical-circle"></div>
      <div class="rune-effects"></div>
      <div class="decorative-elements">
        <div class="corner-line top-left"></div>
        <div class="corner-line top-right"></div>
        <div class="corner-line bottom-left"></div>
        <div class="corner-line bottom-right"></div>
        <div class="mid-line left"></div>
        <div class="mid-line right"></div>
        <div class="mid-line top"></div>
        <div class="mid-line bottom"></div>
      </div>
      <div class="light-beams">
        <div class="beam beam-1"></div>
        <div class="beam beam-2"></div>
        <div class="beam beam-3"></div>
        <div class="beam beam-4"></div>
      </div>
      <div class="rune-circle">
        <div class="rune" *ngFor="let rune of runes" 
             [class.clockwise]="rune.clockwise"
             [class.counter-clockwise]="!rune.clockwise"
             [style.left]="rune.x + 'vw'"
             [style.top]="rune.y + 'vh'"
             [style.--move-x]="rune.moveX + 'px'"
             [style.--move-y]="rune.moveY + 'px'"
             [style.--scale]="rune.scale"
             [style.--base-opacity]="rune.opacity"
             [style.--rotation-offset]="rune.rotationOffset"
             [style.--delay]="rune.delay">
        </div>
      </div>
      <div class="content">
        <div class="logo-container">
          <img src="/assets/graphic/prismcoll_logox_black_upright.svg" alt="Prismatic Collections" class="logo">
        </div>
        <div class="loading-text">Now Loading</div>
      </div>
    </div>
  `,
  styles: [`
    .loader-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.5s ease;
      z-index: 99999;
      isolation: isolate;
    }

    .loader-container.visible {
      opacity: 1;
      pointer-events: all;
    }

    .logo-container {
      position: relative;
      z-index: 10;
      margin-bottom: 30px;
    }

    .logo {
      width: 240px;
      height: auto;
      display: block;
      margin: 0 auto;
    }

    .magical-circle {
      position: absolute;
      width: 800px;
      height: 800px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      animation: rotate 20s linear infinite;
      
      &::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border: 2px solid transparent;
        border-top-color: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
      }

      &::after {
        content: '';
        position: absolute;
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -10px;
        border: 1px solid transparent;
        border-left-color: rgba(0, 0, 0, 0.15);
        border-radius: 50%;
      }

      &.outer {
        width: 1000px;
        height: 1000px;
        animation: rotate 30s linear infinite reverse;
        opacity: 0.5;
      }
    }

    .decorative-elements {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .corner-line {
      position: absolute;
      width: 150px;
      height: 150px;
      border: 2px solid rgba(0, 0, 0, 0.15);
      border-radius: 4px;

      &::before, &::after {
        content: '';
        position: absolute;
        background: linear-gradient(90deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
      }

      &.top-left {
        top: 50px;
        left: 50px;
        border-right: none;
        border-bottom: none;
        animation: pulse 3s infinite;
      }

      &.top-right {
        top: 50px;
        right: 50px;
        border-left: none;
        border-bottom: none;
        animation: pulse 3s infinite 0.75s;
      }

      &.bottom-left {
        bottom: 50px;
        left: 50px;
        border-right: none;
        border-top: none;
        animation: pulse 3s infinite 1.5s;
      }

      &.bottom-right {
        bottom: 50px;
        right: 50px;
        border-left: none;
        border-top: none;
        animation: pulse 3s infinite 2.25s;
      }
    }

    .mid-line {
      position: absolute;
      width: 100px;
      height: 100px;
      border: 2px solid rgba(0, 0, 0, 0.15);
      border-radius: 4px;
      animation: pulse 3s infinite;

      &.left {
        left: 50px;
        top: 50%;
        transform: translateY(-50%);
        border-right: none;
        animation-delay: 0.5s;
      }

      &.right {
        right: 50px;
        top: 50%;
        transform: translateY(-50%);
        border-left: none;
        animation-delay: 1s;
      }

      &.top {
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        border-bottom: none;
        animation-delay: 1.5s;
      }

      &.bottom {
        bottom: 50px;
        left: 50%;
        transform: translateX(-50%);
        border-top: none;
        animation-delay: 2s;
      }
    }

    .rune-circle {
      position: absolute;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      overflow: visible;
    }

    .rune {
      position: absolute;
      width: 18px;
      height: 18px;
      background: linear-gradient(135deg, 
        rgba(0, 0, 0, 0.4), 
        rgba(60, 60, 60, 0.3)
      );
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      transform-origin: center center;
      transform: translate(0, 0) scale(var(--scale)) rotate(calc(var(--rotation-offset) * 1deg));
      opacity: var(--base-opacity);
      will-change: transform;
      animation: none;

      &.clockwise {
        animation: rune-move-clockwise 8s infinite linear;
        animation-delay: calc(var(--delay) * -1s);
      }

      &.counter-clockwise {
        animation: rune-move-counterclockwise 8s infinite linear;
        animation-delay: calc(var(--delay) * -1s);
      }

      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.6));
        mix-blend-mode: screen;
        animation: sparkle 4s infinite linear;
      }

      &::after {
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
      }
    }

    .rune-effects {
      position: absolute;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      mix-blend-mode: multiply;
      background: radial-gradient(circle at center,
        transparent 0%,
        rgba(0, 0, 0, 0.02) 50%,
        transparent 100%
      );
      animation: effect-pulse 8s infinite ease-in-out;
    }

    .light-beams {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
      mix-blend-mode: multiply;
    }

    .beam {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(90deg, 
        rgba(0, 0, 0, 0.1),
        rgba(40, 40, 40, 0.15),
        rgba(0, 0, 0, 0.1)
      );
      mix-blend-mode: multiply;
      
      &.beam-1 {
        width: 600px;
        height: 2px;
        animation: beam-rotate 8s infinite linear,
                   beam-pulse 4s infinite ease-in-out;
      }

      &.beam-2 {
        width: 400px;
        height: 1px;
        animation: beam-rotate 12s infinite linear reverse,
                   beam-pulse 6s infinite ease-in-out 1s;
      }

      &.beam-3 {
        width: 300px;
        height: 1px;
        animation: beam-rotate 10s infinite linear,
                   beam-pulse 5s infinite ease-in-out 2s;
      }

      &.beam-4 {
        width: 200px;
        height: 1px;
        animation: beam-rotate 14s infinite linear reverse,
                   beam-pulse 7s infinite ease-in-out 3s;
      }
    }

    .content {
      position: relative;
      z-index: 2;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .loading-text {
      margin-top: 2rem;
      font-size: 1rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: rgba(0, 0, 0, 0.7);
      font-family: Arial, sans-serif;
      font-weight: 500;
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.2; }
      50% { opacity: 0.5; }
    }

    @keyframes rune-move-clockwise {
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

    @keyframes rune-move-counterclockwise {
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

    @keyframes beam-rotate {
      0% { transform: translate(-50%, -50%) rotate(0deg); }
      100% { transform: translate(-50%, -50%) rotate(360deg); }
    }

    @keyframes beam-pulse {
      0%, 100% { opacity: 0.2; width: 100%; }
      50% { opacity: 0.5; width: 120%; }
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

    @keyframes effect-pulse {
      0%, 100% {
        opacity: 0.3;
        transform: scale(1);
      }
      50% {
        opacity: 0.6;
        transform: scale(1.1);
      }
    }
  `]
})
export class SceneLoaderComponent implements OnInit {
  @Input() isVisible = true;
  @Input() devMode = false;
  runes: RunePosition[] = [];

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