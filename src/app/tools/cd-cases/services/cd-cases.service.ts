import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { CDCase, Config } from '../../shared/interfaces';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CDCasesService {
  private clock = new THREE.Clock();
  private readonly ANIMATION_DURATION = 1.0; // seconds
  private readonly ACTIVE_X_POSITION = 1;
  private readonly INACTIVE_X_POSITION = 2;

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
          this.setupEnvironmentMap(scene, renderer, texture);
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
        
        // Only change: Apply 80% scale to the model
        model.scale.set(0.7, 0.7, 0.7);
        
        // Use exact position from config with Y-axis stacking
        const position = new THREE.Vector3(
          config.caseSettings.basePosition.x,
          config.caseSettings.basePosition.y + (caseConfig.id * config.caseSettings.stackOffset), // Stack along Y axis
          config.caseSettings.basePosition.z
        );
        model.position.copy(position);

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
        this.setupMaterials(model, config.caseSettings);

        const cdCase: CDCase = {
          id: caseConfig.id,
          title: caseConfig.title,
          artist: caseConfig.artist,
          imageUrl: '',
          model,
          isFlipped: false,
          isDragging: false,
          isOpen: false,
          isActive: false,
          isDeactivating: false,
          position,
          rotation,
          momentum: new THREE.Vector2(),
          mixer,
          animations,
          armature,
          carouselIndex: caseConfig.id - 1,
          targetPosition: position.clone(),
          currentLerpAlpha: 0
        };

        // Set up animations
        this.setupAnimation(cdCase);

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
              metalness: matConfig.metalness,
              roughness: matConfig.roughness,
              envMapIntensity: matConfig.envMapIntensity
            });
            if ('clearcoat' in clonedMat && matConfig.clearcoat !== undefined) {
              clonedMat.clearcoat = matConfig.clearcoat;
              clonedMat.clearcoatRoughness = matConfig.clearcoatRoughness || 0;
            }
            clonedMat.needsUpdate = true;
            return clonedMat;
          });
        }
      }
    });
  }

  private setupAnimation(cdCase: CDCase): void {
    if (!cdCase.mixer || !cdCase.animations) {
        console.warn('No mixer or animations available for case:', cdCase.id);
        return;
    }

    // Log all available animations
    console.log('Available animations for case', cdCase.id, ':', 
        cdCase.animations.map(a => ({ name: a.name, duration: a.duration })));

    // Find the open and close animations
    const openAnim = cdCase.animations.find(a => a.name === 'Open Lid.001');
    const closeAnim = cdCase.animations.find(a => a.name === 'Close Lid');

    console.log('Found animations for case', cdCase.id, ':', {
        openAnim: openAnim?.name,
        closeAnim: closeAnim?.name
    });

    if (openAnim && closeAnim) {
        // Create actions for both animations
        const openAction = cdCase.mixer.clipAction(openAnim);
        const closeAction = cdCase.mixer.clipAction(closeAnim);

        // Configure the animations
        openAction.setLoop(THREE.LoopOnce, 1);
        openAction.clampWhenFinished = true;
        openAction.timeScale = 1;
        
        closeAction.setLoop(THREE.LoopOnce, 1);
        closeAction.clampWhenFinished = true;
        closeAction.timeScale = 1;

        // Store the actions in the cdCase object
        cdCase.openAction = openAction;
        cdCase.closeAction = closeAction;

        // Start with lid closed
        closeAction.play();
        closeAction.paused = true;
        closeAction.time = closeAnim.duration;

        console.log('Animation actions created and configured for case', cdCase.id, {
            openAction: {
                isRunning: openAction.isRunning(),
                paused: openAction.paused,
                timeScale: openAction.timeScale,
                time: openAction.time
            },
            closeAction: {
                isRunning: closeAction.isRunning(),
                paused: closeAction.paused,
                timeScale: closeAction.timeScale,
                time: closeAction.time
            }
        });
    } else {
        console.warn('Could not find Open Lid.001 or Close Lid animations:', 
            cdCase.animations.map(a => a.name));
    }
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

    // Stop any current animations
    cdCase.mixer?.stopAllAction();

    if (cdCase.isOpen) {
        // Reset and play the open animation
        cdCase.openAction.reset();
        cdCase.openAction.timeScale = 1;
        cdCase.openAction.setLoop(THREE.LoopOnce, 1);
        cdCase.openAction.clampWhenFinished = true;
        cdCase.openAction.play();
        console.log('Playing Open Lid.001 animation', {
            isRunning: cdCase.openAction.isRunning(),
            paused: cdCase.openAction.paused,
            timeScale: cdCase.openAction.timeScale,
            time: cdCase.openAction.time
        });
    } else {
        // Reset and play the close animation
        cdCase.closeAction.reset();
        cdCase.closeAction.timeScale = 1;
        cdCase.closeAction.setLoop(THREE.LoopOnce, 1);
        cdCase.closeAction.clampWhenFinished = true;
        cdCase.closeAction.play();
        console.log('Playing Close Lid animation', {
            isRunning: cdCase.closeAction.isRunning(),
            paused: cdCase.closeAction.paused,
            timeScale: cdCase.closeAction.timeScale,
            time: cdCase.closeAction.time
        });
    }

    // Update the glow effect
    this.updateGlowEffect(cdCase);
  }

  setActiveCase(cdCases: CDCase[], activeIndex: number): void {
    console.log('Setting active case:', activeIndex);
    
    // First, find the currently active case
    const currentActiveCase = cdCases.find(cdCase => cdCase.isActive);
    const targetCase = cdCases[activeIndex];

    if (currentActiveCase === targetCase) {
        console.log('Case already active:', activeIndex);
        return;
    }

    // Deactivate current case if exists
    if (currentActiveCase) {
        console.log('Deactivating case:', currentActiveCase.id);
        currentActiveCase.isActive = false;
        currentActiveCase.isDeactivating = true;
        currentActiveCase.currentLerpAlpha = 0;
        currentActiveCase.targetPosition.copy(currentActiveCase.position);
        currentActiveCase.targetPosition.x = this.INACTIVE_X_POSITION;
        
        // Close the current active case
        if (currentActiveCase.isOpen) {
            this.flipCase(currentActiveCase);
        }
    }

    // Cancel any other ongoing transitions
    cdCases.forEach(cdCase => {
        if (cdCase !== currentActiveCase && cdCase !== targetCase) {
            cdCase.isActive = false;
            cdCase.isDeactivating = false;
            cdCase.currentLerpAlpha = 1;
            cdCase.position.x = this.INACTIVE_X_POSITION;
            cdCase.model.position.copy(cdCase.position);
            
            // Ensure all other cases are closed
            if (cdCase.isOpen) {
                this.flipCase(cdCase);
            }
        }
    });

    // Activate new case
    console.log('Activating case:', targetCase.id);
    targetCase.isActive = true;
    targetCase.isDeactivating = false;
    targetCase.currentLerpAlpha = 0;
    targetCase.targetPosition.copy(targetCase.position);
    targetCase.targetPosition.x = this.ACTIVE_X_POSITION;
    
    // Ensure the mixer is properly initialized
    if (!targetCase.mixer) {
        console.warn('No mixer found for case:', targetCase.id);
        return;
    }

    // Force stop any running animations
    targetCase.mixer.stopAllAction();
    
    // Open the newly active case with a slight delay to ensure position transition has started
    setTimeout(() => {
        console.log('Opening case after delay:', targetCase.id);
        if (!targetCase.isOpen) {
            this.flipCase(targetCase);
        }
    }, 100);
  }

  private updateCasePosition(cdCase: CDCase, deltaTime: number): void {
    if (cdCase.currentLerpAlpha < 1) {
      cdCase.currentLerpAlpha = Math.min(
        cdCase.currentLerpAlpha + (deltaTime / (this.ANIMATION_DURATION * 0.5)), // Make animation twice as fast
        1
      );

      // Custom easing function (cubic bezier-like)
      const ease = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const alpha = ease(cdCase.currentLerpAlpha);

      // Interpolate position
      const targetX = cdCase.isActive ? this.ACTIVE_X_POSITION : this.INACTIVE_X_POSITION;
      cdCase.position.x = THREE.MathUtils.lerp(cdCase.position.x, targetX, alpha);
      cdCase.model.position.copy(cdCase.position);

      // Reset deactivating state when animation completes
      if (cdCase.isDeactivating && cdCase.currentLerpAlpha >= 1) {
        cdCase.isDeactivating = false;
      }
    }
  }

  updateAnimations(cdCases: CDCase[]): void {
    const delta = this.clock.getDelta();
    
    cdCases.forEach(cdCase => {
      // Update position animations
      this.updateCasePosition(cdCase, delta);
      
      // Update existing animations
      if (cdCase.mixer) {
        cdCase.mixer.update(delta);
      }
    });
  }

  checkCollisions(currentCase: CDCase, cdCases: CDCase[]): void {
    const currentBox = new THREE.Box3().setFromObject(currentCase.model);
    
    cdCases.forEach(otherCase => {
      if (otherCase !== currentCase) {
        const otherBox = new THREE.Box3().setFromObject(otherCase.model);
        
        if (currentBox.intersectsBox(otherBox)) {
          const currentCenter = currentBox.getCenter(new THREE.Vector3());
          const otherCenter = otherBox.getCenter(new THREE.Vector3());
          const pushDir = currentCenter.sub(otherCenter).normalize();
          
          const pushStrength = 0.1;
          currentCase.position.add(pushDir.multiplyScalar(pushStrength));
          otherCase.position.sub(pushDir.multiplyScalar(pushStrength));
          
          currentCase.model.position.copy(currentCase.position);
          otherCase.model.position.copy(otherCase.position);
          
          currentCase.momentum.multiplyScalar(0.8);
          otherCase.momentum.multiplyScalar(0.8);
        }
      }
    });
  }
} 