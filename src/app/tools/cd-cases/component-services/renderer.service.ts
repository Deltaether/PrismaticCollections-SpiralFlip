import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { CDCase } from '../../shared/interfaces';

@Injectable()
export class RendererService {
  private config: any; // will be set in setConfig method
  private renderer!: THREE.WebGLRenderer;
  private labelRenderer!: CSS2DRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  
  // Renamed from videoPlane to rightSideMenuPlane
  private rightSideMenuPlane!: THREE.Mesh;
  // Keep videoTexture for background effects
  private videoTexture!: THREE.VideoTexture;
  private backgroundPlane!: THREE.Mesh;
  private caseBackVideoPlane!: THREE.Mesh;
  private videoPlay!: () => void;
  private videoPause!: () => void;
  private updateVideoSource!: (videoPath: string) => void;
  
  // Lights
  private ambientLight!: THREE.AmbientLight;
  private mainLight!: THREE.DirectionalLight;
  private fillLight!: THREE.DirectionalLight;
  private backLight!: THREE.DirectionalLight;

  // Light helpers
  private mainLightHelper!: THREE.DirectionalLightHelper;
  private fillLightHelper!: THREE.DirectionalLightHelper;
  private backLightHelper!: THREE.DirectionalLightHelper;

  /**
   * Stores component configuration data
   * Makes configuration accessible to all renderer methods
   * 【✓】
   */
  setConfig(config: any): void {
    this.config = config;
  }

  /**
   * Returns the main WebGL renderer instance
   * Used to access rendering capabilities throughout the component
   * 【✓】
   */
  getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  /**
   * Returns the 2D label renderer for UI elements
   * Used for HTML elements in 3D space
   * 【✓】
   */
  getLabelRenderer(): CSS2DRenderer {
    return this.labelRenderer;
  }

  /**
   * Returns the Three.js scene instance
   * Main container for all 3D objects and lights
   * 【✓】
   */
  getScene(): THREE.Scene {
    return this.scene;
  }

  /**
   * Returns the perspective camera for the scene
   * Controls viewpoint and projection settings
   * 【✓】
   */
  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  /**
   * Returns the orbit controls for camera manipulation
   * Enables user interaction with the 3D scene
   * 【✓】
   */
  getControls(): OrbitControls {
    return this.controls;
  }

  /**
   * Returns the video plane (legacy name)
   * Maintained for backwards compatibility
   * 【✓】
   */
  getVideoPlane(): THREE.Mesh {
    // Renamed internally but keep method name for compatibility
    return this.rightSideMenuPlane;
  }
  
  /**
   * Returns the right side menu plane
   * Area where menu/UI is displayed when a case is expanded
   * 【✓】
   */
  getRightSideMenuPlane(): THREE.Mesh {
    return this.rightSideMenuPlane;
  }
  
  /**
   * Returns the video texture used for background effects
   * Provides access to video material for animations
   * 【✓】
   */
  getVideoTexture(): THREE.VideoTexture {
    return this.videoTexture;
  }
  
  /**
   * Returns the background plane behind the CD cases
   * Used for cosmic/animated background effects
   * 【✓】
   */
  getBackgroundPlane(): THREE.Mesh {
    return this.backgroundPlane;
  }
  
  /**
   * Returns the video plane that appears on the back of CD cases
   * Displays case-specific content when a case is expanded
   * 【✓】
   */
  getCaseBackVideoPlane(): THREE.Mesh {
    return this.caseBackVideoPlane;
  }
  
  /**
   * Returns object with video control functions
   * Provides unified access to play, pause and source update
   * 【✓】
   */
  getVideoControls(): { play: () => void, pause: () => void, updateSource: (videoPath: string) => void } {
    return {
      play: this.videoPlay,
      pause: this.videoPause,
      updateSource: this.updateVideoSource
    };
  }

  /**
   * Returns all light objects used in the scene
   * Provides access to ambient, main, fill and back lights
   * 【✓】
   */
  getLights(): { 
    ambientLight: THREE.AmbientLight,
    mainLight: THREE.DirectionalLight,
    fillLight: THREE.DirectionalLight,
    backLight: THREE.DirectionalLight
  } {
    return {
      ambientLight: this.ambientLight,
      mainLight: this.mainLight,
      fillLight: this.fillLight,
      backLight: this.backLight
    };
  }

  /**
   * Returns all light helper objects for debugging
   * Provides visual indicators of light direction and position
   * 【✓】
   */
  getLightHelpers(): {
    mainLightHelper: THREE.DirectionalLightHelper,
    fillLightHelper: THREE.DirectionalLightHelper,
    backLightHelper: THREE.DirectionalLightHelper
  } {
    return {
      mainLightHelper: this.mainLightHelper,
      fillLightHelper: this.fillLightHelper,
      backLightHelper: this.backLightHelper
    };
  }

  /**
   * Sets up all rendering infrastructure for the CD cases component
   * Creates renderer, scene, camera, lights, and video planes
   * Configures initial properties based on component settings
   * 【✓】
   */
  setupRenderer(canvasRef: HTMLCanvasElement, sceneService: any, createCaseBackVideoPlane: (videoTexture: THREE.VideoTexture) => THREE.Mesh): void {
    this.renderer = sceneService.setupRenderer(canvasRef, this.config);
    this.scene = sceneService.setupScene(this.config);
    this.camera = sceneService.setupCamera(this.config);

    // Initialize CSS2D renderer for labels
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0';
    this.labelRenderer.domElement.style.pointerEvents = 'none';

    // Set up lights
    const lights = sceneService.setupLights(this.scene, this.config);
    this.ambientLight = lights.ambientLight;
    this.mainLight = lights.mainLight;
    this.fillLight = lights.fillLight;
    this.backLight = lights.backLight;

    // Add light helpers with labels
    this.mainLightHelper = new THREE.DirectionalLightHelper(this.mainLight, 1);
    this.fillLightHelper = new THREE.DirectionalLightHelper(this.fillLight, 1);
    this.backLightHelper = new THREE.DirectionalLightHelper(this.backLight, 1);
    
    // Add labels to lights
    const mainLabel = sceneService.createLightLabel('Main Light');
    const fillLabel = sceneService.createLightLabel('Fill Light');
    const backLabel = sceneService.createLightLabel('Back Light');
    
    this.mainLight.add(mainLabel);
    this.fillLight.add(fillLabel);
    this.backLight.add(backLabel);
    
    this.scene.add(this.mainLightHelper, this.fillLightHelper, this.backLightHelper);

    // Set up ground
    sceneService.setupGround(this.scene, this.config);

    // Add video plane (formerly red plane) - INITIALLY INVISIBLE
    const videoPlaneResult = sceneService.setupVideoPlane(this.scene, this.config);
    videoPlaneResult.mesh.visible = false;
    
    // Add background plane behind video plane - KEEP VISIBLE
    const backgroundPlane = sceneService.setupBackgroundPlane(this.scene, this.config, videoPlaneResult.videoTexture);
    backgroundPlane.visible = true; // Background remains visible
    
    // Create a new video plane that will be attached to the back of the CD case - INITIALLY INVISIBLE
    const caseBackVideoPlane = createCaseBackVideoPlane(videoPlaneResult.videoTexture);
    caseBackVideoPlane.visible = false; // Start invisible until a case is expanded
    this.scene.add(caseBackVideoPlane);
    
    // Store references for later use
    this.rightSideMenuPlane = videoPlaneResult.mesh;
    this.backgroundPlane = backgroundPlane;
    this.caseBackVideoPlane = caseBackVideoPlane;
    this.videoTexture = videoPlaneResult.videoTexture;
    this.videoPlay = videoPlaneResult.play;
    this.videoPause = videoPlaneResult.pause;
    this.updateVideoSource = videoPlaneResult.updateVideoSource;

    // Make the rightSideMenuPlane transparent (we'll use CSS3D for the menu)
    // while still keeping the video playing for background effects
    if (this.rightSideMenuPlane.material instanceof THREE.Material) {
      this.rightSideMenuPlane.material.transparent = true;
      this.rightSideMenuPlane.material.opacity = 0;
      this.rightSideMenuPlane.material.needsUpdate = true;
    }
  }

  /**
   * Sets up orbit controls for camera interaction
   * Configures movement constraints and behavior
   * 【✓】
   */
  setupControls(sceneService: any): void {
    this.controls = sceneService.setupControls(this.camera, this.renderer.domElement, this.config);
  }

  /**
   * Handles window resize events for responsive rendering
   * Updates camera aspect ratio and renderer dimensions
   * 【✓】
   */
  onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * Cleans up resources when component is destroyed
   * Disposes of materials, textures, and geometries to prevent memory leaks
   * 【✓】
   */
  cleanUpResources(cdCases: CDCase[], animationId: number | null): void {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
    }
    
    // Clean up resources
    cdCases.forEach(cdCase => {
      this.scene.remove(cdCase.model);
      cdCase.model.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    });

    // Clean up helpers
    this.scene.remove(this.mainLightHelper);
    this.scene.remove(this.fillLightHelper);
    this.scene.remove(this.backLightHelper);

    this.renderer.dispose();
    this.labelRenderer.domElement.remove();
  }
} 