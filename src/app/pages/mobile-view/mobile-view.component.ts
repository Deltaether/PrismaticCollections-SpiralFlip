import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MobileNavbarComponent } from './components/mobile-navbar/mobile-navbar.component';
import { CubicContainerComponent } from './components/cubic-container/cubic-container.component';
import { RightSideMenuComponent } from '../../tools/right-side-menu/right-side-menu.component';
import { AudioService } from '../../tools/music-player/audio.service';
import { MobileNavigationService } from './services/mobile-navigation.service';

@Component({
  selector: 'app-mobile-view',
  standalone: true,
  imports: [
    CommonModule,
    MobileNavbarComponent,
    CubicContainerComponent,
    RightSideMenuComponent
  ],
  templateUrl: './mobile-view.component.html',
  styleUrls: ['./mobile-view.component.scss']
})
export class MobileViewComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('backgroundCanvas') private backgroundCanvasRef!: ElementRef<HTMLCanvasElement>;
  
  activeCaseIndex: number | null = null;
  cdCases: any[] = [];
  
  // Album cover information
  albumInfo = {
    title: 'PHANTASIA',
    artist: 'PROJECT PHANTASIA',
    coverImage: 'assets/images/album-covers/phantasia-cover.jpg'
  };
  
  // Canvas animation properties
  private animationFrameId: number | null = null;
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private lastTime = 0;
  
  // Component state
  public isComponentVisible = true; // For debugging visibility issues
  
  // Colors for the background
  private colors = {
    background: '#7a3d1d', // Deep orange
    particles: ['#fcaa55', '#ffcc66', '#e87d38', '#ff8c35', '#ffb347', '#ffd280'],
    gradient: {
      top: 'rgba(122, 61, 29, 1)',      // Dark orange
      bottom: 'rgba(232, 125, 56, 0.8)' // Medium orange with transparency
    }
  };

  constructor(
    private audioService: AudioService,
    private router: Router,
    private ngZone: NgZone,
    private navigationService: MobileNavigationService
  ) { }

  ngOnInit(): void {
    // Set up any initial state
    this.checkScreenSize();
    
    // Initialize navigation
    this.navigationService.navigateToPage(0);
    
    // Set up window resize listener
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngAfterViewInit(): void {
    // Initialize the canvas background after view init
    setTimeout(() => {
      this.initCanvas();
      this.animate();
    });
  }

  ngOnDestroy(): void {
    // Clean up resources when component is destroyed
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    // Remove event listeners
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeCanvas();
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    // Check if we should redirect to desktop view
    const height = window.innerHeight;
    const width = window.innerWidth;
    
    // If screen is larger than our mobile threshold, navigate to desktop view
    if (height >= 800 && width >= 1600) {
      this.router.navigate(['/']);
    }
  }

  onTrackSelected(index: number): void {
    this.activeCaseIndex = index;
    this.audioService.setTrackForSection(`track-${index}`);
  }

  private initCanvas(): void {
    const canvas = this.backgroundCanvasRef?.nativeElement;
    if (!canvas) return;
    
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
    this.initParticles();
  }

  private resizeCanvas(): void {
    const canvas = this.backgroundCanvasRef?.nativeElement;
    if (!canvas || !this.ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Reinitialize particles on resize
    this.initParticles();
  }

  private initParticles(): void {
    const canvas = this.backgroundCanvasRef?.nativeElement;
    if (!canvas) return;
    
    this.particles = [];
    const particleCount = Math.min(50, Math.floor(canvas.width * canvas.height / 15000));
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        color: this.getRandomColor(),
        opacity: Math.random() * 0.5 + 0.3
      });
    }
  }

  private getRandomColor(): string {
    // Updated colors with more brown and orange tones
    const colors = ['#e29c50', '#d4a76a', '#cc8033', '#b36a27', '#8c5319', '#f0c28f'];
    const colorIndex = Math.floor(Math.random() * colors.length);
    const baseColor = colors[colorIndex];
    
    // Return with random opacity
    const opacity = Math.random() * 0.7 + 0.3;
    return baseColor;
  }

  private animate(timestamp = 0): void {
    // Calculate delta time for smooth animation regardless of frame rate
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;
    
    if (!this.ctx || !this.isComponentVisible) return;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    
    // Draw the background
    this.drawBackgroundGradient();
    
    // Draw animated elements
    this.drawWaves(timestamp);
    this.drawParticles(deltaTime);
    this.drawLightRays(timestamp);
    
    // Add film grain effect
    this.addFilmGrainEffect();
    
    // Request next frame
    this.ngZone.runOutsideAngular(() => {
      this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    });
  }

  private drawBackgroundGradient(): void {
    if (!this.ctx) return;
    
    const canvas = this.ctx.canvas;
    const gradient = this.ctx.createLinearGradient(0, 0, 0, canvas.height);
    
    gradient.addColorStop(0, this.colors.gradient.top);
    gradient.addColorStop(0.5, 'rgba(186, 92, 42, 0.9)'); // Add middle gradient stop
    gradient.addColorStop(1, this.colors.gradient.bottom);
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  private drawWaves(timestamp: number): void {
    if (!this.ctx) return;
    
    const canvas = this.ctx.canvas;
    const time = timestamp * 0.001; // Convert to seconds
    
    // Create several waves with different properties
    for (let i = 0; i < 3; i++) {
      const yOffset = canvas.height * (0.7 + i * 0.1);
      const amplitude = 10 + i * 5;
      const frequency = 0.01 - i * 0.002;
      const speed = 0.5 + i * 0.2;
      
      this.ctx.beginPath();
      this.ctx.moveTo(0, yOffset);
      
      for (let x = 0; x < canvas.width; x += 10) {
        const y = yOffset + Math.sin(x * frequency + time * speed) * amplitude;
        this.ctx.lineTo(x, y);
      }
      
      this.ctx.lineTo(canvas.width, canvas.height);
      this.ctx.lineTo(0, canvas.height);
      this.ctx.closePath();
      
      const alpha = 0.05 - i * 0.015;
      this.ctx.fillStyle = `rgba(252, 170, 85, ${alpha})`;
      this.ctx.fill();
    }
  }

  private drawParticles(deltaTime: number): void {
    if (!this.ctx) return;
    
    const canvas = this.ctx.canvas;
    
    // Update and draw particles
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.speedX * deltaTime * 0.05;
      particle.y += particle.speedY * deltaTime * 0.05;
      
      // Wrap around the edges
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;
      
      // Draw the particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
      this.ctx.fill();
    });
  }

  private drawLightRays(timestamp: number): void {
    if (!this.ctx) return;
    
    const canvas = this.ctx.canvas;
    const time = timestamp * 0.0002; // Slower time scale
    
    // Draw light rays emanating from the top
    const rayCount = 5;
    const rayWidth = canvas.width / rayCount;
    
    for (let i = 0; i < rayCount; i++) {
      const x = i * rayWidth + rayWidth / 2;
      const startY = 0;
      const endY = canvas.height;
      
      // Set up gradient for the ray
      const gradient = this.ctx.createLinearGradient(x, startY, x, endY);
      gradient.addColorStop(0, `rgba(252, 170, 85, ${0.18 + Math.sin(time + i) * 0.1})`); // Brighter orange
      gradient.addColorStop(1, 'rgba(252, 170, 85, 0)');
      
      this.ctx.beginPath();
      this.ctx.moveTo(x, startY);
      this.ctx.lineTo(x, endY);
      this.ctx.lineWidth = 140 + Math.sin(time + i * 0.5) * 70; // Wider rays
      this.ctx.strokeStyle = gradient;
      this.ctx.globalCompositeOperation = 'lighter';
      this.ctx.stroke();
      this.ctx.globalCompositeOperation = 'source-over';
    }
  }

  private addFilmGrainEffect(): void {
    if (!this.ctx) return;
    
    const canvas = this.ctx.canvas;
    const imageData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Add subtle noise to each pixel
    for (let i = 0; i < data.length; i += 4) {
      // Only process some pixels for performance
      if (Math.random() < 0.1) {
        const noise = (Math.random() - 0.5) * 10;
        
        // Add noise to each channel (RGB)
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
        // Don't modify alpha channel
      }
    }
    
    this.ctx.putImageData(imageData, 0, 0);
  }
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
} 