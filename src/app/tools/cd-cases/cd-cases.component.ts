import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CDCase {
  id: number;
  title: string;
  artist: string;
  imageUrl: string;
  position: { x: number; y: number };
  rotation: number;
  tiltX: number;
  tiltY: number;
  zIndex: number;
  stackIndex: number;
  stackId: number | null;
  isFlipped: boolean;
  elevation: number;
  angularVelocity: number;
  lastDeltaTime: number;
  momentum: { x: number; y: number };
  grabPoint: { x: number; y: number } | null;
}

@Component({
  selector: 'app-cd-cases',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cd-cases.component.html',
  styleUrls: ['./cd-cases.component.scss']
})
export class CDCasesComponent implements AfterViewInit {
  @ViewChild('cdContainer') cdContainer!: ElementRef;
  
  cdCases: CDCase[] = [
    {
      id: 1,
      title: 'Disc One',
      artist: 'An × Feryquitous',
      imageUrl: '/assets/graphic/disc1_cover.png',
      position: { x: 100, y: 100 },
      rotation: -5,
      tiltX: 0,
      tiltY: 0,
      zIndex: 1,
      stackIndex: 0,
      stackId: null,
      isFlipped: false,
      elevation: 0,
      angularVelocity: 0,
      lastDeltaTime: 0,
      momentum: { x: 0, y: 0 },
      grabPoint: null
    },
    {
      id: 2,
      title: 'Disc Two',
      artist: 'An × Feryquitous',
      imageUrl: '/assets/graphic/disc2_cover.png',
      position: { x: 200, y: 150 },
      rotation: 5,
      tiltX: 0,
      tiltY: 0,
      zIndex: 1,
      stackIndex: 0,
      stackId: null,
      isFlipped: false,
      elevation: 0,
      angularVelocity: 0,
      lastDeltaTime: 0,
      momentum: { x: 0, y: 0 },
      grabPoint: null
    }
  ];

  private draggedCD: CDCase | null = null;
  private startPosition = { x: 0, y: 0 };
  private isDragging = false;
  private containerBounds: DOMRect | null = null;
  private lastMousePosition = { x: 0, y: 0 };
  private stackingDistance = 100;
  private stackOffset = 4;
  private grabOffset = { x: 0, y: 0 };
  private readonly CASE_WIDTH = 280;
  private readonly CASE_HEIGHT = Math.round(280 * (570/640));
  private readonly EDGE_THRESHOLD = 60;
  private readonly MAX_ELEVATION = 100;
  private readonly ROTATION_SENSITIVITY = 1.2;
  private readonly FRICTION = 0.98;
  private readonly MIN_VELOCITY = 0.1;
  private animationFrameId: number | null = null;
  private readonly MOMENTUM_FACTOR = 0.2;
  private readonly EDGE_ROTATION_FACTOR = 5.0;
  private readonly ROTATION_FRICTION = 0.95;
  private readonly MOMENTUM_FRICTION = 0.95;
  private readonly TILT_FACTOR = 45;
  private readonly EDGE_FLEXIBILITY = 2.5;
  private readonly SPIN_SENSITIVITY = 3.0;

  constructor() {
    this.updatePhysics = this.updatePhysics.bind(this);
  }

  ngAfterViewInit() {
    this.containerBounds = this.cdContainer.nativeElement.getBoundingClientRect();
    this.randomizeInitialPositions();
    this.startPhysicsLoop();
  }

  ngOnDestroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private startPhysicsLoop() {
    const updateLoop = () => {
      this.updatePhysics();
      this.animationFrameId = requestAnimationFrame(updateLoop);
    };
    this.animationFrameId = requestAnimationFrame(updateLoop);
  }

  private updatePhysics() {
    const now = performance.now();
    this.cdCases.forEach(cd => {
      if (!this.isDragging || cd !== this.draggedCD) {
        // Apply angular momentum with smooth deceleration
        if (Math.abs(cd.angularVelocity) > this.MIN_VELOCITY) {
          cd.rotation += cd.angularVelocity;
          cd.angularVelocity *= this.ROTATION_FRICTION;
        } else {
          cd.angularVelocity = 0;
        }

        // Smooth tilt reset when not dragging
        cd.tiltX *= this.MOMENTUM_FRICTION;
        cd.tiltY *= this.MOMENTUM_FRICTION;

        // Apply momentum with smooth deceleration
        if (cd.momentum) {
          const momentumMagnitude = Math.sqrt(
            cd.momentum.x * cd.momentum.x + 
            cd.momentum.y * cd.momentum.y
          );

          if (momentumMagnitude > 0.01) {
            cd.momentum.x *= this.MOMENTUM_FRICTION;
            cd.momentum.y *= this.MOMENTUM_FRICTION;
          } else {
            cd.momentum.x = 0;
            cd.momentum.y = 0;
          }
        }
      }
      cd.lastDeltaTime = now;
    });
  }

  private randomizeInitialPositions() {
    if (!this.containerBounds) return;

    const width = this.containerBounds.width || window.innerWidth;
    const height = this.containerBounds.height || window.innerHeight;

    this.cdCases.forEach(cd => {
      cd.position = {
        x: Math.random() * (width - 200),
        y: Math.random() * (height - 200)
      };
      cd.rotation = (Math.random() - 0.5) * 20;
      cd.tiltX = (Math.random() - 0.5) * 10;
      cd.tiltY = (Math.random() - 0.5) * 10;
      cd.stackId = null;
      cd.stackIndex = 0;
      cd.isFlipped = false;
      cd.elevation = 0;
      cd.angularVelocity = 0;
      cd.lastDeltaTime = 0;
      cd.momentum = { x: 0, y: 0 };
      cd.grabPoint = null;
    });
  }

  private findNearestStack(cd: CDCase): CDCase | null {
    return this.cdCases
      .filter(other => 
        other !== cd && 
        other.stackId === null || 
        other.stackId === cd.stackId
      )
      .find(other => {
        const distance = Math.sqrt(
          Math.pow(other.position.x - cd.position.x, 2) +
          Math.pow(other.position.y - cd.position.y, 2)
        );
        return distance < this.stackingDistance;
      }) || null;
  }

  private updateStack(cd: CDCase, nearestCD: CDCase | null) {
    if (!nearestCD) {
      if (cd.stackId !== null) {
        const stackMates = this.cdCases.filter(other => other.stackId === cd.stackId);
        stackMates.forEach(mate => {
          if (mate !== cd) {
            mate.position = {
              x: mate.position.x,
              y: mate.position.y + this.stackOffset
            };
          }
        });
      }
      cd.stackId = null;
      return;
    }

    const stackId = nearestCD.stackId || nearestCD.id;
    cd.stackId = stackId;
    cd.position = {
      x: nearestCD.position.x,
      y: nearestCD.position.y - this.stackOffset
    };
  }

  onMouseDown(event: MouseEvent, cd: CDCase) {
    if (event.button === 2) {
      event.preventDefault();
      this.flipCD(cd);
      return;
    }

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    const relativeY = event.clientY - rect.top;

    // Calculate grab point relative to center (-1 to 1 range)
    cd.grabPoint = {
      x: (relativeX - this.CASE_WIDTH / 2) / (this.CASE_WIDTH / 2),
      y: (relativeY - this.CASE_HEIGHT / 2) / (this.CASE_HEIGHT / 2)
    };

    this.isDragging = true;
    this.draggedCD = cd;
    this.startPosition = {
      x: event.clientX - cd.position.x,
      y: event.clientY - cd.position.y
    };
    this.lastMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
    
    cd.momentum = { x: 0, y: 0 };
    const maxZ = Math.max(...this.cdCases.map(c => c.zIndex));
    cd.zIndex = maxZ + 1;
    cd.elevation = this.MAX_ELEVATION;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging || !this.draggedCD || !this.containerBounds || !this.draggedCD.grabPoint) return;

    const width = this.containerBounds.width || window.innerWidth;
    const height = this.containerBounds.height || window.innerHeight;
    const newX = event.clientX - this.startPosition.x;
    const newY = event.clientY - this.startPosition.y;

    const deltaX = event.clientX - this.lastMousePosition.x;
    const deltaY = event.clientY - this.lastMousePosition.y;
    const moveSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Update position
    this.draggedCD.position = {
      x: Math.max(0, Math.min(newX, width - this.CASE_WIDTH)),
      y: Math.max(0, Math.min(newY, height - this.CASE_HEIGHT))
    };

    const nearestCD = this.findNearestStack(this.draggedCD);
    this.updateStack(this.draggedCD, nearestCD);

    if (!nearestCD) {
      // Calculate grab point influence (0 at center, 1 at edges)
      const grabX = this.draggedCD.grabPoint.x;
      const grabY = this.draggedCD.grabPoint.y;
      const grabDistance = Math.sqrt(grabX * grabX + grabY * grabY);
      
      // Edge influence increases as you get closer to edges
      const edgeInfluence = Math.min(1, grabDistance * this.EDGE_FLEXIBILITY);

      // Calculate movement direction relative to grab point
      const moveAngle = Math.atan2(deltaY, deltaX);
      const grabAngle = Math.atan2(grabY, grabX);
      const angleDiff = Math.abs(moveAngle - grabAngle);

      // Stronger rotation when moving perpendicular to grab point
      const rotationMultiplier = Math.sin(angleDiff) * this.SPIN_SENSITIVITY;

      // Calculate rotation force based on movement and grab point
      const rotationForce = moveSpeed * edgeInfluence * rotationMultiplier;
      
      // Apply rotation with direction based on cross product
      const rotationDirection = Math.sign(deltaX * grabY - deltaY * grabX);
      this.draggedCD.angularVelocity = rotationForce * rotationDirection * this.EDGE_ROTATION_FACTOR;
      this.draggedCD.rotation += this.draggedCD.angularVelocity;

      // Calculate tilt based on grab point and movement
      const tiltX = grabY * this.TILT_FACTOR * (1 + Math.abs(deltaY) * 0.1);
      const tiltY = grabX * this.TILT_FACTOR * (1 + Math.abs(deltaX) * 0.1);

      // Apply smooth tilt transition
      this.draggedCD.tiltX += (tiltX - this.draggedCD.tiltX) * 0.2;
      this.draggedCD.tiltY += (tiltY - this.draggedCD.tiltY) * 0.2;

      // Update momentum
      this.draggedCD.momentum = {
        x: (deltaX * this.MOMENTUM_FACTOR * edgeInfluence),
        y: (deltaY * this.MOMENTUM_FACTOR * edgeInfluence)
      };
    }

    this.lastMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    if (this.draggedCD) {
      const now = performance.now();
      const deltaTime = now - this.draggedCD.lastDeltaTime;
      if (deltaTime > 0) {
        // Preserve momentum for spinning
        this.draggedCD.angularVelocity *= (16 / deltaTime) * 
          (Math.abs(this.draggedCD.grabPoint?.x || 0) + Math.abs(this.draggedCD.grabPoint?.y || 0));
      }
      
      this.draggedCD.grabPoint = null;
      // Don't reset tilts immediately - let physics handle it
      this.draggedCD.elevation = 0;
    }
    this.isDragging = false;
    this.draggedCD = null;
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: Event) {
    event.preventDefault();
  }

  flipCD(cd: CDCase) {
    cd.isFlipped = !cd.isFlipped;
    const maxZ = Math.max(...this.cdCases.map(c => c.zIndex));
    cd.zIndex = maxZ + 1;
  }

  getTransform(cd: CDCase): string {
    const stackTransform = cd.stackId !== null 
      ? `translateZ(${cd.stackIndex * -2}px)` 
      : '';
    
    const flipTransform = cd.isFlipped 
      ? 'rotateY(180deg)' 
      : '';
    
    const elevationTransform = `translateZ(${cd.elevation}px)`;
    
    return `
      translate3d(${cd.position.x}px, ${cd.position.y}px, 0)
      ${elevationTransform}
      rotateX(${cd.tiltX}deg)
      rotateY(${cd.tiltY + (cd.isFlipped ? 180 : 0)}deg)
      rotate(${cd.rotation}deg)
      ${stackTransform}
    `;
  }
} 