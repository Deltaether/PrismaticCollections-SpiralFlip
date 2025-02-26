import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { CDCase, Config } from '../shared/interfaces';
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
      const casesPromises = config.cdCases.map(caseConfig => 
        this.createCDCase(gltf, caseConfig, scene)
      );
      
      // Wait for all CD cases to be created
      const cases = await Promise.all(casesPromises);
      cdCases.push(...cases);

    } catch (error) {
      console.error('Error loading model:', error);
      throw error; // Re-throw to handle in component
    }

    return cdCases;
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

  private async createCDCase(
    gltf: any,
    caseConfig: any,
    scene: THREE.Scene
  ): Promise<CDCase> {
    const model = gltf.scene.clone(true);
    const { position, rotation } = caseConfig;
    
    model.position.set(position.x, position.y, position.z);
    model.rotation.set(rotation.x, rotation.y, rotation.z);
    
    let armature: THREE.Object3D | null = null;
    model.traverse((node: THREE.Object3D) => {
      if (node.name === 'Armature') {
        armature = node;
      }
    });
    
    scene.add(model);

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
      position: new THREE.Vector3(position.x, position.y, position.z),
      rotation: new THREE.Euler(rotation.x, rotation.y, rotation.z),
      momentum: new THREE.Vector2(),
      mixer: new THREE.AnimationMixer(model),
      animations: gltf.animations.map((anim: THREE.AnimationClip) => anim.clone()),
      armature: armature,
      carouselIndex: caseConfig.id - 1,
      targetPosition: new THREE.Vector3(position.x, position.y, position.z),
      currentLerpAlpha: 0
    };

    this.setupMaterials(model, caseConfig);
    this.setupAnimation(cdCase);

    return cdCase;
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
    const openAnim = cdCase.animations?.find(a => 
      a.name.toLowerCase().includes('open') || 
      a.name.toLowerCase().includes('armature')
    );
    
    if (openAnim && cdCase.mixer) {
      console.log('Setting up animation:', openAnim.name);
      cdCase.openAction = cdCase.mixer.clipAction(openAnim);
      cdCase.openAction.setLoop(THREE.LoopOnce, 1);
      cdCase.openAction.clampWhenFinished = true;
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
    console.log('Attempting to flip case:', cdCase.id);
    
    if (!cdCase.armature) {
      console.warn('No armature found for case:', cdCase.id);
      return;
    }

    let lidBone: THREE.Object3D | THREE.Bone | null = null;
    cdCase.armature.traverse((node: THREE.Object3D) => {
      console.log('Checking node:', node.name, 'Type:', node.type);
      if (node.name === 'Front_Case_Bone') {
        lidBone = node;
        console.log('Found lid bone:', node.name);
      }
    });

    if (!lidBone) {
      console.warn('No lid bone found in armature for case:', cdCase.id);
      return;
    }

    if (!cdCase.mixer) {
      cdCase.mixer = new THREE.AnimationMixer(cdCase.model);
    }

    // Toggle the open state
    cdCase.isOpen = !cdCase.isOpen;
    console.log('Case state toggled to:', cdCase.isOpen ? 'Open' : 'Closed');

    const times = [0, 1];
    const values = cdCase.isOpen ? 
      [0, Math.PI * 0.8] :  // Opening animation
      [Math.PI * 0.8, 0];   // Closing animation

    const trackName = `.${(lidBone as THREE.Object3D).name}.rotation[x]`;
    console.log('Creating animation track:', trackName);
    
    const rotationTrack = new THREE.NumberKeyframeTrack(
      trackName,
      times,
      values
    );

    const clip = new THREE.AnimationClip('flip', 1, [rotationTrack]);
    cdCase.mixer.stopAllAction();

    const action = cdCase.mixer.clipAction(clip);
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.play();

    // Update the glow effect
    this.updateGlowEffect(cdCase);
    
    console.log('Animation started for case:', cdCase.id);
  }

  setActiveCase(cdCases: CDCase[], activeIndex: number): void {
    // First, find the currently active case
    const currentActiveCase = cdCases.find(cdCase => cdCase.isActive);
    const targetCase = cdCases[activeIndex];

    if (currentActiveCase === targetCase) return; // No change needed

    // Deactivate current case if exists
    if (currentActiveCase) {
      currentActiveCase.isActive = false;
      currentActiveCase.isDeactivating = true;
      currentActiveCase.currentLerpAlpha = 0;
      currentActiveCase.targetPosition.copy(currentActiveCase.position);
      currentActiveCase.targetPosition.x = this.INACTIVE_X_POSITION;
    }

    // Cancel any other ongoing transitions
    cdCases.forEach(cdCase => {
      if (cdCase !== currentActiveCase && cdCase !== targetCase) {
        cdCase.isActive = false;
        cdCase.isDeactivating = false;
        cdCase.currentLerpAlpha = 1; // Complete any ongoing animations
        cdCase.position.x = this.INACTIVE_X_POSITION;
        cdCase.model.position.copy(cdCase.position);
      }
    });

    // Activate new case
    targetCase.isActive = true;
    targetCase.isDeactivating = false;
    targetCase.currentLerpAlpha = 0;
    targetCase.targetPosition.copy(targetCase.position);
    targetCase.targetPosition.x = this.ACTIVE_X_POSITION;
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