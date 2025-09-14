import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, NgZone, OnInit, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { THREE, OrbitControls, CSS2DRenderer, CSS2DObject } from '../../../../../shared/three';
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
  imports: [CommonModule],
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

  // Initialize debug mode flag - always enable for recording functionality
  public isDebugMode = true; // Changed from isDevMode() to always show recording button

  // Recording mode - hides all UI elements for clean 3D recording
  public isRecordingMode = false;

  // Add a member property for the resize observer
  private resizeObserver: ResizeObserver | null = null;

  // Add a property for wheel event debouncing
  private wheelDebounceTimer: any = null;
  private readonly WHEEL_DEBOUNCE_DELAY = 150; // ms

  // Video background replacement system
  public usePreRecordedVideo = true; // Now using optimized 11MB video file
  @ViewChild('backgroundVideo') backgroundVideoRef?: ElementRef<HTMLVideoElement>;
  public videoPlaybackFailed = false;
  public autoplayAttempted = false;
  private videoReadyForPlay = false;
  public forceShowRecordingControls = true;


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
    
    if (this.isDebugMode) {
      console.log('[CDCases] Component initialized, loading state set to true');
    }
  }

  /**
   * Sets up the 3D environment after the view is initialized
   * Creates renderers, controls, and loads 3D CD case models
   * Configures menu system as DOM overlay
   * 【✓】
   */
  ngAfterViewInit(): void {
    if (this.isDebugMode) {
      console.log('[CDCases] AfterViewInit - Checking rendering mode');
      console.log('  - usePreRecordedVideo:', this.usePreRecordedVideo);
      console.log('  - forceShowRecordingControls:', this.forceShowRecordingControls);
    }
    
    if (this.usePreRecordedVideo) {
      if (this.isDebugMode) {
        console.log('[CDCases] Using pre-recorded video background - skipping 3D setup');
      }
      // Set loading to false immediately for video mode
      setTimeout(() => {
        this.setLoadingState(false);
      }, 100);
      return;
    }
    
    if (this.isDebugMode) {
      console.log('[CDCases] AfterViewInit - Initializing 3D CD case scene');
    }
    
    // Setup renderers and controls
    this.setupRenderer();
    this.setupControls();
    this.setupCSS3DRenderer();
    this.setupRightSideMenu();
    
    // Set up ResizeObserver for more efficient resize handling
    this.setupResizeObserver();
    
    // Load CD case models and initialize scene
    this.loadModels().then(() => {
      if (this.isDebugMode) {
        console.log('[CDCases] CD Case models loaded successfully');
      }
      
      // Notify parent that loading is complete after ensuring all models are rendered
      // Wait a couple frames to ensure Three.js has rendered everything
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (this.isDebugMode) {
            console.log('[CDCases] All CD Case assets loaded, notifying parent component');
          }
          this.setLoadingState(false);
        });
      });
    }).catch((error: any) => {
      console.error('[CDCases] Error loading CD Case models:', error);
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
      } else if ('outputEncoding' in this.renderer) {
        // Fallback for older Three.js versions
        (this.renderer as any).outputEncoding = THREE.SRGBColorSpace;
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
      
      // Use the AnimationHelperService to handle CD case animation
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
   * Implements scrolling behavior to cycle through CD cases
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
        
        // Use CD case navigation
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
      if (this.isDebugMode) {
        console.log(`[CDCases] About to emit loading state: ${isLoading}`);
      }
      
      this.loadingChange.emit(isLoading);
      
      // Mark for check to trigger change detection
      this.cdr.markForCheck();
      
      if (this.isDebugMode) {
        console.log(`[CDCases] Successfully emitted loading state: ${isLoading}`);
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

  /**
   * Enables recording mode - hides all UI elements for clean 3D recording
   * 【✓】
   */
  public enableRecordingMode(): void {
    console.log('[CDCases] Enabling recording mode - hiding all UI elements');
    
    // Enable recording mode flag
    this.isRecordingMode = true;
    
    // Hide the right side menu plane (3D object)
    if (this.rightSideMenuPlane) {
      this.rightSideMenuPlane.visible = false;
      console.log('[CDCases] Hidden right side menu 3D plane');
    }
    
    // Hide the map/scroll 3D object - unload background plane
    if (this.backgroundPlane) {
      this.backgroundPlane.visible = false;
      console.log('[CDCases] Hidden background plane 3D object');
    }
    
    // Hide case back video plane
    if (this.caseBackVideoPlane) {
      this.caseBackVideoPlane.visible = false;
      console.log('[CDCases] Hidden case back video plane');
    }
    
    // Hide app header and auth status (using global styles)
    document.body.classList.add('recording-mode');
    
    // Mark for change detection
    this.cdr.markForCheck();
    
    console.log('[CDCases] Recording mode enabled - all UI elements hidden');
  }

  /**
   * Disables recording mode - restores all UI elements
   * 【✓】
   */
  public disableRecordingMode(): void {
    console.log('[CDCases] Disabling recording mode - restoring UI elements');
    
    // Disable recording mode flag
    this.isRecordingMode = false;
    
    // Show the right side menu plane
    if (this.rightSideMenuPlane) {
      this.rightSideMenuPlane.visible = true;
    }
    
    // Show the background plane
    if (this.backgroundPlane) {
      this.backgroundPlane.visible = true;
    }
    
    // Show case back video plane
    if (this.caseBackVideoPlane) {
      this.caseBackVideoPlane.visible = true;
    }
    
    // Remove recording mode class
    document.body.classList.remove('recording-mode');
    
    // Mark for change detection
    this.cdr.markForCheck();
    
    console.log('[CDCases] Recording mode disabled - UI elements restored');
  }

  /**
   * Starts 60-second Three.js camera recording
   * 【✓】
   */
  public startRecording(): void {
    console.log('[CDCases] Starting 60-second Three.js recording');
    
    // Enable recording mode first
    this.enableRecordingMode();
    
    // Set up MediaRecorder for canvas recording
    const canvas = this.canvasRef.nativeElement;
    
    // Create a stream from the canvas
    const stream = canvas.captureStream(60); // 60 FPS
    
    // Set up MediaRecorder
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9'
    });
    
    const recordedChunks: Blob[] = [];
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      console.log('[CDCases] Recording stopped, processing video');
      
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `phantasia-3d-recording-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      // Disable recording mode
      this.disableRecordingMode();
      
      console.log('[CDCases] Recording saved and recording mode disabled');
    };
    
    // Start recording
    mediaRecorder.start();
    console.log('[CDCases] Recording started for 60 seconds');
    
    // Stop recording after 60 seconds
    setTimeout(() => {
      mediaRecorder.stop();
      console.log('[CDCases] 60 seconds elapsed, stopping recording');
    }, 60000);
  }

  /**
   * Toggle between video background and 3D rendering modes
   */
  public toggle3DMode(): void {
    this.usePreRecordedVideo = !this.usePreRecordedVideo;
    console.log('[CDCases] Rendering mode:', this.usePreRecordedVideo ? 'Pre-recorded Video' : 'Live 3D');
    
    if (this.usePreRecordedVideo) {
      // Switching to video mode - clean up 3D resources if they exist
      if (this.animationId !== null) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    } else {
      // Switching to 3D mode - reinitialize if needed
      this.ngAfterViewInit();
    }
    
    this.cdr.markForCheck();
  }

  /**
   * Video event handlers for comprehensive autoplay bypass
   */
  public onVideoCanPlay(): void {
    console.log('[CDCases] Video can play - attempting autoplay');
    
    if (this.backgroundVideoRef?.nativeElement && this.usePreRecordedVideo) {
      const video = this.backgroundVideoRef.nativeElement;
      
      video.play().then(() => {
        console.log('[CDCases] Video autoplay successful');
        this.setLoadingState(false);
      }).catch(error => {
        console.warn('[CDCases] Video autoplay failed:', error);
        this.setLoadingState(false);
      });
    }
  }

  public onVideoError(event: any): void {
    console.error('[CDCases] Video loading error:', event);
    console.log('[CDCases] Falling back to 3D rendering due to video error');
    
    // Fallback to 3D mode if video fails to load
    this.usePreRecordedVideo = false;
    this.cdr.markForCheck();
    
    // Initialize 3D rendering
    setTimeout(() => {
      this.ngAfterViewInit();
    }, 100);
  }

  public onVideoLoadStart(): void {
    console.log('[CDCases] Video load started');
  }

  public onVideoLoadedData(): void {
    console.log('[CDCases] Video data loaded');
  }

  public onVideoMetadataLoaded(): void {
    console.log('[CDCases] Video metadata loaded - attempting advanced autoplay');
    this.videoReadyForPlay = true;
    this.attemptAdvancedAutoplay();
  }

  public onVideoPlaying(): void {
    console.log('[CDCases] Video is now playing successfully');
    this.videoPlaybackFailed = false;
    this.autoplayAttempted = true;
    
    if (this.usePreRecordedVideo && this.backgroundVideoRef?.nativeElement && this.autoplayAttempted) {
      setTimeout(() => this.attemptAdvancedAutoplay(), 100);
    }
  }

  public onVideoPaused(): void {
    console.log('[CDCases] Video paused');
  }

  private async attemptAdvancedAutoplay(): Promise<void> {
    if (!this.backgroundVideoRef?.nativeElement || !this.usePreRecordedVideo || this.autoplayAttempted) {
      return;
    }

    const video = this.backgroundVideoRef.nativeElement;
    this.autoplayAttempted = true;

    // Aggressive autoplay bypass strategies
    try {
      console.log('[CDCases] Attempting advanced video autoplay bypass...');
      
      // Strategy 1: Force all muted attributes
      video.muted = true;
      video.defaultMuted = true;
      video.volume = 0;
      
      // Strategy 2: Set all mobile-friendly attributes
      video.setAttribute('muted', 'true');
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('x5-playsinline', 'true');
      video.setAttribute('x5-video-player-type', 'h5');
      video.setAttribute('x5-video-player-fullscreen', 'false');
      
      // Strategy 3: Try immediate play
      await video.play();
      console.log('[CDCases] Video autoplay successful on first attempt');
      
    } catch (error1) {
      console.log('[CDCases] First autoplay attempt failed, trying fallback strategies...');
      
      try {
        // Strategy 4: Reset and retry
        video.load();
        video.currentTime = 0;
        await new Promise(resolve => setTimeout(resolve, 50));
        await video.play();
        console.log('[CDCases] Video autoplay successful after reset');
        
      } catch (error2) {
        console.log('[CDCases] Reset strategy failed, trying interaction simulation...');
        
        try {
          // Strategy 5: Simulate user interaction timing
          await new Promise(resolve => {
            const playHandler = () => {
              video.removeEventListener('loadedmetadata', playHandler);
              resolve(video.play());
            };
            video.addEventListener('loadedmetadata', playHandler);
            video.load();
          });
          console.log('[CDCases] Video autoplay successful with interaction simulation');
          
        } catch (error3) {
          console.error('[CDCases] All autoplay strategies exhausted:', error3);
          this.handleAutoplayFailure();
        }
      }
    }
  }

  /**
   * Handle autoplay failure with click-to-play fallback
   */
  private handleAutoplayFailure(): void {
    console.log('[CDCases] All autoplay attempts failed - showing user interaction fallback');
    this.videoPlaybackFailed = true;
    
    // Set loading to false so interface is still usable
    this.setLoadingState(false);
    this.cdr.markForCheck();
  }

  /**
   * Force video play when user clicks fallback overlay
   */
  public forceVideoPlay(): void {
    console.log('[CDCases] User clicked to play video');
    
    if (this.backgroundVideoRef?.nativeElement && this.usePreRecordedVideo) {
      const video = this.backgroundVideoRef.nativeElement;
      this.videoReadyForPlay = true;
      
      video.play().then(() => {
        console.log('[CDCases] Manual video play successful');
        this.videoPlaybackFailed = false;
        this.cdr.markForCheck();
      }).catch(error => {
        console.error('[CDCases] Manual video play failed:', error);
        this.videoPlaybackFailed = false;
        this.cdr.markForCheck();
      });
    }
  }

} 