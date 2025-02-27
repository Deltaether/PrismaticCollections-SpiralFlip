import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { CDCase } from '../../shared/interfaces';
import { CDCasesAnimationService } from './cd-cases-animation.service';

@Injectable({
  providedIn: 'root'
})
export class CDCasesStateService {
  private readonly ACTIVE_X_POSITION = 1;
  private readonly INACTIVE_X_POSITION = 2;

  constructor(private animationService: CDCasesAnimationService) {}

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

  flipCase(cdCase: CDCase): void {
    console.log('Attempting to flip case:', cdCase.id);
    
    // Toggle the open state
    cdCase.isOpen = !cdCase.isOpen;
    console.log('Case state toggled to:', cdCase.isOpen ? 'Open' : 'Closed');

    // Create and play the flip animation
    this.animationService.createFlipAnimation(cdCase, cdCase.isOpen);
  }

  setupMaterials(model: THREE.Object3D, caseConfig: any): void {
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

  setupEnvironmentMap(scene: THREE.Scene, renderer: THREE.WebGLRenderer, texture: THREE.Texture): void {
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    scene.environment = envMap;
    
    texture.dispose();
    pmremGenerator.dispose();
  }
} 