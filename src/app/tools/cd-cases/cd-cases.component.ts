import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { DebugMenuComponent } from '../debug-menu/debug-menu.component';
import { CDCase, CaseSettings, SceneSettings, Config } from '../shared/interfaces';
import config from './config/config.json';
import { CDCasesService } from './services/cd-cases.service';
import { SceneService } from './services/scene/scene.service';
import { allCases, updateCasePositions } from './models';
import { SceneLoaderComponent } from './scene-loader/scene-loader.component';
import { CDCasesEventsService } from './services/events/cd-cases-events.service';
import { CDCaseAnimationsService } from './services/animations/cd-case-animations.service';
import { CDCasesDebugService } from './services/debug/cd-cases-debug.service';
import { CDCasesStateService } from './services/state/cd-cases-state.service';
// Import all component services from the index file
import { 
  VideoService, 
  EventHandlerService, 
  SilhouetteService, 
  RendererService, 
  CaseAnimationService,
  ViewHelperService,
  SetupHelperService,
  AnimationHelperService,
  SceneConfigHelperService
} from './component-services';
import { MenuIntegrationService } from '../right-side-menu/services/menu-integration.service';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

@Component({
  selector: 'app-cd-cases',
  standalone: true,
  imports: [CommonModule, DebugMenuComponent, SceneLoaderComponent],
  providers: [
    VideoService, 
    EventHandlerService, 
    SilhouetteService, 
    RendererService, 
    CaseAnimationService,
    MenuIntegrationService,
    ViewHelperService,
    SetupHelperService,
    AnimationHelperService,
    SceneConfigHelperService,
    CDCasesService,
    SceneService,
    CDCasesEventsService,
    CDCaseAnimationsService,
    CDCasesDebugService,
    CDCasesStateService,
  ],
  templateUrl: './cd-cases.component.html',
  styleUrls: ['./cd-cases.component.scss']
})
export class CDCasesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('labelRenderer') private labelRendererElement!: ElementRef<HTMLDivElement>;

  private renderer!: THREE.WebGLRenderer;
  private labelRenderer!: CSS3DRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private animationId: number | null = null;
  public cdCases: CDCase[] = [];
  private config: Config = config;
  private loadingPromises: Promise<void>[] = [];
  public isLoading = true;

  // Lights
  private ambientLight!: THREE.AmbientLight;
  private mainLight!: THREE.DirectionalLight;
  private fillLight!: THREE.DirectionalLight;
  private backLight!: THREE.DirectionalLight;

  // Light helpers
  private mainLightHelper!: THREE.DirectionalLightHelper;
  private fillLightHelper!: THREE.DirectionalLightHelper;
  private backLightHelper!: THREE.DirectionalLightHelper;

  // Debug settings
  public sceneSettings: SceneSettings = {
    cameraX: this.config.sceneSettings.camera.position.x,
    cameraY: this.config.sceneSettings.camera.position.y,
    cameraZ: this.config.sceneSettings.camera.position.z,
    lookAtX: this.config.sceneSettings.camera.lookAt.x,
    lookAtY: this.config.sceneSettings.camera.lookAt.y,
    lookAtZ: this.config.sceneSettings.camera.lookAt.z,
    ambientIntensity: this.config.sceneSettings.lighting.ambient.intensity,
    mainLightIntensity: this.config.sceneSettings.lighting.main.intensity,
    exposure: this.config.sceneSettings.renderer.exposure,
    orbitMinPolarAngle: this.config.sceneSettings.orbitControls.minPolarAngle,
    orbitMaxPolarAngle: this.config.sceneSettings.orbitControls.maxPolarAngle,
    orbitMinDistance: this.config.sceneSettings.orbitControls.minDistance,
    orbitMaxDistance: this.config.sceneSettings.orbitControls.maxDistance,
    orbitDampingFactor: this.config.sceneSettings.orbitControls.dampingFactor,
    groundY: this.config.sceneSettings.ground.y,
    groundOpacity: this.config.sceneSettings.ground.opacity,
    lockControls: this.config.sceneSettings.camera.lockControls,
    // Initialize background effect toggles to true
    bgEffectContinents: true,
    bgEffectMountains: true,
    bgEffectWaves: true,
    bgEffectBorders: true,
    bgEffectSwirls: true,
    bgEffectLightRays: true,
    bgEffectParticles: true,
    bgEffectVideoInfluence: true,
    bgEffectBloom: true,
    bgEffectFilmGrain: true,
    bgEffectVignette: true
  };
  
  public caseSettings: CaseSettings = {};

  // Rename from videoPlane to rightSideMenuPlane
  private rightSideMenuPlane!: THREE.Mesh;
  // Keep original videoPlane for background effects
  private videoPlane!: THREE.Mesh;
  private backgroundPlane!: THREE.Mesh;
  private caseBackVideoPlane!: THREE.Mesh;
  private videoPlay!: () => void;
  private videoPause!: () => void;
  private updateVideoSource!: (videoPath: string) => void;
  
  // Animation state is now managed by CaseAnimationService
  // Use getters to maintain compatibility with existing code
  private get isManuallyAnimating(): boolean {
    return this.caseAnimationService.getIsManuallyAnimating();
  }
  
  private get manuallyAnimatedCaseId(): number | null {
    return this.caseAnimationService.getManuallyAnimatedCaseId();
  }
  
  private get activeCaseExpanded(): boolean {
    return this.caseAnimationService.getActiveCaseExpanded();
  }
  
  // Video paths are now loaded from the config file
  private videoPaths: string[] = [];
  
  // Initialize arrays to track music playback and tutorial completion
  private playingMusic: boolean[] = [];
  private tutorialCompleted: boolean[] = [];

  private css3DMenu: any; // The CSS3D object containing our menu

  constructor(
    private cdCasesService: CDCasesService,
    private sceneService: SceneService,
    private eventsService: CDCasesEventsService,
    private animationService: CDCaseAnimationsService,
    private debugService: CDCasesDebugService,
    private stateService: CDCasesStateService,
    private videoService: VideoService,
    private eventHandlerService: EventHandlerService,
    private silhouetteService: SilhouetteService,
    private rendererService: RendererService,
    private caseAnimationService: CaseAnimationService,
    private menuIntegrationService: MenuIntegrationService,
    private viewHelperService: ViewHelperService,
    private setupHelperService: SetupHelperService,
    private animationHelperService: AnimationHelperService,
    private sceneConfigHelperService: SceneConfigHelperService,
    private ngZone: NgZone
  ) {}

  /**
   * Initializes component data and services
   * Sets up configuration and initializes state tracking arrays
   * 【✓】
   */
  ngOnInit(): void {
    // Load cases data
    this.config.cdCases = updateCasePositions(allCases);
    
    // Load video paths from config
    this.videoPaths = this.config.videoPaths || [];
    
    // Initialize services with config
    this.videoService.setConfig(this.config);
    this.silhouetteService.setConfig(this.config);
    this.rendererService.setConfig(this.config);
    this.caseAnimationService.setConfig(this.config);

    // Initialize arrays based on the number of cases
    const caseCount = this.config.cdCases.length;
    this.playingMusic = new Array(caseCount).fill(false);
    this.tutorialCompleted = new Array(caseCount).fill(false);
  }

  /**
   * Sets up the 3D environment after the view is initialized
   * Creates renderers, controls, and loads 3D models
   * Configures menu system as DOM overlay
   * 【✓】
   */
  ngAfterViewInit(): void {
    this.setupRenderer();
    this.setupControls();
    
    // Set up the CSS3D renderer for any 2D/3D integration needs 
    // (though we won't use it for the menu anymore)
    this.setupCSS3DRenderer();
    
    // Add our menu component as DOM overlay instead of using CSS3D
    // Do this before loading models to ensure it's interactable from the start
    this.setupRightSideMenu();
    
    // Now load models (do this last so menu is ready first)
    this.loadModels().then(() => {
      // Initialize caseSettings for each CD case to prevent "Cannot read properties of undefined" errors
      this.cdCases.forEach(cdCase => {
        if (!this.caseSettings[cdCase.id]) {
          // Default settings if none exist
          this.caseSettings[cdCase.id] = {
            positionX: 0,
            positionY: 0,
            positionZ: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0
          };
        }
      });
      
      // Set up the scene for the SilhouetteService
      this.silhouetteService.setScene(this.scene);
      
      this.isLoading = false;
    });

    // Set the expand function for use after scrolling
    this.caseAnimationService.setExpandFunction(this.expandActiveCase.bind(this));
  }

  /**
   * Sets up the WebGL renderer, scene, camera, and lighting
   * Creates video planes and initializes core Three.js components
   * 【✓】
   */
  private setupRenderer(): void {
    // Use the SetupHelperService to set up the renderer
    const results = this.setupHelperService.setupRenderer(
      this.canvasRef.nativeElement, 
      this.sceneService,
      this.config
    );
    
    // Get references to components
    this.renderer = results.renderer;
    this.scene = results.scene;
    this.camera = results.camera;
    
    // Get references to lights
    this.ambientLight = results.lights.ambientLight;
    this.mainLight = results.lights.mainLight;
    this.fillLight = results.lights.fillLight;
    this.backLight = results.lights.backLight;

    // Get references to light helpers
    this.mainLightHelper = results.lightHelpers.mainLightHelper;
    this.fillLightHelper = results.lightHelpers.fillLightHelper;
    this.backLightHelper = results.lightHelpers.backLightHelper;
    
    // Get references to video-related elements
    this.rightSideMenuPlane = results.videoElements.rightSideMenuPlane;
    this.backgroundPlane = results.videoElements.backgroundPlane;
    this.caseBackVideoPlane = results.videoElements.caseBackVideoPlane;
    
    // Get references to video controls
    this.videoPlay = results.videoElements.videoPlay;
    this.videoPause = results.videoElements.videoPause;
    this.updateVideoSource = results.videoElements.updateVideoSource;
  }

  /**
   * Sets up camera controls for scene navigation
   * Configures OrbitControls with appropriate constraints
   * 【✓】
   */
  private setupControls(): void {
    // Use the SetupHelperService to set up the controls
    this.controls = this.setupHelperService.setupControls(this.sceneService);
    
    // Make sure controls match sceneSettings after initialization
    this.setupHelperService.updateOrbitControls(this.controls, this.sceneSettings);
  }

  /**
   * Loads CD case models and initializes related state
   * Creates 3D representations of album cases and sets up initial positions
   * Activated first case and sets up silhouette effects
   * 【✗】 - Refactored to SetupHelperService
   */
  private async loadModels(): Promise<void> {
    try {
      // Load CD cases
      this.cdCases = await this.cdCasesService.loadModels(this.config, this.scene, this.renderer);
      
      // Initialize playingMusic array to match CD cases
      this.playingMusic = new Array(this.cdCases.length).fill(false);
      
      // Initialize tutorialCompleted array to match CD cases
      this.tutorialCompleted = new Array(this.cdCases.length).fill(false);
      
      // Initialize caseSettings for each CD case to prevent "Cannot read properties of undefined" errors
      this.cdCases.forEach(cdCase => {
        if (!this.caseSettings[cdCase.id]) {
          // Default settings if none exist
          this.caseSettings[cdCase.id] = {
            positionX: 0,
            positionY: 0,
            positionZ: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0
          };
        }
      });
      
      // Add label renderer to DOM and start animation
      this.labelRendererElement.nativeElement.appendChild(this.labelRenderer.domElement);
      this.animate();
      this.addEventListeners();

      // Ensure everything is rendered before showing
      this.renderer.render(this.scene, this.camera);
      this.labelRenderer.render(this.scene, this.camera);

      // Hide loading screen
      this.isLoading = false;

      // Wait for next frame to ensure all cases are properly positioned
      await new Promise(resolve => requestAnimationFrame(resolve));

      // Activate first case after ensuring all cases are in their initial positions
      this.stateService.setActiveCase(this.cdCases, 0);
      
      // Create silhouette for active case
      const activeCase = this.cdCases.find(cdCase => cdCase.isActive);
      if (activeCase) {
        this.createActiveCaseSilhouette(activeCase);
        
        // Initialize videoPlane2 alignment with active case
        this.videoService.updateVideoPlane2Alignment(
          this.caseBackVideoPlane,
          this.isManuallyAnimating,
          this.manuallyAnimatedCaseId,
          this.cdCases
        );
      }

    } catch (error) {
      console.error('Error loading scene:', error);
      this.isLoading = false;
    }
  }

  /**
   * Adds event listeners for user interaction with CD cases
   * Sets up mouse/touch handlers for case selection and manipulation
   * 【✓】
   */
  private addEventListeners(): void {
    // Use the SetupHelperService to add event listeners
    this.setupHelperService.addEventListeners(
      this.canvasRef.nativeElement,
      this.cdCases,
      this.camera,
      this.eventsService,
      this.tutorialCompleted,
      () => this.activeCaseExpanded,
      this.caseBackVideoPlane,
      this.expandActiveCase.bind(this),
      this.animateActiveCaseBack.bind(this)
    );
  }
  
  /**
   * Reveals video and background planes when a case is expanded
   * Handles transition between browsing and detailed view modes
   * 【✓】
   */
  private revealVideoAndBackground(): void {
    this.viewHelperService.revealVideoAndBackground(
      this.backgroundPlane,
      this.cdCases,
      this.videoPaths
    );
  }

  /**
   * Updates background visual effects based on scene settings
   * Controls shader parameters for the cosmic background
   * 【✓】
   */
  public updateBackgroundEffects(): void {
    this.viewHelperService.updateBackgroundEffects(this.sceneSettings);
  }
  
  /**
   * Removes silhouette effect from a CD case
   * Restores original materials when a case is no longer active
   * 【✓】
   */
  private removeSilhouetteEffect(cdCase: CDCase): void {
    this.viewHelperService.removeSilhouetteEffect(cdCase);
  }
  
  /**
   * Creates a pulsating silhouette for the active case
   * Provides visual feedback to highlight the selected case
   * 【✓】
   */
  private createActiveCaseSilhouette(cdCase: CDCase): void {
    this.silhouetteService.createActiveCaseSilhouette(cdCase, this.tutorialCompleted);
  }

  /**
   * Main animation loop that runs every frame
   * Orchestrates all animations, physics updates, and rendering
   * 【✓】
   */
  private animate(): void {
    if (!this.renderer) return;
    
    this.animationId = requestAnimationFrame(() => this.animate());
    
    // Use the AnimationHelperService to handle animation
    this.animationHelperService.animate(
      this.renderer,
      this.scene,
      this.camera,
      this.controls,
      this.labelRenderer,
      this.cdCases,
      this.caseBackVideoPlane,
      this.rightSideMenuPlane,
      this.isManuallyAnimating,
      this.manuallyAnimatedCaseId,
      this.activeCaseExpanded,
      this.playingMusic,
      this.tutorialCompleted
    );
  }

  /**
   * Updates camera settings from debug panel values
   * Part of the debug configuration system
   * 【✓】
   */
  public updateCamera(): void {
    this.sceneConfigHelperService.updateCamera(this.camera, this.controls, this.sceneSettings);
  }

  /**
   * Updates lighting parameters from debug panel
   * Controls colors, intensities and positions of all scene lights
   * 【✓】
   */
  public updateLighting(): void {
    this.sceneConfigHelperService.updateLighting(
      this.ambientLight,
      this.mainLight,
      this.mainLightHelper,
      this.fillLightHelper,
      this.backLightHelper,
      this.sceneSettings
    );
  }

  /**
   * Updates renderer settings from debug panel
   * Controls exposure, gamma, and tone mapping
   * 【✓】
   */
  public updateRenderer(): void {
    this.sceneConfigHelperService.updateRenderer(this.renderer, this.sceneSettings);
  }

  /**
   * Updates orbit controls parameters from debug panel
   * Adjusts camera movement constraints and behavior
   * 【✓】
   */
  public updateOrbitControls(): void {
    this.sceneConfigHelperService.updateOrbitControls(this.controls, this.sceneSettings);
  }

  /**
   * Updates ground plane settings from debug panel
   * Controls floor visibility and appearance
   * 【✓】
   */
  public updateGround(): void {
    this.sceneConfigHelperService.updateGround(this.scene, this.sceneSettings);
  }

  /**
   * Updates individual case transform from debug panel
   * Fine-tunes position and rotation of CD cases
   * 【✓】
   */
  public updateCaseTransform(cdCase: CDCase): void {
    this.sceneConfigHelperService.updateCaseTransform(cdCase);
  }

  /**
   * Resets all debug settings to default values
   * Returns scene to initial configuration
   * 【✓】
   */
  public resetToDefault(): void {
    this.sceneConfigHelperService.resetToDefault(
      this.sceneSettings,
      this.config,
      this.cdCases,
      this.updateCamera.bind(this),
      this.updateLighting.bind(this),
      this.updateRenderer.bind(this),
      this.updateOrbitControls.bind(this),
      this.updateGround.bind(this),
      this.updateCaseTransform.bind(this)
    );
  }

  /**
   * Handles window resize events to maintain proper rendering
   * Adjusts camera and renderer dimensions for responsive display
   * 【✓】
   */
  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    if (!this.renderer || !this.camera || !this.labelRenderer) return;
    
    // Get current viewport dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    
    // Update camera aspect ratio
    this.camera.aspect = aspectRatio;
    
    // Calculate scaling factor to prevent empty space at screen edges
    // Use design resolution of 1920x1080 as base
    const designWidth = 1920;
    const designHeight = 1080;
    const designAspect = designWidth / designHeight;
    
    // Default FOV value - most THREE.js cameras use 75 as default
    const defaultFOV = 75;
    
    // Adjust camera parameters based on aspect ratio differences
    if (aspectRatio > designAspect) {
      // Wider screen - use a wider FOV to show more horizontal content
      const widthRatio = aspectRatio / designAspect;
      // Much more aggressive FOV adjustment for wider screens
      this.camera.fov = defaultFOV * (0.7 / widthRatio);
    } else {
      // Taller screen - use a narrower FOV to show more vertical content
      const heightRatio = designAspect / aspectRatio;
      // Much more aggressive FOV adjustment for taller screens
      this.camera.fov = defaultFOV * 0.75 * heightRatio;
    }
    
    // Update the camera's projection matrix
    this.camera.updateProjectionMatrix();
    
    // Update renderers with new dimensions
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    
    // Reposition cases if needed
    this.adjustCasePositionsForAspectRatio();
    
    // Update the camera's position to ensure the scene is properly centered
    this.centerCamera();
  }

  // Add a method to ensure the camera is properly positioned 
  private centerCamera(): void {
    // Get the active case position as a reference point
    const activeCase = this.cdCases.find(cdCase => cdCase.isActive);
    if (activeCase && this.camera) {
      // Calculate a position that ensures the active case is centered
      // Adjust the camera's z position to ensure the scene fills the viewport
      const zPosition = Math.max(window.innerWidth, window.innerHeight) / 150;
      
      // Move the camera to look at the active case
      this.camera.position.set(0, 0, zPosition);
      this.camera.lookAt(0, 0, 0);
      
      // Update camera far clip plane to ensure we see everything
      this.camera.far = 2000;
      this.camera.updateProjectionMatrix();
    }
    
    // Reset the container to ensure no positioning issues
    const container = document.querySelector('.cd-cases-container') as HTMLElement;
    if (container) {
      container.style.display = 'flex';
      container.style.justifyContent = 'center';
      container.style.alignItems = 'center';
      container.style.position = 'absolute';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100vw';
      container.style.height = '100vh';
    }
    
    // Reset both canvas and label renderer to 100%
    const canvas = this.renderer?.domElement;
    if (canvas) {
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
    }
    
    const labelRenderer = document.querySelector('.label-renderer') as HTMLElement;
    if (labelRenderer) {
      labelRenderer.style.width = '100%';
      labelRenderer.style.height = '100%';
      labelRenderer.style.position = 'absolute';
      labelRenderer.style.top = '0';
      labelRenderer.style.left = '0';
    }
  }

  // Replace centerContainer with a call to centerCamera
  private centerContainer(): void {
    this.centerCamera();
  }

  // 【✓】 Helper to update case positions based on screen aspect ratio
  private adjustCasePositionsForAspectRatio(): void {
    // Calculate aspect-based position adjustments
    const aspectRatio = window.innerWidth / window.innerHeight;
    const designAspect = 16 / 9; // Base design aspect ratio
    
    // Apply position adjustments
    this.cdCases.forEach(cdCase => {
      // Get original position from the case's userData
      const originalPosition = cdCase.model.userData['originalPosition'] || 
        { x: cdCase.model.position.x, y: cdCase.model.position.y, z: cdCase.model.position.z };
      
      // Store original position if not yet saved
      if (!cdCase.model.userData['originalPosition']) {
        cdCase.model.userData['originalPosition'] = originalPosition;
      }
      
      // More aggressive position adjustments based on aspect ratio
      if (aspectRatio > designAspect) {
        // Wider screen - increase X spread
        const widthFactor = Math.min(aspectRatio / designAspect * 1.15, 1.8);
        cdCase.model.position.x = originalPosition.x * widthFactor;
      } else {
        // Taller screen - increase Y spread
        const heightFactor = Math.min(designAspect / aspectRatio * 1.15, 1.8);
        cdCase.model.position.y = originalPosition.y * heightFactor;
      }
    });
    
    // Also update positions through the state service if needed
    if (this.cdCases.length > 0) {
      this.stateService.updatePositions(this.cdCases);
    }
  }

  /**
   * Cleans up resources when component is destroyed
   * Cancels animation loop and releases memory
   * 【✓】
   */
  ngOnDestroy(): void {
    // Use the RendererService to clean up resources
    this.rendererService.cleanUpResources(this.cdCases, this.animationId);
    
    // Clean up the menu integration
    this.menuIntegrationService.destroy();
  }

  /**
   * Handles mouse wheel events for case navigation
   * Implements scrolling behavior to cycle through cases
   * 【✓】
   */
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    this.eventHandlerService.onWheel(
      event,
      this.cdCases,
      this.sceneSettings,
      this.stateService,
      this.animationService,
      this.createActiveCaseSilhouette.bind(this),
      this.animateActiveCaseBack.bind(this),
      this.updateVideoForNewActiveCase.bind(this),
      () => this.activeCaseExpanded,
      this.caseAnimationService.resetCasePosition.bind(this.caseAnimationService)
    );
  }

  /**
   * Animates a case back to its original position
   * Handles the transition when a case is collapsed
   * 【✓】
   */
  private animateActiveCaseBack(activeCase: CDCase, newIndex: number, wasExpandedBefore: boolean): void {
    // Delegate to the CaseAnimationService
    this.caseAnimationService.animateActiveCaseBack(
      activeCase,
      newIndex,
      wasExpandedBefore,
      this.cdCases,
      this.caseBackVideoPlane,
      this.rightSideMenuPlane,
      this.stateService,
      this.updateVideoForNewActiveCase.bind(this),
      () => this.videoService.updateVideoPlane2Alignment(
        this.caseBackVideoPlane,
        this.isManuallyAnimating,
        this.manuallyAnimatedCaseId,
        this.cdCases
      )
    );
  }
  
  /**
   * Updates video content when a new case becomes active
   * Synchronizes displayed media with the selected case
   * 【✓】
   */
  private updateVideoForNewActiveCase(newIndex: number, wasExpandedBefore: boolean = false): void {
    this.viewHelperService.updateVideoForNewActiveCase(
      newIndex,
      wasExpandedBefore,
      this.videoPaths,
      this.playingMusic,
      this.cdCases,
      this.tutorialCompleted,
      this.createSilhouetteWrapper.bind(this),
      this.expandActiveCaseWrapper.bind(this)
    );
  }

  /**
   * Expands the currently active case with animations
   * Transitions from browsing mode to detailed view
   * 【✓】
   */
  private expandActiveCase(clickedCase: CDCase): void {
    // Delegate to the CaseAnimationService
    this.caseAnimationService.expandActiveCase(
      clickedCase,
      this.cdCases,
      this.playingMusic,
      this.tutorialCompleted,
      this.caseBackVideoPlane,
      this.rightSideMenuPlane,
      this.videoService.resetCaseBackVideoPlane.bind(this.videoService),
      this.removeSilhouetteEffect.bind(this),
      this.revealVideoAndBackground.bind(this),
      () => this.videoService.updateVideoPlane2Alignment(
        this.caseBackVideoPlane,
        this.isManuallyAnimating,
        this.manuallyAnimatedCaseId,
        this.cdCases
      )
    );
  }

  /**
   * Sets up the CSS3D renderer for HTML content in 3D space
   * Enables integration of Angular components with the 3D scene
   * 【✓】
   */
  private setupCSS3DRenderer(): void {
    this.labelRenderer = this.viewHelperService.setupCSS3DRenderer(this.labelRendererElement);
  }
  
  /**
   * Sets up the right side menu for track selection
   * Creates an interactive UI that appears in 3D space
   * 【✓】
   */
  private setupRightSideMenu(): void {
    this.css3DMenu = this.viewHelperService.setupRightSideMenu(
      this.scene,
      this.config,
      this.cdCases,
      this.rightSideMenuPlane,
      this.handleTrackSelection.bind(this)
    );
  }
  
  /**
   * Creates a silhouette effect wrapper function
   * Used for highlighting active cases
   * 【✓】
   */
  private createSilhouetteWrapper(cdCase: CDCase): void {
    this.viewHelperService.createSilhouetteWrapper(cdCase, this.tutorialCompleted);
  }

  /**
   * Wrapper for expanding the active case with proper animations
   * Handles the transition to detailed view mode
   * 【✓】
   */
  private expandActiveCaseWrapper(cdCase: CDCase): void {
    this.viewHelperService.expandActiveCaseWrapper(
      cdCase,
      this.cdCases,
      this.playingMusic,
      this.tutorialCompleted,
      this.caseBackVideoPlane,
      this.rightSideMenuPlane,
      this.revealVideoAndBackground.bind(this),
      () => this.videoService.updateVideoPlane2Alignment(
        this.caseBackVideoPlane,
        this.isManuallyAnimating,
        this.manuallyAnimatedCaseId,
        this.cdCases
      )
    );
  }

  /**
   * Handles track selection from the menu
   * Processes user interaction with the track list
   * 【✓】
   */
  private handleTrackSelection(index: number): void {
    // Handle track selection - activate the corresponding CD case
    if (index >= 0 && index < this.cdCases.length) {
      // First deactivate any currently active case
      const activeCase = this.cdCases.find(c => c.isActive);
      if (activeCase) {
        this.eventHandlerService.deactivateCase(
          activeCase,
          this.cdCases,
          this.playingMusic,
          this.tutorialCompleted,
          this.caseBackVideoPlane,
          this.createSilhouetteWrapper.bind(this),
          this.expandActiveCaseWrapper.bind(this)
        );
      }
      
      // Then activate the selected case
      setTimeout(() => {
        this.eventHandlerService.activateCase(
          this.cdCases[index],
          this.cdCases,
          this.playingMusic,
          this.tutorialCompleted,
          this.caseBackVideoPlane,
          this.createSilhouetteWrapper.bind(this),
          this.expandActiveCaseWrapper.bind(this)
        );
      }, 300);
    }
  }
} 