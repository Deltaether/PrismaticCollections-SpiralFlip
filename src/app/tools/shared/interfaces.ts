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
  closeAction?: THREE.AnimationAction;
  armature?: THREE.Object3D | null;
  isOpen: boolean;
  glowMaterial?: THREE.MeshBasicMaterial;
  carouselIndex: number;
  targetPosition: THREE.Vector3;
  isActive: boolean;
  isDeactivating: boolean;
  currentLerpAlpha: number;
  initialPosition: THREE.Vector3;
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

export interface SilhouetteConfig {
  size: {
    scale: number;  // Scale multiplier for the silhouette size relative to the CD case
  };
  appearance: {
    color: string;   // Hex color for the silhouette glow
    intensity: number; // Base intensity of the glow
    opacity: number;  // Maximum opacity of the glow
  };
  position: {
    offsetX: number; // Offset from the CD case position on X axis
    offsetY: number; // Offset from the CD case position on Y axis
    offsetZ: number; // Offset from the CD case position on Z axis
  };
  rotation: {
    offsetX: number; // Additional rotation around X axis in radians
    offsetY: number; // Additional rotation around Y axis in radians
    offsetZ: number; // Additional rotation around Z axis in radians
  };
  animation: {
    fastPulseSpeed: number;  // Speed of the fast pulse animation
    slowPulseSpeed: number;  // Speed of the slow pulse animation
    fastPulseAmount: number; // Amount of variation in the fast pulse (0-1)
    slowPulseAmount: number; // Amount of variation in the slow pulse (0-1)
  };
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

export interface VideoPlaneConfig {
  position: Vector3Config;
  rotation: Vector3Config;
  size: {
    width: number;
    height: number;
  };
  color: string;
  opacity: number;
}

export interface BackgroundPlaneConfig {
  position: Vector3Config;
  rotation: Vector3Config;
  size: {
    width: number;
    height: number;
  };
  colors: {
    gold: string;
    darkGold: string;
    orange: string;
    brown: string;
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
  videoPlane: VideoPlaneConfig;
  backgroundPlane: BackgroundPlaneConfig;
}

export interface Config {
  sceneSettings: SceneConfig;
  caseSettings: {
    basePosition: {
      x: number;
      y: number;
      z: number;
    };
    baseRotation: {
      x: number;
      y: number;
      z: number;
    };
    stackOffset: number;
    materials: {
      cd: Array<{
        name: string;
        metalness: number;
        roughness: number;
        envMapIntensity: number;
        clearcoat: number;
        clearcoatRoughness: number;
      }>;
    };
  };
  silhouette: SilhouetteConfig;
  cdCases: Array<{
    id: number;
    title: string;
    artist: string;
  }>;
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