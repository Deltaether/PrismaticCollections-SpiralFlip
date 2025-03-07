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
  private videoPlane!: THREE.Mesh;
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

  setConfig(config: any): void {
    this.config = config;
  }

  getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  getLabelRenderer(): CSS2DRenderer {
    return this.labelRenderer;
  }

  getScene(): THREE.Scene {
    return this.scene;
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  getControls(): OrbitControls {
    return this.controls;
  }

  getVideoPlane(): THREE.Mesh {
    return this.videoPlane;
  }
  
  getBackgroundPlane(): THREE.Mesh {
    return this.backgroundPlane;
  }
  
  getCaseBackVideoPlane(): THREE.Mesh {
    return this.caseBackVideoPlane;
  }
  
  getVideoControls(): { play: () => void, pause: () => void, updateSource: (videoPath: string) => void } {
    return {
      play: this.videoPlay,
      pause: this.videoPause,
      updateSource: this.updateVideoSource
    };
  }

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
    videoPlaneResult.mesh.visible = false; // Start invisible until a case is expanded
    
    // Add background plane behind video plane - KEEP VISIBLE
    const backgroundPlane = sceneService.setupBackgroundPlane(this.scene, this.config, videoPlaneResult.videoTexture);
    backgroundPlane.visible = true; // Background remains visible
    
    // Create a new video plane that will be attached to the back of the CD case - INITIALLY INVISIBLE
    const caseBackVideoPlane = createCaseBackVideoPlane(videoPlaneResult.videoTexture);
    caseBackVideoPlane.visible = false; // Start invisible until a case is expanded
    this.scene.add(caseBackVideoPlane);
    
    // Store references for later use
    this.videoPlane = videoPlaneResult.mesh;
    this.backgroundPlane = backgroundPlane;
    this.caseBackVideoPlane = caseBackVideoPlane;
    this.videoPlay = videoPlaneResult.play;
    this.videoPause = videoPlaneResult.pause;
    this.updateVideoSource = videoPlaneResult.updateVideoSource;
  }

  setupControls(sceneService: any): void {
    this.controls = sceneService.setupControls(this.camera, this.renderer.domElement, this.config);
  }

  onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
  }

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