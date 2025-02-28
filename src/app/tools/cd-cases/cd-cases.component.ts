import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { DebugMenuComponent } from '../debug-menu/debug-menu.component';
import { CDCase, CaseSettings, SceneSettings, Config } from '../shared/interfaces';
import config from './config/config.json';
import { CDCasesService } from './services/cd-cases.service';
import { SceneService } from './services/scene/scene.service';
import { allCases, updateCasePositions } from './models';
import { SceneLoaderComponent } from './scene-loader/scene-loader.component';
import { CDCasesEventsService } from './services/events/cd-cases-events.service';
import { CDCaseAnimationsService } from './services/animations/cd-case-animations.service';
import { CDCasesDebugService } from './services/debug/cd-cases-debug.service';
import { CDCasesStateService } from './services/state/cd-cases-state.service';

@Component({
  selector: 'app-cd-cases',
  standalone: true,
  imports: [CommonModule, DebugMenuComponent, SceneLoaderComponent],
  template: `
    <div class="cd-container">
      <app-scene-loader [isVisible]="isLoading"></app-scene-loader>
      <canvas #canvas [style.opacity]="isLoading ? '0' : '1'"></canvas>
      <div #labelRenderer [style.opacity]="isLoading ? '0' : '1'"></div>
      <div class="case-indicators" [style.opacity]="isLoading ? '0' : '1'">
        <div *ngFor="let cdCase of cdCases" 
             class="case-indicator"
             [class.open]="cdCase.isOpen">
          Case {{cdCase.id}}: {{cdCase.isOpen ? 'Open' : 'Closed'}}
        </div>
      </div>
    </div>
    <app-debug-menu
      [sceneSettings]="sceneSettings"
      [caseSettings]="caseSettings"
      [cdCases]="cdCases"
      [onUpdateCamera]="updateCamera.bind(this)"
      [onUpdateLighting]="updateLighting.bind(this)"
      [onUpdateRenderer]="updateRenderer.bind(this)"
      [onUpdateOrbitControls]="updateOrbitControls.bind(this)"
      [onUpdateGround]="updateGround.bind(this)"
      [onUpdateCaseTransform]="updateCaseTransform.bind(this)"
      [onResetToDefault]="resetToDefault.bind(this)"
    ></app-debug-menu>
  `,
  styleUrls: ['./cd-cases.component.scss']
})
export class CDCasesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('labelRenderer') private labelRendererElement!: ElementRef<HTMLDivElement>;

  private renderer!: THREE.WebGLRenderer;
  private labelRenderer!: CSS2DRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private animationId: number | null = null;
  public cdCases: CDCase[] = [];
  private config: Config = config;
  private loadingPromises: Promise<void>[] = [];
  public isLoading = true;

  // Lights
  private ambientLight!: THREE.AmbientLight;
  private mainLight!: THREE.DirectionalLight;
  private fillLight!: THREE.DirectionalLight;
  private backLight!: THREE.DirectionalLight;

  // Light helpers
  private mainLightHelper!: THREE.DirectionalLightHelper;
  private fillLightHelper!: THREE.DirectionalLightHelper;
  private backLightHelper!: THREE.DirectionalLightHelper;

  // Debug settings
  public sceneSettings: SceneSettings = {
    cameraX: this.config.sceneSettings.camera.position.x,
    cameraY: this.config.sceneSettings.camera.position.y,
    cameraZ: this.config.sceneSettings.camera.position.z,
    lookAtX: this.config.sceneSettings.camera.lookAt.x,
    lookAtY: this.config.sceneSettings.camera.lookAt.y,
    lookAtZ: this.config.sceneSettings.camera.lookAt.z,
    ambientIntensity: this.config.sceneSettings.lighting.ambient.intensity,
    mainLightIntensity: this.config.sceneSettings.lighting.main.intensity,
    exposure: this.config.sceneSettings.renderer.exposure,
    orbitMinPolarAngle: this.config.sceneSettings.orbitControls.minPolarAngle,
    orbitMaxPolarAngle: this.config.sceneSettings.orbitControls.maxPolarAngle,
    orbitMinDistance: this.config.sceneSettings.orbitControls.minDistance,
    orbitMaxDistance: this.config.sceneSettings.orbitControls.maxDistance,
    orbitDampingFactor: this.config.sceneSettings.orbitControls.dampingFactor,
    groundY: this.config.sceneSettings.ground.y,
    groundOpacity: this.config.sceneSettings.ground.opacity
  };
  
  public caseSettings: CaseSettings = {};

  constructor(
    private cdCasesService: CDCasesService,
    private sceneService: SceneService,
    private eventsService: CDCasesEventsService,
    private animationService: CDCaseAnimationsService,
    private debugService: CDCasesDebugService,
    private stateService: CDCasesStateService
  ) {
    // Load cases data
    this.config.cdCases = updateCasePositions(allCases);
  }

  ngAfterViewInit(): void {
    this.setupRenderer();
    this.setupControls();
    this.loadModels();
  }

  private setupRenderer(): void {
    this.renderer = this.sceneService.setupRenderer(this.canvasRef.nativeElement, this.config);
    this.scene = this.sceneService.setupScene(this.config);
    this.camera = this.sceneService.setupCamera(this.config);

    // Initialize CSS2D renderer for labels
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0';
    this.labelRenderer.domElement.style.pointerEvents = 'none';

    // Set up lights
    const lights = this.sceneService.setupLights(this.scene, this.config);
    this.ambientLight = lights.ambientLight;
    this.mainLight = lights.mainLight;
    this.fillLight = lights.fillLight;
    this.backLight = lights.backLight;

    // Add light helpers with labels
    this.mainLightHelper = new THREE.DirectionalLightHelper(this.mainLight, 1);
    this.fillLightHelper = new THREE.DirectionalLightHelper(this.fillLight, 1);
    this.backLightHelper = new THREE.DirectionalLightHelper(this.backLight, 1);
    
    // Add labels to lights
    const mainLabel = this.sceneService.createLightLabel('Main Light');
    const fillLabel = this.sceneService.createLightLabel('Fill Light');
    const backLabel = this.sceneService.createLightLabel('Back Light');
    
    this.mainLight.add(mainLabel);
    this.fillLight.add(fillLabel);
    this.backLight.add(backLabel);
    
    this.scene.add(this.mainLightHelper, this.fillLightHelper, this.backLightHelper);

    // Set up ground
    this.sceneService.setupGround(this.scene, this.config);

    // Add background plane (behind video plane)
    this.sceneService.setupBackgroundPlane(this.scene, this.config);
    
    // Add video plane (formerly red plane)
    this.sceneService.setupVideoPlane(this.scene, this.config);
  }

  private setupControls(): void {
    this.controls = this.sceneService.setupControls(this.camera, this.canvasRef.nativeElement, this.config);
  }

  private async loadModels(): Promise<void> {
    try {
      // Load CD cases
      this.cdCases = await this.cdCasesService.loadModels(this.config, this.scene, this.renderer);
      
      // Add label renderer to DOM and start animation
      this.labelRendererElement.nativeElement.appendChild(this.labelRenderer.domElement);
      this.animate();
      this.addEventListeners();

      // Ensure everything is rendered before showing
      this.renderer.render(this.scene, this.camera);
      this.labelRenderer.render(this.scene, this.camera);

      // Hide loading screen
      this.isLoading = false;

      // Wait for next frame to ensure all cases are properly positioned
      await new Promise(resolve => requestAnimationFrame(resolve));

      // Activate first case after ensuring all cases are in their initial positions
      this.stateService.setActiveCase(this.cdCases, 0);

    } catch (error) {
      console.error('Error loading scene:', error);
      this.isLoading = false;
    }
  }

  private addEventListeners(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.addEventListener('mousedown', (e) => this.eventsService.handleMouseDown(e, canvas, this.camera, this.cdCases));
    canvas.addEventListener('mousemove', (e) => this.eventsService.handleMouseMove(e, canvas));
    canvas.addEventListener('mouseup', () => this.eventsService.handleMouseUp());
    canvas.addEventListener('contextmenu', (e) => this.eventsService.handleContextMenu(e, canvas, this.camera, this.cdCases));
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(this.animate.bind(this));
    
    // Update animations and physics
    this.animationService.updateAnimations(this.cdCases);
    
    // Update case positions
    this.stateService.updatePositions(this.cdCases);
    
    // Update background animations
    this.sceneService.updateBackgroundAnimations();
    
    // Update controls and render
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }

  // Debug menu methods
  public updateCamera(): void {
    this.debugService.updateCamera(this.camera, this.controls, this.sceneSettings);
  }

  public updateLighting(): void {
    this.debugService.updateLighting(
      this.ambientLight,
      this.mainLight,
      this.mainLightHelper,
      this.fillLightHelper,
      this.backLightHelper,
      this.sceneSettings
    );
  }

  public updateRenderer(): void {
    this.debugService.updateRenderer(this.renderer, this.sceneSettings);
  }

  public updateOrbitControls(): void {
    this.debugService.updateOrbitControls(this.controls, this.sceneSettings);
  }

  public updateGround(): void {
    this.debugService.updateGround(this.scene, this.sceneSettings);
  }

  public updateCaseTransform(cdCase: CDCase): void {
    this.debugService.updateCaseTransform(cdCase);
  }

  public resetToDefault(): void {
    this.debugService.resetToDefault(this.sceneSettings, this.config, this.cdCases);
    this.updateCamera();
    this.updateLighting();
    this.updateRenderer();
    this.updateOrbitControls();
    this.updateGround();
    this.cdCases.forEach(cdCase => this.updateCaseTransform(cdCase));
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
  }

  ngOnDestroy(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    
    // Clean up resources
    this.cdCases.forEach(cdCase => {
      this.scene.remove(cdCase.model);
      cdCase.model.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    });

    // Clean up helpers
    this.scene.remove(this.mainLightHelper);
    this.scene.remove(this.fillLightHelper);
    this.scene.remove(this.backLightHelper);

    this.renderer.dispose();
    this.labelRenderer.domElement.remove();
  }

  // Wheel event handler for changing active case
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (this.config.sceneSettings.camera.lockControls) {
      // Check if any animations are currently running
      if (this.animationService.hasAnyActiveAnimations(this.cdCases)) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      
      event.preventDefault();
      event.stopPropagation();
      
      const currentActiveIndex = this.cdCases.findIndex(cdCase => cdCase.isActive);
      
      // If no case is active, activate the first one
      if (currentActiveIndex === -1) {
        this.stateService.setActiveCase(this.cdCases, 0);
        return;
      }
      
      // Calculate new index based on scroll direction
      let newIndex = currentActiveIndex;
      if (event.deltaY > 0) { // Scrolling down/forward
        newIndex = (currentActiveIndex + 1) % this.cdCases.length;
      } else { // Scrolling up/backward
        newIndex = (currentActiveIndex - 1 + this.cdCases.length) % this.cdCases.length;
      }
      
      this.stateService.setActiveCase(this.cdCases, newIndex);
    }
  }
} 