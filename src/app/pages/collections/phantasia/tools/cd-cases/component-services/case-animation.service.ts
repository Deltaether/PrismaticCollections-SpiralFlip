import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { CDCase } from '../../shared/interfaces';

@Injectable()
export class CaseAnimationService {
  private config: any; // will be set in setConfig method
  private clock = new THREE.Clock();
  private isManuallyAnimating: boolean = false;
  private manuallyAnimatedCaseId: number | null = null;
  private activeCaseExpanded: boolean = false;
  private animationCancelToken: number | null = null; // To track and cancel animations
  
  // This property will hold the expandActiveCase function bound from the component
  private expandActiveCaseAfterScroll: (cdCase: CDCase) => void = () => {};
  
  // New properties to track activation animation
  private isActivationAnimating: boolean = false;
  private pendingExpansion: { 
    case: CDCase | null,
    params: any[] | null
  } = { case: null, params: null };

  /**
   * Stores component configuration data
   * Makes animation settings accessible to all methods
   * 【✓】
   */
  setConfig(config: any): void {
    this.config = config;
  }

  /**
   * Returns whether manual animation is currently in progress
   * Used to control behavior during transitions
   * 【✓】
   */
  getIsManuallyAnimating(): boolean {
    return this.isManuallyAnimating;
  }

  /**
   * Sets the manual animation state flag
   * Controls behavior during user-triggered animations
   * 【✓】
   */
  setIsManuallyAnimating(value: boolean): void {
    this.isManuallyAnimating = value;
  }

  /**
   * Returns ID of case being manually animated
   * Used to identify which case is in transition
   * 【✓】
   */
  getManuallyAnimatedCaseId(): number | null {
    return this.manuallyAnimatedCaseId;
  }

  /**
   * Sets the ID of the case being manually animated
   * Tracks which case is currently in transition
   * 【✓】
   */
  setManuallyAnimatedCaseId(value: number | null): void {
    this.manuallyAnimatedCaseId = value;
  }

  /**
   * Returns whether the active case is in expanded state
   * Used to control behavior and UI based on expansion status
   * 【✓】
   */
  getActiveCaseExpanded(): boolean {
    return this.activeCaseExpanded;
  }

  /**
   * Sets the expanded state of the active case
   * Controls behavior and UI based on expansion status
   * 【✓】
   */
  setActiveCaseExpanded(value: boolean): void {
    this.activeCaseExpanded = value;
  }

  /**
   * Checks if a case activation animation is in progress
   * Prevents conflicting animations from starting
   * 【✓】
   */
  isActivationInProgress(): boolean {
    return this.isActivationAnimating;
  }
  
  /**
   * Initiates case activation animation sequence
   * Manages timing for expansion after activation completes
   * Handles queuing of animation steps for smooth transitions
   * 【✓】
   */
  startCaseActivation(cdCase: CDCase): void {
    this.isActivationAnimating = true;
    
    // The case is considered in activation animation until its position lerp reaches close to target
    // Typically takes about 10-15 frames at default lerp factor
    
    // We'll use a timeout to approximate when activation is done
    // A better way would be to track the actual lerp progress, but this is simpler
    setTimeout(() => {
      this.isActivationAnimating = false;
      
      // If there's a pending expansion, trigger it now
      if (this.pendingExpansion.case && this.pendingExpansion.params) {
        const { case: pendingCase, params } = this.pendingExpansion;
        this.pendingExpansion = { case: null, params: null };
        
        // Call expandActiveCase with the saved parameters
        this.expandActiveCase(
          pendingCase,
          params[0], // cdCases
          params[1], // playingMusic
          params[2], // tutorialCompleted 
          params[3], // caseBackVideoPlane
          params[4], // videoPlane
          params[5], // resetCaseBackVideoPlane
          params[6], // removeSilhouetteEffect
          params[7], // revealVideoAndBackground
          params[8]  // updateVideoPlane2Alignment
        );
      }
    }, 500); // Use 500ms as approximation for activation animation duration
  }

  /**
   * Calculates point along a cubic Bezier curve
   * Provides smooth animation paths for case movement
   * 【✓】
   */
  cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
    // Standard cubic Bezier formula
    const oneMinusT = 1 - t;
    return (
      Math.pow(oneMinusT, 3) * p0 +
      3 * Math.pow(oneMinusT, 2) * t * p1 +
      3 * oneMinusT * Math.pow(t, 2) * p2 +
      Math.pow(t, 3) * p3
    );
  }

  /**
   * Expands the active CD case with animation
   * Controls transition from browsing to detailed view
   * Manages position, rotation, and visual effects during expansion
   * 【✓】
   */
  expandActiveCase(
    clickedCase: CDCase, 
    cdCases: CDCase[], 
    playingMusic: boolean[], 
    tutorialCompleted: boolean[],
    caseBackVideoPlane: THREE.Mesh,
    videoPlane: THREE.Mesh,
    resetCaseBackVideoPlane: (opacity: number) => void,
    removeSilhouetteEffect: (cdCase: CDCase) => void,
    revealVideoAndBackground: () => void,
    updateVideoPlane2Alignment: () => void
  ): void {
    // Only expand if the case is active and not already expanded
    if (!clickedCase.isActive || this.activeCaseExpanded) {
      return;
    }
    
    // If activation animation is in progress, queue this expansion for later
    if (this.isActivationAnimating) {
      console.log("Queuing expansion - activation animation in progress");
      
      // Store the current parameters for later execution
      this.pendingExpansion = { 
        case: clickedCase, 
        params: [
          cdCases,
          playingMusic,
          tutorialCompleted,
          caseBackVideoPlane,
          videoPlane,
          resetCaseBackVideoPlane,
          removeSilhouetteEffect,
          revealVideoAndBackground,
          updateVideoPlane2Alignment
        ]
      };
      
      return;
    }
    
    // Cancel any in-progress animations first
    this.cancelCurrentAnimation();
    
    // Get the index of the clicked case
    const clickedIndex = cdCases.indexOf(clickedCase);
    
    // Mark tutorial as completed for this case
    if (clickedIndex >= 0) {
      tutorialCompleted[clickedIndex] = true;
    }
    
    // Reset the back video plane with opacity 0 (it will fade in after animation)
    resetCaseBackVideoPlane(0);
    
    // Show the main video plane when a case is expanded
    videoPlane.visible = true;
    
    // Remove silhouette immediately by restoring original materials
    removeSilhouetteEffect(clickedCase);
    
    // Store original rotation and current position (not initial position)
    const originalRotation = new THREE.Euler().copy(clickedCase.model.rotation);
    // Use the current position instead of initialPosition to prevent teleporting
    const startPosition = new THREE.Vector3().copy(clickedCase.model.position);
    
    console.log("Starting expansion from current position:", startPosition);
    console.log("Initial position (for reference):", clickedCase.initialPosition);
    
    // Set flag to prevent position updates during animation
    this.isManuallyAnimating = true;
    this.manuallyAnimatedCaseId = clickedCase.id;
    this.activeCaseExpanded = true; // Mark that the active case is now expanded
    
    // Get video plane configuration values
    const videoPlane2Pos = this.config.videoPlane2Position || { 
      offsetX: 0.8, 
      offsetY: 0.01, 
      offsetZ: 0.02 
    };
    
    // Get video plane rotation values
    const videoPlane2Rot = this.config.videoPlane2Rotation || { 
      offsetX: 0,
      offsetY: -1.57, 
      offsetZ: 0
    };
    
    // Get final case position offset
    const finalCasePosOffset = this.config.finalCasePosition || {
      offsetX: -2.5,
      offsetY: 3.0,
      offsetZ: -2.0
    };

    // Get final case rotation offset
    const finalCaseRotOffset = this.config.finalCaseRotation || {
      offsetX: 3.14,
      offsetY: 0.0,
      offsetZ: 0.0
    };
    
    // Get the consecutive case extra Y offset (default to 0.1 if not configured)
    const consecutiveCaseExtraY = this.config.consecutiveCaseExtraY || 0.1;
    
    // Calculate additional Y offset based on case index (closer to camera with each case)
    const caseIndex = clickedCase.carouselIndex;
    const extraYOffset = consecutiveCaseExtraY * caseIndex;
    
    // Apply the extra Y offset to the finalCasePosOffset
    const adjustedFinalCasePosOffset = {
      offsetX: finalCasePosOffset.offsetX,
      offsetY: finalCasePosOffset.offsetY + extraYOffset,
      offsetZ: finalCasePosOffset.offsetZ
    };
    
    // Debug logging to track position configurations
    console.log('Original Position:', startPosition);
    console.log('videoPlane2Position offsets:', videoPlane2Pos);
    console.log('Case Index:', caseIndex, 'Extra Y Offset:', extraYOffset);
    console.log('finalCasePosition offsets (with extra Y):', adjustedFinalCasePosOffset);
    console.log('finalCaseRotation offsets (added to original):', finalCaseRotOffset);
    
    // Get animation settings from config
    const animConfig = this.config.menuAnimation || {
      duration: 1.0,
      bezierCurve: { p1: 0.25, p2: 0.1, p3: 0.25, p4: 1.0 }
    };

    // Create animation
    const startTime = this.clock.getElapsedTime();
    const duration = animConfig.duration; // Use configured duration

    const animateTransform = () => {
      const currentTime = this.clock.getElapsedTime();
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(elapsed / duration, 1.0);
      
      // Apply bezier curve easing for time interpolation
      const bezierParams = animConfig.bezierCurve;
      const t = this.cubicBezier(
        rawProgress, 
        0,             // Start at 0
        bezierParams.p1,
        bezierParams.p2,
        1              // End at 1
      );
      
      // Use the same offset approach as with the video planes
      // Store current position before applying offsets
      const currentPosition = new THREE.Vector3().copy(clickedCase.model.position);
      
      // Calculate offsets that will be applied for this frame
      const offsetX = finalCasePosOffset.offsetX * t;
      const offsetY = (finalCasePosOffset.offsetY + extraYOffset) * t;
      const offsetZ = finalCasePosOffset.offsetZ * t;
      
      // Apply rotation offsets
      const currentRotation = new THREE.Euler().copy(clickedCase.model.rotation);

      // First apply the rotations from finalCaseRotOffset
      clickedCase.model.rotation.x = originalRotation.x + (finalCaseRotOffset.offsetX * t);
      clickedCase.model.rotation.y = originalRotation.y + (finalCaseRotOffset.offsetY * t);
      clickedCase.model.rotation.z = originalRotation.z + (finalCaseRotOffset.offsetZ * t);

      // Then apply additional rotations from finalCasePosition if they exist
      if (finalCasePosOffset.rotationX !== undefined) {
        clickedCase.model.rotation.x += (finalCasePosOffset.rotationX * t);
      }
      if (finalCasePosOffset.rotationY !== undefined) {
        clickedCase.model.rotation.y += (finalCasePosOffset.rotationY * t);
      }
      if (finalCasePosOffset.rotationZ !== undefined) {
        clickedCase.model.rotation.z += (finalCasePosOffset.rotationZ * t);
      }

      // Get rotation as quaternion to apply to position offset
      const caseQuaternion = new THREE.Quaternion().setFromEuler(clickedCase.model.rotation);
      
      // Create an offset vector based on the final offset scaled by progress
      const offsetVector = new THREE.Vector3(offsetX, offsetY, offsetZ);
      
      // Calculate final position by applying offsets to original position
      const posX = startPosition.x + offsetVector.x;
      const posY = startPosition.y + offsetVector.y;
      const posZ = startPosition.z + offsetVector.z;
      
      // Debug info
      if (rawProgress === 0 || rawProgress >= 0.99) {
        console.log(`Animation progress: ${rawProgress.toFixed(2)}, t=${t.toFixed(2)}`);
        console.log(`Original position:`, startPosition);
        console.log(`Applied offsets: X=${offsetX.toFixed(2)}, Y=${offsetY.toFixed(2)}, Z=${offsetZ.toFixed(2)}`);
        console.log(`Final position: X=${posX.toFixed(2)}, Y=${posY.toFixed(2)}, Z=${posZ.toFixed(2)}`);
      }
      
      // Apply calculated position directly to the case
      clickedCase.model.position.set(posX, posY, posZ);
      // Also update the case's internal position
      clickedCase.position.copy(clickedCase.model.position);
      
      // Update video plane alignment
      updateVideoPlane2Alignment();
      
      if (rawProgress < 1.0) {
        // Store the animation frame ID so it can be cancelled if needed
        this.animationCancelToken = requestAnimationFrame(animateTransform);
      }
      else {
        console.log("Animation complete: Keeping case in final position");
        // Animation is complete - keep the case in this position permanently!
        this.animationCancelToken = null;
        
        // Update the case's internal position to match its model position
        // This ensures if we later want to animate from here, we have the correct starting point
        clickedCase.position.copy(clickedCase.model.position);
        clickedCase.targetPosition.copy(clickedCase.model.position);
      }
    };
    
    // Start animation
    animateTransform();
    
    // After animation completes, show video and background planes
    setTimeout(() => {
      // Mark this case as playing music
      if (clickedIndex >= 0) {
        playingMusic[clickedIndex] = true;
      }
      
      revealVideoAndBackground();
    }, duration * 1000); // Convert duration to milliseconds
  }

  /**
   * Animates active case back to its original position
   * Handles transition from expanded to browsing view
   * Controls smooth retraction and state changes during animation
   * 【✓】
   */
  animateActiveCaseBack(
    activeCase: CDCase, 
    newIndex: number, 
    wasExpandedBefore: boolean, 
    cdCases: CDCase[],
    caseBackVideoPlane: THREE.Mesh,
    videoPlane: THREE.Mesh,
    stateService: any,
    updateVideoForNewActiveCase: (newIndex: number, wasExpandedBefore: boolean) => void,
    updateVideoPlane2Alignment: () => void
  ): void {
    console.log("Animating case back: ", activeCase.id, "New index: ", newIndex);
    
    // Cancel any in-progress animations first
    this.cancelCurrentAnimation();
    
    // Store current rotation and position
    const currentRotation = new THREE.Euler().copy(activeCase.model.rotation);
    const currentPosition = new THREE.Vector3().copy(activeCase.model.position);
    
    // IMPORTANT: Calculate the active position (where we want to end up)
    // Active position = initialPosition + Z_OFFSET from the state service (1.0)
    const targetActivePosition = new THREE.Vector3().copy(activeCase.initialPosition);
    targetActivePosition.z += 1.0; // This is the Z_OFFSET from CDCasesStateService
    
    console.log("Using active position as target:", targetActivePosition);
    console.log("Starting from current position:", currentPosition);
    
    // Set flag to prevent position updates during animation
    this.isManuallyAnimating = true;
    this.manuallyAnimatedCaseId = activeCase.id;
    
    // Hide the case back video plane gradually during the animation
    let videoPlaneOriginalOpacity = 0;
    if (caseBackVideoPlane) {
      const material = caseBackVideoPlane.material as THREE.MeshBasicMaterial;
      videoPlaneOriginalOpacity = material.opacity;
    }
    
    // Get final case position offset - but we will use negative values to go back
    const finalCasePosOffset = this.config.finalCasePosition || {
      offsetX: -1, 
      offsetY: 0.0,
      offsetZ: 2
    };

    // Get final case rotation offset - but we will use negative values to go back
    const finalCaseRotOffset = this.config.finalCaseRotation || {
      offsetX: 3.14,
      offsetY: 0.0,
      offsetZ: 0.0
    };
    
    // Get animation settings from config
    const animConfig = this.config.menuAnimation || {
      duration: 0.5, // Use a faster animation for going back
      bezierCurve: { p1: 0.25, p2: 0.1, p3: 0.25, p4: 1.0 }
    };

    // Create animation
    const startTime = this.clock.getElapsedTime();
    const duration = animConfig.duration; // Use configured duration

    const animateBack = () => {
      const currentTime = this.clock.getElapsedTime();
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(elapsed / duration, 1.0);
      
      // Apply bezier curve easing for time interpolation
      const bezierParams = animConfig.bezierCurve;
      const t = this.cubicBezier(
        rawProgress, 
        0,             // Start at 0
        bezierParams.p1,
        bezierParams.p2,
        1              // End at 1
      );
      
      // For collapse, calculate the needed offset to reach the target position
      // These offsets will decrease as t increases from 0 to 1
      
      // Calculate the total offsets we need to remove
      // This is the difference between our current expanded position and the target active position
      const totalOffsetX = currentPosition.x - targetActivePosition.x;
      const totalOffsetY = currentPosition.y - targetActivePosition.y;
      const totalOffsetZ = currentPosition.z - targetActivePosition.z;
      
      // Calculate current frame offsets by applying (1-t) to gradually remove them
      const offsetX = totalOffsetX * (1 - t);
      const offsetY = totalOffsetY * (1 - t);
      const offsetZ = totalOffsetZ * (1 - t);
      
      // Create offset vector for this frame
      const offsetVector = new THREE.Vector3(offsetX, offsetY, offsetZ);
      
      // Calculate position for this frame - starting from target and adding remaining offset
      const posX = targetActivePosition.x + offsetX;
      const posY = targetActivePosition.y + offsetY; 
      const posZ = targetActivePosition.z + offsetZ;
      
      // Set the position
      activeCase.model.position.set(posX, posY, posZ);
      // Also update the case's internal position
      activeCase.position.copy(activeCase.model.position);
      
      // Get the base rotation - this is what we want to return to
      const baseRotation = this.config.caseSettings?.baseRotation || { x: 0, y: 0, z: 0 };
      
      // Calculate the total rotation offset to remove
      const totalRotX = currentRotation.x - baseRotation.x;
      const totalRotY = currentRotation.y - baseRotation.y;
      const totalRotZ = currentRotation.z - baseRotation.z;
      
      // Calculate remaining rotation offset for this frame
      const remainingRotX = totalRotX * (1 - t);
      const remainingRotY = totalRotY * (1 - t);
      const remainingRotZ = totalRotZ * (1 - t);
      
      // Apply rotation: target + remaining offset
      const rotX = baseRotation.x + remainingRotX;
      const rotY = baseRotation.y + remainingRotY;
      const rotZ = baseRotation.z + remainingRotZ;
      
      activeCase.model.rotation.set(rotX, rotY, rotZ);
      
      // Fade out the video plane
      if (caseBackVideoPlane) {
        const material = caseBackVideoPlane.material as THREE.MeshBasicMaterial;
        material.opacity = videoPlaneOriginalOpacity * (1 - t);
      }
      
      if (rawProgress < 1.0) {
        // Store the animation frame ID so it can be cancelled if needed
        this.animationCancelToken = requestAnimationFrame(animateBack);
      } else {
        // Animation is complete - clear flags
        this.animationCancelToken = null;
        this.isManuallyAnimating = false;
        this.manuallyAnimatedCaseId = null;
        this.activeCaseExpanded = false; // Reset the expanded state
        
        // Set exact active position - should be the original active position with no offsets
        activeCase.model.position.copy(targetActivePosition);
        activeCase.position.copy(targetActivePosition);
        activeCase.targetPosition.copy(targetActivePosition);
        
        // Set exact base rotation
        activeCase.model.rotation.set(baseRotation.x, baseRotation.y, baseRotation.z);
        
        // Hide both video planes completely
        if (caseBackVideoPlane) {
          const material = caseBackVideoPlane.material as THREE.MeshBasicMaterial;
          material.opacity = 0;
          caseBackVideoPlane.visible = false;
        }
        videoPlane.visible = false;
        
        // If the new index is different than the current index (scrolling to another case),
        // set the new active case. Otherwise (clicking on the same case), just reset UI elements
        const currentIndex = cdCases.findIndex(cdCase => cdCase.isActive);
        if (newIndex !== currentIndex) {
          // Now set the new active case
          stateService.setActiveCase(cdCases, newIndex);
          
          // If the previous case was expanded, we should also expand the new case
          if (wasExpandedBefore) {
            // Need to wait a bit for the new case to be set as active before expanding it
            setTimeout(() => {
              // Find the newly activated case and expand it
              const newActiveCase = cdCases.find(cdCase => cdCase.isActive);
              if (newActiveCase) {
                // Use the expandActiveCase method of the component that will be bound when this is called
                this.expandActiveCaseAfterScroll(newActiveCase);
              }
            }, 100); // Short delay to ensure the case is fully activated
          }
        }
        updateVideoForNewActiveCase(newIndex, wasExpandedBefore);
      }
    };
    
    // Start the animation
    animateBack();
  }

  /**
   * Cancels any currently running animations
   * Prevents animation conflicts and allows clean transitions
   * 【✓】
   */
  cancelCurrentAnimation(): void {
    if (this.animationCancelToken !== null) {
      cancelAnimationFrame(this.animationCancelToken);
      this.animationCancelToken = null;
    }
  }

  /**
   * Sets the function to call for expanding a case after scrolling
   * Allows animation sequencing between component and service
   * 【✓】
   */
  setExpandFunction(expandFn: (cdCase: CDCase) => void): void {
    this.expandActiveCaseAfterScroll = expandFn;
  }

  /**
   * Resets a case to its default position and rotation
   * Used to clean up cases during rapid navigation
   * 【✓】
   */
  resetCasePosition(cdCase: CDCase): void {
    // Calculate the target active position
    const targetActivePosition = new THREE.Vector3().copy(cdCase.initialPosition);
    targetActivePosition.z += 1.0; // Add the Z_OFFSET
    
    // Reset case position
    cdCase.model.position.copy(targetActivePosition);
    cdCase.position.copy(targetActivePosition);
    cdCase.targetPosition.copy(targetActivePosition);
    
    // Set exact base rotation
    const baseRotation = this.config.caseSettings?.baseRotation || { x: 0, y: 0, z: 0 };
    cdCase.model.rotation.set(baseRotation.x, baseRotation.y, baseRotation.z);
  }
} 