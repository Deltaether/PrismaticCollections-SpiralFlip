import { Injectable, ElementRef, Renderer2, ApplicationRef, ComponentFactoryResolver, Injector, ComponentRef, NgZone, RendererFactory2 } from '@angular/core';
import * as THREE from 'three';
import { RightSideMenuComponent } from '../right-side-menu.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuIntegrationService {
  private renderer: Renderer2;
  private menuContainer!: HTMLElement;
  private menuVisible = false;
  
  // 【✓】 Observable for menu visibility state
  public menuVisibilityState = new BehaviorSubject<boolean>(false);
  
  // 【✓】 Store viewport dimensions
  private viewportWidth = window.innerWidth;
  private viewportHeight = window.innerHeight;

  // Original variables
  private menuElement: HTMLElement | null = null;
  private componentRef: ComponentRef<RightSideMenuComponent> | null = null;
  private isMenuVisible = false;
  // Store menu container for DOM manipulations
  private originalMenuContainer: HTMLElement | null = null;
  // Store 3D coordinates for positioning calculations
  private menuPosition = { x: 0, y: 0, z: 0 };
  private menuRotation = { x: 0, y: 0, z: 0 };
  private menuSize = { width: 0, height: 0 };
  // Track window resize listener
  private resizeListener: (() => void) | null = null;

  constructor(
    private rendererFactory: RendererFactory2,
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private ngZone: NgZone
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    
    // 【✓】 Add window resize listener
    window.addEventListener('resize', this.handleResize.bind(this));
  }
  
  // 【✓】 Handle window resize events
  private handleResize(): void {
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;
    
    // If menu exists and is visible, update its position and size
    if (this.menuContainer && this.menuVisible) {
      this.updateMenuDimensions();
    }
  }
  
  // 【✓】 Update menu position and dimensions based on viewport
  private updateMenuDimensions(): void {
    // Calculate responsive dimensions
    const menuWidth = Math.min(650, this.viewportWidth * 0.35);
    const menuHeight = this.viewportHeight * 0.8;
    const leftPosition = `${Math.min(85, Math.max(65, this.viewportWidth * 0.01 + 80))}%`;
    
    // Apply responsive dimensions
    this.renderer.setStyle(this.menuContainer, 'width', `${menuWidth}px`);
    this.renderer.setStyle(this.menuContainer, 'height', `${menuHeight}px`);
    this.renderer.setStyle(this.menuContainer, 'left', leftPosition);
    this.renderer.setStyle(this.menuContainer, 'top', '10%');
  }

  // 【✓】 Initialize the menu container in the DOM
  public initMenuContainer(): void {
    // Create menu container if it doesn't exist
    if (!this.menuContainer) {
      this.menuContainer = this.renderer.createElement('div');
      this.renderer.addClass(this.menuContainer, 'menu-container');
      
      // Add to DOM
      const body = document.body;
      this.renderer.appendChild(body, this.menuContainer);
      
      // Set initial state (hidden)
      this.setMenuVisibility(false);
      
      // Add styles
      const style = this.renderer.createElement('style');
      style.textContent = `
        .menu-container {
          position: fixed;
          width: 650px;
          height: 80%;
          left: 80%;
          top: 10%;
          transform: translateX(-100%);
          z-index: 1000;
          overflow: hidden;
          transition: opacity 0.5s ease;
        }
        .menu-container.hidden {
          opacity: 0;
          pointer-events: none;
        }
        .menu-container.visible {
          opacity: 1;
          pointer-events: auto;
        }
      `;
      
      this.renderer.appendChild(document.head, style);
      
      // Set initial dimensions based on viewport
      this.updateMenuDimensions();
    }
  }

  // 【✓】 Set the menu visibility state
  public setMenuVisibility(visible: boolean): void {
    // If the visibility state hasn't changed, do nothing to avoid retriggering animations
    if (this.menuVisible === visible) {
      return;
    }
    
    this.menuVisible = visible;
    
    // Send updated state to subscribers
    this.menuVisibilityState.next(visible);
    
    if (this.menuContainer) {
      // Remove both classes first
      this.renderer.removeClass(this.menuContainer, 'visible');
      this.renderer.removeClass(this.menuContainer, 'hidden');
      
      // Add appropriate class
      if (visible) {
        this.renderer.addClass(this.menuContainer, 'visible');
      } else {
        this.renderer.addClass(this.menuContainer, 'hidden');
      }
    }
    
    // Also handle original menu visibility for backward compatibility
    if (this.originalMenuContainer) {
      // Set opacity to show/hide the menu
      this.renderer.setStyle(this.originalMenuContainer, 'opacity', visible ? '1' : '0');
      
      // Toggle pointer events to enable/disable interaction
      this.renderer.setStyle(this.originalMenuContainer, 'pointerEvents', visible ? 'auto' : 'none');
      
      this.isMenuVisible = visible;
    }
  }

  // 【✓】 Get reference to the menu container DOM element
  public getMenuContainer(): HTMLElement {
    return this.menuContainer;
  }
  
  // 【✗】 Clean up when service is destroyed
  public ngOnDestroy(): void {
    // Remove resize listener
    window.removeEventListener('resize', this.handleResize.bind(this));
    
    // Remove menu container from DOM if it exists
    if (this.menuContainer && this.menuContainer.parentNode) {
      this.renderer.removeChild(this.menuContainer.parentNode, this.menuContainer);
    }
  }

  /**
   * 【✓】 Updates the active case index in the menu
   * @param index The index of the active case
   */
  updateActiveCase(index: number): void {
    if (this.componentRef) {
      this.componentRef.instance.activeCaseIndex = index;
      this.componentRef.changeDetectorRef.detectChanges();
    }
  }

  /**
   * 【✓】 Creates the right-side menu as an overlay that appears on top of the Three.js scene
   * @param scene The Three.js scene (no longer used for attaching the menu)
   * @param videoPlaneConfig Configuration of the original video plane (position, rotation, etc.)
   * @param cdCases The CD cases data
   * @param onTrackSelected Callback function when a track is selected
   * @returns The created container element
   */
  createMenuObject(
    scene: THREE.Scene,
    videoPlaneConfig: any,
    cdCases: any[],
    onTrackSelected: (index: number) => void
  ): HTMLElement {
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
    
    // Store the 3D position, rotation and size for calculations
    this.menuPosition = {
      x: videoPlaneConfig.position.x,
      y: videoPlaneConfig.position.y,
      z: videoPlaneConfig.position.z
    };
    this.menuRotation = {
      x: videoPlaneConfig.rotation.x,
      y: videoPlaneConfig.rotation.y,
      z: videoPlaneConfig.rotation.z
    };
    this.menuSize = {
      width: videoPlaneConfig.size.width,
      height: videoPlaneConfig.size.height
    };
    
    // Create a container for the menu using our new responsive approach
    this.originalMenuContainer = document.createElement('div');
    this.renderer.addClass(this.originalMenuContainer, 'menu-overlay-container');
    
    // Calculate responsive dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const width = Math.min(650, viewportWidth * 0.35); // Responsive width with max of 650px
    const height = Math.round(viewportHeight * 0.8); // 80% of viewport height
    
    this.menuSize = { width, height };
    this.renderer.setStyle(this.originalMenuContainer, 'width', `${width}px`);
    this.renderer.setStyle(this.originalMenuContainer, 'height', `${height}px`);
    
    // Add a scaling factor based on viewport size for internal elements
    const scaleFactor = Math.min(viewportWidth / 1920, viewportHeight / 1080);
    this.renderer.setStyle(this.originalMenuContainer, 'transform', `translate(-50%, -50%) scale(${scaleFactor})`);
    this.renderer.setStyle(this.originalMenuContainer, 'transform-origin', 'center center');
    
    // Set position using viewport percentages
    this.renderer.setStyle(this.originalMenuContainer, 'position', 'absolute');
    this.renderer.setStyle(this.originalMenuContainer, 'pointerEvents', 'auto');
    this.renderer.setStyle(this.originalMenuContainer, 'top', '60%');
    this.renderer.setStyle(this.originalMenuContainer, 'left', '80%');
    this.renderer.setStyle(this.originalMenuContainer, 'zIndex', '10');
    this.renderer.setStyle(this.originalMenuContainer, 'opacity', '0');
    this.renderer.setStyle(this.originalMenuContainer, 'transition', 'opacity 400ms ease');
    
    // Add the menu element to the container
    this.originalMenuContainer.appendChild(this.menuElement);
    
    // Add the container to the document body
    document.body.appendChild(this.originalMenuContainer);
    
    // Add window resize listener to adjust menu size with viewport changes
    this.setupResizeHandler();
    
    return this.menuElement;
  }

  /**
   * 【✓】 Updates the menu position when the camera or scene changes
   * @param camera The Three.js camera
   */
  updateMenuPosition(camera: THREE.Camera): void {
    // No need to update position for the overlay approach
    // The menu stays fixed on screen
  }

  /**
   * 【✓】 Setup responsive resize handling
   */
  private setupResizeHandler(): void {
    // Remove existing listener if any
    this.removeResizeHandler();
    
    // Create new resize handler
    this.resizeListener = () => {
      this.ngZone.run(() => {
        if (this.originalMenuContainer) {
          // Get updated viewport dimensions
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          
          // Update container size with responsive dimensions
          const width = Math.min(650, viewportWidth * 0.35);
          const height = Math.round(viewportHeight * 0.8);
          
          this.menuSize = { width, height };
          this.renderer.setStyle(this.originalMenuContainer, 'width', `${width}px`);
          this.renderer.setStyle(this.originalMenuContainer, 'height', `${height}px`);
          
          // Update scaling factor
          const scaleFactor = Math.min(viewportWidth / 1920, viewportHeight / 1080);
          this.renderer.setStyle(this.originalMenuContainer, 'transform', `translate(-50%, -50%) scale(${scaleFactor})`);
        }
      });
    };
    
    // Register the event listener
    window.addEventListener('resize', this.resizeListener);
  }

  /**
   * 【✓】 Clean up resize handler
   */
  private removeResizeHandler(): void {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
      this.resizeListener = null;
    }
  }

  /**
   * 【✓】 Cleans up resources when the component is destroyed
   */
  destroy(): void {
    // Remove resize handler when service is destroyed
    this.removeResizeHandler();
    
    if (this.componentRef) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
    
    if (this.originalMenuContainer && this.originalMenuContainer.parentNode) {
      this.originalMenuContainer.parentNode.removeChild(this.originalMenuContainer);
      this.originalMenuContainer = null;
    }
    
    if (this.menuElement) {
      // Remove from DOM if still attached
      const parent = this.menuElement.parentNode;
      if (parent) {
        parent.removeChild(this.menuElement);
      }
      this.menuElement = null;
    }
    
    // Clean up our new menu container as well
    if (this.menuContainer && this.menuContainer.parentNode) {
      this.renderer.removeChild(this.menuContainer.parentNode, this.menuContainer);
    }
  }
  
  /**
   * 【✗】 Creates the menu with simplified DOM approach
   * @param initialScale Initial scale of the menu
   */
  createMenu(initialScale: number = 1.0): void {
    // If component ref already exists, don't recreate
    if (this.componentRef) return;
    
    // Initialize menu container
    this.initMenuContainer();
  }
}
