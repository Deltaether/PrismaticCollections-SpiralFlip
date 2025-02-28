import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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
        <div class="title-line"></div>
        <h1>
          <span class="title-top">Project</span>
          <span class="title-main">Phantasia</span>
        </h1>
        <div class="title-line"></div>
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
      background: radial-gradient(circle at center, 
        rgb(142, 45, 45) 0%, 
        rgb(85, 25, 25) 100%
      );
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.5s ease;
      z-index: 9999;
    }

    .loader-container.visible {
      opacity: 1;
      pointer-events: all;
    }

    .magical-circle {
      position: absolute;
      width: 800px;
      height: 800px;
      border: 1px solid rgba(255, 255, 255, 0.1);
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
        border-top-color: rgba(255, 180, 90, 0.4);
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
        border-left-color: rgba(255, 170, 70, 0.3);
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
      border: 2px solid rgba(255, 170, 90, 0.3);
      border-radius: 4px;

      &::before, &::after {
        content: '';
        position: absolute;
        background: linear-gradient(90deg, rgba(255, 180, 90, 0.2), rgba(255, 200, 120, 0.4));
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
      border: 2px solid rgba(255, 160, 80, 0.3);
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
        rgba(255, 190, 110, 0.8), 
        rgba(255, 160, 70, 0.6)
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
      mix-blend-mode: screen;
      background: radial-gradient(circle at center,
        transparent 0%,
        rgba(60, 120, 255, 0.03) 50%,
        transparent 100%
      );
      animation: effect-pulse 8s infinite ease-in-out;
    }

    .light-beams {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
      mix-blend-mode: screen;
    }

    .beam {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(90deg, 
        rgba(255, 170, 90, 0.2),
        rgba(255, 160, 70, 0.3),
        rgba(255, 190, 110, 0.2)
      );
      mix-blend-mode: screen;
      
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
      color: rgba(255, 255, 255, 0.9);
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      font-family: 'Cinzel', serif;
    }

    .title-line {
      width: 300px;
      height: 1px;
      margin: 20px auto;
      background: linear-gradient(90deg,
        transparent,
        rgba(255, 190, 110, 0.7),
        transparent
      );
      position: relative;

      &::before {
        content: '';
        position: absolute;
        width: 6px;
        height: 6px;
        background: rgba(255, 190, 110, 0.9);
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
      }
    }

    h1 {
      margin: 0;
      line-height: 1.4;
    }

    .title-top {
      display: block;
      font-size: 1.2rem;
      font-weight: 400;
      letter-spacing: 0.3em;
      color: rgba(255, 230, 190, 0.95);
      text-shadow: 0 2px 10px rgba(180, 100, 50, 0.7);
    }

    .title-main {
      display: block;
      font-size: 3rem;
      font-weight: 600;
      letter-spacing: 0.2em;
      color: rgba(255, 200, 120, 1);
      text-shadow: 0 0 20px rgba(220, 140, 60, 0.8),
                   0 0 40px rgba(255, 170, 70, 0.6);
    }

    .loading-text {
      margin-top: 2rem;
      font-size: 1rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      opacity: 0.85;
      color: rgba(255, 210, 150, 0.9);
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

  ngOnInit() {
    this.generateRunePositions();
  }

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