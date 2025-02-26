import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scene-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-container" [class.fade-out]="!isVisible">
      <div class="magical-circle"></div>
      <div class="magical-circle outer"></div>
      <div class="runes">
        <div class="rune" *ngFor="let i of [1,2,3,4,5,6,7,8]"></div>
      </div>
      <div class="loader-content">
        <div class="crystal-container">
          <div class="crystal-core">
            <div class="core-light"></div>
          </div>
          <div class="crystal-facets">
            <div class="facet"></div>
            <div class="facet"></div>
            <div class="facet"></div>
            <div class="facet"></div>
            <div class="facet"></div>
            <div class="facet"></div>
          </div>
          <div class="energy-rings">
            <div class="ring"></div>
            <div class="ring"></div>
            <div class="ring"></div>
          </div>
          <div class="particles">
            <div class="particle" *ngFor="let i of [1,2,3,4,5,6,7,8]"></div>
          </div>
          <div class="light-beams">
            <div class="beam"></div>
            <div class="beam"></div>
            <div class="beam"></div>
            <div class="beam"></div>
          </div>
        </div>
        <div class="title-container">
          <div class="title-line">
            <div class="line-ornament left"></div>
            <div class="line-glow"></div>
            <div class="line-ornament right"></div>
          </div>
          <h2 class="loader-title">
            <span class="title-top">Project</span>
            <span class="title-main">Phantasia</span>
          </h2>
          <div class="title-line">
            <div class="line-ornament left"></div>
            <div class="line-glow"></div>
            <div class="line-ornament right"></div>
          </div>
        </div>
        <div class="loader-status">
          <span class="status-text">Now Loading</span>
          <div class="loading-bar">
            <div class="bar-progress"></div>
            <div class="bar-glows">
              <div class="glow-point"></div>
              <div class="glow-point"></div>
              <div class="glow-point"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes rotate-reverse {
      0% { transform: rotate(360deg); }
      100% { transform: rotate(0deg); }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(2deg); }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.2); opacity: 1; }
    }

    @keyframes particle-float {
      0% { transform: translate(0, 0) scale(1); opacity: 1; }
      100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
    }

    @keyframes beam-rotate {
      0% { transform: rotate(0deg); opacity: 0.3; }
      50% { opacity: 0.7; }
      100% { transform: rotate(360deg); opacity: 0.3; }
    }

    @keyframes rune-float {
      0% { transform: translate(0, 0) scale(1) rotate(0deg); }
      25% { transform: translate(var(--float-x), var(--float-y)) scale(1.1) rotate(45deg); }
      50% { transform: translate(var(--float-x-alt), var(--float-y-alt)) scale(0.9) rotate(90deg); }
      75% { transform: translate(calc(var(--float-x) * -0.5), calc(var(--float-y) * -0.5)) scale(1.05) rotate(135deg); }
      100% { transform: translate(0, 0) scale(1) rotate(180deg); }
    }

    @keyframes rune-pulse {
      0%, 100% { opacity: 0.2; filter: brightness(1); }
      50% { opacity: 0.6; filter: brightness(1.5); }
    }

    @keyframes rune-fade {
      0%, 100% { opacity: 0.1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.1); }
    }

    @keyframes bar-progress {
      0% { width: 0; }
      50% { width: 70%; }
      100% { width: 100%; }
    }

    @keyframes glow-point {
      0% { transform: translateX(0); opacity: 0; }
      50% { opacity: 1; }
      100% { transform: translateX(300px); opacity: 0; }
    }

    .loader-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        linear-gradient(120deg, rgba(62, 35, 20, 0.95) 0%, rgba(45, 23, 12, 0.95) 100%),
        radial-gradient(circle at center, rgba(59, 77, 101, 0.4) 0%, rgba(31, 41, 55, 0.4) 100%),
        linear-gradient(180deg, rgba(139, 69, 19, 0.2) 0%, rgba(101, 67, 33, 0.2) 100%);
      background-blend-mode: overlay;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      opacity: 1;
      transition: opacity 0.5s ease, visibility 0.5s ease;
      overflow: hidden;
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: 
          url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="none" stroke="%23432" stroke-width="1" stroke-dasharray="2,2"/></svg>') center repeat,
          radial-gradient(circle at 30% 20%, rgba(255, 62, 62, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(62, 83, 104, 0.15) 0%, transparent 50%);
        background-size: 20px 20px, cover, cover;
        opacity: 0.5;
        mix-blend-mode: overlay;
      }
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, transparent 0%, rgba(20, 24, 32, 0.8) 100%);
        pointer-events: none;
      }
    }

    .magical-circle {
      position: absolute;
      width: 800px;
      height: 800px;
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="%23654321" stroke-width="0.5"/></svg>') center no-repeat,
                  url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="35" fill="none" stroke="%23654321" stroke-width="0.5"/></svg>') center no-repeat;
      background-size: contain;
      opacity: 0.4;
      animation: rotate 20s linear infinite;
      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, rgba(139, 69, 19, 0.2) 0%, transparent 70%);
        mix-blend-mode: overlay;
      }
    }

    .magical-circle.outer {
      width: 1000px;
      height: 1000px;
      opacity: 0.3;
      animation: rotate-reverse 30s linear infinite;
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="none" stroke="%23876543" stroke-width="0.3"/></svg>') center no-repeat;
      background-size: contain;
    }

    .runes {
      position: absolute;
      width: 600px;
      height: 600px;
    }

    .rune {
      position: absolute;
      width: 30px;
      height: 30px;
      background: linear-gradient(135deg, rgba(139, 69, 19, 0.4) 0%, rgba(205, 127, 50, 0.2) 100%);
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      --float-x: 20px;
      --float-y: -15px;
      --float-x-alt: -15px;
      --float-y-alt: 20px;
      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, transparent, rgba(255, 62, 62, 0.3));
        mix-blend-mode: overlay;
      }
    }

    .rune:nth-child(1) { 
      top: 0; 
      left: 50%; 
      transform: translateX(-50%); 
      animation: rune-float 8s ease-in-out infinite, rune-pulse 3s ease-in-out infinite;
      --float-x: 25px;
      --float-y: 15px;
      --float-x-alt: -20px;
      --float-y-alt: 25px;
    }
    .rune:nth-child(2) { 
      top: 50%; 
      right: 0; 
      transform: translateY(-50%); 
      animation: rune-float 8s ease-in-out infinite 0.5s, rune-pulse 3s ease-in-out infinite 0.2s;
      --float-x: -15px;
      --float-y: 20px;
      --float-x-alt: -25px;
      --float-y-alt: -15px;
    }
    .rune:nth-child(3) { 
      bottom: 0; 
      left: 50%; 
      transform: translateX(-50%); 
      animation: rune-float 8s ease-in-out infinite 1s, rune-pulse 3s ease-in-out infinite 0.4s;
      --float-x: -20px;
      --float-y: -25px;
      --float-x-alt: 15px;
      --float-y-alt: -20px;
    }
    .rune:nth-child(4) { 
      top: 50%; 
      left: 0; 
      transform: translateY(-50%); 
      animation: rune-float 8s ease-in-out infinite 1.5s, rune-pulse 3s ease-in-out infinite 0.6s;
      --float-x: 15px;
      --float-y: -20px;
      --float-x-alt: 25px;
      --float-y-alt: 15px;
    }
    .rune:nth-child(5) { 
      top: 15%; 
      right: 15%; 
      animation: rune-float 8s ease-in-out infinite 2s, rune-pulse 3s ease-in-out infinite 0.8s;
      --float-x: -25px;
      --float-y: -15px;
      --float-x-alt: 20px;
      --float-y-alt: -25px;
    }
    .rune:nth-child(6) { 
      bottom: 15%; 
      right: 15%; 
      animation: rune-float 8s ease-in-out infinite 2.5s, rune-pulse 3s ease-in-out infinite 1s;
      --float-x: -15px;
      --float-y: -25px;
      --float-x-alt: -20px;
      --float-y-alt: 15px;
    }
    .rune:nth-child(7) { 
      bottom: 15%; 
      left: 15%; 
      animation: rune-float 8s ease-in-out infinite 3s, rune-pulse 3s ease-in-out infinite 1.2s;
      --float-x: 20px;
      --float-y: -15px;
      --float-x-alt: -25px;
      --float-y-alt: -20px;
    }
    .rune:nth-child(8) { 
      top: 15%; 
      left: 15%; 
      animation: rune-float 8s ease-in-out infinite 3.5s, rune-pulse 3s ease-in-out infinite 1.4s;
      --float-x: 25px;
      --float-y: 20px;
      --float-x-alt: 15px;
      --float-y-alt: -25px;
    }

    .crystal-container {
      position: relative;
      width: 120px;
      height: 120px;
      animation: float 4s ease-in-out infinite;
    }

    .crystal-core {
      position: absolute;
      width: 60px;
      height: 60px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: radial-gradient(circle at center, rgba(205, 127, 50, 0.5) 0%, transparent 70%);
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, rgba(255, 62, 62, 0.3) 0%, transparent 70%);
        mix-blend-mode: screen;
      }
    }

    .core-light {
      position: absolute;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at center, #fff 0%, transparent 50%);
      opacity: 0.5;
      animation: pulse 2s ease-in-out infinite reverse;
    }

    .crystal-facets {
      position: absolute;
      width: 100%;
      height: 100%;
      animation: rotate 8s linear infinite;
    }

    .facet {
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(205, 127, 50, 0.2) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      transform-origin: center;
      backdrop-filter: blur(5px);
      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, transparent, rgba(255, 62, 62, 0.2));
        mix-blend-mode: overlay;
      }
    }

    .facet:nth-child(1) { transform: rotate(0deg); }
    .facet:nth-child(2) { transform: rotate(60deg); }
    .facet:nth-child(3) { transform: rotate(120deg); }
    .facet:nth-child(4) { transform: rotate(180deg); }
    .facet:nth-child(5) { transform: rotate(240deg); }
    .facet:nth-child(6) { transform: rotate(300deg); }

    .energy-rings {
      position: absolute;
      width: 100%;
      height: 100%;
      animation: rotate 4s linear infinite reverse;
    }

    .ring {
      position: absolute;
      border: 1px solid rgba(205, 127, 50, 0.3);
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(255, 62, 62, 0.2),
                  inset 0 0 15px rgba(139, 69, 19, 0.3);
    }

    .ring:nth-child(1) {
      width: 100%;
      height: 100%;
      animation: pulse 2s ease-in-out infinite;
    }

    .ring:nth-child(2) {
      width: 80%;
      height: 80%;
      top: 10%;
      left: 10%;
      animation: pulse 2s ease-in-out infinite 0.3s;
    }

    .ring:nth-child(3) {
      width: 60%;
      height: 60%;
      top: 20%;
      left: 20%;
      animation: pulse 2s ease-in-out infinite 0.6s;
    }

    .light-beams {
      position: absolute;
      width: 200%;
      height: 200%;
      top: -50%;
      left: -50%;
      animation: rotate 10s linear infinite;
    }

    .beam {
      position: absolute;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(255, 62, 62, 0.5), transparent);
      transform-origin: center;
    }

    .beam:nth-child(1) { transform: rotate(0deg); }
    .beam:nth-child(2) { transform: rotate(45deg); }
    .beam:nth-child(3) { transform: rotate(90deg); }
    .beam:nth-child(4) { transform: rotate(135deg); }

    .title-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .title-line {
      position: relative;
      width: 300px;
      height: 2px;
      background: rgba(255, 62, 62, 0.3);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .line-ornament {
      width: 10px;
      height: 10px;
      background: #ff3e3e;
      transform: rotate(45deg);
    }

    .line-glow {
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 62, 62, 0.8), transparent);
      animation: pulse 2s ease-in-out infinite;
    }

    .loader-title {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
      font-family: 'Cinzel', serif;
      text-transform: uppercase;
      letter-spacing: 0.5rem;
    }

    .title-top {
      color: rgba(255, 255, 255, 0.8);
      font-size: 1rem;
      font-weight: 400;
    }

    .title-main {
      color: #ff3e3e;
      font-size: 2.5rem;
      font-weight: 600;
      text-shadow: 0 0 20px rgba(255, 62, 62, 0.5),
                   0 0 40px rgba(255, 62, 62, 0.3);
    }

    .loader-status {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      font-family: 'Cinzel', serif;
    }

    .status-text {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
      letter-spacing: 0.2rem;
    }

    .loading-bar {
      position: relative;
      width: 300px;
      height: 2px;
      background: rgba(255, 255, 255, 0.1);
      overflow: hidden;
    }

    .bar-progress {
      height: 100%;
      background: linear-gradient(90deg, transparent, #ff3e3e, transparent);
      animation: bar-progress 3s ease-in-out infinite;
    }

    .bar-glows {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .glow-point {
      position: absolute;
      width: 20px;
      height: 100%;
      background: radial-gradient(circle at center, rgba(255, 255, 255, 0.8), transparent);
    }

    .glow-point:nth-child(1) { animation: glow-point 3s ease-out infinite; }
    .glow-point:nth-child(2) { animation: glow-point 3s ease-out infinite 1s; }
    .glow-point:nth-child(3) { animation: glow-point 3s ease-out infinite 2s; }

    .loader-container.fade-out {
      opacity: 0;
      visibility: hidden;
    }
  `]
})
export class SceneLoaderComponent {
  @Input() isVisible = true;
} 