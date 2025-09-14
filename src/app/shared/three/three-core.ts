/**
 * Centralized Three.js Core Module
 * 
 * Consolidates all Three.js imports to eliminate duplication
 * and improve bundle optimization through tree-shaking.
 * 
 * Usage:
 * import { THREE, GLTFLoader, DRACOLoader, OrbitControls, CSS2DRenderer, CSS2DObject, CSS3DRenderer } from '@shared/three/three-core';
 */

// Core Three.js library
import * as THREE from 'three';

// Loaders
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Controls
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Renderers
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

// Re-export everything for easy importing
export {
  THREE,
  GLTFLoader,
  DRACOLoader,
  OrbitControls,
  CSS2DRenderer,
  CSS2DObject,
  CSS3DRenderer
};

// Additional commonly used types and interfaces
export type {
  Vector3,
  Scene,
  Camera,
  WebGLRenderer,
  Mesh,
  Material,
  Geometry,
  BufferGeometry,
  Group,
  Object3D,
  Texture,
  Light,
  Color,
  Matrix4,
  Quaternion,
  Euler,
  Box3,
  Sphere,
  Ray,
  Plane,
  Triangle,
  AnimationMixer,
  AnimationClip,
  AnimationAction
} from 'three';

// Common Three.js constants
export const {
  // Renderer constants
  WebGLRenderer,
  PCFSoftShadowMap,
  sRGBEncoding,
  ACESFilmicToneMapping,
  ReinhardToneMapping,
  
  // Geometry constants
  BoxGeometry,
  PlaneGeometry,
  SphereGeometry,
  CylinderGeometry,
  
  // Material constants
  MeshStandardMaterial,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  
  // Light constants
  AmbientLight,
  DirectionalLight,
  PointLight,
  SpotLight,
  
  // Camera constants
  PerspectiveCamera,
  OrthographicCamera,
  
  // Texture constants
  TextureLoader,
  CubeTextureLoader,
  
  // Math constants
  Vector3,
  Vector2,
  Matrix4,
  Quaternion,
  Euler,
  Color,
  MathUtils,
  
  // Scene constants
  Scene,
  Group,
  Mesh,
  Object3D,
  
  // Animation constants
  AnimationMixer,
  Clock
} = THREE;

// Utility functions for common Three.js operations
export const ThreeUtils = {
  /**
   * Creates a standard scene setup with lighting
   */
  createStandardScene(): THREE.Scene {
    const scene = new Scene();
    
    // Add ambient lighting
    const ambientLight = new AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    // Add directional lighting
    const directionalLight = new DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    return scene;
  },

  /**
   * Creates a standard perspective camera
   */
  createStandardCamera(aspect: number = window.innerWidth / window.innerHeight): THREE.PerspectiveCamera {
    const camera = new PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.set(0, 0, 5);
    return camera;
  },

  /**
   * Creates a standard WebGL renderer with optimal settings
   */
  createStandardRenderer(container: HTMLElement): THREE.WebGLRenderer {
    const renderer = new WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.outputEncoding = sRGBEncoding;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    
    return renderer;
  },

  /**
   * Disposes of Three.js objects properly to prevent memory leaks
   */
  dispose(object: THREE.Object3D): void {
    if ('geometry' in object) {
      (object as THREE.Mesh).geometry?.dispose();
    }
    
    if ('material' in object) {
      const material = (object as THREE.Mesh).material;
      if (Array.isArray(material)) {
        material.forEach(mat => mat.dispose());
      } else if (material) {
        material.dispose();
      }
    }
    
    object.children.forEach(child => this.dispose(child));
  },

  /**
   * Converts degrees to radians
   */
  degToRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  },

  /**
   * Converts radians to degrees
   */
  radToDeg(radians: number): number {
    return radians * (180 / Math.PI);
  }
};