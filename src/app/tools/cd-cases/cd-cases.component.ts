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
  CaseAnimationService 
} from './component-services';

@Component({
  selector: 'app-cd-cases',
  standalone: true,
  imports: [CommonModule, DebugMenuComponent, SceneLoaderComponent],
  providers: [VideoService, EventHandlerService, SilhouetteService, RendererService, CaseAnimationService],
  templateUrl: './cd-cases.component.html',
  styleUrls: ['./cd-cases.component.scss']
})
export class CDCasesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('labelRenderer') private labelRendererElement!: ElementRef<HTMLDivElement>;

  private renderer!: THREE.WebGLRenderer;
  private labelRenderer!: CSS2DRenderer;
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

  // Add properties to store references
  private videoPlane!: THREE.Mesh;
  private backgroundPlane!: THREE.Mesh;
  private caseBackVideoPlane!: THREE.Mesh; // New property for the case back video plane
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
    private ngZone: NgZone
  ) {}

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

  ngAfterViewInit(): void {
    this.setupRenderer();
    this.setupControls();
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
  }

  private setupRenderer(): void {
    // Use the RendererService to set up the renderer, scene, camera, and video planes
    this.rendererService.setupRenderer(
      this.canvasRef.nativeElement, 
      this.sceneService, 
      this.videoService.createCaseBackVideoPlane.bind(this.videoService)
    );
    
    // Get references to the renderer components
    this.renderer = this.rendererService.getRenderer();
    this.labelRenderer = this.rendererService.getLabelRenderer();
    this.scene = this.rendererService.getScene();
    this.camera = this.rendererService.getCamera();
    
    // Get references to lights
    const lights = this.rendererService.getLights();
    this.ambientLight = lights.ambientLight;
    this.mainLight = lights.mainLight;
    this.fillLight = lights.fillLight;
    this.backLight = lights.backLight;

    // Get references to light helpers
    const lightHelpers = this.rendererService.getLightHelpers();
    this.mainLightHelper = lightHelpers.mainLightHelper;
    this.fillLightHelper = lightHelpers.fillLightHelper;
    this.backLightHelper = lightHelpers.backLightHelper;
    
    // Get references to video-related elements
    this.videoPlane = this.rendererService.getVideoPlane();
    this.backgroundPlane = this.rendererService.getBackgroundPlane();
    this.caseBackVideoPlane = this.rendererService.getCaseBackVideoPlane();
    
    // Get references to video controls
    const videoControls = this.rendererService.getVideoControls();
    this.videoPlay = videoControls.play;
    this.videoPause = videoControls.pause;
    this.updateVideoSource = videoControls.updateSource;
    
    // Initialize VideoService with these video elements
    this.videoService.setVideoElements(
      this.videoPlane,
      this.backgroundPlane,
      this.caseBackVideoPlane,
      this.videoPlay,
      this.videoPause,
      this.updateVideoSource
    );
  }

  private setupControls(): void {
    // Use the RendererService to set up the controls
    this.rendererService.setupControls(this.sceneService);
    
    // Get a reference to the controls
    this.controls = this.rendererService.getControls();
    
    // Make sure controls match sceneSettings after initialization
    this.updateOrbitControls();
  }

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

  private addEventListeners(): void {
    const canvas = this.canvasRef.nativeElement;
    
    // Initialize the EventHandlerService with the config
    this.eventHandlerService.setConfig(this.config);
    
    // Use the EventHandlerService to add event listeners
    this.eventHandlerService.addEventListeners(
      canvas,
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
  
  // Method to start playback on video and background planes
  private revealVideoAndBackground(): void {
    // Delegate to the VideoService
    this.videoService.revealVideoAndBackground(
      this.activeCaseExpanded, 
      this.cdCases,
      this.videoPaths
    );
  }

  // Add method to update background effects
  public updateBackgroundEffects(): void {
    this.sceneService.updateBackgroundEffects(this.sceneSettings);
  }
  
  // Helper method to remove silhouette effect by restoring original materials
  private removeSilhouetteEffect(cdCase: CDCase): void {
    this.silhouetteService.removeSilhouetteEffect(cdCase);
  }
  
  // Method to create pulsating silhouette for active case
  private createActiveCaseSilhouette(cdCase: CDCase): void {
    this.silhouetteService.createActiveCaseSilhouette(cdCase, this.tutorialCompleted);
  }

  private animate(): void {
    if (!this.renderer) return;
    
    this.animationId = requestAnimationFrame(() => this.animate());
    
    // Update animations and physics
    this.animationService.updateAnimations(this.cdCases);

    // Get animation state from CaseAnimationService
    const isManualAnimation = this.isManuallyAnimating;
    
    if (!isManualAnimation) {
      this.stateService.updatePositions(this.cdCases);
      
      // Keep videoPlane2 aligned with the active case if one exists
      const activeIndex = this.cdCases.findIndex(cdCase => cdCase.isActive);
      if (activeIndex >= 0) {
        this.videoService.updateVideoPlane2Alignment(
          this.caseBackVideoPlane,
          this.isManuallyAnimating,
          this.manuallyAnimatedCaseId,
          this.cdCases
        );
      }
    } else {
      // Only apply automatic position updates to cases we're not manually animating
      this.cdCases.forEach(cdCase => {
        if (cdCase.id !== this.manuallyAnimatedCaseId) {
          // Update positions for other cases only
          cdCase.position.lerp(cdCase.targetPosition, this.stateService.getPositionLerpFactor());
          cdCase.model.position.copy(cdCase.position);
        }
      });
      
      // Also keep videoPlane2 aligned during manual animation
      this.videoService.updateVideoPlane2Alignment(
        this.caseBackVideoPlane,
        this.isManuallyAnimating,
        this.manuallyAnimatedCaseId,
        this.cdCases
      );
    }
    
    // Update silhouette animation using SilhouetteService
    this.silhouetteService.updateSilhouetteAnimation(this.cdCases, this.playingMusic, this.tutorialCompleted);
    
    // Always update background animations - don't check for visibility
    // This ensures continuous shader animation even when the plane is toggled
    this.sceneService.updateBackgroundAnimations();
    
    // Update controls and render
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);

    // Update video plane alignment if needed
    if (this.caseBackVideoPlane && (this.activeCaseExpanded || this.isManuallyAnimating)) {
      this.videoService.updateVideoPlane2Alignment(
        this.caseBackVideoPlane,
        this.isManuallyAnimating,
        this.manuallyAnimatedCaseId,
        this.cdCases
      );
    }
  }

  // Debug menu methods
  public updateCamera(): void {
    this.debugService.updateCamera(this.camera, this.controls, this.sceneSettings);
  }

  public updateLighting(): void {
    this.debugService.updateLighting(
      this.ambientLight,
      this.mainLight,
      this.mainLightHelper,
      this.fillLightHelper,
      this.backLightHelper,
      this.sceneSettings
    );
  }

  public updateRenderer(): void {
    this.debugService.updateRenderer(this.renderer, this.sceneSettings);
  }

  public updateOrbitControls(): void {
    this.debugService.updateOrbitControls(this.controls, this.sceneSettings);
  }

  public updateGround(): void {
    this.debugService.updateGround(this.scene, this.sceneSettings);
  }

  public updateCaseTransform(cdCase: CDCase): void {
    this.debugService.updateCaseTransform(cdCase);
  }

  public resetToDefault(): void {
    this.debugService.resetToDefault(this.sceneSettings, this.config, this.cdCases);
    this.updateCamera();
    this.updateLighting();
    this.updateRenderer();
    this.updateOrbitControls();
    this.updateGround();
    this.cdCases.forEach(cdCase => this.updateCaseTransform(cdCase));
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.rendererService.onWindowResize();
  }

  ngOnDestroy(): void {
    // Use the RendererService to clean up resources
    this.rendererService.cleanUpResources(this.cdCases, this.animationId);
  }

  // Wheel event handler for changing active case
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

  // Method to animate active case back to its original position
  private animateActiveCaseBack(activeCase: CDCase, newIndex: number, wasExpandedBefore: boolean): void {
    // Delegate to the CaseAnimationService
    this.caseAnimationService.animateActiveCaseBack(
      activeCase,
      newIndex,
      wasExpandedBefore,
      this.cdCases,
      this.caseBackVideoPlane,
      this.videoPlane,
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
  
  // Helper method to update video for new active case
  private updateVideoForNewActiveCase(newIndex: number, wasExpandedBefore: boolean = false): void {
    // Call the videoService's method with appropriate parameters
    this.videoService.updateVideoForNewActiveCase(
      newIndex,
      wasExpandedBefore,
      this.videoPaths,
      this.playingMusic,
      this.cdCases,
      this.tutorialCompleted,
      this.createActiveCaseSilhouette.bind(this),
      this.expandActiveCase.bind(this)
    );
  }

  // Method to handle case expansion, extracted from click handler to be reusable
  private expandActiveCase(clickedCase: CDCase): void {
    // Delegate to the CaseAnimationService
    this.caseAnimationService.expandActiveCase(
      clickedCase,
      this.cdCases,
      this.playingMusic,
      this.tutorialCompleted,
      this.caseBackVideoPlane,
      this.videoPlane,
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
} 