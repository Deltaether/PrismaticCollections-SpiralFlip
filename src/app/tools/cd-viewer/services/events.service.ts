import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subject, fromEvent } from 'rxjs';
import { takeUntil, throttleTime, distinctUntilChanged } from 'rxjs/operators';
import * as THREE from 'three';

/**
 * Consolidated events service for CD Viewer
 * Handles mouse interactions, keyboard controls, and touch events
 * Provides reactive event streams for component consumption
 */

export interface MouseInteraction {
  type: 'click' | 'hover' | 'leave' | 'drag';
  object: THREE.Object3D | null;
  point: THREE.Vector3 | null;
  screenPosition: { x: number; y: number };
  timestamp: number;
}

export interface KeyboardEvent {
  type: 'keydown' | 'keyup';
  key: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  timestamp: number;
}

export interface TouchInteraction {
  type: 'touchstart' | 'touchmove' | 'touchend';
  touches: TouchList;
  screenPosition: { x: number; y: number };
  timestamp: number;
}

export interface ViewportChange {
  width: number;
  height: number;
  devicePixelRatio: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private readonly destroy$ = new Subject<void>();
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  
  // Event subjects for reactive programming
  private readonly mouseInteractionSubject = new Subject<MouseInteraction>();
  private readonly keyboardEventSubject = new Subject<KeyboardEvent>();
  private readonly touchInteractionSubject = new Subject<TouchInteraction>();
  private readonly viewportChangeSubject = new Subject<ViewportChange>();
  
  // State tracking
  private readonly hoveredObjectSubject = new BehaviorSubject<THREE.Object3D | null>(null);
  private readonly selectedObjectSubject = new BehaviorSubject<THREE.Object3D | null>(null);
  
  // Interaction targets
  private interactableObjects: THREE.Object3D[] = [];
  private camera: THREE.Camera | null = null;
  private domElement: HTMLElement | null = null;
  
  // Public observables
  public readonly mouseInteractions$ = this.mouseInteractionSubject.asObservable();
  public readonly keyboardEvents$ = this.keyboardEventSubject.asObservable();
  public readonly touchInteractions$ = this.touchInteractionSubject.asObservable();
  public readonly viewportChanges$ = this.viewportChangeSubject.asObservable();
  public readonly hoveredObject$ = this.hoveredObjectSubject.asObservable();
  public readonly selectedObject$ = this.selectedObjectSubject.asObservable();

  constructor(private ngZone: NgZone) {}

  /**
   * Initialize event handling for a specific DOM element and camera
   */
  public initialize(domElement: HTMLElement, camera: THREE.Camera): void {
    this.domElement = domElement;
    this.camera = camera;
    
    this.setupMouseEvents();
    this.setupKeyboardEvents();
    this.setupTouchEvents();
    this.setupResizeHandler();
  }

  /**
   * Set up mouse interaction handlers
   */
  private setupMouseEvents(): void {
    if (!this.domElement) return;

    // Mouse move for hover detection
    fromEvent<MouseEvent>(this.domElement, 'mousemove')
      .pipe(
        takeUntil(this.destroy$),
        throttleTime(16) // ~60fps
      )
      .subscribe((event) => {
        this.updateMousePosition(event);
        this.handleMouseHover(event);
      });

    // Mouse click for selection
    fromEvent<MouseEvent>(this.domElement, 'click')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        this.updateMousePosition(event);
        this.handleMouseClick(event);
      });

    // Mouse leave to clear hover state
    fromEvent<MouseEvent>(this.domElement, 'mouseleave')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        this.handleMouseLeave(event);
      });

    // Context menu (right click)
    fromEvent<MouseEvent>(this.domElement, 'contextmenu')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        event.preventDefault(); // Prevent browser context menu
        this.updateMousePosition(event);
        this.handleRightClick(event);
      });
  }

  /**
   * Set up keyboard event handlers
   */
  private setupKeyboardEvents(): void {
    // Keyboard events on document level
    fromEvent<globalThis.KeyboardEvent>(document, 'keydown')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        this.handleKeyboardEvent('keydown', event);
      });

    fromEvent<globalThis.KeyboardEvent>(document, 'keyup')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        this.handleKeyboardEvent('keyup', event);
      });
  }

  /**
   * Set up touch event handlers for mobile support
   */
  private setupTouchEvents(): void {
    if (!this.domElement) return;

    fromEvent<TouchEvent>(this.domElement, 'touchstart')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        this.handleTouchEvent('touchstart', event);
      });

    fromEvent<TouchEvent>(this.domElement, 'touchmove')
      .pipe(
        takeUntil(this.destroy$),
        throttleTime(16)
      )
      .subscribe((event) => {
        this.handleTouchEvent('touchmove', event);
      });

    fromEvent<TouchEvent>(this.domElement, 'touchend')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        this.handleTouchEvent('touchend', event);
      });
  }

  /**
   * Set up window resize handler
   */
  private setupResizeHandler(): void {
    fromEvent(window, 'resize')
      .pipe(
        takeUntil(this.destroy$),
        throttleTime(100),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.handleViewportChange();
      });
  }

  /**
   * Update normalized mouse coordinates
   */
  private updateMousePosition(event: MouseEvent): void {
    if (!this.domElement) return;

    const rect = this.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  /**
   * Handle mouse hover interactions
   */
  private handleMouseHover(event: MouseEvent): void {
    const intersectedObject = this.getIntersectedObject();
    const currentHovered = this.hoveredObjectSubject.value;

    if (intersectedObject !== currentHovered) {
      // Mouse leave previous object
      if (currentHovered) {
        this.emitMouseInteraction('leave', currentHovered, null, event);
      }

      // Mouse enter new object
      if (intersectedObject) {
        this.emitMouseInteraction('hover', intersectedObject, this.getIntersectionPoint(), event);
      }

      this.hoveredObjectSubject.next(intersectedObject);
    }
  }

  /**
   * Handle mouse click interactions
   */
  private handleMouseClick(event: MouseEvent): void {
    const intersectedObject = this.getIntersectedObject();
    
    if (intersectedObject) {
      this.selectedObjectSubject.next(intersectedObject);
      this.emitMouseInteraction('click', intersectedObject, this.getIntersectionPoint(), event);
    } else {
      // Click on empty space - deselect
      this.selectedObjectSubject.next(null);
      this.emitMouseInteraction('click', null, null, event);
    }
  }

  /**
   * Handle mouse leave interactions
   */
  private handleMouseLeave(event: MouseEvent): void {
    const currentHovered = this.hoveredObjectSubject.value;
    
    if (currentHovered) {
      this.emitMouseInteraction('leave', currentHovered, null, event);
      this.hoveredObjectSubject.next(null);
    }
  }

  /**
   * Handle right click interactions
   */
  private handleRightClick(event: MouseEvent): void {
    const intersectedObject = this.getIntersectedObject();
    // Emit as a special click type or handle context menu logic here
    console.log('Right click detected on:', intersectedObject);
  }

  /**
   * Handle keyboard events
   */
  private handleKeyboardEvent(type: 'keydown' | 'keyup', event: globalThis.KeyboardEvent): void {
    // Only process certain keys to avoid spam
    const relevantKeys = [
      'Escape', 'Enter', 'Space', 'Tab',
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'w', 'a', 's', 'd', 'q', 'e', 'r', 'f',
      '1', '2', '3', '4', '5'
    ];

    if (relevantKeys.includes(event.key) || event.key === ' ') {
      const keyboardEvent: KeyboardEvent = {
        type,
        key: event.key,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        timestamp: Date.now()
      };

      this.ngZone.run(() => {
        this.keyboardEventSubject.next(keyboardEvent);
      });

      // Handle specific key actions
      this.handleSpecificKeyActions(keyboardEvent);
    }
  }

  /**
   * Handle specific key actions
   */
  private handleSpecificKeyActions(keyEvent: KeyboardEvent): void {
    if (keyEvent.type === 'keydown') {
      switch (keyEvent.key) {
        case 'Escape':
          this.selectedObjectSubject.next(null);
          break;
        case 'Enter':
        case ' ':
          const selected = this.selectedObjectSubject.value;
          if (selected) {
            // Trigger action on selected object
            this.emitMouseInteraction('click', selected, null, {} as MouseEvent);
          }
          break;
      }
    }
  }

  /**
   * Handle touch events
   */
  private handleTouchEvent(type: 'touchstart' | 'touchmove' | 'touchend', event: TouchEvent): void {
    event.preventDefault(); // Prevent default touch behavior
    
    const touch = event.touches[0] || event.changedTouches[0];
    if (!touch) return;

    const touchInteraction: TouchInteraction = {
      type,
      touches: event.touches,
      screenPosition: { x: touch.clientX, y: touch.clientY },
      timestamp: Date.now()
    };

    this.ngZone.run(() => {
      this.touchInteractionSubject.next(touchInteraction);
    });

    // Convert touch to mouse-like interaction for consistency
    if (type === 'touchstart') {
      const mockEvent = { clientX: touch.clientX, clientY: touch.clientY } as MouseEvent;
      this.updateMousePosition(mockEvent);
      this.handleMouseClick(mockEvent);
    }
  }

  /**
   * Handle viewport changes
   */
  private handleViewportChange(): void {
    const viewportChange: ViewportChange = {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
      timestamp: Date.now()
    };

    this.ngZone.run(() => {
      this.viewportChangeSubject.next(viewportChange);
    });
  }

  /**
   * Get intersected object using raycasting
   */
  private getIntersectedObject(): THREE.Object3D | null {
    if (!this.camera || this.interactableObjects.length === 0) {
      return null;
    }

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactableObjects, true);
    
    return intersects.length > 0 ? intersects[0].object : null;
  }

  /**
   * Get intersection point in world coordinates
   */
  private getIntersectionPoint(): THREE.Vector3 | null {
    if (!this.camera || this.interactableObjects.length === 0) {
      return null;
    }

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactableObjects, true);
    
    return intersects.length > 0 ? intersects[0].point.clone() : null;
  }

  /**
   * Emit mouse interaction event
   */
  private emitMouseInteraction(
    type: 'click' | 'hover' | 'leave',
    object: THREE.Object3D | null,
    point: THREE.Vector3 | null,
    event: MouseEvent
  ): void {
    const interaction: MouseInteraction = {
      type,
      object,
      point,
      screenPosition: { x: event.clientX || 0, y: event.clientY || 0 },
      timestamp: Date.now()
    };

    this.ngZone.run(() => {
      this.mouseInteractionSubject.next(interaction);
    });
  }

  /**
   * Set objects that can be interacted with
   */
  public setInteractableObjects(objects: THREE.Object3D[]): void {
    this.interactableObjects = objects;
  }

  /**
   * Add an object to the interactable list
   */
  public addInteractableObject(object: THREE.Object3D): void {
    if (!this.interactableObjects.includes(object)) {
      this.interactableObjects.push(object);
    }
  }

  /**
   * Remove an object from the interactable list
   */
  public removeInteractableObject(object: THREE.Object3D): void {
    const index = this.interactableObjects.indexOf(object);
    if (index > -1) {
      this.interactableObjects.splice(index, 1);
    }
  }

  /**
   * Get current hovered object
   */
  public getCurrentHoveredObject(): THREE.Object3D | null {
    return this.hoveredObjectSubject.value;
  }

  /**
   * Get current selected object
   */
  public getCurrentSelectedObject(): THREE.Object3D | null {
    return this.selectedObjectSubject.value;
  }

  /**
   * Manually set hovered object (useful for programmatic interactions)
   */
  public setHoveredObject(object: THREE.Object3D | null): void {
    this.hoveredObjectSubject.next(object);
  }

  /**
   * Manually set selected object
   */
  public setSelectedObject(object: THREE.Object3D | null): void {
    this.selectedObjectSubject.next(object);
  }

  /**
   * Clean up event listeners and resources
   */
  public dispose(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    this.interactableObjects = [];
    this.camera = null;
    this.domElement = null;
    
    this.hoveredObjectSubject.complete();
    this.selectedObjectSubject.complete();
    this.mouseInteractionSubject.complete();
    this.keyboardEventSubject.complete();
    this.touchInteractionSubject.complete();
    this.viewportChangeSubject.complete();
  }
}