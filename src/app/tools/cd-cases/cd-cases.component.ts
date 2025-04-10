import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, NgZone, OnInit, Output, EventEmitter } from '@angular/core';
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
  @Output() loadingChange = new EventEmitter<boolean>();

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

  // Add constant for target aspect ratio
  private readonly targetAspect = 16 / 9;

  // Add debug mode flag
  private isDebugMode = false;

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

  // 【✓】 Initialize services and setup scene
  private initializeServices(): void {
    // Load CD cases data and initialize services
    this.loadCDCases();
  }

  // 【✓】 Setup scene and initialize components
  private setupScene(): void {
    if (this.isDebugMode) {
      console.log('[CDCases] Setting up scene');
    }
    
    // Setup renderers and controls
    this.setupRenderer();
    this.setupControls();
    this.setupCSS3DRenderer();
    this.setupRightSideMenu();
    
    // Load models and initialize scene
    this.loadModels().then(() => {
      if (this.isDebugMode) {
        console.log('[CDCases] Scene setup completed');
      }
      this.setLoadingState(false);
    }).catch(error => {
      console.error('[CDCases] Error setting up scene:', error);
      this.setLoadingState(false);
    });
  }

  /**
   * Initializes component data and services
   * Sets up configuration and initializes state tracking arrays
   * 【✓】
   */
  ngOnInit(): void {
    if (this.isDebugMode) {
      console.log('[CDCases] Initializing component');
    }
    
    // Initialize services only
    this.initializeServices();
  }

  /**
   * Sets up the 3D environment after the view is initialized
   * Creates renderers, controls, and loads 3D models
   * Configures menu system as DOM overlay
   * 【✓】
   */
  ngAfterViewInit(): void {
    if (this.isDebugMode) {
      console.log('[CDCases] AfterViewInit - Setting up renderers and controls');
    }
    
    // Setup renderers and controls
    this.setupRenderer();
    this.setupControls();
    this.setupCSS3DRenderer();
    this.setupRightSideMenu();
    
    // Load models and initialize scene
    this.loadModels().then(() => {
      if (this.isDebugMode) {
        console.log('[CDCases] Models loaded successfully');
      }
      this.setLoadingState(false);
    }).catch(error => {
      console.error('[CDCases] Error loading models:', error);
      this.setLoadingState(false);
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
    
    // Disable zooming in OrbitControls
    this.controls.enableZoom = false;
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN
    };
    
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
      
      // Initialize caseSettings for each CD case
      this.cdCases.forEach(cdCase => {
        if (!this.caseSettings[cdCase.id]) {
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
      console.error('[CDCases] Error loading scene:', error);
      this.setLoadingState(false);
      throw error; // Re-throw to be caught by the caller
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
  public updateCaseTransform(event: CDCase): void {
    this.sceneConfigHelperService.updateCaseTransform(event);
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
    
    // Calculate aspect ratios
    const currentAspect = width / height;
    const targetAspect = 16 / 9; // Our design aspect ratio
    
    // Base FOV for 16:9 aspect ratio
    const baseFOV = 60;
    
    // Adjust FOV based on aspect ratio to maintain scene composition
    if (currentAspect > targetAspect) {
      // Wider screen - increase FOV horizontally
      this.camera.fov = baseFOV / (currentAspect / targetAspect);
    } else {
      // Taller screen - increase FOV vertically
      this.camera.fov = baseFOV * (targetAspect / currentAspect);
    }
    
    // Update camera parameters
    this.camera.aspect = currentAspect;
    this.camera.updateProjectionMatrix();
    
    // Update renderers with new dimensions
    this.renderer.setSize(width, height);
    this.labelRenderer.setSize(width, height);
    
    // Ensure pixel ratio is set correctly
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  // Update centerCamera to maintain fixed positions
  private centerCamera(): void {
    const activeCase = this.cdCases.find(cdCase => cdCase.isActive);
    
    if (activeCase && this.camera) {
      // Keep camera at fixed distance regardless of screen size
      const zPosition = 10; // Fixed distance that works for our scene
      
      this.camera.position.set(0, 0, zPosition);
      this.camera.lookAt(0, 0, 0);
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
    
    // Debug logging for aspect ratio adjustments
    if (this.isDebugMode) {
      console.log(`[CDCases] Current Aspect Ratio: ${aspectRatio.toFixed(3)}`);
      console.log(`[CDCases] Design Aspect Ratio: ${designAspect.toFixed(3)}`);
    }
    
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
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      return;
    }
    
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
    console.log(`Expanding case ${clickedCase.id}`);
    
    // Reload menu config to ensure positioning is updated
    this.menuIntegrationService.reloadMenuConfig();
    
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
  public handleTrackSelection(index: number): void {
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

  // Add the loadCDCases method to load CD cases data and initialize services
  /**
   * 【✓】 Loads CD cases data and initializes services with configuration
   * Sets up tracking arrays for playback and tutorial state
   */
  private loadCDCases(): void {
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

  // Add keyboard event handler to prevent zooming shortcuts
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): boolean {
    // Prevent Ctrl/Cmd + Plus/Minus/Zero/Wheel for zooming
    if ((event.ctrlKey || event.metaKey) && 
        (event.key === '+' || 
         event.key === '-' || 
         event.key === '0' || 
         event.key === '=')) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  private setLoadingState(isLoading: boolean) {
    if (this.isDebugMode) {
      console.log('[CDCases] Setting loading state:', isLoading);
    }
    this.isLoading = isLoading;
    this.loadingChange.emit(isLoading);
  }
} 