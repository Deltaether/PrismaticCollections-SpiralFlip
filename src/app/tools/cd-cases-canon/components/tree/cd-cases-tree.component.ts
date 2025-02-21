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
           [style.transform]="getTransform(cd)"
           [style.z-index]="cd.zIndex"
           (mousedown)="onMouseDown($event, cd)">
        <div class="cd-front">
          <img [src]="cd.imageUrl" [alt]="cd.title">
        </div>
        <div class="cd-spine">
          <span>{{ cd.title }}</span>
        </div>
        <div class="cd-right-edge"></div>
      </div>
    </div>
  `,
  styleUrls: ['./cd-cases-tree.component.scss']
})
export class CDCasesTreeComponent implements AfterViewInit {
  @ViewChild('cdContainer') cdContainer!: ElementRef;

  cdCases: CDCase[] = [
    {
      id: 1,
      title: 'Disc One',
      artist: 'An × Feryquitous',
      imageUrl: '/assets/graphic/disc1_cover.png',
      position: { x: window.innerWidth / 2 - 400, y: window.innerHeight / 2 },
      rotation: 0,
      tilt: { x: 0, y: 0 },
      zIndex: 1,
      elevation: 0
    },
    {
      id: 2,
      title: 'Disc Two',
      artist: 'An × Feryquitous',
      imageUrl: '/assets/graphic/disc2_cover.png',
      position: { x: window.innerWidth / 2 + 100, y: window.innerHeight / 2 },
      rotation: 0,
      tilt: { x: 0, y: 0 },
      zIndex: 1,
      elevation: 0
    }
  ];

  draggedCD: CDCase | null = null;
  private dragOffset: Vector2D = { x: 0, y: 0 };
  private lastMousePos: Vector2D = { x: 0, y: 0 };

  ngAfterViewInit() {
    // Initialize CD positions
    this.cdCases.forEach(cd => {
      cd.position = {
        x: window.innerWidth / 2 + (cd.id === 1 ? -400 : 100),
        y: window.innerHeight / 2
      };
    });
  }

  onMouseDown(event: MouseEvent, cd: CDCase) {
    if (event.button !== 0) return; // Only handle left click

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    this.dragOffset = {
      x: event.clientX - cd.position.x,
      y: event.clientY - cd.position.y
    };
    this.lastMousePos = { x: event.clientX, y: event.clientY };
    
    this.draggedCD = cd;
    cd.zIndex = Math.max(...this.cdCases.map(c => c.zIndex)) + 1;
    cd.elevation = 50; // Lift CD when grabbed
    
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.draggedCD) return;

    const deltaX = event.clientX - this.lastMousePos.x;
    const deltaY = event.clientY - this.lastMousePos.y;

    // Update position
    this.draggedCD.position = {
      x: event.clientX - this.dragOffset.x,
      y: event.clientY - this.dragOffset.y
    };

    // Enhanced tilt calculation with more dramatic effect
    this.draggedCD.tilt = {
      x: deltaY * 2.5,  // Increased from 0.5 to 2.5
      y: -deltaX * 2.5  // Increased from 0.5 to 2.5
    };

    // Limit maximum tilt
    this.draggedCD.tilt.x = Math.max(-30, Math.min(30, this.draggedCD.tilt.x));
    this.draggedCD.tilt.y = Math.max(-30, Math.min(30, this.draggedCD.tilt.y));

    this.lastMousePos = { x: event.clientX, y: event.clientY };
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    if (this.draggedCD) {
      // Smooth tilt reset animation
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
          this.draggedCD = null;
        }
      };
      
      requestAnimationFrame(resetTilt);
    }
  }

  getTransform(cd: CDCase): string {
    return `
      translate3d(${cd.position.x}px, ${cd.position.y}px, ${cd.elevation}px)
      rotateX(${cd.tilt.x}deg)
      rotateY(${cd.tilt.y}deg)
      rotate(${cd.rotation}deg)
    `;
  }
} 