import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { Injectable } from '@angular/core';
import { Config, SceneSettings } from '../../../shared/interfaces';
import { SceneEffectsService } from './scene-effects.service';

/**
 * Core service for Three.js scene management
 * Handles scene creation, camera setup, rendering, and lighting
 * Provides infrastructure for the 3D environment
 */
@Injectable({
  providedIn: 'root'
})
export class SceneService {
  private readonly FOG_COLOR = 0x000000;
  private readonly FOG_NEAR = 10;
  private readonly FOG_FAR = 40;
  
  constructor(private sceneEffectsService: SceneEffectsService) { }

  /**
   * Creates and configures the Three.js scene
   * Sets up background, fog, and debug helpers
   * Creates the container for all 3D objects
   * 【✓】
   */
  setupScene(config: Config): THREE.Scene {
    const scene = new THREE.Scene();
    // Remove scene background to ensure full transparency
    scene.background = null;
    // Use a very distant fog to avoid clipping
    scene.fog = new THREE.Fog(0x000000, 30, 100);

    // Add AxesHelper for orientation
    const axesHelper = new THREE.AxesHelper(5);
    // Red is X, Green is Y, Blue is Z
    axesHelper.setColors(
      new THREE.Color(0xff0000), // X axis - Red
      new THREE.Color(0x00ff00), // Y axis - Green
      new THREE.Color(0x0000ff)  // Z axis - Blue
    );
    scene.add(axesHelper);

    return scene;
  }

  /**
   * Creates and configures the perspective camera
   * Sets initial position and viewing angle
   * Primary viewpoint for the 3D scene
   * 【✓】
   */
  setupCamera(config: Config): THREE.PerspectiveCamera {
    const { position, lookAt } = config.sceneSettings.camera;
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(position.x, position.y, position.z);
    camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
    return camera;
  }

  /**
   * Creates and configures the WebGL renderer
   * Sets up pixel ratio, color space, and shadows
   * Handles the actual rendering to the canvas
   * 【✓】
   */
  setupRenderer(canvas: HTMLCanvasElement, config: Config): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      stencil: true,
      depth: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = config.sceneSettings.renderer.exposure;
    
    // Set a fully transparent background
    renderer.setClearColor(0x000000, 0);
    
    return renderer;
  }

  /**
   * Creates and configures orbit controls for camera manipulation
   * Handles user interaction for rotating, panning, and zooming
   * Applies constraints and behavior settings from config
   * 【✓】
   */
  setupControls(camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement, config: Config): OrbitControls {
    const { orbitControls } = config.sceneSettings;
    const controls = new OrbitControls(camera, canvas);
    
    // First set up base orbit control properties
    controls.enableDamping = orbitControls.enableDamping;
    controls.dampingFactor = orbitControls.dampingFactor;
    controls.minDistance = orbitControls.minDistance;
    controls.maxDistance = orbitControls.maxDistance;
    controls.minPolarAngle = orbitControls.minPolarAngle;
    controls.maxPolarAngle = orbitControls.maxPolarAngle;
    
    // Then apply lock controls setting
    const lockControls = config.sceneSettings.camera.lockControls;
    
    // Set master control
    controls.enabled = !lockControls;
    
    // Set individual control properties to match
    if (lockControls) {
      // Disable all individual controls
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableRotate = false;
    } else {
      // Enable individual controls based on config
      controls.enableZoom = orbitControls.enableZoom;
      controls.enablePan = orbitControls.enablePan;
      controls.enableRotate = true;
    }

    // Set look target
    controls.target.set(
      config.sceneSettings.camera.lookAt.x,
      config.sceneSettings.camera.lookAt.y,
      config.sceneSettings.camera.lookAt.z
    );

    controls.update();
    return controls;
  }

  /**
   * Creates and configures lighting for the scene
   * Sets up ambient, main, fill, and back lights
   * Creates dramatic lighting for the CD cases
   * 【✓】
   */
  setupLights(scene: THREE.Scene, config: Config): {
    ambientLight: THREE.AmbientLight;
    mainLight: THREE.DirectionalLight;
    fillLight: THREE.DirectionalLight;
    backLight: THREE.DirectionalLight;
  } {
    const { lighting } = config.sceneSettings;
    
    const ambientLight = new THREE.AmbientLight(0xffffff, lighting.ambient.intensity);
    
    const mainLight = new THREE.DirectionalLight(0xffffff, lighting.main.intensity);
    mainLight.position.set(
      lighting.main.position.x,
      lighting.main.position.y,
      lighting.main.position.z
    );
    mainLight.castShadow = true;
    
    const fillLight = new THREE.DirectionalLight(0xffffff, lighting.fill.intensity);
    fillLight.position.set(
      lighting.fill.position.x,
      lighting.fill.position.y,
      lighting.fill.position.z
    );
    
    const backLight = new THREE.DirectionalLight(0xffffff, lighting.back.intensity);
    backLight.position.set(
      lighting.back.position.x,
      lighting.back.position.y,
      lighting.back.position.z
    );

    scene.add(ambientLight, mainLight, fillLight, backLight);

    return { ambientLight, mainLight, fillLight, backLight };
  }

  /**
   * Creates a ground plane for the scene
   * Provides visual reference for CD case positioning
   * Adds depth and context to the 3D space
   * 【✓】
   */
  setupGround(scene: THREE.Scene, config: Config): THREE.Mesh {
    const { ground } = config.sceneSettings;
    const groundGeometry = new THREE.PlaneGeometry(ground.size, ground.size);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: ground.opacity });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = ground.y;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);
    return groundMesh;
  }

  /**
   * Creates a CSS2D label for lights in debug mode
   * Displays text labels for light sources
   * Helps visualize lighting setup
   * 【✗】
   */
  createLightLabel(text: string): CSS2DObject {
    const div = document.createElement('div');
    div.className = 'light-label';
    div.textContent = text;
    return new CSS2DObject(div);
  }
  
  /**
   * Gets the video playing state flag
   * Used to track video playback status
   * 【✓】
   */
  get videoPlaying(): boolean {
    return this.sceneEffectsService.videoPlaying;
  }
  
  /**
   * Sets the video playing state flag
   * Used to control video playback status
   * 【✓】
   */
  set videoPlaying(value: boolean) {
    this.sceneEffectsService.videoPlaying = value;
  }
  
  /**
   * Sets up the video plane for the CD case display
   * Creates a mesh for video texture display
   * Shows content when a case is expanded
   * 【✓】
   */
  setupVideoPlane(scene: THREE.Scene, config: Config) {
    return this.sceneEffectsService.setupVideoPlane(scene, config);
  }
  
  /**
   * Creates the cosmic background plane
   * Sets up shaders and animations for the background
   * Creates atmospheric visual effects
   * 【✓】
   */
  setupBackgroundPlane(scene: THREE.Scene, config: Config, videoTexture?: THREE.VideoTexture) {
    return this.sceneEffectsService.setupBackgroundPlane(scene, config, videoTexture);
  }
  
  /**
   * Updates background animations each frame
   * Advances shader time uniforms for animated effects
   * Creates dynamic cosmic background
   * 【✓】
   */
  updateBackgroundAnimations(): void {
    this.sceneEffectsService.updateBackgroundAnimations();
  }
  
  /**
   * Updates background visual effects based on scene settings
   * Applies color, intensity, and animation parameters
   * Controls the mood and atmosphere of the scene
   * 【✓】
   */
  updateBackgroundEffects(settings: SceneSettings): void {
    this.sceneEffectsService.updateBackgroundEffects(settings);
  }
} 