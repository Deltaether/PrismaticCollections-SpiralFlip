import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { CDCase, Config } from '../../../shared/interfaces';
import { CDCaseAnimationsService } from '../animations/cd-case-animations.service';
import { CDCaseMaterialsService } from '../materials/cd-case-materials.service';

/**
 * Specialized service for loading CD case 3D models
 * Handles asset loading, configuration, and initialization
 * Creates fully functional CD case objects with animations
 */
@Injectable({
  providedIn: 'root'
})
export class CDCaseLoadingService {
  /**
   * Position calculation utilities for CD case positioning
   * Determines where each case should be placed in the stack
   * 【✓】
   */
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

  /**
   * Main method for loading all CD case models
   * Sets up model geometry, animations, and materials
   * Creates complete CD case objects ready for scene use
   * 【✓】
   */
  async loadModels(
    config: Config,
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer
  ): Promise<CDCase[]> {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    
    // Set the path to the Draco decoder files (with console logging for debugging)
    const dracoPath = 'assets/draco/';
    console.log('[CDCaseLoadingService] Setting Draco decoder path:', dracoPath);
    dracoLoader.setDecoderPath(dracoPath);
    loader.setDRACOLoader(dracoLoader);

    const cdCases: CDCase[] = [];
    const loadingPromises: Promise<any>[] = [];

    try {
      // Log the start of model loading
      console.log('[CDCaseLoadingService] Loading 3D model: assets/3d/CD_Case/untitled.glb');
      
      // Load the GLTF model
      const modelPromise = loader.loadAsync('assets/3d/CD_Case/untitled.glb')
        .catch(error => {
          console.error('[CDCaseLoadingService] Error loading GLB model:', error);
          throw new Error('Failed to load CD Case model: ' + error.message);
        });
      loadingPromises.push(modelPromise);

      // Load environment map
      const envMapPromise = new Promise<void>((resolve, reject) => {
        console.log('[CDCaseLoadingService] Loading environment map: assets/images/composite.png');
        new THREE.TextureLoader().load(
          'assets/images/composite.png', 
          (texture) => {
            console.log('[CDCaseLoadingService] Environment map loaded successfully');
            this.materialsService.setupEnvironmentMap(scene, renderer, texture);
            resolve();
          },
          (progress) => {
            // Loading progress
            if (progress.total > 0) {
              const percent = Math.round((progress.loaded / progress.total) * 100);
              console.log(`[CDCaseLoadingService] Environment map loading: ${percent}%`);
            }
          },
          (error) => {
            console.error('[CDCaseLoadingService] Error loading environment map:', error);
            // Continue even if environment map fails - just reject the specific promise
            reject(error);
          }
        );
      }).catch(error => {
        console.warn('[CDCaseLoadingService] Continuing without environment map:', error);
        // Return null instead of rejecting to allow the process to continue
        return null;
      });
      loadingPromises.push(envMapPromise);

      // Wait for model and environment map to load
      const results = await Promise.all(loadingPromises);
      const gltf = results[0];
      
      if (!gltf) {
        throw new Error('Failed to load 3D model');
      }
      
      // Log loaded animations and bones
      console.log('[CDCaseLoadingService] Loaded animations:', gltf.animations);
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

  /**
   * Logs skeletal bone information for debugging
   * Used during development to identify animation structure
   * 【✗】
   */
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