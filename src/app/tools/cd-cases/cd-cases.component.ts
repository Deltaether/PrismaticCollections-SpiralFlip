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
    groundOpacity: this.config.sceneSettings.ground.opacity,
    lockControls: this.config.sceneSettings.camera.lockControls
  };
  
  public caseSettings: CaseSettings = {};

  // Add properties to store references
  private videoPlane!: THREE.Mesh;
  private backgroundPlane!: THREE.Mesh;
  private videoPlay!: () => void;
  private updateVideoSource!: (videoPath: string) => void;
  
  // Add property to track if case has been opened
  private hasOpenedCase = false;
  
  // Array of video paths for each CD case
  private videoPaths: string[] = [
    'assets/3d/CD_Case/twitter_crossfade.mp4',
    'assets/3d/CD_Case/twitter_crossfade2.mp4',
    'assets/3d/CD_Case/twitter_crossfade3.mp4',
    'assets/3d/CD_Case/twitter_crossfade4.mp4',
    'assets/3d/CD_Case/twitter_crossfade5.mp4'
  ];
  
  // Add property for pulsating silhouette
  private silhouetteMaterial: THREE.ShaderMaterial | null = null;
  private silhouetteMesh: THREE.Mesh | null = null;

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

    // Add video plane (formerly red plane) - INITIALLY INVISIBLE
    const videoPlaneResult = this.sceneService.setupVideoPlane(this.scene, this.config);
    videoPlaneResult.mesh.visible = false; // Hide initially
    
    // Add background plane behind video plane - INITIALLY INVISIBLE
    const backgroundPlane = this.sceneService.setupBackgroundPlane(this.scene, this.config, videoPlaneResult.videoTexture);
    backgroundPlane.visible = false; // Hide initially
    
    // Store references for later use
    this.videoPlane = videoPlaneResult.mesh;
    this.backgroundPlane = backgroundPlane;
    this.videoPlay = videoPlaneResult.play;
    this.updateVideoSource = videoPlaneResult.updateVideoSource;
  }

  private setupControls(): void {
    this.controls = this.sceneService.setupControls(this.camera, this.canvasRef.nativeElement, this.config);
    
    // Make sure controls match sceneSettings after initialization
    this.updateOrbitControls();
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
      
      // Create silhouette for active case
      const activeCase = this.cdCases.find(cdCase => cdCase.isActive);
      if (activeCase) {
        this.createActiveCaseSilhouette(activeCase);
      }

    } catch (error) {
      console.error('Error loading scene:', error);
      this.isLoading = false;
    }
  }

  private addEventListeners(): void {
    const canvas = this.canvasRef.nativeElement;
    
    // Modified event handler to handle case click for opening
    canvas.addEventListener('mousedown', (e) => {
      // Check if click is on active case
      const clickedCase = this.eventsService.handleMouseDown(e, canvas, this.camera, this.cdCases);
      
      // If active case is clicked and not already opened
      if (clickedCase && clickedCase.isActive && !clickedCase.isOpen && !this.hasOpenedCase) {
        // Play open animation when clicked
        this.animationService.openCase(clickedCase);
        
        // After animation completes, show video and background planes
        setTimeout(() => {
          this.revealVideoAndBackground();
          this.hasOpenedCase = true;
          
          // Remove silhouette when case is opened
          if (this.silhouetteMesh) {
            this.scene.remove(this.silhouetteMesh);
            this.silhouetteMesh = null;
          }
        }, 1000); // Assuming 1 second for animation duration as fallback
      }
    });
    
    canvas.addEventListener('mousemove', (e) => this.eventsService.handleMouseMove(e, canvas));
    canvas.addEventListener('mouseup', () => this.eventsService.handleMouseUp());
    canvas.addEventListener('contextmenu', (e) => this.eventsService.handleContextMenu(e, canvas, this.camera, this.cdCases));
  }
  
  // Method to reveal video and background planes
  private revealVideoAndBackground(): void {
    if (this.videoPlane && this.backgroundPlane) {
      // Make planes visible
      this.videoPlane.visible = true;
      this.backgroundPlane.visible = true;
      
      // Get active case index to load the appropriate video
      const activeIndex = this.cdCases.findIndex(cdCase => cdCase.isActive);
      if (activeIndex >= 0 && activeIndex < this.videoPaths.length) {
        // Update video source to match active case
        this.updateVideoSource(this.videoPaths[activeIndex]);
      }
      
      // Start video playback
      this.videoPlay();
    }
  }
  
  // Method to create pulsating silhouette for active case
  private createActiveCaseSilhouette(cdCase: CDCase): void {
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

  private animate(): void {
    this.animationId = requestAnimationFrame(this.animate.bind(this));
    
    // Update animations and physics
    this.animationService.updateAnimations(this.cdCases);
    
    // Update case positions
    this.stateService.updatePositions(this.cdCases);
    
    // Update silhouette animation for active case
    const activeCase = this.cdCases.find(cdCase => cdCase.isActive && !cdCase.isOpen);
    if (activeCase && !this.hasOpenedCase) {
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
    this.cdCases.forEach(cdCase => {
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
    
    // Only update background animations if background is visible
    if (this.backgroundPlane && this.backgroundPlane.visible) {
      this.sceneService.updateBackgroundAnimations();
    }
    
    // Update controls and render
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }
  
  // Add clock for animations
  private clock = new THREE.Clock();

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
    // If controls are locked, handle CD case navigation
    if (this.sceneSettings.lockControls) {
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
        
        // Create silhouette for new active case
        const activeCase = this.cdCases.find(cdCase => cdCase.isActive);
        if (activeCase) {
          this.createActiveCaseSilhouette(activeCase);
        }
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
      
      // Create silhouette for new active case
      const activeCase = this.cdCases.find(cdCase => cdCase.isActive);
      if (activeCase) {
        this.createActiveCaseSilhouette(activeCase);
      }
      
      // If a case has been opened and video is showing, update the video
      if (this.hasOpenedCase && this.videoPlane && this.videoPlane.visible) {
        // Update video source to match new active case
        if (newIndex >= 0 && newIndex < this.videoPaths.length) {
          this.updateVideoSource(this.videoPaths[newIndex]);
        }
      }
    }
    // If controls are not locked, the event will propagate to OrbitControls naturally
  }
} 