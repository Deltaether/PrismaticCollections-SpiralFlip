import * as THREE from 'three';

export interface CDCase {
  id: number;
  title: string;
  artist: string;
  imageUrl: string;
  model: THREE.Group;
  isFlipped: boolean;
  isDragging: boolean;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  momentum: THREE.Vector2;
  mixer?: THREE.AnimationMixer;
  animations?: THREE.AnimationClip[];
  openAction?: THREE.AnimationAction;
  armature?: THREE.Object3D | null;
  isOpen: boolean;
  glowMaterial?: THREE.MeshBasicMaterial;
  carouselIndex: number;
  targetPosition: THREE.Vector3;
  isActive: boolean;
  isDeactivating: boolean;
  currentLerpAlpha: number;
}

export interface Vector3Config {
  x: number;
  y: number;
  z: number;
}

export interface MaterialConfig {
  name: string;
  metalness: number;
  roughness: number;
  envMapIntensity: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
}

export interface CaseConfig {
  id: number;
  title: string;
  artist: string;
  position: Vector3Config;
  rotation: Vector3Config;
  materials: {
    cd: MaterialConfig[];
  };
}

export interface SceneConfig {
  camera: {
    position: Vector3Config;
    lookAt: Vector3Config;
    lockControls: boolean;
  };
  lighting: {
    ambient: {
      intensity: number;
    };
    main: {
      intensity: number;
      position: Vector3Config;
    };
    fill: {
      intensity: number;
      position: Vector3Config;
    };
    back: {
      intensity: number;
      position: Vector3Config;
    };
  };
  renderer: {
    exposure: number;
  };
  orbitControls: {
    minPolarAngle: number;
    maxPolarAngle: number;
    minDistance: number;
    maxDistance: number;
    dampingFactor: number;
    enableDamping: boolean;
    enableZoom: boolean;
    enablePan: boolean;
  };
  ground: {
    y: number;
    opacity: number;
    size: number;
  };
}

export interface Config {
  sceneSettings: SceneConfig;
  cdCases: CaseConfig[];
}

// Legacy interfaces kept for compatibility with debug menu
export interface CaseSettingsData {
  positionX: number;
  positionY: number;
  positionZ: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
}

export interface CaseSettings {
  [key: number]: CaseSettingsData;
}

export interface SceneSettings {
  cameraX: number;
  cameraY: number;
  cameraZ: number;
  lookAtX: number;
  lookAtY: number;
  lookAtZ: number;
  ambientIntensity: number;
  mainLightIntensity: number;
  exposure: number;
  orbitMinPolarAngle: number;
  orbitMaxPolarAngle: number;
  orbitMinDistance: number;
  orbitMaxDistance: number;
  orbitDampingFactor: number;
  groundY: number;
  groundOpacity: number;
} 