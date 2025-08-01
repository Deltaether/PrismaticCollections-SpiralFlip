import { Injectable, ElementRef, Renderer2, ApplicationRef, ComponentFactoryResolver, Injector, ComponentRef, NgZone, RendererFactory2, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { RightSideMenuComponent } from '../right-side-menu.component';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';

// 【✓】 Define interfaces for type safety
interface MenuPosition {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

interface MenuRotation {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

interface MenuSize {
  readonly width: number;
  readonly height: number;
}

interface MenuPositionConfig {
  rightPercentage: number;
  topPercentage: number;
  minRightPercentage: number;
  maxRightPercentage: number;
}

interface MenuSizeConfig {
  maxWidth: number;
  widthPercentage: number;
  heightPercentage: number;
}

interface MenuConfig {
  position: MenuPositionConfig;
  size: MenuSizeConfig;
  transformOrigin: string;
  zIndex: number;
}

@Injectable({
  providedIn: 'root'
})
export class MenuIntegrationService implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly isDebugMode = true;
  private readonly renderer: Renderer2;
  private menuContainer!: HTMLElement;
  private menuVisible = false;
  
  // 【✓】 Observable for menu visibility state
  public readonly menuVisibilityState = new BehaviorSubject<boolean>(false);
  
  // 【✓】 Store viewport dimensions
  private viewportWidth = window.innerWidth;
  private viewportHeight = window.innerHeight;

  // 【✓】 Menu configuration with proper typing
  private menuConfig: MenuConfig = {
    position: {
      rightPercentage: 5,
      topPercentage: 5,
      minRightPercentage: 5,
      maxRightPercentage: 15
    },
    size: {
      maxWidth: 650,
      widthPercentage: 35,
      heightPercentage: 80
    },
    transformOrigin: "top right",
    zIndex: 1000
  };

  // 【✓】 Component properties with proper typing
  private menuElement: HTMLElement | null = null;
  private componentRef: ComponentRef<RightSideMenuComponent> | null = null;
  private isMenuVisible = false;
  private originalMenuContainer: HTMLElement | null = null;
  private menuPosition: MenuPosition = { x: 0, y: 0, z: 0 };
  private menuRotation: MenuRotation = { x: 0, y: 0, z: 0 };
  private menuSize: MenuSize = { width: 0, height: 0 };
  private resizeListener: (() => void) | null = null;

  constructor(
    private readonly rendererFactory: RendererFactory2,
    private readonly appRef: ApplicationRef,
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly injector: Injector,
    private readonly ngZone: NgZone,
    private readonly http: HttpClient
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    
    if (this.isDebugMode) {
      console.log('[MenuIntegration] Service initialized');
    }
    
    // 【✓】 Add window resize listener
    this.setupResizeListener();
    
    // 【✓】 Load configuration from JSON
    this.loadMenuConfiguration();
  }

  // 【✓】 Setup resize listener with proper cleanup
  private setupResizeListener(): void {
    window.addEventListener('resize', this.handleResize.bind(this));
    
    if (this.isDebugMode) {
      console.log('[MenuIntegration] Resize listener set up');
    }
  }
  
  // 【✓】 Load menu configuration from JSON file
  private loadMenuConfiguration(): void {
    if (this.isDebugMode) {
      console.log('[MenuIntegration] Attempting to load menu configuration');
    }
    
    // Use a timestamp query parameter to prevent caching
    const timestamp = new Date().getTime();
    
    this.http.get(`src/app/tools/right-side-menu/config/menu-config.json?t=${timestamp}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (config: any) => {
          if (config && config.rightSideMenu) {
            this.menuConfig = config.rightSideMenu;
            
            if (this.isDebugMode) {
              console.log('[MenuIntegration] Configuration loaded successfully:', this.menuConfig);
            }
            
            // Update menu dimensions immediately
            if (this.menuContainer) {
              this.updateMenuDimensions();
            }
          } else {
            console.error('[MenuIntegration] Config loaded but rightSideMenu property not found:', config);
            this.loadAlternateConfig(timestamp);
          }
        },
        error => {
          console.error('[MenuIntegration] Error loading configuration from primary path:', error);
          this.loadAlternateConfig(timestamp);
        }
      );
  }
  
  // 【✓】 Load alternate configuration if primary fails
  private loadAlternateConfig(timestamp: number): void {
    if (this.isDebugMode) {
      console.log('[MenuIntegration] Attempting to load from alternate path');
    }
    
    this.http.get(`assets/app/tools/right-side-menu/config/menu-config.json?t=${timestamp}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (config: any) => {
          if (config && config.rightSideMenu) {
            this.menuConfig = config.rightSideMenu;
            
            if (this.isDebugMode) {
              console.log('[MenuIntegration] Configuration loaded from alternate path:', this.menuConfig);
            }
            
            // Update menu dimensions immediately
            if (this.menuContainer) {
              this.updateMenuDimensions();
            }
          } else {
            console.error('[MenuIntegration] Alternate config loaded but rightSideMenu property not found:', config);
          }
        },
        secondError => {
          console.error('[MenuIntegration] Error loading from alternate path:', secondError);
          console.log('[MenuIntegration] Using default menu configuration');
        }
      );
  }

  // 【✓】 Cleanup resources
  ngOnDestroy(): void {
    if (this.isDebugMode) {
      console.log('[MenuIntegration] Destroying service');
    }
    
    // Remove window event listener
    window.removeEventListener('resize', this.handleResize.bind(this));
    
    // Remove resize handler if it exists
    this.removeResizeHandler();
    
    // Detach and destroy component if it exists
    if (this.componentRef) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
    
    // Remove menu container from DOM if it exists
    if (this.menuContainer && this.menuContainer.parentNode) {
      this.menuContainer.parentNode.removeChild(this.menuContainer);
    }
    
    // Remove any styles we added
    const menuStyle = document.querySelector('style.menu-container-style');
    if (menuStyle && menuStyle.parentNode) {
      menuStyle.parentNode.removeChild(menuStyle);
    }
    
    // Complete all subjects
    this.menuVisibilityState.complete();
    this.destroy$.next();
    this.destroy$.complete();
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
  
  // 【✓】 Update menu position and dimensions based on viewport and config
  private updateMenuDimensions(): void {
    // Use configuration values for calculations
    const maxWidth = this.menuConfig.size.maxWidth;
    const widthPercentage = this.menuConfig.size.widthPercentage;
    const heightPercentage = this.menuConfig.size.heightPercentage;
    const rightPercentage = this.menuConfig.position.rightPercentage;
    const topPercentage = this.menuConfig.position.topPercentage;
    
    // Calculate responsive dimensions
    const menuWidth = Math.min(maxWidth, this.viewportWidth * (widthPercentage / 100));
    const menuHeight = this.viewportHeight * (heightPercentage / 100);
    
    console.log(`Applying menu position: right=${rightPercentage}%, top=${topPercentage}%`);
    
    // Apply responsive dimensions to main container
    this.renderer.setStyle(this.menuContainer, 'width', `${menuWidth}px`);
    this.renderer.setStyle(this.menuContainer, 'height', `${menuHeight}px`);
    this.renderer.setStyle(this.menuContainer, 'right', `${rightPercentage}%`);
    this.renderer.setStyle(this.menuContainer, 'left', 'auto'); // Clear left position
    this.renderer.setStyle(this.menuContainer, 'top', `${topPercentage}%`);
    this.renderer.setStyle(this.menuContainer, 'z-index', this.menuConfig.zIndex.toString());
    
    // Also update the originalMenuContainer if it exists
    if (this.originalMenuContainer) {
      this.renderer.setStyle(this.originalMenuContainer, 'width', `${menuWidth}px`);
      this.renderer.setStyle(this.originalMenuContainer, 'height', `${menuHeight}px`);
      this.renderer.setStyle(this.originalMenuContainer, 'right', '0');
      this.renderer.setStyle(this.originalMenuContainer, 'top', '0');
    }
    
    // Update the CSS rules as well by removing old style and adding new
    const oldStyle = document.querySelector('style.menu-container-style');
    if (oldStyle) {
      oldStyle.parentNode?.removeChild(oldStyle);
    }
    
    // Add updated styles
    const style = this.renderer.createElement('style');
    this.renderer.addClass(style, 'menu-container-style');
    style.textContent = `
      .menu-container {
        position: fixed;
        width: ${maxWidth}px;
        height: ${heightPercentage}%;
        right: ${rightPercentage}%;
        top: ${topPercentage}%;
        z-index: ${this.menuConfig.zIndex};
        overflow: hidden;
        transition: opacity 0.5s ease, pointer-events 0s;
      }
      .menu-container.hidden {
        opacity: 0;
        pointer-events: none !important;
        visibility: hidden;
      }
      .menu-container.visible {
        opacity: 1;
        pointer-events: auto !important;
        visibility: visible;
      }
    `;
    
    this.renderer.appendChild(document.head, style);
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
      
      // Set initial dimensions based on viewport and config
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
        // Explicitly enable pointer events when visible
        this.renderer.setStyle(this.menuContainer, 'pointer-events', 'auto');
      } else {
        this.renderer.addClass(this.menuContainer, 'hidden');
        // Explicitly disable pointer events when hidden
        this.renderer.setStyle(this.menuContainer, 'pointer-events', 'none');
      }
    }
    
    // Also handle original menu visibility for backward compatibility
    if (this.originalMenuContainer) {
      // Set opacity to show/hide the menu
      this.renderer.setStyle(this.originalMenuContainer, 'opacity', visible ? '1' : '0');
      
      // Toggle pointer events to enable/disable interaction
      this.renderer.setStyle(this.originalMenuContainer, 'pointer-events', visible ? 'auto' : 'none');
      
      this.isMenuVisible = visible;
    }
  }

  // 【✓】 Get reference to the menu container DOM element
  public getMenuContainer(): HTMLElement {
    return this.menuContainer;
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
    // First ensure our menu container is initialized in the DOM
    this.initMenuContainer();
    
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
    
    // Create a container for the menu using configuration values
    this.originalMenuContainer = document.createElement('div');
    this.renderer.addClass(this.originalMenuContainer, 'menu-overlay-container');
    
    // Calculate responsive dimensions using configuration
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const width = Math.min(
      this.menuConfig.size.maxWidth, 
      viewportWidth * (this.menuConfig.size.widthPercentage / 100)
    );
    const height = Math.round(viewportHeight * (this.menuConfig.size.heightPercentage / 100));
    
    this.menuSize = { width, height };
    this.renderer.setStyle(this.originalMenuContainer, 'width', `${width}px`);
    this.renderer.setStyle(this.originalMenuContainer, 'height', `${height}px`);
    
    // Add a scaling factor based on viewport size for internal elements
    const scaleFactor = Math.min(viewportWidth / 1920, viewportHeight / 1080);
    this.renderer.setStyle(this.originalMenuContainer, 'transform', `scale(${scaleFactor})`);
    this.renderer.setStyle(this.originalMenuContainer, 'transform-origin', this.menuConfig.transformOrigin);
    
    // Set position - the original container is positioned relative to the main menu container
    this.renderer.setStyle(this.originalMenuContainer, 'position', 'absolute');
    this.renderer.setStyle(this.originalMenuContainer, 'right', '0');
    this.renderer.setStyle(this.originalMenuContainer, 'top', '0');
    
    // Start with pointer events disabled if menu is not visible initially
    const initialPointerEvents = this.menuVisible ? 'auto' : 'none';
    this.renderer.setStyle(this.originalMenuContainer, 'pointer-events', initialPointerEvents);
    
    // Set initial opacity - hidden by default until explicitly shown
    const initialOpacity = this.menuVisible ? '1' : '0';
    this.renderer.setStyle(this.originalMenuContainer, 'opacity', initialOpacity);
    
    // Append the menu element to the container
    this.renderer.appendChild(this.originalMenuContainer, this.menuElement);
    
    // IMPORTANT: Append our originalMenuContainer to the menuContainer that's in the DOM
    if (this.menuContainer) {
      // Clear the menuContainer first to avoid duplicate components
      while (this.menuContainer.firstChild) {
        this.renderer.removeChild(this.menuContainer, this.menuContainer.firstChild);
      }
      
      // Now append the originalMenuContainer to the menuContainer
      this.renderer.appendChild(this.menuContainer, this.originalMenuContainer);
    }
    
    // Set up resize handler to maintain responsive positioning
    this.setupResizeHandler();
    
    // Force initial visibility state
    this.setMenuVisibility(this.menuVisible);
    
    return this.originalMenuContainer;
  }

  /**
   * 【✓】 Updates the menu position based on camera perspective 
   * @param camera The Three.js camera
   */
  update3DMenuPosition(camera: THREE.Camera): void {
    // No need to update position for the overlay approach
    // The menu stays fixed on screen
  }

  /**
   * 【✓】 Setup responsive resize handling
   */
  private setupResizeHandler(): void {
    // Remove existing listener if any
    this.removeResizeHandler();
    
    // Create new resize handler using configuration values
    this.resizeListener = () => {
      this.ngZone.run(() => {
        if (this.originalMenuContainer) {
          // Get updated viewport dimensions
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          
          // Update container size with responsive dimensions from config
          const width = Math.min(
            this.menuConfig.size.maxWidth,
            viewportWidth * (this.menuConfig.size.widthPercentage / 100)
          );
          const height = Math.round(viewportHeight * (this.menuConfig.size.heightPercentage / 100));
          
          this.menuSize = { width, height };
          this.renderer.setStyle(this.originalMenuContainer, 'width', `${width}px`);
          this.renderer.setStyle(this.originalMenuContainer, 'height', `${height}px`);
          
          // Update scaling factor
          const scaleFactor = Math.min(viewportWidth / 1920, viewportHeight / 1080);
          this.renderer.setStyle(this.originalMenuContainer, 'transform', `scale(${scaleFactor})`);
          
          // Keep original container anchored to top-right of main container
          this.renderer.setStyle(this.originalMenuContainer, 'right', '0');
          this.renderer.setStyle(this.originalMenuContainer, 'top', '0');
          
          // Update main menu container position
          const rightPercentage = this.menuConfig.position.rightPercentage;
          const topPercentage = this.menuConfig.position.topPercentage;
          
          console.log(`Resize handler: Setting menu position right=${rightPercentage}%, top=${topPercentage}%`);
          this.renderer.setStyle(this.menuContainer, 'right', `${rightPercentage}%`);
          this.renderer.setStyle(this.menuContainer, 'top', `${topPercentage}%`);
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
   * 【✓】 Creates the menu with simplified DOM approach
   * @param initialScale Initial scale of the menu
   */
  createMenu(initialScale: number = 1.0): void {
    // If component ref already exists, don't recreate
    if (this.componentRef) return;
    
    // Initialize menu container
    this.initMenuContainer();
    
    // If the component hasn't been created yet, create it
    if (!this.componentRef) {
      console.log('Creating right-side menu component');
      
      // Create the component
      const factory = this.componentFactoryResolver.resolveComponentFactory(RightSideMenuComponent);
      this.componentRef = factory.create(this.injector);
      
      // Attach component to the application
      this.appRef.attachView(this.componentRef.hostView);
      
      // Get the DOM element
      this.menuElement = (this.componentRef.location.nativeElement as HTMLElement);
      
      // Append the menu element to the container
      if (this.menuContainer && this.menuElement) {
        // Clear any existing children
        while (this.menuContainer.firstChild) {
          this.renderer.removeChild(this.menuContainer, this.menuContainer.firstChild);
        }
        
        // Add the menu element
        this.renderer.appendChild(this.menuContainer, this.menuElement);
        
        console.log('Right-side menu component added to DOM container');
      } else {
        console.error('Menu container or menu element not found');
      }
    }
  }

  // 【✓】 Set menu configuration directly from external source
  public setMenuConfig(config: any): void {
    console.log('Menu configuration being set directly:', config);
    this.menuConfig = config;
    
    // Update menu dimensions immediately whenever config changes
    if (this.menuContainer) {
      this.updateMenuDimensions();
      console.log('Menu dimensions updated with directly set config');
    }
  }

  // Manual method to force update from the config file
  public reloadMenuConfig(): void {
    console.log('Manually reloading menu configuration...');
    this.loadMenuConfiguration();
  }

  // 【✓】 Update position property
  public updateMenuPosition(property: string, value: number): void {
    if (!this.menuConfig || !this.menuConfig.position) {
      console.warn('[MenuIntegration] Cannot update menu position: Config not properly initialized');
      return;
    }
    
    // Update the property in our local config using a type-safe approach
    const validProperties = ['rightPercentage', 'topPercentage', 'minRightPercentage', 'maxRightPercentage'];
    
    if (validProperties.includes(property)) {
      // Cast the property name to keyof MenuPositionConfig for type safety
      const positionKey = property as keyof MenuPositionConfig;
      this.menuConfig.position[positionKey] = value;
      
      // Apply the change to the DOM
      this.updateMenuDimensions();
      
      if (this.isDebugMode) {
        console.log(`[MenuIntegration] Position updated: ${property} = ${value}`);
      }
    } else {
      console.warn(`[MenuIntegration] Unknown position property: ${property}`);
    }
  }

  // 【✓】 Method to get the current menu configuration
  public getConfig(): any {
    return this.menuConfig;
  }

  // 【✓】 Update menu dimensions using the current stored config
  private updateMenuDimensionsWithCurrentConfig(): void {
    if (!this.menuContainer || !this.menuConfig) return;
    
    const position = this.menuConfig.position;
    const size = this.menuConfig.size;
    
    // Use the exact values from our config
    const rightPosition = `${position.rightPercentage}%`;
    const topPosition = `${position.topPercentage}%`;
    
    // Calculate width based on viewport or max-width constraint
    const viewportWidth = window.innerWidth;
    const calculatedWidth = Math.min(
      (viewportWidth * size.widthPercentage) / 100,
      size.maxWidth
    );
    
    // Apply styles directly to the menu container
    this.menuContainer.style.position = 'absolute';
    this.menuContainer.style.right = rightPosition;
    this.menuContainer.style.top = topPosition;
    this.menuContainer.style.width = `${calculatedWidth}px`;
    this.menuContainer.style.height = `${size.heightPercentage}%`;
    this.menuContainer.style.transformOrigin = this.menuConfig.transformOrigin;
    this.menuContainer.style.zIndex = this.menuConfig.zIndex.toString();
    
    // Add a data attribute for easier debugging
    this.menuContainer.setAttribute('data-right-percent', position.rightPercentage.toString());
    this.menuContainer.setAttribute('data-top-percent', position.topPercentage.toString());
    
    // Inner container should be positioned relative to the main container
    if (this.originalMenuContainer) {
      this.originalMenuContainer.style.position = 'absolute';
      this.originalMenuContainer.style.top = '0';
      this.originalMenuContainer.style.right = '0';
      this.originalMenuContainer.style.width = '100%';
      this.originalMenuContainer.style.height = '100%';
    }
  }
}
