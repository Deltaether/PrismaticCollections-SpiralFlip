import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { CDCase } from '../../../shared/interfaces';

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
        const oldAlpha = cdCase.currentLerpAlpha;
        cdCase.currentLerpAlpha += this.LERP_SPEED;
        
        if (cdCase.currentLerpAlpha > 1) {
          cdCase.currentLerpAlpha = 1;
          if (cdCase.isDeactivating) {
            console.log('Case deactivation complete:', cdCase.id);
            cdCase.isDeactivating = false;
          }
        }

        // Only log if there's significant movement
        if (Math.abs(oldAlpha - cdCase.currentLerpAlpha) > 0.1) {
          console.log(`Case ${cdCase.id} lerp update:`, {
            isActive: cdCase.isActive,
            isDeactivating: cdCase.isDeactivating,
            alpha: cdCase.currentLerpAlpha,
            position: cdCase.position.toArray()
          });
        }

        cdCase.position.lerp(cdCase.targetPosition, cdCase.currentLerpAlpha);
        cdCase.model.position.copy(cdCase.position);
      }
    });
  }

  setupAnimation(cdCase: CDCase): void {
    if (!cdCase.animations || !cdCase.mixer) {
      console.warn('No animations or mixer available for case:', cdCase.id);
      return;
    }

    // Find both open and close animations
    const openAnim = cdCase.animations.find(a => a.name === 'Open Lid.001');
    const closeAnim = cdCase.animations.find(a => a.name === 'Close Lid');
    
    console.log('Found animations for case:', cdCase.id, {
      openAnim: openAnim?.name,
      closeAnim: closeAnim?.name
    });

    if (openAnim && closeAnim) {
      // Create actions for both animations
      cdCase.openAction = cdCase.mixer.clipAction(openAnim);
      cdCase.closeAction = cdCase.mixer.clipAction(closeAnim);

      // Configure the animations
      cdCase.openAction.setLoop(THREE.LoopOnce, 1);
      cdCase.openAction.clampWhenFinished = true;
      cdCase.openAction.timeScale = 1;
      
      cdCase.closeAction.setLoop(THREE.LoopOnce, 1);
      cdCase.closeAction.clampWhenFinished = true;
      cdCase.closeAction.timeScale = 1;

      // Start with lid closed
      cdCase.closeAction.play();
      cdCase.closeAction.paused = true;
      cdCase.closeAction.time = closeAnim.duration;
    } else {
      console.warn('Could not find required animations for case:', cdCase.id);
    }
  }

  createFlipAnimation(cdCase: CDCase, isOpening: boolean): void {
    if (!cdCase.armature) {
      console.warn('No armature found for case:', cdCase.id);
      return;
    }

    if (!cdCase.openAction || !cdCase.closeAction) {
      console.warn('No animation actions found for case:', cdCase.id);
      return;
    }

    // Stop any current animations
    cdCase.mixer?.stopAllAction();

    console.log(`Playing ${isOpening ? 'open' : 'close'} animation for case:`, cdCase.id);
    
    if (isOpening) {
      cdCase.openAction.reset();
      cdCase.openAction.setLoop(THREE.LoopOnce, 1);
      cdCase.openAction.clampWhenFinished = true;
      cdCase.openAction.timeScale = 1;
      cdCase.openAction.play();
    } else {
      cdCase.closeAction.reset();
      cdCase.closeAction.setLoop(THREE.LoopOnce, 1);
      cdCase.closeAction.clampWhenFinished = true;
      cdCase.closeAction.timeScale = 1;
      cdCase.closeAction.play();
    }
  }
} 