import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as dat from 'dat.gui';
import * as THREE from 'three';
import { CDCase, CaseSettings, SceneSettings, CaseSettingsData } from '../shared/interfaces';

@Component({
  selector: 'app-debug-menu',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="debug-container"></div>',
  styles: [`
    .debug-container {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 1000;
      pointer-events: auto;
    }

    :host {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 1000;
      pointer-events: none;
    }

    :host ::ng-deep .dg {
      z-index: 1000 !important;
      pointer-events: auto !important;
    }

    :host ::ng-deep .dg.main {
      position: absolute !important;
      top: 0 !important;
      right: 0 !important;
      pointer-events: auto !important;
    }

    :host ::ng-deep .dg.main .close-button {
      position: relative !important;
      z-index: 1001 !important;
      pointer-events: auto !important;
    }

    :host ::ng-deep .dg.main > ul {
      pointer-events: auto !important;
    }
  `]
})
export class DebugMenuComponent implements OnInit, OnDestroy {
  @Input() sceneSettings!: SceneSettings;
  @Input() caseSettings!: CaseSettings;
  @Input() cdCases!: CDCase[];
  @Input() onUpdateCamera!: () => void;
  @Input() onUpdateLighting!: () => void;
  @Input() onUpdateRenderer!: () => void;
  @Input() onUpdateOrbitControls!: () => void;
  @Input() onUpdateGround!: () => void;
  @Input() onUpdateCaseTransform!: (cdCase: CDCase) => void;
  @Input() onResetToDefault!: () => void;

  private gui!: dat.GUI;

  ngOnInit(): void {
    this.setupDebugUI();
  }

  ngOnDestroy(): void {
    if (this.gui) {
      this.gui.destroy();
    }
  }

  private setupDebugUI(): void {
    this.gui = new dat.GUI({ autoPlace: false });
    
    // Ensure GUI is always on top and properly positioned
    const guiContainer = this.gui.domElement;
    document.querySelector('.debug-container')?.appendChild(guiContainer);
    
    if (guiContainer.parentElement) {
      guiContainer.parentElement.style.zIndex = '1000';
      guiContainer.parentElement.style.position = 'relative';
      guiContainer.style.position = 'absolute';
      guiContainer.style.top = '0';
      guiContainer.style.right = '0';
    }
    
    // Scene settings folder
    const sceneFolder = this.gui.addFolder('Scene Settings');
    
    // Camera position
    const cameraFolder = sceneFolder.addFolder('Camera Position');
    cameraFolder.add(this.sceneSettings, 'cameraX', -20, 20).onChange(this.onUpdateCamera);
    cameraFolder.add(this.sceneSettings, 'cameraY', -20, 20).onChange(this.onUpdateCamera);
    cameraFolder.add(this.sceneSettings, 'cameraZ', -20, 20).onChange(this.onUpdateCamera);
    
    // Look at point
    const lookAtFolder = sceneFolder.addFolder('Look At Point');
    lookAtFolder.add(this.sceneSettings, 'lookAtX', -20, 20).onChange(this.onUpdateCamera);
    lookAtFolder.add(this.sceneSettings, 'lookAtY', -20, 20).onChange(this.onUpdateCamera);
    lookAtFolder.add(this.sceneSettings, 'lookAtZ', -20, 20).onChange(this.onUpdateCamera);
    
    // Orbit Controls
    const orbitFolder = sceneFolder.addFolder('Orbit Controls');
    orbitFolder.add(this.sceneSettings, 'orbitMinPolarAngle', 0, Math.PI).onChange(this.onUpdateOrbitControls);
    orbitFolder.add(this.sceneSettings, 'orbitMaxPolarAngle', 0, Math.PI).onChange(this.onUpdateOrbitControls);
    orbitFolder.add(this.sceneSettings, 'orbitMinDistance', 1, 50).onChange(this.onUpdateOrbitControls);
    orbitFolder.add(this.sceneSettings, 'orbitMaxDistance', 1, 50).onChange(this.onUpdateOrbitControls);
    orbitFolder.add(this.sceneSettings, 'orbitDampingFactor', 0, 1).onChange(this.onUpdateOrbitControls);
    
    // Ground settings
    const groundFolder = sceneFolder.addFolder('Ground Plane');
    groundFolder.add(this.sceneSettings, 'groundY', -10, 10).onChange(this.onUpdateGround);
    groundFolder.add(this.sceneSettings, 'groundOpacity', 0, 1).onChange(this.onUpdateGround);
    
    // Lighting
    const lightingFolder = sceneFolder.addFolder('Lighting');
    lightingFolder.add(this.sceneSettings, 'ambientIntensity', 0, 2).onChange(this.onUpdateLighting);
    lightingFolder.add(this.sceneSettings, 'mainLightIntensity', 0, 2).onChange(this.onUpdateLighting);
    lightingFolder.add(this.sceneSettings, 'exposure', 0, 2).onChange(this.onUpdateRenderer);
    
    // CD Cases folders with enhanced material controls
    const casesFolder = this.gui.addFolder('CD Cases');
    
    this.cdCases.forEach(cdCase => {
      const caseFolder = casesFolder.addFolder(`Case ${cdCase.id}`);
      const settings = this.caseSettings[cdCase.id];
      
      // Position controls
      const posFolder = caseFolder.addFolder('Position');
      posFolder.add(settings, 'positionX', -10, 10, 0.01).onChange(() => this.onUpdateCaseTransform(cdCase));
      posFolder.add(settings, 'positionY', -10, 10, 0.01).onChange(() => this.onUpdateCaseTransform(cdCase));
      posFolder.add(settings, 'positionZ', -10, 10, 0.01).onChange(() => this.onUpdateCaseTransform(cdCase));
      
      // Rotation controls
      const rotFolder = caseFolder.addFolder('Rotation');
      rotFolder.add(settings, 'rotationX', -Math.PI, Math.PI, 0.01).onChange(() => this.onUpdateCaseTransform(cdCase));
      rotFolder.add(settings, 'rotationY', -Math.PI, Math.PI, 0.01).onChange(() => this.onUpdateCaseTransform(cdCase));
      rotFolder.add(settings, 'rotationZ', -Math.PI, Math.PI, 0.01).onChange(() => this.onUpdateCaseTransform(cdCase));
      
      // Material controls for CD
      const matFolder = caseFolder.addFolder('CD Materials');
      cdCase.model.traverse((node) => {
        if (node instanceof THREE.Mesh && node.name === 'CD') {
          if (Array.isArray(node.material)) {
            node.material.forEach((mat, index) => {
              const matSubFolder = matFolder.addFolder(`Material ${index + 1}`);
              matSubFolder.add(mat, 'metalness', 0, 1, 0.01);
              matSubFolder.add(mat, 'roughness', 0, 1, 0.01);
              matSubFolder.add(mat, 'envMapIntensity', 0, 5, 0.1);
              if ('clearcoat' in mat) {
                matSubFolder.add(mat, 'clearcoat', 0, 1, 0.01);
                matSubFolder.add(mat, 'clearcoatRoughness', 0, 1, 0.01);
              }
            });
          }
        }
      });
    });
    
    // Save/Load Settings
    const saveLoadFolder = this.gui.addFolder('Save/Load');
    saveLoadFolder.add({ saveToFile: () => this.saveSettingsToFile() }, 'saveToFile').name('Save Settings to File');
    saveLoadFolder.add({ loadFromFile: () => this.loadSettingsFromFile() }, 'loadFromFile').name('Load Settings from File');
    
    // Add button to print current settings
    this.gui.add({ printSettings: () => this.printCurrentSettings() }, 'printSettings').name('Print Settings');
    
    // Add button to reset to default
    this.gui.add({ resetToDefault: () => this.onResetToDefault() }, 'resetToDefault').name('Reset to Default');
  }

  private printCurrentSettings(): void {
    console.log('Current Scene Settings:', JSON.stringify(this.sceneSettings, null, 2));
    console.log('Current Case Settings:', JSON.stringify(this.caseSettings, null, 2));
  }

  private saveSettingsToFile(): void {
    const settings = {
      scene: this.sceneSettings,
      cases: this.caseSettings
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cd-case-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  private loadSettingsFromFile(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const settings = JSON.parse(e.target?.result as string);
            Object.assign(this.sceneSettings, settings.scene);
            Object.assign(this.caseSettings, settings.cases);
            
            // Update everything
            this.onUpdateCamera();
            this.onUpdateLighting();
            this.onUpdateRenderer();
            this.onUpdateOrbitControls();
            this.onUpdateGround();
            this.cdCases.forEach(cdCase => this.onUpdateCaseTransform(cdCase));
          } catch (error) {
            console.error('Error loading settings:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    
    input.click();
  }
} 