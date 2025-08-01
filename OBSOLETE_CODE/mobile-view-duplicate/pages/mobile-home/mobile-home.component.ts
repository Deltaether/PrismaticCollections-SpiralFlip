import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AudioService } from '../../../../tools/music-player/audio.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// 【✓】 Define interfaces for type safety
interface FeaturedItem {
  readonly title: string;
  readonly subtitle: string;
  readonly image: string;
  readonly route: string;
  readonly description?: string;
}

@Component({
  selector: 'app-mobile-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <div class="hero-section">
        <h1 class="hero-title">Project Phantasia</h1>
        <p class="hero-subtitle">Discover the musical journey</p>
      </div>
      
      <div class="featured-grid">
        <div 
          *ngFor="let item of featuredItems" 
          class="featured-item"
          [style.background-image]="getSafeBackgroundImage(item.image)"
          (click)="navigateTo(item.route)">
          <div class="item-overlay"></div>
          <div class="item-content">
            <h2 class="item-title">{{ item.title }}</h2>
            <p class="item-subtitle">{{ item.subtitle }}</p>
            <p *ngIf="item.description" class="item-description">{{ item.description }}</p>
          </div>
        </div>
      </div>
      
      <div class="welcome-section">
        <h2 class="section-title">Welcome to Project Phantasia</h2>
        <p class="section-text">
          Explore our latest musical creations, learn about our project, 
          and connect with us through this immersive mobile experience.
        </p>
        <button class="explore-button" (click)="navigateTo('/mobile/music')">
          Explore Music
        </button>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      padding: 20px;
      color: #fff;
      display: flex;
      flex-direction: column;
      gap: 30px;
    }
    
    .hero-section {
      text-align: center;
      padding: 40px 0;
    }
    
    .hero-title {
      font-size: 36px;
      margin: 0 0 10px;
      font-weight: 700;
      background: linear-gradient(45deg, #5557f7, #9d55f7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 2px 10px rgba(85, 87, 247, 0.3);
    }
    
    .hero-subtitle {
      font-size: 18px;
      margin: 0;
      color: rgba(255, 255, 255, 0.8);
    }
    
    .featured-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }
    
    .featured-item {
      height: 180px;
      border-radius: 10px;
      overflow: hidden;
      position: relative;
      background-size: cover;
      background-position: center;
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    
    .featured-item:hover {
      transform: translateY(-5px);
    }
    
    .item-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7));
    }
    
    .item-content {
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 20px;
      width: 100%;
    }
    
    .item-title {
      font-size: 24px;
      margin: 0 0 5px;
      font-weight: 600;
    }
    
    .item-subtitle {
      font-size: 16px;
      margin: 0;
      opacity: 0.8;
    }
    
    .item-description {
      font-size: 14px;
      margin: 10px 0 0;
      opacity: 0.7;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .welcome-section {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      padding: 25px;
      margin-top: 10px;
    }
    
    .section-title {
      font-size: 22px;
      margin: 0 0 15px;
    }
    
    .section-text {
      font-size: 16px;
      line-height: 1.6;
      margin: 0 0 20px;
      color: rgba(255, 255, 255, 0.8);
    }
    
    .explore-button {
      background: #5557f7;
      color: white;
      border: none;
      padding: 12px 25px;
      border-radius: 5px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.3s;
    }
    
    .explore-button:hover {
      background: #4041c7;
    }
    
    /* Media query for larger screens */
    @media (min-width: 768px) {
      .featured-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .featured-item:first-child {
        grid-column: 1 / -1;
        height: 240px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush // 【✓】 Optimize change detection
})
export class MobileHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly isDebugMode = false; // Set to true only during development
  
  // 【✓】 Featured items with proper typing
  readonly featuredItems: readonly FeaturedItem[] = [
    {
      title: 'Phantasia',
      subtitle: 'Latest Album',
      image: 'assets/images/album-covers/phantasia-cover.jpg',
      route: '/mobile/music',
      description: 'Explore our latest album featuring unique soundscapes and melodies.'
    },
    {
      title: 'About',
      subtitle: 'The Project',
      image: 'assets/images/backgrounds/about-bg.jpg',
      route: '/mobile/about',
      description: 'Learn more about Project Phantasia and our creative vision.'
    },
    {
      title: 'Contact',
      subtitle: 'Get in Touch',
      image: 'assets/images/backgrounds/contact-bg.jpg',
      route: '/mobile/contact',
      description: 'Connect with us for collaborations, feedback, or questions.'
    }
  ];
  
  constructor(
    private readonly router: Router,
    private readonly audioService: AudioService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  // 【✓】 Initialize component
  ngOnInit(): void {
    if (this.isDebugMode) {
      console.log('[MobileHome] Initializing component');
    }
    
    // Preload images for smoother UX
    this.preloadImages();
  }
  
  // 【✓】 Preload featured images
  private preloadImages(): void {
    if (this.isDebugMode) {
      console.log('[MobileHome] Preloading images');
    }
    
    this.featuredItems.forEach(item => {
      const img = new Image();
      img.src = item.image;
    });
  }
  
  // 【✓】 Get safe background image URL
  getSafeBackgroundImage(imageUrl: string): string {
    return `url('${imageUrl}')`;
  }

  // 【✓】 Navigate to route
  navigateTo(route: string): void {
    if (this.isDebugMode) {
      console.log(`[MobileHome] Navigating to: ${route}`);
    }
    
    this.audioService.playUISound('menu-click');
    this.router.navigate([route]);
  }

  // 【✓】 Cleanup resources
  ngOnDestroy(): void {
    if (this.isDebugMode) {
      console.log('[MobileHome] Destroying component');
    }
    
    this.destroy$.next();
    this.destroy$.complete();
  }
} 