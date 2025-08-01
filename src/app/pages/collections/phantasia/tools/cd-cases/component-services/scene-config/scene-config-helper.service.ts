import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CDCase } from '../../../shared/interfaces';
import { CDCasesDebugService } from '../../services/debug/cd-cases-debug.service';

@Injectable()
export class SceneConfigHelperService {
  constructor(
    private debugService: CDCasesDebugService
  ) {}

  /**
   * Updates the camera position, field of view, and target
   * Delegates to the debug service to apply settings from the debug panel
   * 【✓】
   */
  updateCamera(camera: THREE.PerspectiveCamera, controls: OrbitControls, sceneSettings: any): void {
    this.debugService.updateCamera(camera, controls, sceneSettings);
  }

  /**
   * Updates lighting parameters, colors, intensities, and positions
   * Manages all scene lights (ambient, main, fill, back) and their helper visualizations
   * 【✓】
   */
  updateLighting(
    ambientLight: THREE.AmbientLight,
    mainLight: THREE.DirectionalLight,
    mainLightHelper: THREE.DirectionalLightHelper,
    fillLightHelper: THREE.DirectionalLightHelper,
    backLightHelper: THREE.DirectionalLightHelper,
    sceneSettings: any
  ): void {
    this.debugService.updateLighting(
      ambientLight,
      mainLight,
      mainLightHelper,
      fillLightHelper,
      backLightHelper,
      sceneSettings
    );
  }

  /**
   * Updates renderer parameters like exposure, gamma, and tone mapping
   * Controls the overall visual quality and appearance of the rendered scene
   * 【✓】
   */
  updateRenderer(renderer: THREE.WebGLRenderer, sceneSettings: any): void {
    this.debugService.updateRenderer(renderer, sceneSettings);
  }

  /**
   * Updates orbit controls parameters like rotation speed and damping
   * Configures how the camera responds to user input for scene navigation
   * 【✓】
   */
  updateOrbitControls(controls: OrbitControls, sceneSettings: any): void {
    this.debugService.updateOrbitControls(controls, sceneSettings);
  }

  /**
   * Updates ground plane settings (visibility, size, color)
   * Controls the appearance of the floor/ground in the scene
   * 【✓】
   */
  updateGround(scene: THREE.Scene, sceneSettings: any): void {
    this.debugService.updateGround(scene, sceneSettings);
  }

  /**
   * Updates case transform with debug panel settings
   * Allows fine-tuning of individual case position and rotation
   * 【✓】
   */
  updateCaseTransform(cdCase: CDCase): void {
    this.debugService.updateCaseTransform(cdCase);
  }

  /**
   * Resets all settings to default values from the config
   * Provides a way to return to a known good state after experimentation
   * 【✓】
   */
  resetToDefault(
    sceneSettings: any,
    config: any,
    cdCases: CDCase[],
    updateCamera: () => void,
    updateLighting: () => void,
    updateRenderer: () => void,
    updateOrbitControls: () => void,
    updateGround: () => void,
    updateCaseTransform: (cdCase: CDCase) => void
  ): void {
    this.debugService.resetToDefault(sceneSettings, config, cdCases);
    updateCamera();
    updateLighting();
    updateRenderer();
    updateOrbitControls();
    updateGround();
    cdCases.forEach(cdCase => updateCaseTransform(cdCase));
  }
} 