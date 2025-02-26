import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scene-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-container" [class.visible]="isVisible">
      <div class="magical-circle outer"></div>
      <div class="magical-circle"></div>
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
        <div class="rune" *ngFor="let i of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]" 
             [style.--delay]="i * 0.2 + 's'"
             [style.--float-x]="(i % 3 ? 30 : -30) + 'px'"
             [style.--float-y]="(i % 2 ? 25 : -25) + 'px'"
             [style.--float-x-alt]="(i % 2 ? -20 : 20) + 'px'"
             [style.--float-y-alt]="(i % 3 ? -30 : 30) + 'px'"
             [style.--color-shift]="i * 11.25 + 'deg'"
             [style.--scale]="0.5 + (i % 5) * 0.2"
             [style.--base-opacity]="0.3 + (i % 3) * 0.2">
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
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
    }

    .rune {
      position: absolute;
      width: 15px;
      height: 15px;
      background: linear-gradient(135deg, 
        rgba(255, 190, 110, 0.8), 
        rgba(255, 160, 70, 0.6)
      );
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      animation: rune-float 12s infinite ease-in-out var(--delay),
                 rune-pulse 3s infinite ease-in-out calc(var(--delay) + 1s),
                 color-shift 6s infinite ease-in-out calc(var(--delay) + 2s);

      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.6));
        mix-blend-mode: screen;
      }

      @for $i from 1 through 32 {
        &:nth-child(#{$i}) {
          --x-pos: #{random(100)}vw;
          --y-pos: #{random(100)}vh;
          left: var(--x-pos);
          top: var(--y-pos);
          transform: scale(#{random(100) * 0.01 + 0.5});
          opacity: #{random(60) * 0.01 + 0.2};
        }
      }
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

    @keyframes rune-float {
      0% { transform: translate(0, 0) scale(var(--scale, 1)) rotate(0deg); }
      25% { transform: translate(var(--float-x), var(--float-y)) scale(calc(var(--scale, 1) * 1.2)) rotate(90deg); }
      50% { transform: translate(var(--float-x-alt), var(--float-y-alt)) scale(var(--scale, 1)) rotate(180deg); }
      75% { transform: translate(calc(var(--float-x) * -0.5), calc(var(--float-y) * -0.5)) scale(calc(var(--scale, 1) * 1.1)) rotate(270deg); }
      100% { transform: translate(0, 0) scale(var(--scale, 1)) rotate(360deg); }
    }

    @keyframes rune-pulse {
      0%, 100% { opacity: calc(var(--base-opacity, 0.4) * 0.7); filter: blur(0px); }
      50% { opacity: calc(var(--base-opacity, 0.4) * 1.3); filter: blur(1px); }
    }

    @keyframes beam-rotate {
      0% { transform: translate(-50%, -50%) rotate(0deg); }
      100% { transform: translate(-50%, -50%) rotate(360deg); }
    }

    @keyframes beam-pulse {
      0%, 100% { opacity: 0.2; width: 100%; }
      50% { opacity: 0.5; width: 120%; }
    }

    @keyframes color-shift {
      0%, 100% { filter: hue-rotate(0deg) brightness(1); }
      50% { filter: hue-rotate(var(--color-shift)) brightness(1.3); }
    }
  `]
})
export class SceneLoaderComponent {
  @Input() isVisible = true;
} 