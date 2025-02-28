import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { CDCase, Config } from '../../shared/interfaces';
import { Injectable } from '@angular/core';
import config from '../config/config.json';
import { CDCaseAnimationsService } from './animations/cd-case-animations.service';
import { CDCaseEffectsService } from './effects/cd-case-effects.service';
import { CDCaseLoadingService } from './loading/cd-case-loading.service';

@Injectable({
  providedIn: 'root'
})
export class CDCasesService {
  private clock = new THREE.Clock();
  private readonly ANIMATION_DURATION = 1.0; // seconds

  // Movement Types - clearly labeled case movements
  private readonly MOVEMENTS = {
    OPEN_LID: 'Open Lid.001',    // Trigger to open the CD case lid
    CLOSE_LID: 'Close Lid'       // Trigger to close the CD case lid
  };

  // Animation configurations
  private readonly ANIMATION_CONFIG = {
    duration: 1.0,
    easing: (t: number): number => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  };

  // Position states - define exact positions for cases
  private readonly POSITION_STATES = {
    getInactivePosition: (basePosition: THREE.Vector3, stackIndex: number, stackOffset: number): THREE.Vector3 => {
      return new THREE.Vector3(
        basePosition.x,
        basePosition.y + (stackIndex * stackOffset),
        basePosition.z
      );
    },
    getActivePosition: (inactivePosition: THREE.Vector3, activeOffset: THREE.Vector3): THREE.Vector3 => {
      return inactivePosition.clone().add(activeOffset);
    }
  };

  constructor(
    private animationsService: CDCaseAnimationsService,
    private effectsService: CDCaseEffectsService,
    private loadingService: CDCaseLoadingService
  ) {}

  async loadModels(
    config: Config,
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer
  ): Promise<CDCase[]> {
    return this.loadingService.loadModels(config, scene, renderer);
  }

  private logBones(scene: THREE.Object3D): void {
    scene.traverse((node) => {
      if (node.type === 'Bone') {
        console.log('Found bone:', {
          name: node.name,
          type: node.type,
          position: node.position,
          rotation: node.rotation,
          parent: node.parent?.name
        });
      }
    });
  }

  private setupEnvironmentMap(scene: THREE.Scene, renderer: THREE.WebGLRenderer, texture: THREE.Texture): void {
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    
    // Create a custom post-processing shader to add red tint
    const tintShader = {
      uniforms: {
        tDiffuse: { value: texture },
        tintColor: { value: new THREE.Color(1.1, 0.9, 0.9) }, // Subtle red tint
        tintIntensity: { value: 0.3 } // Adjust intensity of the tint
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec3 tintColor;
        uniform float tintIntensity;
        varying vec2 vUv;
        
        void main() {
          vec4 texel = texture2D(tDiffuse, vUv);
          vec3 tinted = mix(texel.rgb, texel.rgb * tintColor, tintIntensity);
          gl_FragColor = vec4(tinted, texel.a);
        }
      `
    };

    // Create a temporary scene and camera for post-processing
    const tempScene = new THREE.Scene();
    const tempCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    // Create a plane with the tinted shader
    const material = new THREE.ShaderMaterial(tintShader);
    const plane = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(plane, material);
    tempScene.add(quad);

    // Render to a target
    const renderTarget = new THREE.WebGLRenderTarget(
      texture.image.width,
      texture.image.height,
      {
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType
      }
    );

    // Render the tinted texture
    renderer.setRenderTarget(renderTarget);
    renderer.render(tempScene, tempCamera);
    renderer.setRenderTarget(null);

    // Create environment map from the tinted texture
    const tintedTexture = renderTarget.texture;
    tintedTexture.colorSpace = THREE.SRGBColorSpace;
    
    // Set up tone mapping
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;

    // Generate environment map
    const envMap = pmremGenerator.fromEquirectangular(tintedTexture).texture;
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envMap;

    // Clean up
    texture.dispose();
    tintedTexture.dispose();
    renderTarget.dispose();
    material.dispose();
    plane.dispose();
    pmremGenerator.dispose();
  }

  private setupMaterials(model: THREE.Object3D, caseConfig: any): void {
    model.traverse((node: THREE.Object3D) => {
      if (node instanceof THREE.Mesh && node.name === 'CD') {
        if (Array.isArray(node.material)) {
          node.material = node.material.map((mat, index) => {
            const matConfig = caseConfig.materials.cd[index];
            const clonedMat = mat.clone();
            Object.assign(clonedMat, {
              metalness: Math.min(matConfig.metalness, 0.6),  // Reduce metalness
              roughness: Math.max(matConfig.roughness, 0.4),  // Increase roughness
              envMapIntensity: Math.min(matConfig.envMapIntensity * 0.5, 1.0),  // Reduce environment map influence
              transparent: false,
              depthWrite: true,
              depthTest: true,
              side: THREE.DoubleSide
            });
            if ('clearcoat' in clonedMat && matConfig.clearcoat !== undefined) {
              clonedMat.clearcoat = Math.min(matConfig.clearcoat * 0.7, 0.7);  // Reduce clearcoat
              clonedMat.clearcoatRoughness = Math.max(matConfig.clearcoatRoughness, 0.3);  // Increase clearcoat roughness
            }
            clonedMat.needsUpdate = true;
            return clonedMat;
          });
        }
      }
    });
  }

  // MOVEMENT 1 & 2: Lid Opening/Closing Triggers
  private setupAnimation(cdCase: CDCase): void {
    if (!cdCase.mixer || !cdCase.animations) {
      console.warn('No mixer or animations available for case:', cdCase.id);
      return;
    }

    // Find the open and close animations by their movement type
    const openAnim = cdCase.animations.find((a: THREE.AnimationClip) => a.name === this.MOVEMENTS.OPEN_LID);
    const closeAnim = cdCase.animations.find((a: THREE.AnimationClip) => a.name === this.MOVEMENTS.CLOSE_LID);

    if (openAnim && closeAnim) {
      // Configure opening animation
      const openAction = cdCase.mixer.clipAction(openAnim);
      openAction.setLoop(THREE.LoopOnce, 1);
      openAction.clampWhenFinished = true;
      openAction.timeScale = 1;
      
      // Configure closing animation
      const closeAction = cdCase.mixer.clipAction(closeAnim);
      closeAction.setLoop(THREE.LoopOnce, 1);
      closeAction.clampWhenFinished = true;
      closeAction.timeScale = 1;

      cdCase.openAction = openAction;
      cdCase.closeAction = closeAction;

      // Initialize with closed lid
      closeAction.play();
      closeAction.paused = true;
      closeAction.time = closeAnim.duration;
    }
  }

  updateAnimations(cdCases: CDCase[]): void {
    this.animationsService.updateAnimations(cdCases);
  }

  private createGlowEffect(model: THREE.Object3D): THREE.MeshBasicMaterial {
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,  // Green glow
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    return glowMaterial;
  }

  private updateGlowEffect(cdCase: CDCase): void {
    if (!cdCase.glowMaterial) {
      cdCase.glowMaterial = this.createGlowEffect(cdCase.model);
    }

    cdCase.model.traverse((node: THREE.Object3D) => {
      if (node instanceof THREE.Mesh && node.name === 'CD') {
        if (cdCase.isOpen) {
          // Store original materials if not already stored
          if (!node.userData['originalMaterials']) {
            node.userData['originalMaterials'] = Array.isArray(node.material) 
              ? node.material.map(m => m.clone())
              : [node.material.clone()];
          }
          // Apply glow material
          node.material = cdCase.glowMaterial;
        } else if (node.userData['originalMaterials']) {
          // Restore original materials
          node.material = node.userData['originalMaterials'];
        }
      }
    });
  }

  flipCase(cdCase: CDCase): void {
    console.log('Attempting to flip case:', cdCase.id, {
      hasOpenAction: !!cdCase.openAction,
      hasCloseAction: !!cdCase.closeAction,
      currentState: cdCase.isOpen ? 'Open' : 'Closed'
    });
    
    if (!cdCase.openAction || !cdCase.closeAction) {
      console.warn('No animations found for case:', cdCase.id);
      return;
    }

    // Toggle the open state
    cdCase.isOpen = !cdCase.isOpen;
    console.log('Case state toggled to:', cdCase.isOpen ? 'Open' : 'Closed');

    // Queue the appropriate animation
    this.animationsService.queueAnimation(
      cdCase,
      cdCase.isOpen ? 'open' : 'close',
      () => {
        // Update glow effect after animation completes
        this.effectsService.updateGlowEffect(cdCase);
      }
    );
  }

  checkCollisions(currentCase: CDCase, cdCases: CDCase[]): void {
    // Disabled to prevent unwanted drifting
    return;
  }
} 