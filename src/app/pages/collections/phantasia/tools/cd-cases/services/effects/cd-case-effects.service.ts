import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { CDCase } from '../../../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CDCaseEffectsService {
  createGlowEffect(model: THREE.Object3D): THREE.MeshBasicMaterial {
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,  // Green glow
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    return glowMaterial;
  }

  updateGlowEffect(cdCase: CDCase): void {
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
} 