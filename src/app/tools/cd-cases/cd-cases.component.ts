import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, NgZone, OnInit, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, isDevMode } from '@angular/core';
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
  imports: [CommonModule, DebugMenuComponent],
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
  styleUrls: ['./cd-cases.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  // Initialize debug mode flag - use Angular's isDevMode() for production detection
  public isDebugMode = isDevMode();

  // Add a member property for the resize observer
  private resizeObserver: ResizeObserver | null = null;

  // Add a property for wheel event debouncing
  private wheelDebounceTimer: any = null;
  private readonly WHEEL_DEBOUNCE_DELAY = 150; // ms

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
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
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
    
    // Load models and initialize scene - don't set loading state here
    // as it's now managed in ngAfterViewInit
    this.loadModels().then(() => {
      if (this.isDebugMode) {
        console.log('[CDCases] Scene setup completed');
      }
    }).catch(error => {
      console.error('[CDCases] Error setting up scene:', error);
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
    
    // Set loading state to true at initialization and emit to parent
    this.setLoadingState(true);
    
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
    
    // Set up ResizeObserver for more efficient resize handling
    this.setupResizeObserver();
    
    // Load models and initialize scene
    this.loadModels().then(() => {
      if (this.isDebugMode) {
        console.log('[CDCases] Models loaded successfully');
      }
      
      // Notify parent that loading is complete after small delay to ensure rendering
      setTimeout(() => {
        this.setLoadingState(false);
      }, 500);
    }).catch(error => {
      console.error('[CDCases] Error loading models:', error);
      this.setLoadingState(false);
    });

    // Set the expand function for use after scrolling
    this.caseAnimationService.setExpandFunction(this.expandActiveCase.bind(this));
  }

  /**
   * Sets up a ResizeObserver for more efficient resize handling
   * Modern alternative to window resize event
   * 【✓】
   */
  private setupResizeObserver(): void {
    // Only create if ResizeObserver is available and canvas exists
    if (typeof ResizeObserver !== 'undefined' && this.canvasRef?.nativeElement) {
      // Run outside Angular zone to avoid change detection triggers
      this.ngZone.runOutsideAngular(() => {
        this.resizeObserver = new ResizeObserver((entries) => {
          // Use requestAnimationFrame to debounce and sync with render cycle
          if (this.resizeDebounceId) {
            cancelAnimationFrame(this.resizeDebounceId);
          }
          
          this.resizeDebounceId = requestAnimationFrame(() => {
            this.updateRendererSize();
          });
        });
        
        // Observe the parent container for size changes
        const container = this.canvasRef.nativeElement.parentElement;
        if (container) {
          this.resizeObserver.observe(container);
          
          if (this.isDebugMode) {
            console.log('[CDCases] ResizeObserver set up on container');
          }
        }
      });
    } else if (this.isDebugMode) {
      console.log('[CDCases] ResizeObserver not available, falling back to window resize');
    }
  }

  /**
   * Sets up the WebGL renderer, scene, camera, and lighting
   * Creates video planes and initializes core Three.js components
   * Optimizes for modern GPUs and performance
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
    
    // Apply performance optimizations for the renderer
    this.optimizeRenderer();
    
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
   * Applies performance optimizations to the renderer
   * Sets appropriate renderer settings for modern GPUs
   * 【✓】
   */
  private optimizeRenderer(): void {
    if (!this.renderer) return;
    
    // Run outside Angular zone to avoid change detection
    this.ngZone.runOutsideAngular(() => {
      // Cap pixel ratio for performance
      const pixelRatio = Math.min(window.devicePixelRatio, 2);
      this.renderer.setPixelRatio(pixelRatio);
      
      // Set renderer parameters based on available properties
      // Use type assertion for properties that might not be in the type definitions
      if ('powerPreference' in this.renderer) {
        (this.renderer as any).powerPreference = 'high-performance';
      }
      
      // Set appropriate color encoding if available
      if ('outputColorSpace' in this.renderer) {
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      } else if ('sRGBEncoding' in THREE) {
        (this.renderer as any).outputEncoding = (THREE as any).sRGBEncoding;
      }
      
      // Enable shadow optimization if shadows are used
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      
      // Enable physical lighting model if available
      if ('physicallyCorrectLights' in this.renderer) {
        (this.renderer as any).physicallyCorrectLights = true;
      } else if ('useLegacyLights' in this.renderer) {
        (this.renderer as any).useLegacyLights = false;
      }
      
      if (this.isDebugMode) {
        console.log(`[CDCases] Renderer optimized with pixel ratio: ${pixelRatio}`);
      }
    });
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
   * Uses promise-based loading for better performance
   * 【✓】
   */
  private async loadModels(): Promise<void> {
    try {
      if (this.isDebugMode) {
        console.log('[CDCases] Starting model loading');
        console.time('model-loading');
      }
      
      // Load CD cases - use Promise.all to load models in parallel when possible
      this.cdCases = await this.cdCasesService.loadModels(this.config, this.scene, this.renderer);
      
      // Initialize arrays and settings in parallel
      await Promise.all([
        // Initialize tracking arrays
        this.initializeTrackingArrays(),
        
        // Initialize case settings
        this.initializeCaseSettings()
      ]);
      
      // Add label renderer to DOM and start animation
      this.labelRendererElement.nativeElement.appendChild(this.labelRenderer.domElement);
      
      // Run animation outside Angular zone
      this.ngZone.runOutsideAngular(() => {
        this.animate();
      });
      
      // Add event listeners
      this.addEventListeners();

      // Ensure everything is rendered before showing
      this.renderer.render(this.scene, this.camera);
      this.labelRenderer.render(this.scene, this.camera);

      // Wait for next frame to ensure all cases are properly positioned
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

      // Activate first case after ensuring all cases are in their initial positions
      this.activateInitialCase();
      
      if (this.isDebugMode) {
        console.timeEnd('model-loading');
        console.log('[CDCases] Models loaded and initialized successfully');
      }
      
    } catch (error) {
      console.error('[CDCases] Error loading scene:', error);
      this.setLoadingState(false);
      throw error; // Re-throw to be caught by the caller
    }
  }
  
  /**
   * Initializes tracking arrays for music playback and tutorial state
   * 【✓】
   */
  private async initializeTrackingArrays(): Promise<void> {
    // Initialize playingMusic array to match CD cases
    this.playingMusic = new Array(this.cdCases.length).fill(false);
    
    // Initialize tutorialCompleted array to match CD cases
    this.tutorialCompleted = new Array(this.cdCases.length).fill(false);
    
    if (this.isDebugMode) {
      console.log(`[CDCases] Initialized tracking arrays for ${this.cdCases.length} cases`);
    }
  }
  
  /**
   * Initializes settings for each CD case
   * 【✓】
   */
  private async initializeCaseSettings(): Promise<void> {
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
    
    if (this.isDebugMode) {
      console.log(`[CDCases] Initialized settings for ${this.cdCases.length} cases`);
    }
  }
  
  /**
   * Activates the initial case and creates silhouette effect
   * 【✓】
   */
  private activateInitialCase(): void {
    // Activate first case
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
      
      if (this.isDebugMode) {
        console.log(`[CDCases] Activated initial case ID: ${activeCase.id}`);
      }
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
   * Runs outside Angular's change detection zone for better performance
   * 【✓】
   */
  private animate(): void {
    if (!this.renderer) return;
    
    // Run animation loop outside Angular zone for better performance
    this.ngZone.runOutsideAngular(() => {
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
    });
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
   * Uses debouncing for better performance
   * 【✓】
   */
  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    // Use requestAnimationFrame to debounce resize handling
    if (this.resizeDebounceId) {
      cancelAnimationFrame(this.resizeDebounceId);
    }
    
    this.resizeDebounceId = requestAnimationFrame(() => {
      this.updateRendererSize();
    });
  }
  
  // Add property for resize debouncing
  private resizeDebounceId: number | null = null;
  
  /**
   * Updates renderer and camera based on current window size
   * Extracts resize logic to a separate method for reuse
   * 【✓】
   */
  private updateRendererSize(): void {
    if (!this.renderer || !this.camera || !this.labelRenderer) return;
    
    // Run outside Angular zone to avoid triggering change detection
    this.ngZone.runOutsideAngular(() => {
      // Get current viewport dimensions
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Calculate aspect ratios
      const currentAspect = width / height;
      
      // Adjust FOV based on aspect ratio to maintain scene composition
      if (currentAspect > this.targetAspect) {
        // Wider screen - increase FOV horizontally
        this.camera.fov = 60 / (currentAspect / this.targetAspect);
      } else {
        // Taller screen - increase FOV vertically
        this.camera.fov = 60 * (this.targetAspect / currentAspect);
      }
      
      // Update camera parameters
      this.camera.aspect = currentAspect;
      this.camera.updateProjectionMatrix();
      
      // Update renderers with new dimensions
      this.renderer.setSize(width, height);
      this.labelRenderer.setSize(width, height);
      
      // Ensure pixel ratio is set correctly
      const pixelRatio = Math.min(window.devicePixelRatio, 2); // Cap at 2 for performance
      this.renderer.setPixelRatio(pixelRatio);
      
      // Adjust case positions for the new aspect ratio
      this.adjustCasePositionsForAspectRatio();
      
      if (this.isDebugMode) {
        console.log(`[CDCases] Renderer resized: ${width}x${height}, aspect: ${currentAspect.toFixed(2)}`);
      }
    });
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
   * Disconnects observers and event listeners
   * 【✓】
   */
  ngOnDestroy(): void {
    if (this.isDebugMode) {
      console.log('[CDCases] Component destroying - cleaning up resources');
    }
    
    // Clean up ResizeObserver
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    
    // Cancel any pending resize operations
    if (this.resizeDebounceId) {
      cancelAnimationFrame(this.resizeDebounceId);
      this.resizeDebounceId = null;
    }
    
    // Cancel any pending wheel debounce
    if (this.wheelDebounceTimer) {
      clearTimeout(this.wheelDebounceTimer);
      this.wheelDebounceTimer = null;
    }
    
    // Cancel animation loop
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    // Clean up the menu integration
    this.menuIntegrationService.destroy();
    
    // Perform comprehensive cleanup of THREE.js resources
    this.performComprehensiveCleanup();
  }

  /**
   * Handles mouse wheel events for case navigation
   * Implements scrolling behavior to cycle through cases
   * Uses debouncing for better performance
   * 【✓】
   */
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      return;
    }
    
    // Debounce wheel events to prevent rapid firing
    if (this.wheelDebounceTimer) {
      clearTimeout(this.wheelDebounceTimer);
    }
    
    this.wheelDebounceTimer = setTimeout(() => {
      // Run in Angular zone to ensure change detection
      this.ngZone.run(() => {
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
        
        // Mark for check after navigation
        this.cdr.markForCheck();
      });
    }, this.WHEEL_DEBOUNCE_DELAY);
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

  /**
   * Sets the loading state and emits the change to parent components
   * Ensures the parent component is aware of loading state changes
   * Uses ChangeDetectorRef for OnPush change detection
   * 【✓】
   */
  private setLoadingState(isLoading: boolean): void {
    if (this.isDebugMode) {
      console.log(`[CDCases] Setting loading state to: ${isLoading}`);
    }
    
    // Update internal loading state
    this.isLoading = isLoading;
    
    // Always emit the loading state change
    // Use NgZone.run to ensure it runs inside Angular's zone for change detection
    this.ngZone.run(() => {
      this.loadingChange.emit(isLoading);
      
      // Mark for check to trigger change detection
      this.cdr.markForCheck();
      
      if (this.isDebugMode) {
        console.log(`[CDCases] Emitted loading state: ${isLoading}`);
      }
    });
  }

  /**
   * Performs comprehensive cleanup of THREE.js resources
   * Ensures proper garbage collection
   * 【✓】
   */
  private performComprehensiveCleanup(): void {
    // Clean up renderer
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      (this.renderer as any).domElement = null;
      (this.renderer as any) = null;
    }
    
    // Clean up label renderer
    if (this.labelRenderer) {
      if (this.labelRenderer.domElement && this.labelRenderer.domElement.parentNode) {
        this.labelRenderer.domElement.parentNode.removeChild(this.labelRenderer.domElement);
      }
      (this.labelRenderer as any) = null;
    }
    
    // Clean up scene objects
    if (this.scene) {
      this.disposeSceneObjects(this.scene);
      (this.scene as any) = null;
    }
    
    // Clean up controls
    if (this.controls) {
      this.controls.dispose();
      (this.controls as any) = null;
    }
    
    // Clean up camera
    if (this.camera) {
      (this.camera as any) = null;
    }
    
    // Clean up DOM elements
    if (this.canvasRef?.nativeElement) {
      while (this.canvasRef.nativeElement.firstChild) {
        this.canvasRef.nativeElement.removeChild(this.canvasRef.nativeElement.firstChild);
      }
    }
    
    if (this.labelRendererElement?.nativeElement) {
      while (this.labelRendererElement.nativeElement.firstChild) {
        this.labelRendererElement.nativeElement.removeChild(
          this.labelRendererElement.nativeElement.firstChild
        );
      }
    }
    
    if (this.isDebugMode) {
      console.log('[CDCases] Comprehensive cleanup completed');
    }
  }
  
  /**
   * Recursively disposes all objects in a scene
   * Ensures proper garbage collection of THREE.js objects
   * 【✓】
   */
  private disposeSceneObjects(obj: THREE.Object3D): void {
    while (obj.children.length > 0) {
      this.disposeSceneObjects(obj.children[0]);
      obj.remove(obj.children[0]);
    }
    
    if ((obj as any).geometry) {
      (obj as any).geometry.dispose();
    }
    
    if ((obj as any).material) {
      if (Array.isArray((obj as any).material)) {
        (obj as any).material.forEach((material: THREE.Material) => this.disposeMaterial(material));
      } else {
        this.disposeMaterial((obj as any).material);
      }
    }
  }
  
  /**
   * Disposes a THREE.js material
   * 【✓】
   */
  private disposeMaterial(material: THREE.Material): void {
    material.dispose();
    
    // Dispose textures if they exist
    for (const key in material) {
      const value = (material as any)[key];
      if (value && typeof value === 'object' && 'dispose' in value) {
        value.dispose();
      }
    }
  }

  /**
   * TrackBy function for ngFor to improve rendering performance
   * 【✓】
   */
  trackByCaseId(index: number, cdCase: CDCase): number {
    return cdCase.id;
  }
} 