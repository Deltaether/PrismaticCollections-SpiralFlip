import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { CDCase } from '../../shared/interfaces';

@Injectable()
export class SilhouetteService {
  private silhouetteMaterial: THREE.ShaderMaterial | null = null;
  private silhouetteMesh: THREE.Mesh | null = null;
  private config: any; // will be set in setConfig method
  private scene!: THREE.Scene;
  private clock = new THREE.Clock();

  /**
   * Stores configuration data for silhouette effects
   * Sets up appearance settings like color, intensity, and animation parameters
   * 【✓】
   */
  setConfig(config: any): void {
    this.config = config;
    // Save a reference to cdCases if it exists
    if (config.cdCases) {
      this.config.cdCases = config.cdCases;
    }
  }

  /**
   * Sets the Three.js scene for adding silhouette meshes
   * Required for all silhouette operations that modify the scene
   * 【✓】
   */
  setScene(scene: THREE.Scene): void {
    this.scene = scene;
  }

  /**
   * Removes silhouette effect from a CD case
   * Restores original materials and cleans up added meshes
   * Called when a case is no longer active or during cleanup
   * 【✓】
   */
  removeSilhouetteEffect(cdCase: CDCase): void {
    // Restore original materials to the case model
    cdCase.model.traverse((child) => {
      if (child instanceof THREE.Mesh && child.userData['originalMaterial']) {
        // Restore original material
        child.material = child.userData['originalMaterial'];
        // Clear the stored material reference
        delete child.userData['originalMaterial'];
      }
    });
    
    // Also clear any silhouette mesh references if they exist
    if (this.silhouetteMesh) {
      this.scene.remove(this.silhouetteMesh);
      this.silhouetteMesh = null;
    }
    
    if (this.silhouetteMaterial) {
      this.silhouetteMaterial.dispose();
      this.silhouetteMaterial = null;
    }
  }

  /**
   * Creates a pulsating silhouette effect for the active CD case
   * Applies emissive materials for visual highlighting
   * Skips effect if tutorial is completed for that case
   * 【✓】
   */
  createActiveCaseSilhouette(cdCase: CDCase, tutorialCompleted: boolean[]): void {
    // Check if tutorial has been completed for this case - don't show silhouette if so
    const caseIndex = this.config.cdCases.indexOf(cdCase);
    if (caseIndex >= 0 && tutorialCompleted[caseIndex]) {
      return;
    }
    
    // Remove existing silhouette if any
    if (this.silhouetteMesh) {
      this.scene.remove(this.silhouetteMesh);
      this.silhouetteMesh = null;
      
      // Dispose of old geometry and material
      if (this.silhouetteMaterial) {
        this.silhouetteMaterial.dispose();
      }
    }
    
    // Get silhouette config
    const silhouetteConfig = this.config.silhouette;
    
    // Store reference to the CD case model
    const caseModel = cdCase.model;
    
    // If we have an active case, create an outline effect by applying a custom shader directly to the case
    // Parse color from config hex
    const colorHex = silhouetteConfig.appearance.color;
    const color = new THREE.Color(colorHex);
    
    // Create the outline effect by applying emissive materials to the CD case's existing geometry
    caseModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Store original material to restore later
        if (!child.userData['originalMaterial']) {
          child.userData['originalMaterial'] = child.material.clone();
        }
        
        // Create a new material based on the original but with emissive properties
        if (child.material) {
          // Handle array of materials
          if (Array.isArray(child.material)) {
            child.material = child.material.map(mat => {
              const newMat = mat.clone();
              newMat.emissive = color;
              newMat.emissiveIntensity = silhouetteConfig.appearance.intensity;
              return newMat;
            });
          } else {
            // Single material
            const newMaterial = child.material.clone();
            newMaterial.emissive = color;
            newMaterial.emissiveIntensity = silhouetteConfig.appearance.intensity;
            child.material = newMaterial;
          }
        }
      }
    });
    
    // For now, store a reference to the active case for pulsing
    this.silhouetteMaterial = null;
    this.silhouetteMesh = null; // Not storing mesh reference anymore, we'll work directly with the case model
    
    console.log('Silhouette effect applied directly to CD case:', cdCase.id);
  }

  /**
   * Updates silhouette animation effects each frame
   * Handles pulsing glow and visual feedback for active cases
   * Adjusts animation based on music playing and tutorial completion status
   * 【✓】
   */
  updateSilhouetteAnimation(cdCases: CDCase[], playingMusic: boolean[], tutorialCompleted: boolean[]): void {
    // Update silhouette animation for active case
    const activeIndex = cdCases.findIndex(cdCase => cdCase.isActive && !cdCase.isOpen);
    if (activeIndex >= 0 && !playingMusic[activeIndex] && !tutorialCompleted[activeIndex]) {
      const activeCase = cdCases[activeIndex];
      const elapsedTime = this.clock.getElapsedTime();
      const silhouetteConfig = this.config.silhouette;
      
      // Create pulsating effect by modulating emissive intensity
      const fastPulse = (1.0 - silhouetteConfig.animation.fastPulseAmount) + 
                        silhouetteConfig.animation.fastPulseAmount * 
                        Math.sin(elapsedTime * silhouetteConfig.animation.fastPulseSpeed);
      const slowPulse = (1.0 - silhouetteConfig.animation.slowPulseAmount) + 
                        silhouetteConfig.animation.slowPulseAmount * 
                        Math.sin(elapsedTime * silhouetteConfig.animation.slowPulseSpeed);
      const pulseIntensity = fastPulse * slowPulse * silhouetteConfig.appearance.intensity;
      
      // Apply pulsating intensity to the active case material
      activeCase.model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              if (mat.emissive) {
                mat.emissiveIntensity = pulseIntensity;
              }
            });
          } else if (child.material && child.material.emissive) {
            child.material.emissiveIntensity = pulseIntensity;
          }
        }
      });
    }
    
    // Restore original materials when case is no longer active
    cdCases.forEach(cdCase => {
      if (!cdCase.isActive && cdCase.model) {
        cdCase.model.traverse((child) => {
          if (child instanceof THREE.Mesh && child.userData['originalMaterial']) {
            // Restore original material
            child.material = child.userData['originalMaterial'];
            // Clear the stored material reference
            delete child.userData['originalMaterial'];
          }
        });
      }
    });
  }
} 