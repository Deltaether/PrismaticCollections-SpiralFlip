import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { CDCase, Config } from '../../../shared/interfaces';
import { CDCaseAnimationsService } from '../animations/cd-case-animations.service';
import { CDCaseMaterialsService } from '../materials/cd-case-materials.service';

@Injectable({
  providedIn: 'root'
})
export class CDCaseLoadingService {
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
    private materialsService: CDCaseMaterialsService
  ) {}

  async loadModels(
    config: Config,
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer
  ): Promise<CDCase[]> {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('assets/draco/');
    loader.setDRACOLoader(dracoLoader);

    const cdCases: CDCase[] = [];
    const loadingPromises: Promise<any>[] = [];

    try {
      // Load the GLTF model
      const modelPromise = loader.loadAsync('assets/3d/CD_Case/CD_Case.glb');
      loadingPromises.push(modelPromise);

      // Load environment map
      const envMapPromise = new Promise<void>((resolve) => {
        new THREE.TextureLoader().load('assets/graphic/composite.png', (texture) => {
          this.materialsService.setupEnvironmentMap(scene, renderer, texture);
          resolve();
        });
      });
      loadingPromises.push(envMapPromise);

      // Wait for model and environment map to load
      const [gltf] = await Promise.all(loadingPromises);
      
      // Log loaded animations and bones
      console.log('Loaded animations:', gltf.animations);
      this.logBones(gltf.scene);

      // Create CD cases from config
      const casesPromises = config.cdCases.map(caseConfig => {
        const model = gltf.scene.clone(true);
        
        // Apply scale to the model
        model.scale.set(0.7, 0.7, 0.7);
        
        // Calculate initial position using position states
        const initialPosition = this.POSITION_STATES.getInactivePosition(
          new THREE.Vector3(
            config.caseSettings.basePosition.x,
            config.caseSettings.basePosition.y,
            config.caseSettings.basePosition.z
          ),
          caseConfig.id,
          config.caseSettings.stackOffset
        );
        
        // Set model position exactly once
        model.position.copy(initialPosition);

        // Use exact rotation from config
        const rotation = new THREE.Euler(
          config.caseSettings.baseRotation.x,
          config.caseSettings.baseRotation.y,
          config.caseSettings.baseRotation.z
        );
        model.rotation.copy(rotation);
        
        let armature: THREE.Object3D | null = null;
        model.traverse((node: THREE.Object3D) => {
          if (node.name === 'Armature') {
            armature = node;
          }
        });
        
        const mixer = new THREE.AnimationMixer(model);
        const animations = gltf.animations.map((anim: THREE.AnimationClip) => anim.clone());

        // Set up materials
        this.materialsService.setupMaterials(model, config.caseSettings);

        const cdCase: CDCase = {
          id: caseConfig.id,
          title: caseConfig.title || `CD Case ${caseConfig.id}`,
          artist: caseConfig.artist || 'Unknown Artist',
          imageUrl: '',
          model,
          isFlipped: false,
          position: new THREE.Vector3(initialPosition.x, initialPosition.y, initialPosition.z),
          rotation: new THREE.Euler(rotation.x, rotation.y, rotation.z),
          mixer: mixer,
          animations: gltf.animations,
          openAction: undefined,
          closeAction: undefined,
          armature: armature,
          isOpen: false,
          glowMaterial: undefined,
          carouselIndex: caseConfig.id - 1,
          targetPosition: new THREE.Vector3(initialPosition.x, initialPosition.y, initialPosition.z),
          isActive: false,
          isDeactivating: false,
          currentLerpAlpha: 0,
          initialPosition: new THREE.Vector3(initialPosition.x, initialPosition.y, initialPosition.z)
        };

        // Set up animations
        this.animationsService.setupAnimation(cdCase);

        scene.add(model);
        return cdCase;
      });
      
      const cases = await Promise.all(casesPromises);
      cdCases.push(...cases);

      return cdCases;
    } catch (error) {
      console.error('Error loading model:', error);
      throw error;
    }
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
} 