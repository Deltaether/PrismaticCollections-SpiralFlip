import { Injectable, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { CDCase } from '../../../shared/interfaces';
import { SceneService } from '../../services/scene/scene.service';
import { VideoService } from '../video.service';
import { RendererService } from '../renderer.service';
import { MenuIntegrationService } from '../../../right-side-menu/services/menu-integration.service';
import { SilhouetteService } from '../silhouette.service';
import { CaseAnimationService } from '../case-animation.service';

@Injectable()
export class ViewHelperService {
  constructor(
    private videoService: VideoService,
    private rendererService: RendererService,
    private menuIntegrationService: MenuIntegrationService,
    private silhouetteService: SilhouetteService,
    private caseAnimationService: CaseAnimationService,
    private sceneService: SceneService
  ) {}

  /**
   * Sets up the CSS3D renderer for integrating HTML content into the 3D scene
   * Creates and configures a renderer that allows Angular components to appear in 3D space
   * Used for the interactive menu system that appears when cases are expanded
   * 【✓】
   */
  setupCSS3DRenderer(labelRendererElement: ElementRef<HTMLDivElement>): CSS3DRenderer {
    // Create CSS3D renderer
    const labelRenderer = new CSS3DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    
    // Basic positioning
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.left = '0';
    
    // Make sure the CSS3D renderer doesn't block interactions with the rest of the page
    // Only the menu itself should have pointer events
    labelRenderer.domElement.style.pointerEvents = 'none';
    labelRenderer.domElement.style.zIndex = '1';
    
    // Append to label renderer element
    labelRendererElement.nativeElement.appendChild(labelRenderer.domElement);
    
    return labelRenderer;
  }

  /**
   * Sets up the right-side menu for track selection and information display
   * Creates a 3D-positioned Angular component that integrates with the scene
   * Handles interaction between the 3D world and the 2D UI elements
   * 【✓】
   */
  setupRightSideMenu(
    scene: THREE.Scene,
    config: any,
    cdCases: CDCase[],
    rightSideMenuPlane: THREE.Mesh,
    handleTrackSelection: (index: number) => void
  ): any {
    // Get the config values for the rightSideMenuPlane
    const planeConfig = config.sceneSettings.videoPlane;

    // Create the menu component as a CSS3D object
    const css3DMenu = this.menuIntegrationService.createMenuObject(
      scene,
      planeConfig,
      cdCases,
      handleTrackSelection
    );
    
    // The CSS3D menu will not be visible until a case is expanded
    
    // Ensure the original video is still loaded for background effects
    // but not visible on the rightSideMenuPlane
    if (rightSideMenuPlane) {
      // Make the rightSideMenuPlane transparent but keep its geometry
      const material = rightSideMenuPlane.material as THREE.MeshBasicMaterial;
      if (material) {
        material.opacity = 0;
        material.transparent = true;
        material.needsUpdate = true;
      }
    }
    
    return css3DMenu;
  }

  /**
   * Reveals the video and background planes when a CD case is expanded
   * Controls the transition from browsing mode to detailed view mode
   * Handles proper video loading and visibility for the active case
   * 【✓】
   */
  revealVideoAndBackground(
    backgroundPlane: THREE.Mesh,
    cdCases: CDCase[],
    videoPaths: string[]
  ): void {
    // Show the right-side menu
    const activeIndex = cdCases.findIndex(cdCase => cdCase.isActive);
    if (activeIndex >= 0) {
      // Show the menu
      this.menuIntegrationService.setMenuVisibility(true);
      this.menuIntegrationService.updateActiveCase(activeIndex);
      
      // While making the rightSideMenuPlane transparent, we still need to play the video
      // for background effects, just not show it on the plane
      
      // Play the video for background effects (invisible on rightSideMenuPlane)
      if (activeIndex >= 0 && activeIndex < videoPaths.length) {
        // Get the methods via public getters
        const updateSource = this.videoService.getUpdateVideoSource();
        const playVideo = this.videoService.getVideoPlay();
        
        // Update video source to match active case
        if (updateSource) {
          updateSource(videoPaths[activeIndex]);
        }
        
        // Start video playback (it will be invisible on the plane but used for background)
        if (playVideo) {
          playVideo();
        }
      }
    }
    
    // Make the background visible
    if (backgroundPlane) {
      backgroundPlane.visible = true;
    }
  }

  /**
   * Updates visual effects on the background plane based on scene settings
   * Controls shader parameters and visual appearance of the cosmic background
   * 【✓】
   */
  updateBackgroundEffects(sceneSettings: any): void {
    // Delegate to the scene service
    this.sceneService.updateBackgroundEffects(sceneSettings);
  }

  /**
   * Removes the silhouette effect from a CD case
   * Restores original materials when a case is no longer active
   * 【✓】
   */
  removeSilhouetteEffect(cdCase: CDCase): void {
    this.silhouetteService.removeSilhouetteEffect(cdCase);
  }

  /**
   * Creates a silhouette effect wrapper for the active CD case
   * Adds a pulsating outline to highlight the currently selected case
   * Takes tutorial completion into account for visual feedback
   * 【✓】
   */
  createSilhouetteWrapper(cdCase: CDCase, tutorialCompleted: boolean[]): void {
    this.silhouetteService.createActiveCaseSilhouette(cdCase, tutorialCompleted);
  }

  /**
   * Wrapper for expanding the active case with proper animations
   * Orchestrates the transition between browsing and expanded view modes
   * Handles video planes, silhouette effects, and visual transitions
   * 【✓】
   */
  expandActiveCaseWrapper(
    cdCase: CDCase,
    cdCases: CDCase[],
    playingMusic: boolean[],
    tutorialCompleted: boolean[],
    caseBackVideoPlane: THREE.Mesh,
    rightSideMenuPlane: THREE.Mesh,
    revealVideoAndBackground: () => void,
    updateVideoPlane2Alignment: () => void
  ): void {
    // For background effects we keep video but for display we use the menu
    // We need to create a videoPlane reference from rightSideMenuPlane to maintain backward compatibility
    const videoPlane = rightSideMenuPlane;
    
    this.caseAnimationService.expandActiveCase(
      cdCase,
      cdCases,
      playingMusic,
      tutorialCompleted,
      caseBackVideoPlane,
      videoPlane,  // Pass rightSideMenuPlane as videoPlane
      this.videoService.resetCaseBackVideoPlane.bind(this.videoService),
      this.silhouetteService.removeSilhouetteEffect.bind(this.silhouetteService),
      revealVideoAndBackground,
      updateVideoPlane2Alignment
    );
  }

  /**
   * Updates the video content when a new case becomes active
   * Synchronizes the menu display with the newly selected CD case
   * Handles visibility states based on expansion status
   * 【✓】
   */
  updateVideoForNewActiveCase(
    newIndex: number, 
    wasExpandedBefore: boolean, 
    videoPaths: string[],
    playingMusic: boolean[],
    cdCases: CDCase[],
    tutorialCompleted: boolean[],
    createSilhouette: (cdCase: CDCase) => void,
    expandActiveCase: (cdCase: CDCase) => void
  ): void {
    // Update our menu instead of the video
    this.menuIntegrationService.updateActiveCase(newIndex);
    
    // Show the menu if a case is expanded
    if (wasExpandedBefore) {
      this.menuIntegrationService.setMenuVisibility(true);
    }
  }

  /**
   * Handles window resize events for proper rendering at new dimensions
   * Adjusts camera aspect ratio and renderer sizes for responsive display
   * Ensures the 3D scene maintains correct proportions when resized
   * 【✓】
   */
  onWindowResize(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, labelRenderer: CSS3DRenderer): void {
    // Adjust camera aspect ratio to match new window dimensions
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    // Resize renderers
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
  }
}
