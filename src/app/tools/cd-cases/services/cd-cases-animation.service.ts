import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { CDCase } from '../../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CDCasesAnimationService {
  private clock = new THREE.Clock();
  private readonly ANIMATION_DURATION = 1.0; // seconds
  private readonly LERP_SPEED = 0.05;

  updateAnimations(cdCases: CDCase[]): void {
    const delta = this.clock.getDelta();

    cdCases.forEach(cdCase => {
      // Update animation mixers
      if (cdCase.mixer) {
        cdCase.mixer.update(delta);
      }

      // Update position lerping for active/inactive transitions
      if (cdCase.isActive || cdCase.isDeactivating) {
        cdCase.currentLerpAlpha += this.LERP_SPEED;
        if (cdCase.currentLerpAlpha > 1) {
          cdCase.currentLerpAlpha = 1;
          if (cdCase.isDeactivating) {
            cdCase.isDeactivating = false;
          }
        }

        cdCase.position.lerp(cdCase.targetPosition, cdCase.currentLerpAlpha);
        cdCase.model.position.copy(cdCase.position);
      }

      // Apply physics and momentum
      if (!cdCase.isDragging && (cdCase.momentum.x !== 0 || cdCase.momentum.y !== 0)) {
        cdCase.position.x += cdCase.momentum.x;
        cdCase.position.z += cdCase.momentum.y;
        cdCase.model.position.copy(cdCase.position);
        
        cdCase.momentum.multiplyScalar(0.95);
        if (cdCase.momentum.length() < 0.001) {
          cdCase.momentum.set(0, 0);
        }
      }
    });
  }

  setupAnimation(cdCase: CDCase): void {
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

  createFlipAnimation(cdCase: CDCase, isOpening: boolean): void {
    if (!cdCase.armature) {
      console.warn('No armature found for case:', cdCase.id);
      return;
    }

    let lidBone: THREE.Object3D | THREE.Bone | null = null;
    cdCase.armature.traverse((node: THREE.Object3D) => {
      if (node.name === 'Front_Case_Bone') {
        lidBone = node;
      }
    });

    if (!lidBone) {
      console.warn('No lid bone found in armature for case:', cdCase.id);
      return;
    }

    if (!cdCase.mixer) {
      cdCase.mixer = new THREE.AnimationMixer(cdCase.model);
    }

    const times = [0, this.ANIMATION_DURATION];
    const values = isOpening ? 
      [0, Math.PI * 0.8] :  // Opening animation
      [Math.PI * 0.8, 0];   // Closing animation

    const trackName = `.${(lidBone as THREE.Object3D).name}.rotation[x]`;
    const rotationTrack = new THREE.NumberKeyframeTrack(
      trackName,
      times,
      values
    );

    const clip = new THREE.AnimationClip('flip', this.ANIMATION_DURATION, [rotationTrack]);
    cdCase.mixer.stopAllAction();

    const action = cdCase.mixer.clipAction(clip);
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.play();
  }
} 