import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { CDCase } from '../../../shared/interfaces';
import { SceneService } from '../../services/scene/scene.service';
import { VideoService } from '../video.service';
import { SilhouetteService } from '../silhouette.service';
import { CDCasesStateService } from '../../services/state/cd-cases-state.service';
import { CDCaseAnimationsService } from '../../services/animations/cd-case-animations.service';
import { MenuIntegrationService } from '../../../right-side-menu/services/menu-integration.service';

@Injectable()
export class AnimationHelperService {
  constructor(
    private videoService: VideoService,
    private silhouetteService: SilhouetteService,
    private sceneService: SceneService,
    private stateService: CDCasesStateService,
    private animationService: CDCaseAnimationsService,
    private menuIntegrationService: MenuIntegrationService
  ) {}

  /**
   * Main animation loop for the CD cases component
   * Orchestrates all animations, physics, and renders the scene
   * Handles case positioning, silhouette effects, video plane alignment, and menu integration
   * Called on each animation frame to maintain smooth motion and interactivity
   * 【✓】
   */
  animate(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    controls: OrbitControls,
    labelRenderer: CSS3DRenderer,
    cdCases: CDCase[],
    caseBackVideoPlane: THREE.Mesh,
    rightSideMenuPlane: THREE.Mesh,
    isManuallyAnimating: boolean,
    manuallyAnimatedCaseId: number | null,
    activeCaseExpanded: boolean,
    playingMusic: boolean[],
    tutorialCompleted: boolean[]
  ): void {
    if (!renderer) return;
    
    // Update animations and physics
    this.animationService.updateAnimations(cdCases);

    if (!isManuallyAnimating) {
      this.stateService.updatePositions(cdCases);
      
      // Keep videoPlane2 aligned with the active case if one exists
      const activeIndex = cdCases.findIndex(cdCase => cdCase.isActive);
      if (activeIndex >= 0) {
        this.videoService.updateVideoPlane2Alignment(
          caseBackVideoPlane,
          isManuallyAnimating,
          manuallyAnimatedCaseId,
          cdCases
        );
      }
    } else {
      // Only apply automatic position updates to cases we're not manually animating
      cdCases.forEach(cdCase => {
        if (cdCase.id !== manuallyAnimatedCaseId) {
          // Update positions for other cases only
          cdCase.position.lerp(cdCase.targetPosition, this.stateService.getPositionLerpFactor());
          cdCase.model.position.copy(cdCase.position);
        }
      });
      
      // Also keep videoPlane2 aligned during manual animation
      this.videoService.updateVideoPlane2Alignment(
        caseBackVideoPlane,
        isManuallyAnimating,
        manuallyAnimatedCaseId,
        cdCases
      );
    }
    
    // Update silhouette animation using SilhouetteService
    this.silhouetteService.updateSilhouetteAnimation(cdCases, playingMusic, tutorialCompleted);
    
    // Always update background animations - don't check for visibility
    // This ensures continuous shader animation even when the plane is toggled
    this.sceneService.updateBackgroundAnimations();
    
    // Update controls and render
    controls.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);

    // Update video plane alignment if needed
    if (caseBackVideoPlane && (activeCaseExpanded || isManuallyAnimating)) {
      this.videoService.updateVideoPlane2Alignment(
        caseBackVideoPlane,
        isManuallyAnimating,
        manuallyAnimatedCaseId,
        cdCases
      );
    }

    // If we have an active case, make sure the menu is visible and update its active index
    const activeIndex = cdCases.findIndex(cdCase => cdCase.isActive);
    if (activeIndex >= 0 && activeCaseExpanded) {
      // Only show the menu when a case is expanded
      this.menuIntegrationService.setMenuVisibility(true);
      this.menuIntegrationService.updateActiveCase(activeIndex);
      
      // Hide the original video plane when showing our menu
      if (rightSideMenuPlane) {
        rightSideMenuPlane.visible = false;
      }
    } else {
      this.menuIntegrationService.setMenuVisibility(false);
      
      // Restore the video plane visibility when the menu is hidden
      // (if it would normally be visible)
      if (rightSideMenuPlane && activeCaseExpanded) {
        rightSideMenuPlane.visible = true;
      }
    }
  }
} 