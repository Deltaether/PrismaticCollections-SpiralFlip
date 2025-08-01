import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { gsap } from 'gsap';

/**
 * Consolidated animation service for CD Viewer
 * Handles all CD case animations, GSAP integration, and animation queuing
 * Combines functionality from multiple animation services for better maintainability
 */

export interface AnimationQueueItem {
  type: 'open' | 'close' | 'rotate' | 'highlight';
  target?: THREE.Object3D;
  duration?: number;
  onComplete?: () => void;
  onStart?: () => void;
}

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay: number;
}

export interface CDCaseAnimations {
  mixer: THREE.AnimationMixer;
  openAction: THREE.AnimationAction | null;
  closeAction: THREE.AnimationAction | null;
  isAnimating: boolean;
  currentState: 'open' | 'closed' | 'opening' | 'closing';
}

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private readonly clock = new THREE.Clock();
  private readonly animationQueue: AnimationQueueItem[] = [];
  private readonly caseAnimations = new Map<string, CDCaseAnimations>();
  private isProcessingQueue = false;

  // Animation configuration constants
  private readonly DEFAULT_CONFIG: AnimationConfig = {
    duration: 1.0,
    easing: 'power2.inOut',
    delay: 0
  };

  private readonly ANIMATION_NAMES = {
    OPEN_LID: 'Open Lid.001',
    CLOSE_LID: 'Close Lid'
  };

  private readonly GSAP_TIMELINE = gsap.timeline({ paused: true });

  /**
   * Initialize animations for a CD case model
   */
  public initializeCDCaseAnimations(
    model: THREE.Group, 
    caseId: string
  ): CDCaseAnimations | null {
    if (!model || this.caseAnimations.has(caseId)) {
      return this.caseAnimations.get(caseId) || null;
    }

    const mixer = new THREE.AnimationMixer(model);
    let openAction: THREE.AnimationAction | null = null;
    let closeAction: THREE.AnimationAction | null = null;

    // Find and set up animation actions
    model.animations?.forEach((clip: THREE.AnimationClip) => {
      const action = mixer.clipAction(clip);
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;

      if (clip.name === this.ANIMATION_NAMES.OPEN_LID) {
        openAction = action;
      } else if (clip.name === this.ANIMATION_NAMES.CLOSE_LID) {
        closeAction = action;
      }
    });

    const animations: CDCaseAnimations = {
      mixer,
      openAction,
      closeAction,
      isAnimating: false,
      currentState: 'closed'
    };

    this.caseAnimations.set(caseId, animations);
    return animations;
  }

  /**
   * Open a CD case with smooth animation
   */
  public async openCDCase(
    caseId: string, 
    config: Partial<AnimationConfig> = {}
  ): Promise<void> {
    return this.animateCDCase(caseId, 'open', config);
  }

  /**
   * Close a CD case with smooth animation
   */
  public async closeCDCase(
    caseId: string, 
    config: Partial<AnimationConfig> = {}
  ): Promise<void> {
    return this.animateCDCase(caseId, 'close', config);
  }

  /**
   * Toggle CD case open/closed state
   */
  public async toggleCDCase(
    caseId: string, 
    config: Partial<AnimationConfig> = {}
  ): Promise<void> {
    const animations = this.caseAnimations.get(caseId);
    if (!animations) return;

    const isOpen = animations.currentState === 'open';
    return this.animateCDCase(caseId, isOpen ? 'close' : 'open', config);
  }

  /**
   * Core CD case animation logic
   */
  private async animateCDCase(
    caseId: string, 
    action: 'open' | 'close',
    config: Partial<AnimationConfig> = {}
  ): Promise<void> {
    const animations = this.caseAnimations.get(caseId);
    if (!animations || animations.isAnimating) {
      return Promise.reject(new Error(`Cannot animate case ${caseId}: ${!animations ? 'not found' : 'already animating'}`));
    }

    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
    const targetAction = action === 'open' ? animations.openAction : animations.closeAction;
    
    if (!targetAction) {
      return Promise.reject(new Error(`Animation action not found for ${action} on case ${caseId}`));
    }

    return new Promise((resolve, reject) => {
      try {
        animations.isAnimating = true;
        animations.currentState = action === 'open' ? 'opening' : 'closing';

        // Reset and configure the action
        targetAction.reset();
        targetAction.setEffectiveTimeScale(1 / finalConfig.duration);
        targetAction.setEffectiveWeight(1);

        // Set up completion callback
        const onComplete = () => {
          animations.isAnimating = false;
          animations.currentState = action === 'open' ? 'open' : 'closed';
          animations.mixer.removeEventListener('finished', onComplete);
          resolve();
        };

        animations.mixer.addEventListener('finished', onComplete);

        // Start the animation
        if (finalConfig.delay > 0) {
          setTimeout(() => {
            targetAction.play();
          }, finalConfig.delay * 1000);
        } else {
          targetAction.play();
        }

      } catch (error) {
        animations.isAnimating = false;
        reject(error);
      }
    });
  }

  /**
   * Create smooth rotation animation using GSAP
   */
  public animateRotation(
    object: THREE.Object3D,
    targetRotation: { x?: number; y?: number; z?: number },
    config: Partial<AnimationConfig> = {}
  ): gsap.core.Tween {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
    
    return gsap.to(object.rotation, {
      duration: finalConfig.duration,
      ease: finalConfig.easing,
      delay: finalConfig.delay,
      ...targetRotation
    });
  }

  /**
   * Create smooth position animation using GSAP
   */
  public animatePosition(
    object: THREE.Object3D,
    targetPosition: { x?: number; y?: number; z?: number },
    config: Partial<AnimationConfig> = {}
  ): gsap.core.Tween {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
    
    return gsap.to(object.position, {
      duration: finalConfig.duration,
      ease: finalConfig.easing,
      delay: finalConfig.delay,
      ...targetPosition
    });
  }

  /**
   * Create smooth scale animation using GSAP
   */
  public animateScale(
    object: THREE.Object3D,
    targetScale: number | { x?: number; y?: number; z?: number },
    config: Partial<AnimationConfig> = {}
  ): gsap.core.Tween {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
    const scaleTarget = typeof targetScale === 'number' 
      ? { x: targetScale, y: targetScale, z: targetScale }
      : targetScale;
    
    return gsap.to(object.scale, {
      duration: finalConfig.duration,
      ease: finalConfig.easing,
      delay: finalConfig.delay,
      ...scaleTarget
    });
  }

  /**
   * Create highlight animation for UI feedback
   */
  public animateHighlight(
    object: THREE.Object3D,
    config: Partial<AnimationConfig> = {}
  ): gsap.core.Timeline {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
    const tl = gsap.timeline();

    // Scale up slightly and add glow effect
    tl.to(object.scale, {
      duration: finalConfig.duration * 0.3,
      ease: 'power2.out',
      x: 1.1,
      y: 1.1,
      z: 1.1
    })
    .to(object.scale, {
      duration: finalConfig.duration * 0.7,
      ease: 'power2.out',
      x: 1,
      y: 1,
      z: 1
    });

    return tl;
  }

  /**
   * Queue animation for sequential execution
   */
  public queueAnimation(item: AnimationQueueItem): void {
    this.animationQueue.push(item);
    if (!this.isProcessingQueue) {
      this.processAnimationQueue();
    }
  }

  /**
   * Process animation queue sequentially
   */
  private async processAnimationQueue(): Promise<void> {
    if (this.isProcessingQueue || this.animationQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.animationQueue.length > 0) {
      const item = this.animationQueue.shift();
      if (!item) continue;

      try {
        item.onStart?.();

        switch (item.type) {
          case 'open':
          case 'close':
            if (item.target) {
              // Assume the target has a case ID stored as userData
              const caseId = (item.target as any).userData?.caseId || 'default';
              await this.animateCDCase(caseId, item.type, { duration: item.duration || 1.0 });
            }
            break;
          case 'rotate':
            if (item.target) {
              await new Promise(resolve => {
                this.animateRotation(item.target!, { y: Math.PI * 2 }, { 
                  duration: item.duration || 1.0 
                }).then(() => resolve(void 0));
              });
            }
            break;
          case 'highlight':
            if (item.target) {
              await new Promise(resolve => {
                this.animateHighlight(item.target!, { 
                  duration: item.duration || 0.5 
                }).then(() => resolve(void 0));
              });
            }
            break;
        }

        item.onComplete?.();
      } catch (error) {
        console.error('Animation queue error:', error);
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * Update all animation mixers (call in render loop)
   */
  public update(): void {
    const deltaTime = this.clock.getDelta();
    
    this.caseAnimations.forEach(animations => {
      animations.mixer.update(deltaTime);
    });
  }

  /**
   * Check if any CD case is currently animating
   */
  public isAnyCaseAnimating(): boolean {
    return Array.from(this.caseAnimations.values()).some(animations => animations.isAnimating);
  }

  /**
   * Get animation state for a specific case
   */
  public getCaseAnimationState(caseId: string): CDCaseAnimations | null {
    return this.caseAnimations.get(caseId) || null;
  }

  /**
   * Stop all animations immediately
   */
  public stopAllAnimations(): void {
    // Stop GSAP animations
    gsap.killTweensOf('*');
    
    // Stop CD case animations
    this.caseAnimations.forEach(animations => {
      animations.openAction?.stop();
      animations.closeAction?.stop();
      animations.isAnimating = false;
    });

    // Clear animation queue
    this.animationQueue.length = 0;
    this.isProcessingQueue = false;
  }

  /**
   * Dispose of all animation resources
   */
  public dispose(): void {
    this.stopAllAnimations();
    
    this.caseAnimations.forEach(animations => {
      animations.mixer.stopAllAction();
      animations.mixer.uncacheRoot(animations.mixer.getRoot());
    });
    
    this.caseAnimations.clear();
  }
}