import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { CDCase } from '../../../shared/interfaces';

interface AnimationQueueItem {
  type: 'open' | 'close';
  onComplete?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class CDCaseAnimationsService {
  private clock = new THREE.Clock();
  private readonly ANIMATION_DURATION = 1.0; // seconds
  private readonly ANIMATION_BUFFER = 100; // ms buffer between animations

  // Movement Types - clearly labeled case movements
  private readonly MOVEMENTS = {
    OPEN_LID: 'Open Lid.001',    // Trigger to open the CD case lid
    CLOSE_LID: 'Close Lid'       // Trigger to close the CD case lid
  };

  // Animation configurations
  private readonly ANIMATION_CONFIG = {
    duration: 1.0,
    easing: (t: number): number => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  };

  // Animation queues for each case
  private animationQueues: Map<number, AnimationQueueItem[]> = new Map();
  private activeAnimations: Map<number, boolean> = new Map();
  private animationListeners: Map<number, (e: any) => void> = new Map();
  private currentActions: Map<number, THREE.AnimationAction | undefined> = new Map();
  private targetStates: Map<number, boolean> = new Map(); // Tracks desired final state (open/closed)
  private animationLocks: Map<number, boolean> = new Map(); // Prevents any interference during animation

  // Add timing tracking
  private animationTimers: Map<number, {
    startTime: number,
    duration: number,
    type: 'open' | 'close'
  }> = new Map();

  setupAnimation(cdCase: CDCase): void {
    if (!cdCase.mixer || !cdCase.animations) {
      console.warn('🔧 [Setup] No mixer or animations available for case:', cdCase.id);
      return;
    }

    console.log(`🔧 [Setup] Initializing animations for case ${cdCase.id}`);
    
    // Initialize state tracking
    this.animationQueues.set(cdCase.id, []);
    this.activeAnimations.set(cdCase.id, false);
    this.currentActions.set(cdCase.id, undefined);
    this.targetStates.set(cdCase.id, false);
    this.animationLocks.set(cdCase.id, false);

    // Find the open and close animations
    const openAnim = cdCase.animations.find(a => a.name === this.MOVEMENTS.OPEN_LID);
    const closeAnim = cdCase.animations.find(a => a.name === this.MOVEMENTS.CLOSE_LID);

    if (openAnim && closeAnim) {
      console.log(`🔧 [Setup] Found animations for case ${cdCase.id}:`, {
        openAnim: openAnim.name,
        closeAnim: closeAnim.name
      });

      // Create and configure actions
      cdCase.openAction = cdCase.mixer.clipAction(openAnim);
      cdCase.closeAction = cdCase.mixer.clipAction(closeAnim);

      // Configure both actions
      [cdCase.openAction, cdCase.closeAction].forEach(action => {
        if (action) {
          action.setLoop(THREE.LoopOnce, 1);
          action.clampWhenFinished = true;
          action.enabled = true;
        }
      });

      // Initialize in closed state
      if (cdCase.closeAction) {
        cdCase.closeAction.play().setEffectiveTimeScale(1).setEffectiveWeight(1);
        cdCase.closeAction.paused = true;
        cdCase.closeAction.time = closeAnim.duration;
        cdCase.mixer.update(0);
        cdCase.isOpen = false;
      }

      // Set up completion listener
      const onAnimationFinished = () => this.onAnimationComplete(cdCase);
      this.animationListeners.set(cdCase.id, onAnimationFinished);
    }
  }

  queueAnimation(cdCase: CDCase, type: 'open' | 'close', onComplete?: () => void): void {
    const targetOpen = type === 'open';
    
    console.group(`%c 🎬 [ANIM-QUEUE] Case ${cdCase.id}`, 'background: #2196F3; color: white; padding: 2px 5px; border-radius: 3px;');
    console.log('Request:', {
      type,
      currentlyOpen: cdCase.isOpen,
      isLocked: this.animationLocks.get(cdCase.id),
      isAnimating: this.isAnimating(cdCase),
      queueLength: (this.animationQueues.get(cdCase.id) || []).length,
      hasActiveAction: !!this.currentActions.get(cdCase.id)
    });

    // If we're already animating or locked, add to queue and return
    if (this.animationLocks.get(cdCase.id) || this.isAnimating(cdCase)) {
      const queue = this.animationQueues.get(cdCase.id) || [];
      queue.push({ type, onComplete });
      this.animationQueues.set(cdCase.id, queue);
      this.targetStates.set(cdCase.id, targetOpen);
      
      console.log(`%c ⏳ [ANIM-QUEUE] Case ${cdCase.id} is busy, queued ${type}`, 'background: #FFA000; color: white; padding: 2px 5px; border-radius: 3px;');
      console.groupEnd();
      return;
    }

    // If we're already in the target state, just call complete
    if ((targetOpen && cdCase.isOpen) || (!targetOpen && !cdCase.isOpen)) {
      console.log(`%c ✅ [ANIM-SKIP] Case ${cdCase.id} already in ${type} state`, 'background: #4CAF50; color: white; padding: 2px 5px; border-radius: 3px;');
      onComplete?.();
      console.groupEnd();
      return;
    }

    // Clear existing queue and start fresh
    const queue = [{ type, onComplete }];
    this.animationQueues.set(cdCase.id, queue);
    this.targetStates.set(cdCase.id, targetOpen);
    
    console.log(`%c 📋 [ANIM-QUEUE] Starting new animation queue for case ${cdCase.id}`, 'background: #2196F3; color: white; padding: 2px 5px; border-radius: 3px;');
    console.groupEnd();
    
    // Lock immediately to prevent race conditions
    this.animationLocks.set(cdCase.id, true);
    
    // Process on next frame to ensure clean state
    requestAnimationFrame(() => {
      this.processNextAnimation(cdCase);
    });
  }

  private processNextAnimation(cdCase: CDCase): void {
    console.group(`%c ⚙️ [ANIM-PROCESS] Case ${cdCase.id}`, 'background: #673AB7; color: white; padding: 2px 5px; border-radius: 3px;');
    
    // Handle animation buffer timing
    const currentTimer = this.animationTimers.get(cdCase.id);
    if (currentTimer) {
      const elapsed = Date.now() - currentTimer.startTime;
      if (elapsed < currentTimer.duration + this.ANIMATION_BUFFER) {
        setTimeout(() => this.processNextAnimation(cdCase), this.ANIMATION_BUFFER);
        console.groupEnd();
        return;
      }
    }

    // Ensure lock state
    this.animationLocks.set(cdCase.id, true);

    const queue = this.animationQueues.get(cdCase.id) || [];
    if (queue.length === 0) {
      this.animationLocks.set(cdCase.id, false);
      this.animationTimers.delete(cdCase.id);
      console.groupEnd();
      return;
    }

    const nextAnimation = queue[0];
    const action = nextAnimation.type === 'open' ? cdCase.openAction : cdCase.closeAction;

    if (!action) {
      console.warn(`No ${nextAnimation.type} action available for case:`, cdCase.id);
      this.onAnimationComplete(cdCase);
      console.groupEnd();
      return;
    }

    try {
      // Stop any current animations
      if (cdCase.mixer) {
        cdCase.mixer.stopAllAction();
      }

      // Configure the new animation
      action.reset();
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      action.enabled = true;

      // Set up timing
      this.animationTimers.set(cdCase.id, {
        startTime: Date.now(),
        duration: action.getClip().duration * 1000,
        type: nextAnimation.type
      });

      // Mark as active and store current action
      this.activeAnimations.set(cdCase.id, true);
      this.currentActions.set(cdCase.id, action);

      // Add completion listener
      const listener = this.animationListeners.get(cdCase.id);
      if (listener) {
        action.getMixer().addEventListener('finished', listener);
      }

      // Start the animation
      action.play();

      console.log(`%c ▶️ [ANIM-START] Playing ${nextAnimation.type} animation for case ${cdCase.id}`, 'background: #E91E63; color: white; padding: 2px 5px; border-radius: 3px;');
    } catch (error) {
      console.error(`Error playing animation for case ${cdCase.id}:`, error);
      this.cleanupAnimation(cdCase);
    }
    
    console.groupEnd();
  }

  private stopExistingAnimations(cdCase: CDCase): void {
    if (cdCase.mixer) {
      cdCase.mixer.stopAllAction();
    }
    this.cleanupListeners(cdCase);
  }

  private onAnimationComplete(cdCase: CDCase): void {
    console.group(`%c ✨ [ANIM-COMPLETE] Case ${cdCase.id}`, 'background: #009688; color: white; padding: 2px 5px; border-radius: 3px;');
    
    const queue = this.animationQueues.get(cdCase.id) || [];
    const completedAnimation = queue.shift();
    this.animationQueues.set(cdCase.id, queue);

    const timer = this.animationTimers.get(cdCase.id);
    if (timer) {
      const elapsed = Date.now() - timer.startTime;
      console.log(`Animation timing:`, {
        type: timer.type,
        duration: timer.duration,
        elapsed,
        difference: elapsed - timer.duration
      });
    }

    if (completedAnimation) {
      // Update the case state
      if (completedAnimation.type === 'open') {
        cdCase.isOpen = true;
        console.log(`%c 📂 [ANIM-STATE] Case ${cdCase.id} marked as open`, 'background: #4CAF50; color: white; padding: 2px 5px; border-radius: 3px;');
      } else if (completedAnimation.type === 'close') {
        cdCase.isOpen = false;
        console.log(`%c 📁 [ANIM-STATE] Case ${cdCase.id} marked as closed`, 'background: #F44336; color: white; padding: 2px 5px; border-radius: 3px;');
      }

      // Call the completion callback
      completedAnimation.onComplete?.();
    }

    // Clean up current animation state
    this.cleanupAnimation(cdCase);

    // If there are more animations in the queue, process them after buffer
    if (queue.length > 0) {
      console.log(`%c 🔄 [ANIM-NEXT] Processing next animation in queue for case ${cdCase.id} after buffer`, 'background: #2196F3; color: white; padding: 2px 5px; border-radius: 3px;');
      setTimeout(() => {
        this.processNextAnimation(cdCase);
      }, this.ANIMATION_BUFFER);
    } else {
      // Check if we need to reach target state
      const targetOpen = this.targetStates.get(cdCase.id);
      if (targetOpen !== undefined && targetOpen !== cdCase.isOpen) {
        console.log(`%c 🔄 [ANIM-NEXT] Queueing animation to reach target state for case ${cdCase.id}`, 'background: #2196F3; color: white; padding: 2px 5px; border-radius: 3px;', {
          currentState: cdCase.isOpen,
          targetState: targetOpen
        });
        setTimeout(() => {
          this.queueAnimation(cdCase, targetOpen ? 'open' : 'close');
        }, this.ANIMATION_BUFFER);
      } else {
        // Finally unlock the case
        this.animationLocks.set(cdCase.id, false);
        this.animationTimers.delete(cdCase.id);
      }
    }
    
    console.groupEnd();
  }

  private cleanupAnimation(cdCase: CDCase): void {
    console.group(`%c 🧹 [ANIM-CLEANUP] Case ${cdCase.id}`, 'background: #795548; color: white; padding: 2px 5px; border-radius: 3px;');
    
    // Clean up the current action
    const currentAction = this.currentActions.get(cdCase.id);
    if (currentAction) {
      // Don't stop the action, just remove the listener
      this.cleanupListeners(cdCase);
    }
    
    this.currentActions.set(cdCase.id, undefined);
    this.activeAnimations.set(cdCase.id, false);
    
    console.log('Cleanup complete:', {
      currentAction: currentAction?.getClip().name,
      wasAnimating: this.isAnimating(cdCase),
      wasLocked: this.animationLocks.get(cdCase.id),
      remainingInQueue: (this.animationQueues.get(cdCase.id) || []).length,
      timer: this.animationTimers.get(cdCase.id)
    });
    
    console.groupEnd();
  }

  updateAnimations(cdCases: CDCase[]): void {
    const delta = this.clock.getDelta();
    
    cdCases.forEach(cdCase => {
      // Only update if there's an active animation
      if (cdCase.mixer && this.isAnimating(cdCase)) {
        cdCase.mixer.update(delta);
        if (Math.random() < 0.02) { // Log only ~2% of updates to avoid spam
          console.log(`%c ⏱️ [ANIM-UPDATE] Case ${cdCase.id}`, 'background: #607D8B; color: white; padding: 2px 5px; border-radius: 3px;', {
            delta,
            currentAction: this.currentActions.get(cdCase.id)?.getClip().name,
            progress: this.currentActions.get(cdCase.id)?.time || 0
          });
        }
      }
    });
  }

  clearQueue(cdCase: CDCase): void {
    // Don't clear if case is locked
    if (this.animationLocks.get(cdCase.id)) {
      return;
    }
    this.animationQueues.set(cdCase.id, []);
    this.targetStates.set(cdCase.id, cdCase.isOpen);
  }

  isAnimating(cdCase: CDCase): boolean {
    return this.activeAnimations.get(cdCase.id) || false;
  }

  private cleanupListeners(cdCase: CDCase): void {
    const currentAction = this.currentActions.get(cdCase.id);
    const listener = this.animationListeners.get(cdCase.id);
    
    if (currentAction && listener) {
      console.log(`🎧 [Cleanup] Removing animation listener for case ${cdCase.id}`, {
        actionName: currentAction.getClip().name
      });
      currentAction.getMixer().removeEventListener('finished', listener);
    }
  }

  // New method to check if any case is currently animating
  hasAnyActiveAnimations(cdCases: CDCase[]): boolean {
    return cdCases.some(cdCase => this.isAnimating(cdCase));
  }
} 