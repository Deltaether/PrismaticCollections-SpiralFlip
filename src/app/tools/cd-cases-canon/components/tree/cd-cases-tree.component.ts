import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CDCase, Vector2D } from '../../models/cd-case.model';

@Component({
  selector: 'app-cd-cases-tree',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #cdContainer class="cd-container">
      <div *ngFor="let cd of cdCases"
           class="cd-case"
           [class.grabbed]="cd === draggedCD"
           [class.flipped]="cd.isFlipped"
           [style.transform]="getTransform(cd)"
           [style.z-index]="cd.zIndex"
           (mousedown)="onMouseDown($event, cd)"
           (contextmenu)="onRightClick($event, cd)">
        <div class="cd-front">
          <img [src]="cd.imageUrl" [alt]="cd.title">
        </div>
        <div class="cd-spine">
          <span>{{ cd.title }}</span>
        </div>
        <div class="cd-right-edge"></div>
        <div class="cd-back">
          <div class="track-list">
            <h3>{{ cd.title }}</h3>
            <p>{{ cd.artist }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./cd-cases-tree.component.scss']
})
export class CDCasesTreeComponent implements AfterViewInit {
  @ViewChild('cdContainer') cdContainer!: ElementRef;

  private readonly FALL_SPEED = 4;
  private readonly MAX_DEPTH = 400;
  private readonly INITIAL_DEPTH = 0;
  private readonly HOVER_DEPTH = 50;
  private readonly FALL_ACCELERATION = 1.75;
  private readonly SETTLE_FACTOR = 0.85;
  private readonly CENTER_FORCE = 0.05;
  private readonly SCREEN_MARGIN = 100;
  private readonly MAX_FALL_SPEED = 1005;
  private readonly CD_WIDTH = 670;
  private readonly CD_HEIGHT = 570;

  cdCases: CDCase[] = [
    {
      id: 1,
      title: 'Disc One',
      artist: 'An × Feryquitous',
      imageUrl: '/assets/graphic/disc1_cover.png',
      position: { x: window.innerWidth / 3, y: window.innerHeight / 2 },
      rotation: 0,
      tilt: { x: 0, y: 0 },
      zIndex: 1,
      elevation: 0,
      depth: 0,
      fallSpeed: 0,
      isFlipped: false,
      bounceCount: 0
    },
    {
      id: 2,
      title: 'Disc Two',
      artist: 'An × Feryquitous',
      imageUrl: '/assets/graphic/disc2_cover.png',
      position: { x: (window.innerWidth * 2) / 3, y: window.innerHeight / 2 },
      rotation: 0,
      tilt: { x: 0, y: 0 },
      zIndex: 1,
      elevation: 0,
      depth: 0,
      fallSpeed: 0,
      isFlipped: false,
      bounceCount: 0
    }
  ];

  draggedCD: CDCase | null = null;
  private dragOffset: Vector2D = { x: 0, y: 0 };
  private lastMousePos: Vector2D = { x: 0, y: 0 };
  private animationFrame: number | null = null;

  ngAfterViewInit() {
    this.cdCases.forEach(cd => {
      cd.position = {
        x: window.innerWidth / 2 + (cd.id === 1 ? -200 : 200),
        y: window.innerHeight / 2
      };
      cd.depth = this.INITIAL_DEPTH;
      cd.bounceCount = 0;
    });
    this.startFallingAnimation();
  }

  ngOnDestroy() {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  private moveTowardsCenter(cd: CDCase) {
    const centerX = window.innerWidth / 2;
    const margin = this.SCREEN_MARGIN;
    const maxOffset = (window.innerWidth / 3) - (cd.depth / this.MAX_DEPTH) * 200;
    
    let targetX = centerX;
    if (cd.id === 1) {
      targetX = centerX - maxOffset;
    } else {
      targetX = centerX + maxOffset;
    }
    
    cd.position.x += (targetX - cd.position.x) * this.CENTER_FORCE;
    
    const minX = margin;
    const maxX = window.innerWidth - margin - this.CD_WIDTH;
    cd.position.x = Math.max(minX, Math.min(maxX, cd.position.x));
  }

  private startFallingAnimation() {
    const animate = () => {
      this.cdCases.forEach(cd => {
        if (cd !== this.draggedCD) {
          this.moveTowardsCenter(cd);

          cd.fallSpeed = (cd.fallSpeed || this.FALL_SPEED) * this.FALL_ACCELERATION;
          cd.fallSpeed = Math.min(cd.fallSpeed, this.MAX_FALL_SPEED);
          cd.depth += cd.fallSpeed;

          if (cd.depth >= this.MAX_DEPTH) {
            const overDepth = cd.depth - this.MAX_DEPTH;
            cd.depth = this.MAX_DEPTH + (overDepth * this.SETTLE_FACTOR);
            cd.fallSpeed *= this.SETTLE_FACTOR;
            
            if (Math.abs(overDepth) < 0.1) {
              cd.depth = this.MAX_DEPTH;
              cd.fallSpeed = 0;
            }
          }

          const scale = 1 - (cd.depth / this.MAX_DEPTH) * 0.15;
          cd.position.y += cd.fallSpeed * scale * 0.4;
        }
      });
      this.animationFrame = requestAnimationFrame(animate);
    };
    this.animationFrame = requestAnimationFrame(animate);
  }

  onMouseDown(event: MouseEvent, cd: CDCase) {
    if (event.button !== 0) return;

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    this.dragOffset = {
      x: event.clientX - cd.position.x,
      y: event.clientY - cd.position.y
    };
    this.lastMousePos = { x: event.clientX, y: event.clientY };
    
    this.draggedCD = cd;
    cd.zIndex = Math.max(...this.cdCases.map(c => c.zIndex)) + 1;
    cd.elevation = 50;
    cd.depth = this.HOVER_DEPTH;
    cd.fallSpeed = 0;
    cd.bounceCount = 0;
    
    event.preventDefault();
  }

  onRightClick(event: MouseEvent, cd: CDCase) {
    event.preventDefault();
    if (!cd.isFlipped) {
      cd.zIndex = Math.max(...this.cdCases.map(c => c.zIndex)) + 1;
    }
    cd.isFlipped = !cd.isFlipped;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.draggedCD) return;

    const deltaX = event.clientX - this.lastMousePos.x;
    const deltaY = event.clientY - this.lastMousePos.y;

    const margin = this.SCREEN_MARGIN;
    const newX = event.clientX - this.dragOffset.x;
    const newY = event.clientY - this.dragOffset.y;
    
    const minX = margin;
    const maxX = window.innerWidth - margin - this.CD_WIDTH;
    const minY = margin;
    const maxY = window.innerHeight - margin - this.CD_HEIGHT;
    
    this.draggedCD.position = {
      x: Math.max(minX, Math.min(maxX, newX)),
      y: Math.max(minY, Math.min(maxY, newY))
    };

    this.draggedCD.tilt = {
      x: deltaY * 2.5,
      y: -deltaX * 2.5
    };

    this.draggedCD.tilt.x = Math.max(-30, Math.min(30, this.draggedCD.tilt.x));
    this.draggedCD.tilt.y = Math.max(-30, Math.min(30, this.draggedCD.tilt.y));

    this.lastMousePos = { x: event.clientX, y: event.clientY };
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    if (this.draggedCD) {
      const resetTilt = () => {
        if (!this.draggedCD) return;
        
        this.draggedCD.tilt = {
          x: this.draggedCD.tilt.x * 0.85,
          y: this.draggedCD.tilt.y * 0.85
        };
        
        this.draggedCD.elevation *= 0.85;
        
        if (Math.abs(this.draggedCD.tilt.x) > 0.01 || Math.abs(this.draggedCD.tilt.y) > 0.01 || this.draggedCD.elevation > 0.01) {
          requestAnimationFrame(resetTilt);
        } else {
          this.draggedCD.tilt = { x: 0, y: 0 };
          this.draggedCD.elevation = 0;
          this.draggedCD.fallSpeed = this.FALL_SPEED;
          this.draggedCD = null;
        }
      };
      
      requestAnimationFrame(resetTilt);
    }
  }

  getTransform(cd: CDCase): string {
    const scale = 1 - (cd.depth / this.MAX_DEPTH) * 0.2;
    const perspective = cd.isFlipped ? 'rotateY(180deg)' : '';
    
    return `
      translate3d(${cd.position.x}px, ${cd.position.y}px, ${-cd.depth + cd.elevation}px)
      scale(${scale})
      rotateX(${cd.tilt.x}deg)
      rotateY(${cd.tilt.y}deg)
      rotate(${cd.rotation}deg)
      ${perspective}
    `;
  }
} 