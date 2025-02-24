import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloaderService } from '../../services/preloader.service';

@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="preloader" [class.hidden]="isLoaded">
      <div class="loader-content">
        <div class="loader-title">Project Phantasia</div>
        <div class="loader-description">
          <p>Loading assets and preparing your experience...</p>
          <ul class="loading-status">
            <li [class.loaded]="progressValue >= 25">Initializing Components</li>
            <li [class.loaded]="progressValue >= 50">Loading 3D Models</li>
            <li [class.loaded]="progressValue >= 75">Preparing Audio</li>
            <li [class.loaded]="progressValue >= 100 && componentReady">Finalizing Setup</li>
          </ul>
        </div>
        <div class="loader-progress">
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="progressValue"></div>
          </div>
          <div class="progress-text">{{ progressValue.toFixed(0) }}%</div>
        </div>
        <div class="loader-spinner"></div>
      </div>
    </div>
  `,
  styles: [`
    .preloader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      transition: opacity 0.5s ease-out;
    }

    .preloader.hidden {
      opacity: 0;
      pointer-events: none;
    }

    .loader-content {
      text-align: center;
      max-width: 600px;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 15px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
    }

    .loader-title {
      color: #fff;
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 1.5rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .loader-description {
      color: #ccc;
      margin-bottom: 2rem;
      font-size: 1rem;
      line-height: 1.5;
    }

    .loading-status {
      list-style: none;
      padding: 0;
      margin: 1rem 0;
      text-align: left;
    }

    .loading-status li {
      color: #666;
      padding: 0.5rem 0;
      position: relative;
      padding-left: 1.5rem;
      transition: color 0.3s ease;
    }

    .loading-status li::before {
      content: '○';
      position: absolute;
      left: 0;
      transition: content 0.3s ease;
    }

    .loading-status li.loaded {
      color: #fff;
    }

    .loading-status li.loaded::before {
      content: '●';
      color: #4CAF50;
    }

    .loader-progress {
      margin: 2rem 0;
    }

    .progress-bar {
      width: 100%;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #4CAF50, #8BC34A);
      transition: width 0.3s ease-out;
    }

    .progress-text {
      color: #fff;
      font-size: 1rem;
      font-weight: bold;
    }

    .loader-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top: 3px solid #4CAF50;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 1rem auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .loader-content {
        width: 90%;
        padding: 1.5rem;
      }

      .loader-title {
        font-size: 2rem;
      }

      .loader-description {
        font-size: 0.9rem;
      }
    }
  `]
})
export class PreloaderComponent implements OnInit {
  @Input() progress: number | null = 0;
  isLoaded: boolean = false;
  componentReady: boolean = false;

  constructor(private preloaderService: PreloaderService) {}

  ngOnInit() {
    this.preloaderService.getLoadingComplete().subscribe(
      complete => this.isLoaded = complete
    );

    this.preloaderService.getComponentReady().subscribe(
      ready => this.componentReady = ready
    );
  }

  get progressValue(): number {
    return this.progress ?? 0;
  }
} 