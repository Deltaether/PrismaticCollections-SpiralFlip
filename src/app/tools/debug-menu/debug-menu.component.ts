import { Component, Input, Output, EventEmitter, OnDestroy, OnInit, AfterViewInit, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as dat from 'dat.gui';
import * as THREE from 'three';
import { CDCase, CaseSettings, SceneSettings, CaseSettingsData } from '../shared/interfaces';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// 【✓】 Define interfaces for type safety
interface DebugState {
  readonly isVisible: boolean;
  readonly isInitialized: boolean;
}

interface DebugUISettings {
  readonly fileInputId: string;
}

@Component({
  selector: 'app-debug-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toggle-button" (click)="toggleDebugMenu()">
      <span class="icon">{{ isDebugVisible ? '×' : '⚙' }}</span>
      <span class="label" *ngIf="!isDebugVisible">Debug</span>
    </div>
    <div class="debug-container" [class.hidden]="!isDebugVisible"></div>
  `,
  styles: [`
    .debug-container {
      position: fixed;
      top: 100px;
      right: 0;
      z-index: 1000;
      pointer-events: auto;
      transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
      opacity: 1;
    }

    .debug-container.hidden {
      transform: translateX(100%);
      opacity: 0;
    }

    .toggle-button {
      position: fixed;
      top: 100px;
      right: 15px;
      min-width: 40px;
      height: 40px;
      background-color: rgba(60, 60, 60, 0.7);
      color: white;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 20px;
      z-index: 1001;
      pointer-events: auto;
      user-select: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      transition: all 0.2s ease-in-out;
      backdrop-filter: blur(2px);
      padding: 0 8px;
    }

    .toggle-button .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      width: 24px;
      height: 24px;
    }

    .toggle-button .label {
      margin-left: 5px;
      font-size: 14px;
      font-family: Arial, sans-serif;
    }

    .toggle-button:hover {
      background-color: rgba(80, 80, 80, 0.9);
      transform: scale(1.05);
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
  `],
  changeDetection: ChangeDetectionStrategy.OnPush // 【✓】 Optimize change detection
})
export class DebugMenuComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() sceneSettings!: SceneSettings;
  @Input() caseSettings!: CaseSettings;
  @Input() cdCases!: CDCase[];
  
  @Output() updateCamera = new EventEmitter<void>();
  @Output() updateLighting = new EventEmitter<void>();
  @Output() updateRenderer = new EventEmitter<void>();
  @Output() updateOrbitControls = new EventEmitter<void>();
  @Output() updateGround = new EventEmitter<void>();
  @Output() updateCaseTransform = new EventEmitter<CDCase>();
  @Output() resetToDefault = new EventEmitter<void>();
  @Output() updateBackgroundEffects = new EventEmitter<void>();

  // 【✓】 Component state and configuration
  isDebugVisible = true;
  private readonly destroy$ = new Subject<void>();
  private readonly isDebugMode = false;
  private readonly debugUISettings: DebugUISettings = {
    fileInputId: 'debug-settings-file-input'
  };
  
  private gui!: dat.GUI;
  private debugContainer!: HTMLElement | null;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly cdr: ChangeDetectorRef
  ) {}

  // 【✓】 Toggle debug menu visibility
  toggleDebugMenu(): void {
    this.isDebugVisible = !this.isDebugVisible;
    localStorage.setItem('debugMenuVisible', this.isDebugVisible.toString());

    // When hiding the menu, set pointer-events to none after animation
    if (!this.isDebugVisible && this.debugContainer) {
      setTimeout(() => {
        if (!this.isDebugVisible && this.debugContainer) {
          this.debugContainer.style.pointerEvents = 'none';
        }
      }, 300); // Match the transition duration
    } else if (this.debugContainer) {
      // When showing, immediately enable pointer events
      this.debugContainer.style.pointerEvents = 'auto';
    }
    
    this.cdr.markForCheck();
    
    if (this.isDebugMode) {
      console.log(`[DebugMenu] Menu visibility set to: ${this.isDebugVisible}`);
    }
  }

  // 【✓】 Initialize component
  ngOnInit(): void {
    // First check if we have a saved visibility state
    const savedVisibility = localStorage.getItem('debugMenuVisible');
    if (savedVisibility !== null) {
      this.isDebugVisible = savedVisibility === 'true';
      this.cdr.markForCheck();
    }
    
    if (this.isDebugMode) {
      console.log('[DebugMenu] Component initialized');
      console.log('[DebugMenu] Initial visibility:', this.isDebugVisible);
    }
  }

  // 【✓】 Setup debug UI after view init
  ngAfterViewInit(): void {
    this.setupDebugUI();
    
    if (this.isDebugMode) {
      console.log('[DebugMenu] Debug UI setup complete');
    }
  }

  // 【✓】 Cleanup on component destroy
  ngOnDestroy(): void {
    if (this.gui) {
      this.gui.destroy();
    }
    
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.isDebugMode) {
      console.log('[DebugMenu] Component destroyed, resources cleaned up');
    }
  }

  // 【✓】 Setup debug UI with dat.gui
  private setupDebugUI(): void {
    try {
      this.gui = new dat.GUI({ autoPlace: false });
      
      // Ensure GUI is always on top and properly positioned
      const guiContainer = this.gui.domElement;
      this.debugContainer = this.elementRef.nativeElement.querySelector('.debug-container');
      
      if (!this.debugContainer) {
        console.error('[DebugMenu] Debug container not found');
        return;
      }
      
      this.debugContainer.appendChild(guiContainer);
      
      if (guiContainer.parentElement) {
        guiContainer.parentElement.style.zIndex = '1000';
        guiContainer.parentElement.style.position = 'relative';
        guiContainer.style.position = 'absolute';
        guiContainer.style.top = '0';
        guiContainer.style.right = '0';
      }
      
      // Set initial pointer-events based on visibility
      this.debugContainer.style.pointerEvents = this.isDebugVisible ? 'auto' : 'none';
      
      this.setupSceneControls();
      this.setupCaseControls();
      this.setupUtilityControls();
      
      if (this.isDebugMode) {
        console.log('[DebugMenu] Debug UI initialized with dat.gui');
      }
    } catch (error) {
      console.error('[DebugMenu] Error setting up debug UI:', error);
    }
  }
  
  // 【✓】 Setup scene controls
  private setupSceneControls(): void {
    // Scene settings folder
    const sceneFolder = this.gui.addFolder('Scene Settings');
    
    // Camera position
    const cameraFolder = sceneFolder.addFolder('Camera Position');
    cameraFolder.add(this.sceneSettings, 'cameraX', -20, 20).onChange(() => this.updateCamera.emit());
    cameraFolder.add(this.sceneSettings, 'cameraY', -20, 20).onChange(() => this.updateCamera.emit());
    cameraFolder.add(this.sceneSettings, 'cameraZ', -20, 20).onChange(() => this.updateCamera.emit());
    
    // Look at point
    const lookAtFolder = sceneFolder.addFolder('Look At Point');
    lookAtFolder.add(this.sceneSettings, 'lookAtX', -20, 20).onChange(() => this.updateCamera.emit());
    lookAtFolder.add(this.sceneSettings, 'lookAtY', -20, 20).onChange(() => this.updateCamera.emit());
    lookAtFolder.add(this.sceneSettings, 'lookAtZ', -20, 20).onChange(() => this.updateCamera.emit());
    
    // Orbit Controls
    const orbitFolder = sceneFolder.addFolder('Orbit Controls');
    orbitFolder.add(this.sceneSettings, 'orbitMinPolarAngle', 0, Math.PI).onChange(() => this.updateOrbitControls.emit());
    orbitFolder.add(this.sceneSettings, 'orbitMaxPolarAngle', 0, Math.PI).onChange(() => this.updateOrbitControls.emit());
    orbitFolder.add(this.sceneSettings, 'orbitMinDistance', 1, 50).onChange(() => this.updateOrbitControls.emit());
    orbitFolder.add(this.sceneSettings, 'orbitMaxDistance', 1, 50).onChange(() => this.updateOrbitControls.emit());
    orbitFolder.add(this.sceneSettings, 'orbitDampingFactor', 0, 1).onChange(() => this.updateOrbitControls.emit());
    
    // Ground settings
    const groundFolder = sceneFolder.addFolder('Ground Plane');
    groundFolder.add(this.sceneSettings, 'groundY', -10, 10).onChange(() => this.updateGround.emit());
    groundFolder.add(this.sceneSettings, 'groundOpacity', 0, 1).onChange(() => this.updateGround.emit());
    
    // Lighting
    const lightingFolder = sceneFolder.addFolder('Lighting');
    lightingFolder.add(this.sceneSettings, 'ambientIntensity', 0, 2).onChange(() => this.updateLighting.emit());
    lightingFolder.add(this.sceneSettings, 'mainLightIntensity', 0, 2).onChange(() => this.updateLighting.emit());
    lightingFolder.add(this.sceneSettings, 'exposure', 0, 2).onChange(() => this.updateRenderer.emit());
    
    // Add Background Effects folder
    const backgroundEffectsFolder = sceneFolder.addFolder('Background Effects');
    backgroundEffectsFolder.add(this.sceneSettings, 'bgEffectContinents').name('Continents').onChange(() => this.updateBackgroundEffects.emit());
    backgroundEffectsFolder.add(this.sceneSettings, 'bgEffectMountains').name('Mountains').onChange(() => this.updateBackgroundEffects.emit());
    backgroundEffectsFolder.add(this.sceneSettings, 'bgEffectWaves').name('Waves').onChange(() => this.updateBackgroundEffects.emit());
    backgroundEffectsFolder.add(this.sceneSettings, 'bgEffectBorders').name('Borders').onChange(() => this.updateBackgroundEffects.emit());
    backgroundEffectsFolder.add(this.sceneSettings, 'bgEffectSwirls').name('Swirls').onChange(() => this.updateBackgroundEffects.emit());
    backgroundEffectsFolder.add(this.sceneSettings, 'bgEffectLightRays').name('Magical Ley Lines').onChange(() => this.updateBackgroundEffects.emit());
    backgroundEffectsFolder.add(this.sceneSettings, 'bgEffectParticles').name('Particles').onChange(() => this.updateBackgroundEffects.emit());
    backgroundEffectsFolder.add(this.sceneSettings, 'bgEffectVideoInfluence').name('Video Shimmer').onChange(() => this.updateBackgroundEffects.emit());
    backgroundEffectsFolder.add(this.sceneSettings, 'bgEffectBloom').name('Bloom').onChange(() => this.updateBackgroundEffects.emit());
    backgroundEffectsFolder.add(this.sceneSettings, 'bgEffectFilmGrain').name('Film Grain').onChange(() => this.updateBackgroundEffects.emit());
    backgroundEffectsFolder.add(this.sceneSettings, 'bgEffectVignette').name('Vignette').onChange(() => this.updateBackgroundEffects.emit());
    
    // Open folders depending on visibility
    if (this.isDebugVisible) {
      sceneFolder.open();
    }
  }
  
  // 【✓】 Setup CD case controls
  private setupCaseControls(): void {
    // CD Cases folders with enhanced material controls
    const casesFolder = this.gui.addFolder('CD Cases');
    
    this.cdCases.forEach(cdCase => {
      const caseFolder = casesFolder.addFolder(`Case ${cdCase.id}`);
      const settings = this.caseSettings[cdCase.id];
      
      // Position controls
      const posFolder = caseFolder.addFolder('Position');
      posFolder.add(settings, 'positionX', -10, 10, 0.01).onChange(() => this.updateCaseTransform.emit(cdCase));
      posFolder.add(settings, 'positionY', -10, 10, 0.01).onChange(() => this.updateCaseTransform.emit(cdCase));
      posFolder.add(settings, 'positionZ', -10, 10, 0.01).onChange(() => this.updateCaseTransform.emit(cdCase));
      
      // Rotation controls
      const rotFolder = caseFolder.addFolder('Rotation');
      rotFolder.add(settings, 'rotationX', -Math.PI, Math.PI, 0.01).onChange(() => this.updateCaseTransform.emit(cdCase));
      rotFolder.add(settings, 'rotationY', -Math.PI, Math.PI, 0.01).onChange(() => this.updateCaseTransform.emit(cdCase));
      rotFolder.add(settings, 'rotationZ', -Math.PI, Math.PI, 0.01).onChange(() => this.updateCaseTransform.emit(cdCase));
      
      // Material controls for CD
      this.setupMaterialControls(cdCase, caseFolder);
    });
  }
  
  // 【✓】 Setup material controls for a CD case
  private setupMaterialControls(cdCase: CDCase, caseFolder: dat.GUI): void {
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
        } else if (node.material) {
          const mat = node.material;
          matFolder.add(mat, 'metalness', 0, 1, 0.01);
          matFolder.add(mat, 'roughness', 0, 1, 0.01);
          matFolder.add(mat, 'envMapIntensity', 0, 5, 0.1);
          if ('clearcoat' in mat) {
            matFolder.add(mat, 'clearcoat', 0, 1, 0.01);
            matFolder.add(mat, 'clearcoatRoughness', 0, 1, 0.01);
          }
        }
      }
    });
  }
  
  // 【✓】 Setup utility controls for saving/loading/resetting
  private setupUtilityControls(): void {
    const utilFolder = this.gui.addFolder('Utilities');
    
    // Add button to print current settings to console
    utilFolder.add({
      printSettings: () => this.printCurrentSettings()
    }, 'printSettings').name('Print Current Settings');
    
    // Add button to save settings to a file
    utilFolder.add({
      saveSettings: () => this.saveSettingsToFile()
    }, 'saveSettings').name('Save Settings to File');
    
    // Add button to load settings from a file
    utilFolder.add({
      loadSettings: () => this.loadSettingsFromFile()
    }, 'loadSettings').name('Load Settings from File');
    
    // Add button to reset to default settings
    utilFolder.add({
      resetSettings: () => this.resetToDefault.emit()
    }, 'resetSettings').name('Reset to Defaults');
    
    // Add camera lock control toggle for easy access
    this.gui.add(this.sceneSettings, 'lockControls')
      .name('Lock Camera Controls')
      .onChange(() => {
        this.updateOrbitControls.emit();
      });
  }

  // 【✓】 Print current settings to console
  private printCurrentSettings(): void {
    console.log('Current Scene Settings:', JSON.stringify(this.sceneSettings, null, 2));
    console.log('Current Case Settings:', JSON.stringify(this.caseSettings, null, 2));
  }

  // 【✓】 Save settings to a file
  private saveSettingsToFile(): void {
    const settings = {
      scene: this.sceneSettings,
      cases: this.caseSettings
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.download = 'phantasia-debug-settings.json';
    a.href = url;
    a.click();
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  // 【✓】 Load settings from a file
  private loadSettingsFromFile(): void {
    try {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.json';
      fileInput.id = this.debugUISettings.fileInputId;
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);
      
      fileInput.addEventListener('change', (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (!target.files || target.files.length === 0) return;
        
        const file = target.files[0];
        const reader = new FileReader();
        
        reader.onload = (e: ProgressEvent<FileReader>) => {
          try {
            const result = e.target?.result;
            if (typeof result !== 'string') return;
            
            const settings = JSON.parse(result);
            
            // Update scene settings
            if (settings.scene) {
              Object.assign(this.sceneSettings, settings.scene);
              this.updateCamera.emit();
              this.updateLighting.emit();
              this.updateRenderer.emit();
              this.updateOrbitControls.emit();
              this.updateGround.emit();
              this.updateBackgroundEffects.emit();
            }
            
            // Update case settings
            if (settings.cases) {
              Object.assign(this.caseSettings, settings.cases);
              this.cdCases.forEach(cdCase => this.updateCaseTransform.emit(cdCase));
            }
            
            // Rebuild the UI
            if (this.gui) {
              this.gui.destroy();
              this.setupDebugUI();
            }
            
            if (this.isDebugMode) {
              console.log('[DebugMenu] Settings loaded from file');
            }
          } catch (error) {
            console.error('[DebugMenu] Error parsing settings file:', error);
          } finally {
            document.body.removeChild(fileInput);
          }
        };
        
        reader.readAsText(file);
      });
      
      fileInput.click();
    } catch (error) {
      console.error('[DebugMenu] Error loading settings:', error);
    }
  }
} 