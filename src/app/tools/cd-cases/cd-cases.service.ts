import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { CDCase, Config } from '../shared/interfaces';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CDCasesService {
  private clock = new THREE.Clock();

  async loadModels(
    config: Config,
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer
  ): Promise<CDCase[]> {
    const loader = new GLTFLoader();
    const cdCases: CDCase[] = [];

    try {
      const gltf = await loader.loadAsync('assets/3d/CD_Case/CD_Case.glb');
      
      // Log loaded animations and bones
      console.log('Loaded animations:', gltf.animations);
      this.logBones(gltf.scene);
      
      // Create environment map
      this.setupEnvironmentMap(scene, renderer);

      // Create CD cases from config
      for (const caseConfig of config.cdCases) {
        const cdCase = await this.createCDCase(gltf, caseConfig, scene);
        cdCases.push(cdCase);
      }

    } catch (error) {
      console.error('Error loading model:', error);
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

  private setupEnvironmentMap(scene: THREE.Scene, renderer: THREE.WebGLRenderer): void {
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    new THREE.TextureLoader().load('assets/graphic/composite.png', (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      scene.environment = envMap;
      texture.dispose();
      pmremGenerator.dispose();
    });
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
        console.log('Found armature in case:', caseConfig.id);
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
      position: new THREE.Vector3(position.x, position.y, position.z),
      rotation: new THREE.Euler(rotation.x, rotation.y, rotation.z),
      momentum: new THREE.Vector2(),
      mixer: new THREE.AnimationMixer(model),
      animations: gltf.animations.map((anim: THREE.AnimationClip) => anim.clone()),
      armature: armature
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

  updateAnimations(cdCases: CDCase[]): void {
    const delta = this.clock.getDelta();
    cdCases.forEach(cdCase => {
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