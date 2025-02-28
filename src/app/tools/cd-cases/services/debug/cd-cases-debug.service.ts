import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CDCase, SceneSettings, Config } from '../../../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CDCasesDebugService {
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

  updateRenderer(
    renderer: THREE.WebGLRenderer,
    settings: SceneSettings
  ): void {
    renderer.toneMappingExposure = settings.exposure;
  }

  updateOrbitControls(
    controls: OrbitControls,
    settings: SceneSettings
  ): void {
    controls.minPolarAngle = settings.orbitMinPolarAngle;
    controls.maxPolarAngle = settings.orbitMaxPolarAngle;
    controls.minDistance = settings.orbitMinDistance;
    controls.maxDistance = settings.orbitMaxDistance;
    controls.dampingFactor = settings.orbitDampingFactor;
    controls.update();
  }

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

  updateCaseTransform(cdCase: CDCase): void {
    cdCase.model.position.copy(cdCase.position);
    cdCase.model.rotation.copy(cdCase.rotation);
  }

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
      groundOpacity: config.sceneSettings.ground.opacity
    });
    
    // Reset case positions and rotations
    cdCases.forEach(cdCase => {
      cdCase.position.copy(cdCase.model.position);
      cdCase.rotation.copy(cdCase.model.rotation);
    });
  }
} 