import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { CDCase } from '../../shared/interfaces';
import { CDCaseAnimationsService } from './animations/cd-case-animations.service';

@Injectable({
  providedIn: 'root'
})
export class CDCasesStateService {
  private readonly Z_OFFSET = 2; // Units to move in Z axis when active

  constructor(private animationsService: CDCaseAnimationsService) {}

  setActiveCase(cdCases: CDCase[], activeIndex: number): void {
    console.group('Setting active case:', activeIndex);
    
    const currentActiveCase = cdCases.find(cdCase => cdCase.isActive);
    const targetCase = cdCases[activeIndex];

    if (!targetCase) {
      console.error('Target case not found for index:', activeIndex);
      console.groupEnd();
      return;
    }

    if (currentActiveCase === targetCase) {
      console.log('Case already active:', activeIndex);
      console.groupEnd();
      return;
    }

    // Deactivate current case if exists
    if (currentActiveCase) {
      console.log('Deactivating case:', currentActiveCase.id);
      currentActiveCase.isActive = false;
      
      // Move back to initial position and close
      currentActiveCase.targetPosition.copy(currentActiveCase.initialPosition);
      if (currentActiveCase.isOpen) {
        this.animationsService.queueAnimation(currentActiveCase, 'close');
      }
    }

    // Ensure all other cases are closed and at initial positions
    cdCases.forEach(cdCase => {
      if (cdCase !== currentActiveCase && cdCase !== targetCase) {
        cdCase.isActive = false;
        cdCase.position.copy(cdCase.initialPosition);
        cdCase.model.position.copy(cdCase.initialPosition);
        
        if (cdCase.isOpen) {
          this.animationsService.queueAnimation(cdCase, 'close');
        }
      }
    });

    // Activate new case
    console.log('Activating case:', targetCase.id);
    targetCase.isActive = true;
    
    // Move forward in Z
    targetCase.targetPosition.copy(targetCase.initialPosition);
    targetCase.targetPosition.z += this.Z_OFFSET;
    
    // Queue the open animation
    this.animationsService.queueAnimation(targetCase, 'open');
    
    console.groupEnd();
  }

  flipCase(cdCase: CDCase): void {
    console.log('Attempting to flip case:', cdCase.id);
    
    // Toggle the open state
    cdCase.isOpen = !cdCase.isOpen;
    console.log('Case state toggled to:', cdCase.isOpen ? 'Open' : 'Closed');

    // Queue the appropriate animation
    this.animationsService.queueAnimation(cdCase, cdCase.isOpen ? 'open' : 'close');
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