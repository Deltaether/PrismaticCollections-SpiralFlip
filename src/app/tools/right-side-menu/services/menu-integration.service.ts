import { Injectable, ElementRef, Renderer2, ApplicationRef, ComponentFactoryResolver, Injector, ComponentRef } from '@angular/core';
import * as THREE from 'three';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { RightSideMenuComponent } from '../right-side-menu.component';

@Injectable({
  providedIn: 'root'
})
export class MenuIntegrationService {
  private menuElement: HTMLElement | null = null;
  private menuCSS3DObject: CSS3DObject | null = null;
  private componentRef: ComponentRef<RightSideMenuComponent> | null = null;

  constructor(
    private renderer2: Renderer2,
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) { }

  /**
   * Creates the right-side menu as a CSS3D object that can be added to the Three.js scene
   * @param scene The Three.js scene to add the menu to
   * @param videoPlaneConfig Configuration of the original video plane (position, rotation, etc.)
   * @param cdCases The CD cases data
   * @param onTrackSelected Callback function when a track is selected
   * @returns The created CSS3D object containing the menu
   */
  createMenuObject(
    scene: THREE.Scene,
    videoPlaneConfig: any,
    cdCases: any[],
    onTrackSelected: (index: number) => void
  ): CSS3DObject {
    // Create the menu component
    const factory = this.componentFactoryResolver.resolveComponentFactory(RightSideMenuComponent);
    this.componentRef = factory.create(this.injector);
    
    // Set the input properties
    this.componentRef.instance.cdCases = cdCases;
    this.componentRef.instance.trackSelected.subscribe(index => {
      if (onTrackSelected) {
        onTrackSelected(index);
      }
    });
    
    // Attach component to the application
    this.appRef.attachView(this.componentRef.hostView);
    
    // Get the DOM element
    this.menuElement = (this.componentRef.location.nativeElement as HTMLElement);
    
    // Additional styling for proper 3D display
    this.renderer2.setStyle(this.menuElement, 'position', 'absolute');
    this.renderer2.setStyle(this.menuElement, 'pointerEvents', 'auto');
    this.renderer2.setStyle(this.menuElement, 'backfaceVisibility', 'hidden');
    this.renderer2.setStyle(this.menuElement, 'transformOrigin', 'center center');
    this.renderer2.setStyle(this.menuElement, 'overflow', 'hidden');
    
    // Set size to match video plane with proper resolution
    // Higher resolution factor for crisp text
    const scaleFactor = 500; // Pixels per Three.js unit for high resolution
    const width = videoPlaneConfig.size.width * scaleFactor; 
    const height = videoPlaneConfig.size.height * scaleFactor;
    
    // Apply styles to contain the menu within these dimensions
    this.renderer2.setStyle(this.menuElement, 'width', `${width}px`);
    this.renderer2.setStyle(this.menuElement, 'height', `${height}px`);
    
    // Set transform for proper 3D rendering
    this.menuCSS3DObject = new CSS3DObject(this.menuElement);
    
    // Position the menu in the same position as the video plane
    this.menuCSS3DObject.position.set(
      videoPlaneConfig.position.x,
      videoPlaneConfig.position.y,
      videoPlaneConfig.position.z
    );
    
    // Apply the same rotation as the video plane
    this.menuCSS3DObject.rotation.set(
      videoPlaneConfig.rotation.x,
      videoPlaneConfig.rotation.y,
      videoPlaneConfig.rotation.z
    );
    
    // Scale the object to match the exact dimensions of the plane
    // The scale needs to be inversely proportional to our scaleFactor
    this.menuCSS3DObject.scale.set(0.002, 0.002, 0.002); // Adjusted for higher resolution
    
    // Initially hide it
    this.menuCSS3DObject.visible = false;
    
    // Add to scene
    scene.add(this.menuCSS3DObject);
    
    return this.menuCSS3DObject;
  }

  /**
   * Updates the active case index in the menu
   * @param index The index of the active case
   */
  updateActiveCase(index: number): void {
    if (this.componentRef) {
      this.componentRef.instance.activeCaseIndex = index;
      this.componentRef.changeDetectorRef.detectChanges();
    }
  }

  /**
   * Shows or hides the menu
   * @param visible Whether the menu should be visible
   */
  setMenuVisibility(visible: boolean): void {
    if (this.menuCSS3DObject) {
      this.menuCSS3DObject.visible = visible;
    }
  }

  /**
   * Updates the menu's position and rotation to align with an object
   * @param targetObject The object to align with
   * @param offsets Optional position and rotation offsets
   */
  alignWithObject(
    targetObject: THREE.Object3D,
    offsets?: {
      position?: { x?: number, y?: number, z?: number },
      rotation?: { x?: number, y?: number, z?: number }
    }
  ): void {
    if (!this.menuCSS3DObject) return;
    
    // Copy position from target
    this.menuCSS3DObject.position.copy(targetObject.position);
    this.menuCSS3DObject.rotation.copy(targetObject.rotation);
    
    // Apply offsets if provided
    if (offsets) {
      if (offsets.position) {
        if (offsets.position.x !== undefined) this.menuCSS3DObject.position.x += offsets.position.x;
        if (offsets.position.y !== undefined) this.menuCSS3DObject.position.y += offsets.position.y;
        if (offsets.position.z !== undefined) this.menuCSS3DObject.position.z += offsets.position.z;
      }
      
      if (offsets.rotation) {
        if (offsets.rotation.x !== undefined) this.menuCSS3DObject.rotation.x += offsets.rotation.x;
        if (offsets.rotation.y !== undefined) this.menuCSS3DObject.rotation.y += offsets.rotation.y;
        if (offsets.rotation.z !== undefined) this.menuCSS3DObject.rotation.z += offsets.rotation.z;
      }
    }
  }
  
  /**
   * Cleans up the component and objects when no longer needed
   */
  destroy(): void {
    if (this.componentRef) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
    
    if (this.menuCSS3DObject) {
      if (this.menuCSS3DObject.parent) {
        this.menuCSS3DObject.parent.remove(this.menuCSS3DObject);
      }
      this.menuCSS3DObject = null;
    }
    
    this.menuElement = null;
  }
}
