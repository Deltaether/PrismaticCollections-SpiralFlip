import { Injectable, NgZone } from '@angular/core';
import { Vector2D, CDCase } from '../models/cd-case.model';
import * as Matter from 'matter-js';

@Injectable({
  providedIn: 'root'
})
export class PhysicsService {
  // Core physics components
  private engine!: Matter.Engine;
  private world!: Matter.World;
  private render: Matter.Render | null = null;
  private runner!: Matter.Runner;
  private bodies: Map<number, Matter.Body> = new Map();
  private constraints: Map<number, Matter.Constraint> = new Map();

  // Physics constants
  private readonly PHYSICS_CONFIG = {
    GRAVITY_Z: 0.8,
    FRICTION: 0.9,
    AIR_RESISTANCE: 0.02,
    STATIC_FRICTION: 1.0,
    BOUNCE: 0.05,
    MASS: 8,
    STIFFNESS: 0.2,
    DAMPING: 0.4,
    GRAB_STIFFNESS: 0.5,
    GRAB_DAMPING: 0.3,
    Z_SCALE_FACTOR: 0.001
  };

  // CD case dimensions
  private readonly CD_DIMENSIONS = {
    WIDTH: 670,
    HEIGHT: 570,
    CORNER_RADIUS: 4,
    EDGE_THICKNESS: 20,
    MAX_Z: 1000,  // Maximum z-depth
    MIN_Z: 0      // Minimum z-depth (screen plane)
  };

  constructor(private ngZone: NgZone) {
    this.initializeEngine();
  }

  private initializeEngine(): void {
    this.engine = Matter.Engine.create({
      constraintIterations: 4,
      positionIterations: 6,
      velocityIterations: 4,
      enableSleeping: true
    });

    this.world = this.engine.world;
    Matter.World.clear(this.world, false);
    
    // Set gravity to pull into the screen (z-axis)
    this.world.gravity.x = 0;
    this.world.gravity.y = 0;  // No vertical gravity
    this.world.gravity.scale = this.PHYSICS_CONFIG.GRAVITY_Z;

    this.runner = Matter.Runner.create({
      isFixed: true,
      delta: 1000 / 60
    });
  }

  initializePhysics(container: HTMLElement): void {
    this.render = Matter.Render.create({
      element: container,
      engine: this.engine,
      options: {
        width: container.clientWidth,
        height: container.clientHeight,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio
      }
    });

    Matter.Render.run(this.render);
    this.ngZone.runOutsideAngular(() => {
      Matter.Runner.run(this.runner, this.engine);
    });
  }

  private createBackgroundPlane(): Matter.Body {
    return Matter.Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight * 0.85,  // Moved further down for better perspective
      window.innerWidth * 1.5,
      20,
      { 
        isStatic: true,
        angle: Math.PI * 0.15,  // Angle the ground to create perspective
        render: { visible: false },
        friction: this.PHYSICS_CONFIG.FRICTION,
        frictionStatic: this.PHYSICS_CONFIG.STATIC_FRICTION,
        restitution: this.PHYSICS_CONFIG.BOUNCE
      }
    );
  }

  createBody(cd: CDCase): void {
    const body = Matter.Bodies.rectangle(
      cd.position.x,
      cd.position.y,
      this.CD_DIMENSIONS.WIDTH,
      this.CD_DIMENSIONS.HEIGHT,
      {
        angle: 0,
        friction: this.PHYSICS_CONFIG.FRICTION,
        frictionAir: this.PHYSICS_CONFIG.AIR_RESISTANCE,
        frictionStatic: this.PHYSICS_CONFIG.STATIC_FRICTION,
        restitution: this.PHYSICS_CONFIG.BOUNCE,
        mass: this.PHYSICS_CONFIG.MASS,
        plugin: {
          zPosition: 0,  // Start at screen plane
          zVelocity: 0
        }
      }
    );

    this.bodies.set(cd.id, body);
    Matter.World.add(this.world, body);
  }

  private createCornerPoints(position: Vector2D, width: number, height: number): Matter.Body[] {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    
    return [
      [-halfWidth, -halfHeight],
      [halfWidth, -halfHeight],
      [-halfWidth, halfHeight],
      [halfWidth, halfHeight]
    ].map(([x, y]) => 
      Matter.Bodies.circle(
        position.x + x,
        position.y + y,
        this.CD_DIMENSIONS.CORNER_RADIUS,
        { isSensor: true }
      )
    );
  }

  private setupCollisionHandling(body: Matter.Body): void {
    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const cdBody = pair.bodyA === body ? pair.bodyA : 
                      pair.bodyB === body ? pair.bodyB : null;
        
        if (cdBody) {
          this.handleCollision(cdBody);
        }
      });
    });
  }

  private handleCollision(body: Matter.Body): void {
    // Stop rotation and movement on collision
    Matter.Body.setAngle(body, 0);
    Matter.Body.setAngularVelocity(body, 0);
    Matter.Body.setVelocity(body, { x: 0, y: 0 });
    
    // Stop z movement
    body.plugin.zVelocity = 0;
  }

  updateCDFromBody(cd: CDCase): void {
    const body = this.bodies.get(cd.id);
    if (!body) return;

    // Update z position based on velocity
    body.plugin.zPosition += body.plugin.zVelocity;
    body.plugin.zPosition = Math.max(0, Math.min(this.CD_DIMENSIONS.MAX_Z, body.plugin.zPosition));

    // Apply gravity to z velocity
    body.plugin.zVelocity += this.PHYSICS_CONFIG.GRAVITY_Z;

    // Calculate scale based on z position
    const scale = 1 - (body.plugin.zPosition * this.PHYSICS_CONFIG.Z_SCALE_FACTOR);
    cd.physics.scale = Math.max(0.2, Math.min(1, scale));

    // Update position and rotation
    cd.position = { 
      x: body.position.x,
      y: body.position.y + (body.plugin.zPosition * 0.5)  // Offset y based on z for perspective
    };
    cd.rotation = body.angle * 180 / Math.PI;
    cd.physics.velocity = { ...body.velocity };
    cd.physics.angularVelocity = body.angularVelocity;
  }

  createGrabConstraint(cd: CDCase, grabPoint: Vector2D, mousePosition: Vector2D): void {
    const body = this.bodies.get(cd.id);
    if (!body) return;

    // Keep the CD case exactly where it was grabbed
    const currentPosition = body.position;
    
    // Create constraint at exact grab location
    const constraint = Matter.Constraint.create({
        pointA: { x: currentPosition.x, y: currentPosition.y },
        bodyB: body,
        pointB: { 
            x: (grabPoint.x * this.CD_DIMENSIONS.WIDTH / 2),
            y: (grabPoint.y * this.CD_DIMENSIONS.HEIGHT / 2)
        },
        stiffness: this.PHYSICS_CONFIG.GRAB_STIFFNESS,
        damping: this.PHYSICS_CONFIG.GRAB_DAMPING,
        length: 0
    });

    this.constraints.set(cd.id, constraint);
    Matter.World.add(this.world, constraint);

    // Reset velocities but maintain position
    Matter.Body.setVelocity(body, { x: 0, y: 0 });
    Matter.Body.setAngularVelocity(body, 0);
    body.plugin.zVelocity = -15;
  }

  updateGrabConstraint(cd: CDCase, mousePosition: Vector2D): void {
    const constraint = this.constraints.get(cd.id);
    const body = this.bodies.get(cd.id);
    if (!constraint || !body) return;

    // Smoothly update constraint point without teleporting
    const currentPos = constraint.pointA;
    constraint.pointA = {
        x: currentPos.x + (mousePosition.x - currentPos.x) * 0.3,
        y: currentPos.y + (mousePosition.y - currentPos.y) * 0.3
    };
    
    // Maintain z-position while dragged
    const targetZ = Math.max(0, body.plugin.zPosition - 2);
    body.plugin.zPosition = targetZ;
    body.plugin.zVelocity = 0;

    // Ensure body stays at current position
    Matter.Body.setPosition(body, body.position);
  }

  removeConstraint(cd: CDCase): void {
    const constraint = this.constraints.get(cd.id);
    const body = this.bodies.get(cd.id);
    if (!constraint || !body) return;

    Matter.World.remove(this.world, constraint);
    this.constraints.delete(cd.id);

    // Add velocity into screen based on current position
    const zVelocity = 10 + (body.plugin.zPosition * 0.1);
    body.plugin.zVelocity = zVelocity;

    // Add some friction to prevent floating
    Matter.Body.setVelocity(body, {
      x: body.velocity.x * 0.5,
      y: body.velocity.y * 0.5
    });
  }

  calculateTilt(cd: CDCase, deltaMovement: Vector2D): Vector2D {
    const body = this.bodies.get(cd.id);
    if (!body) return { x: 0, y: 0 };

    // Calculate tilt based on movement and z-position
    const zFactor = 1 - (body.plugin.zPosition / this.CD_DIMENSIONS.MAX_Z);
    return {
      x: deltaMovement.y * zFactor * 0.5,
      y: -deltaMovement.x * zFactor * 0.5
    };
  }

  setVelocity(cd: CDCase, velocity: Vector2D): void {
    const body = this.bodies.get(cd.id);
    if (!body) return;

    Matter.Body.setVelocity(body, {
      x: 0,
      y: Math.min(this.PHYSICS_CONFIG.DAMPING, Math.abs(velocity.y))
    });
    Matter.Body.setAngle(body, 0);
    Matter.Body.setAngularVelocity(body, 0);
  }

  cleanup(): void {
    if (this.render) {
      Matter.Render.stop(this.render);
      this.render.canvas.remove();
    }
    Matter.Runner.stop(this.runner);
    Matter.Engine.clear(this.engine);
  }
} 