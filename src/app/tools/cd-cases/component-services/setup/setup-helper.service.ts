import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CDCase } from '../../../shared/interfaces';
import { SceneService } from '../../services/scene/scene.service';
import { VideoService } from '../video.service';
import { RendererService } from '../renderer.service';
import { SilhouetteService } from '../silhouette.service';
import { CDCasesEventsService } from '../../services/events/cd-cases-events.service';
import { EventHandlerService } from '../event-handler.service';

@Injectable()
export class SetupHelperService {
  constructor(
    private rendererService: RendererService,
    private videoService: VideoService,
    private silhouetteService: SilhouetteService,
    private eventHandlerService: EventHandlerService,
    private sceneService: SceneService
  ) {}

  /**
   * Sets up the renderer, scene, camera, and other core Three.js components
   * Creates the essential rendering infrastructure for the CD cases display
   * Returns object with references to all created scene elements
   * 【✓】
   */
  setupRenderer(
    canvasRef: HTMLCanvasElement, 
    sceneService: SceneService,
    config: any
  ): {
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    lights: {
      ambientLight: THREE.AmbientLight,
      mainLight: THREE.DirectionalLight,
      fillLight: THREE.DirectionalLight,
      backLight: THREE.DirectionalLight
    },
    lightHelpers: {
      mainLightHelper: THREE.DirectionalLightHelper,
      fillLightHelper: THREE.DirectionalLightHelper,
      backLightHelper: THREE.DirectionalLightHelper
    },
    videoElements: {
      rightSideMenuPlane: THREE.Mesh,
      backgroundPlane: THREE.Mesh,
      caseBackVideoPlane: THREE.Mesh,
      videoPlay: () => void,
      videoPause: () => void,
      updateVideoSource: (videoPath: string) => void
    }
  } {
    // Use the RendererService to set up the renderer, scene, camera, and video planes
    this.rendererService.setupRenderer(
      canvasRef, 
      sceneService, 
      this.videoService.createCaseBackVideoPlane.bind(this.videoService)
    );
    
    // Get references to the renderer components
    const renderer = this.rendererService.getRenderer();
    const scene = this.rendererService.getScene();
    const camera = this.rendererService.getCamera();
    
    // Get references to lights
    const lights = this.rendererService.getLights();
    
    // Get references to light helpers
    const lightHelpers = this.rendererService.getLightHelpers();
    
    // Get references to video-related elements
    const rightSideMenuPlane = this.rendererService.getVideoPlane();
    const backgroundPlane = this.rendererService.getBackgroundPlane();
    const caseBackVideoPlane = this.rendererService.getCaseBackVideoPlane();
    
    // Get references to video controls
    const videoControls = this.rendererService.getVideoControls();
    
    // Initialize VideoService with these video elements
    this.videoService.setVideoElements(
      rightSideMenuPlane,
      backgroundPlane,
      caseBackVideoPlane,
      videoControls.play,
      videoControls.pause,
      videoControls.updateSource
    );

    // Set up the scene for the SilhouetteService
    this.silhouetteService.setScene(scene);

    return {
      renderer,
      scene,
      camera,
      lights,
      lightHelpers,
      videoElements: {
        rightSideMenuPlane,
        backgroundPlane,
        caseBackVideoPlane,
        videoPlay: videoControls.play,
        videoPause: videoControls.pause,
        updateVideoSource: videoControls.updateSource
      }
    };
  }

  /**
   * Sets up the OrbitControls for camera movement and interaction
   * Configures control settings for smooth camera navigation around the CD cases
   * 【✓】
   */
  setupControls(sceneService: SceneService): OrbitControls {
    // Use the RendererService to set up the controls
    this.rendererService.setupControls(sceneService);
    
    // Get a reference to the controls
    const controls = this.rendererService.getControls();
    
    return controls;
  }

  /**
   * Updates the OrbitControls with the provided scene settings
   * Applies camera movement constraints and behavior settings
   * 【✓】
   */
  updateOrbitControls(controls: OrbitControls, sceneSettings: any): void {
    controls.minPolarAngle = sceneSettings.orbitMinPolarAngle;
    controls.maxPolarAngle = sceneSettings.orbitMaxPolarAngle;
    controls.minDistance = sceneSettings.orbitMinDistance;
    controls.maxDistance = sceneSettings.orbitMaxDistance;
    controls.dampingFactor = sceneSettings.orbitDampingFactor;
  }

  /**
   * Adds event listeners to the canvas for user interaction
   * Configures mouse/touch events for case selection and manipulation
   * 【✓】
   */
  addEventListeners(
    canvas: HTMLCanvasElement,
    cdCases: CDCase[],
    camera: THREE.Camera,
    eventsService: CDCasesEventsService,
    tutorialCompleted: boolean[],
    getActiveCaseExpanded: () => boolean,
    caseBackVideoPlane: THREE.Mesh,
    expandActiveCase: (cdCase: CDCase) => void,
    animateActiveCaseBack: (activeCase: CDCase, newIndex: number, wasExpandedBefore: boolean) => void
  ): void {
    // Initialize the EventHandlerService with the config
    
    // Use the EventHandlerService to add event listeners
    this.eventHandlerService.addEventListeners(
      canvas,
      cdCases,
      camera,
      eventsService,
      tutorialCompleted,
      getActiveCaseExpanded,
      caseBackVideoPlane,
      expandActiveCase,
      animateActiveCaseBack
    );
  }

  /**
   * Initializes arrays to track music playing status for each CD case
   * Returns an array with default values (false) for each case
   * 【✓】
   */
  initializeMusicStatus(cdCases: CDCase[]): boolean[] {
    return new Array(cdCases.length).fill(false);
  }

  /**
   * Initializes arrays to track tutorial completion status for each CD case
   * Returns an array with default values (false) for each case
   * 【✓】
   */
  initializeTutorialCompletion(cdCases: CDCase[]): boolean[] {
    return new Array(cdCases.length).fill(false);
  }

  /**
   * Handles the loading of model assets for CD cases
   * Orchestrates loading process and sets up initial scene state
   * 【✓】
   */
  loadModelAssets(
    config: any,
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    services: {
      cdCasesService: any,
      stateService: any,
      videoService: any,
      silhouetteService: any
    },
    functions: {
      animate: () => void,
      createSilhouette: (cdCase: CDCase) => void
    }
  ): Promise<CDCase[]> {
    return this.loadModel(config, scene, renderer, services.cdCasesService)
      .then(cdCases => {
        this.setupScene(
          cdCases, 
          scene, 
          services.stateService, 
          services.videoService,
          services.silhouetteService,
          services.videoService.getCaseBackVideoPlane(),
          false,
          null,
          functions.createSilhouette
        );
        return cdCases;
      });
  }

  /**
   * Loads individual CD case models into the scene
   * Creates model geometry, materials and configures initial properties
   * 【✓】
   */
  loadModel(
    config: any,
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    cdCasesService: any
  ): Promise<CDCase[]> {
    return cdCasesService.loadModels(config, scene, renderer);
  }

  /**
   * Sets up the scene with loaded models
   * Configures initial positioning, active case, and silhouette effects
   * 【✓】
   */
  setupScene(
    cdCases: CDCase[], 
    scene: THREE.Scene,
    stateService: any,
    videoService: any,
    silhouetteService: any,
    caseBackVideoPlane: THREE.Mesh,
    isManuallyAnimating: boolean,
    manuallyAnimatedCaseId: number | null,
    createSilhouette: (cdCase: CDCase) => void
  ): void {
    // Set the scene for the silhouette service
    silhouetteService.setScene(scene);
    
    // Activate the first case
    stateService.setActiveCase(cdCases, 0);
    
    // Create silhouette for active case
    const activeCase = cdCases.find(cdCase => cdCase.isActive);
    if (activeCase) {
      createSilhouette(activeCase);
      
      // Initialize videoPlane2 alignment with active case
      videoService.updateVideoPlane2Alignment(
        caseBackVideoPlane,
        isManuallyAnimating,
        manuallyAnimatedCaseId,
        cdCases
      );
    }
  }
} 