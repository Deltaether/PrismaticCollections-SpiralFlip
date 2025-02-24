import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloaderService } from '../../services/preloader.service';

@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="preloader" [class.hidden]="isLoaded">
      <div class="loader-content">
        <div class="loader-spinner"></div>
        <div class="loader-text">Loading {{ progress.toFixed(0) }}%</div>
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
      background: #000;
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
    }

    .loader-spinner {
      width: 50px;
      height: 50px;
      border: 3px solid #333;
      border-top: 3px solid #fff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    .loader-text {
      color: #fff;
      font-size: 18px;
      font-family: Arial, sans-serif;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class PreloaderComponent implements OnInit {
  progress: number = 0;
  isLoaded: boolean = false;

  constructor(private preloaderService: PreloaderService) {}

  ngOnInit() {
    this.preloaderService.getLoadingProgress().subscribe(
      progress => this.progress = progress
    );

    this.preloaderService.getLoadingComplete().subscribe(
      complete => this.isLoaded = complete
    );
  }
} 