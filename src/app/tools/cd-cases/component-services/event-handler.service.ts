import { Injectable } from '@angular/core';
import { CDCase } from '../../shared/interfaces';
import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';

@Injectable()
export class EventHandlerService {
  private config: any; // will be set in setConfig method

  /**
   * Stores component configuration data
   * Makes settings accessible to all event handlers
   * 【✓】
   */
  setConfig(config: any): void {
    this.config = config;
  }

  /**
   * Handles mouse wheel events for case navigation
   * Implements scrolling behavior to cycle through CD cases
   * Controls case activation, animation, and video updates
   * 【✓】
   */
  onWheel(
    event: WheelEvent,
    cdCases: CDCase[],
    sceneSettings: any,
    stateService: any,
    animationService: any,
    createSilhouette: (cdCase: CDCase) => void,
    animateActiveCaseBack: (activeCase: CDCase, newIndex: number, wasExpandedBefore: boolean) => void,
    updateVideoForNewActiveCase: (newIndex: number, wasExpandedBefore: boolean) => void,
    getActiveCaseExpanded: () => boolean,
    resetCasePosition: (cdCase: CDCase) => void
  ): void {
    // If controls are locked, handle CD case navigation
    if (sceneSettings.lockControls) {
      // Check if any automatic animations are currently running
      // But allow scrolling when a case is expanded (isManuallyAnimating is true but no active animation)
      if (animationService.hasAnyActiveAnimations(cdCases)) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      
      event.preventDefault();
      event.stopPropagation();
      
      const currentActiveIndex = cdCases.findIndex(cdCase => cdCase.isActive);
      
      // If no case is active, activate the first one
      if (currentActiveIndex === -1) {
        stateService.setActiveCase(cdCases, 0);
        
        // Create silhouette for new active case if it's not playing music
        const activeCase = cdCases.find(cdCase => cdCase.isActive);
        if (activeCase) {
          createSilhouette(activeCase);
        }
        return;
      }
      
      // Calculate new index based on scroll direction
      let newIndex = currentActiveIndex;
      if (event.deltaY > 0) { // Scrolling down/forward
        newIndex = (currentActiveIndex + 1) % cdCases.length;
      } else { // Scrolling up/backward
        newIndex = (currentActiveIndex - 1 + cdCases.length) % cdCases.length;
      }
      
      // Get the active case that we will animate back
      const activeCase = cdCases[currentActiveIndex];
      
      // Track if the case was expanded before we navigate away
      const wasExpandedBefore = getActiveCaseExpanded();
      
      // Ensure all cases are in their proper position when rapidly scrolling
      cdCases.forEach(cdCase => {
        if (cdCase !== activeCase && cdCase.isActive) {
          // Use the service method to reset the case position correctly
          resetCasePosition(cdCase);
        }
      });
      
      // Animate current active case back to its original position ONLY if it's expanded
      if (activeCase && activeCase.isActive && wasExpandedBefore) {
        // Pass the expanded state to the animateActiveCaseBack method
        // so it can be used when setting up the new case
        animateActiveCaseBack(activeCase, newIndex, wasExpandedBefore);
      } else {
        // If the case isn't expanded, just set the new active case directly
        stateService.setActiveCase(cdCases, newIndex);
        updateVideoForNewActiveCase(newIndex, wasExpandedBefore);
      }
    }
    // If controls are not locked, the event will propagate to OrbitControls naturally
  }

  /**
   * Sets up all event listeners for user interaction
   * Configures mouse/touch events for case selection and camera control
   * Handles click detection for case expansion and interface elements
   * 【✓】
   */
  addEventListeners(
    canvasRef: HTMLCanvasElement,
    cdCases: CDCase[],
    camera: THREE.Camera,
    eventsService: any,
    tutorialCompleted: boolean[],
    getActiveCaseExpanded: () => boolean,
    caseBackVideoPlane: THREE.Mesh,
    expandActiveCase: (clickedCase: CDCase) => void,
    animateActiveCaseBack: (activeCase: CDCase, newIndex: number, wasExpandedBefore: boolean) => void
  ): void {
    const canvas = canvasRef;
    
    // Modified event handler to handle case click
    canvas.addEventListener('mousedown', (e) => {
      // Check if click is on active case
      const clickedCase = eventsService.handleMouseDown(e, canvas, camera, cdCases);
      
      // Get the index of the clicked case
      const clickedIndex = clickedCase ? cdCases.indexOf(clickedCase) : -1;
      
      // If active case is clicked
      if (clickedCase && clickedCase.isActive) {
        // Mark tutorial as completed for this case
        if (clickedIndex >= 0) {
          tutorialCompleted[clickedIndex] = true;
        }
        
        // Check current expansion state
        const isCurrentlyExpanded = getActiveCaseExpanded();
        
        // If the case is already expanded, collapse it fully and stop
        if (isCurrentlyExpanded) {
          console.log("Case is already expanded, collapsing it fully");
          
          // Immediately hide the case back video plane
          if (caseBackVideoPlane) {
            caseBackVideoPlane.visible = false;
          }
          
          // Use the same animation logic as scrolling away
          // Keep the same index to stay on this case, don't switch
          animateActiveCaseBack(clickedCase, clickedIndex, false);
          return;
        }
        
        // If not expanded, expand the case using the new method
        expandActiveCase(clickedCase);
      }
    });
    
    canvas.addEventListener('mousemove', (e) => eventsService.handleMouseMove(e, canvas));
    canvas.addEventListener('mouseup', () => eventsService.handleMouseUp());
    canvas.addEventListener('contextmenu', (e) => eventsService.handleContextMenu(e, canvas, camera, cdCases));
  }

  /**
   * Handles window resize events for responsive display
   * Updates camera and renderer dimensions to match new window size
   * 【✓】
   */
  onWindowResize(
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    labelRenderer: CSS2DRenderer
  ): void {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * Activates a CD case with proper visual effects
   * Sets active state, creates silhouette, and handles expansion
   * 【✓】
   */
  activateCase(
    cdCase: CDCase,
    cdCases: CDCase[],
    playingMusic: boolean[],
    tutorialCompleted: boolean[],
    caseBackVideoPlane: THREE.Mesh,
    createSilhouette: (cdCase: CDCase) => void,
    expandActiveCase: (cdCase: CDCase) => void
  ): void {
    // Set the case as active
    cdCase.isActive = true;
    
    // Create silhouette for the newly active case
    createSilhouette(cdCase);
    
    // If the case back video plane exists, make it visible
    if (caseBackVideoPlane) {
      caseBackVideoPlane.visible = true;
    }
    
    // Expand the active case if the user clicks on it
    expandActiveCase(cdCase);
  }
  
  /**
   * Deactivates a CD case and resets its appearance
   * Cleans up effects and resets state when case is no longer selected
   * 【✓】
   */
  deactivateCase(
    cdCase: CDCase,
    cdCases: CDCase[],
    playingMusic: boolean[],
    tutorialCompleted: boolean[],
    caseBackVideoPlane: THREE.Mesh,
    createSilhouette: (cdCase: CDCase) => void,
    expandActiveCase: (cdCase: CDCase) => void
  ): void {
    // Set the case as inactive
    cdCase.isActive = false;
    cdCase.isDeactivating = true;
    
    // If the case back video plane exists, hide it
    if (caseBackVideoPlane) {
      caseBackVideoPlane.visible = false;
    }
    
    // Reset the case position to its default
    setTimeout(() => {
      cdCase.isDeactivating = false;
    }, 300);
  }
} 