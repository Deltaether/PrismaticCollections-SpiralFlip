import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CDCase, SceneSettings, Config } from '../../../shared/interfaces';

/**
 * Debug service for CD cases visualization
 * Provides configuration controls for scene elements
 * Used with the debug panel for real-time adjustments
 */
@Injectable({
  providedIn: 'root'
})
export class CDCasesDebugService {
  /**
   * Updates camera position and target
   * Applies debug panel settings to camera view
   * 【✓】
   */
  updateCamera(
    camera: THREE.PerspectiveCamera,
    controls: OrbitControls,
    settings: SceneSettings
  ): void {
    camera.position.set(
      settings.cameraX,
      settings.cameraY,
      settings.cameraZ
    );
    controls.target.set(
      settings.lookAtX,
      settings.lookAtY,
      settings.lookAtZ
    );
    controls.update();
  }

  /**
   * Updates lighting parameters from debug panel
   * Controls intensity, color, and position of scene lights
   * 【✓】
   */
  updateLighting(
    ambientLight: THREE.AmbientLight,
    mainLight: THREE.DirectionalLight,
    mainLightHelper: THREE.DirectionalLightHelper,
    fillLightHelper: THREE.DirectionalLightHelper,
    backLightHelper: THREE.DirectionalLightHelper,
    settings: SceneSettings
  ): void {
    ambientLight.intensity = settings.ambientIntensity;
    mainLight.intensity = settings.mainLightIntensity;
    
    mainLightHelper.update();
    fillLightHelper.update();
    backLightHelper.update();
  }

  /**
   * Updates renderer settings from debug panel
   * Controls exposure, tone mapping, and other visual parameters
   * 【✓】
   */
  updateRenderer(
    renderer: THREE.WebGLRenderer,
    settings: SceneSettings
  ): void {
    renderer.toneMappingExposure = settings.exposure;
  }

  /**
   * Updates orbit controls with debug panel settings
   * Controls camera movement constraints and behavior
   * 【✓】
   */
  updateOrbitControls(
    controls: OrbitControls,
    settings: SceneSettings
  ): void {
    // Set basic orbit control properties
    controls.minPolarAngle = settings.orbitMinPolarAngle;
    controls.maxPolarAngle = settings.orbitMaxPolarAngle;
    controls.minDistance = settings.orbitMinDistance;
    controls.maxDistance = settings.orbitMaxDistance;
    controls.dampingFactor = settings.orbitDampingFactor;
    
    // Handle camera controls locking - master control
    controls.enabled = !settings.lockControls;
    
    // Also set individual control properties to match
    if (settings.lockControls) {
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableRotate = false;
    } else {
      controls.enableZoom = true;
      controls.enablePan = true;
      controls.enableRotate = true;
    }
    
    controls.update();
  }

  /**
   * Updates ground plane with debug panel settings
   * Controls floor visibility, position, and opacity
   * 【✓】
   */
  updateGround(
    scene: THREE.Scene,
    settings: SceneSettings
  ): void {
    const ground = scene.children.find(child => 
      child instanceof THREE.Mesh && 
      child.geometry instanceof THREE.PlaneGeometry
    ) as THREE.Mesh;
    
    if (ground && ground.material instanceof THREE.ShadowMaterial) {
      ground.position.y = settings.groundY;
      ground.material.opacity = settings.groundOpacity;
      ground.material.needsUpdate = true;
    }
  }

  /**
   * Updates CD case transform from debug panel
   * Allows fine-tuning of case position and rotation
   * 【✓】
   */
  updateCaseTransform(cdCase: CDCase): void {
    cdCase.model.position.copy(cdCase.position);
    cdCase.model.rotation.copy(cdCase.rotation);
  }

  /**
   * Resets all settings to default values
   * Provides a way to return to baseline configuration
   * 【✓】
   */
  resetToDefault(
    sceneSettings: SceneSettings,
    config: Config,
    cdCases: CDCase[]
  ): void {
    // Reset scene settings
    Object.assign(sceneSettings, {
      cameraX: config.sceneSettings.camera.position.x,
      cameraY: config.sceneSettings.camera.position.y,
      cameraZ: config.sceneSettings.camera.position.z,
      lookAtX: config.sceneSettings.camera.lookAt.x,
      lookAtY: config.sceneSettings.camera.lookAt.y,
      lookAtZ: config.sceneSettings.camera.lookAt.z,
      ambientIntensity: config.sceneSettings.lighting.ambient.intensity,
      mainLightIntensity: config.sceneSettings.lighting.main.intensity,
      exposure: config.sceneSettings.renderer.exposure,
      orbitMinPolarAngle: config.sceneSettings.orbitControls.minPolarAngle,
      orbitMaxPolarAngle: config.sceneSettings.orbitControls.maxPolarAngle,
      orbitMinDistance: config.sceneSettings.orbitControls.minDistance,
      orbitMaxDistance: config.sceneSettings.orbitControls.maxDistance,
      orbitDampingFactor: config.sceneSettings.orbitControls.dampingFactor,
      groundY: config.sceneSettings.ground.y,
      groundOpacity: config.sceneSettings.ground.opacity,
      lockControls: config.sceneSettings.camera.lockControls
    });
    
    // Reset case positions and rotations
    cdCases.forEach(cdCase => {
      cdCase.position.copy(cdCase.model.position);
      cdCase.rotation.copy(cdCase.model.rotation);
    });
  }
} 