import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

/**
 * Consolidated scene service for CD Viewer 3D environment
 * Handles scene creation, camera setup, lighting, rendering, and background effects
 * Combines functionality from multiple previous services for better maintainability
 */

export interface SceneConfig {
  readonly fov: number;
  readonly near: number;
  readonly far: number;
  readonly enableFog: boolean;
  readonly fogColor: number;
  readonly fogNear: number;
  readonly fogFar: number;
  readonly showAxesHelper: boolean;
}

export interface RenderingContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  css2DRenderer: CSS2DRenderer;
  controls: OrbitControls;
  composer?: any; // Post-processing composer
}

@Injectable({
  providedIn: 'root'
})
export class SceneService {
  private readonly DEFAULT_CONFIG: SceneConfig = {
    fov: 75,
    near: 0.1,
    far: 1000,
    enableFog: true,
    fogColor: 0x000000,
    fogNear: 30,
    fogFar: 100,
    showAxesHelper: false
  };

  private renderingContext: RenderingContext | null = null;
  private backgroundPlane: THREE.Mesh | null = null;
  private animationId: number | null = null;

  /**
   * Initialize the complete 3D environment
   * Creates scene, camera, renderer, controls, and lighting
   */
  public initializeScene(
    container: HTMLElement, 
    config: Partial<SceneConfig> = {}
  ): RenderingContext {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
    
    const scene = this.createScene(finalConfig);
    const camera = this.createCamera(finalConfig, container);
    const renderer = this.createRenderer(container);
    const css2DRenderer = this.createCSS2DRenderer(container);
    const controls = this.createControls(camera, renderer.domElement);
    
    this.setupLighting(scene);
    this.setupBackgroundEffects(scene);
    
    this.renderingContext = {
      scene,
      camera,
      renderer,
      css2DRenderer,
      controls
    };

    // Start render loop
    this.startRenderLoop();

    return this.renderingContext;
  }

  /**
   * Create and configure the Three.js scene
   */
  private createScene(config: SceneConfig): THREE.Scene {
    const scene = new THREE.Scene();
    
    // Transparent background for compositing
    scene.background = null;
    
    // Configure fog for depth perception
    if (config.enableFog) {
      scene.fog = new THREE.Fog(config.fogColor, config.fogNear, config.fogFar);
    }

    // Add debug helpers if enabled
    if (config.showAxesHelper) {
      const axesHelper = new THREE.AxesHelper(5);
      axesHelper.setColors(
        new THREE.Color(0xff0000), // X axis - Red
        new THREE.Color(0x00ff00), // Y axis - Green
        new THREE.Color(0x0000ff)  // Z axis - Blue
      );
      scene.add(axesHelper);
    }

    return scene;
  }

  /**
   * Create and configure the perspective camera
   */
  private createCamera(config: SceneConfig, container: HTMLElement): THREE.PerspectiveCamera {
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(config.fov, aspect, config.near, config.far);
    
    // Set default camera position for optimal CD case viewing
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);
    
    return camera;
  }

  /**
   * Create and configure the WebGL renderer
   */
  private createRenderer(container: HTMLElement): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Enable shadow mapping for realistic lighting
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Configure tone mapping for better color reproduction
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    // Optimize rendering performance
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    container.appendChild(renderer.domElement);
    return renderer;
  }

  /**
   * Create CSS2D renderer for HTML overlays
   */
  private createCSS2DRenderer(container: HTMLElement): CSS2DRenderer {
    const css2DRenderer = new CSS2DRenderer();
    css2DRenderer.setSize(container.clientWidth, container.clientHeight);
    css2DRenderer.domElement.style.position = 'absolute';
    css2DRenderer.domElement.style.top = '0px';
    css2DRenderer.domElement.style.pointerEvents = 'none';
    
    container.appendChild(css2DRenderer.domElement);
    return css2DRenderer;
  }

  /**
   * Create and configure orbit controls
   */
  private createControls(camera: THREE.PerspectiveCamera, domElement: HTMLElement): OrbitControls {
    const controls = new OrbitControls(camera, domElement);
    
    // Configure controls for CD case viewing
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableRotate = true;
    
    // Set limits for better user experience
    controls.minDistance = 3;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI * 0.8;
    
    // Auto-rotate when idle
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.5;
    
    return controls;
  }

  /**
   * Set up scene lighting for optimal CD case presentation
   */
  private setupLighting(scene: THREE.Scene): void {
    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    // Main directional light (key light)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    
    // Configure shadow properties
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    
    scene.add(directionalLight);

    // Fill lights for balanced illumination
    const fillLight1 = new THREE.DirectionalLight(0x8899ff, 0.2);
    fillLight1.position.set(-5, 5, -5);
    scene.add(fillLight1);

    const fillLight2 = new THREE.DirectionalLight(0xff8899, 0.2);
    fillLight2.position.set(5, -5, 5);
    scene.add(fillLight2);

    // Rim light for edge definition
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(0, 0, -10);
    scene.add(rimLight);
  }

  /**
   * Set up background effects and post-processing
   */
  private setupBackgroundEffects(scene: THREE.Scene): void {
    // Create background plane with shader material
    const backgroundGeometry = new THREE.PlaneGeometry(50, 50);
    const backgroundMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        
        void main() {
          vec2 center = vUv - 0.5;
          float dist = length(center);
          float wave = sin(dist * 10.0 - time * 2.0) * 0.1;
          float gradient = 1.0 - dist;
          
          vec3 color1 = vec3(0.1, 0.0, 0.2);
          vec3 color2 = vec3(0.0, 0.1, 0.3);
          vec3 finalColor = mix(color1, color2, gradient + wave);
          
          gl_FragColor = vec4(finalColor, 0.3);
        }
      `,
      uniforms: {
        time: { value: 0.0 }
      },
      transparent: true,
      side: THREE.DoubleSide
    });

    this.backgroundPlane = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    this.backgroundPlane.position.z = -20;
    this.backgroundPlane.renderOrder = -1;
    scene.add(this.backgroundPlane);
  }

  /**
   * Start the render loop
   */
  private startRenderLoop(): void {
    if (!this.renderingContext) return;

    const animate = (time: number) => {
      this.animationId = requestAnimationFrame(animate);
      
      if (this.renderingContext) {
        // Update controls
        this.renderingContext.controls.update();
        
        // Update background shader time
        if (this.backgroundPlane?.material instanceof THREE.ShaderMaterial) {
          this.backgroundPlane.material.uniforms.time.value = time * 0.001;
        }
        
        // Render scene
        this.renderingContext.renderer.render(
          this.renderingContext.scene, 
          this.renderingContext.camera
        );
        
        // Render CSS2D elements
        this.renderingContext.css2DRenderer.render(
          this.renderingContext.scene, 
          this.renderingContext.camera
        );
      }
    };
    
    animate(0);
  }

  /**
   * Handle window resize events
   */
  public handleResize(container: HTMLElement): void {
    if (!this.renderingContext) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const aspect = width / height;

    // Update camera
    this.renderingContext.camera.aspect = aspect;
    this.renderingContext.camera.updateProjectionMatrix();

    // Update renderers
    this.renderingContext.renderer.setSize(width, height);
    this.renderingContext.css2DRenderer.setSize(width, height);
  }

  /**
   * Add object to scene
   */
  public addToScene(object: THREE.Object3D): void {
    if (this.renderingContext) {
      this.renderingContext.scene.add(object);
    }
  }

  /**
   * Remove object from scene
   */
  public removeFromScene(object: THREE.Object3D): void {
    if (this.renderingContext) {
      this.renderingContext.scene.remove(object);
    }
  }

  /**
   * Get current rendering context
   */
  public getRenderingContext(): RenderingContext | null {
    return this.renderingContext;
  }

  /**
   * Dispose of all resources
   */
  public dispose(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.renderingContext) {
      // Cleanup renderer
      this.renderingContext.renderer.dispose();
      
      // Cleanup CSS2D renderer
      if (this.renderingContext.css2DRenderer.domElement.parentNode) {
        this.renderingContext.css2DRenderer.domElement.parentNode.removeChild(
          this.renderingContext.css2DRenderer.domElement
        );
      }

      // Cleanup controls
      this.renderingContext.controls.dispose();

      // Cleanup scene objects
      this.renderingContext.scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      this.renderingContext = null;
    }

    if (this.backgroundPlane) {
      this.backgroundPlane.geometry.dispose();
      if (this.backgroundPlane.material instanceof THREE.Material) {
        this.backgroundPlane.material.dispose();
      }
      this.backgroundPlane = null;
    }
  }
}