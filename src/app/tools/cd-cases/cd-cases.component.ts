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
      [onUpdateBackgroundEffects]="updateBackgroundEffects.bind(this)"
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
    lockControls: this.config.sceneSettings.camera.lockControls,
    // Initialize background effect toggles to true
    bgEffectContinents: true,
    bgEffectMountains: true,
    bgEffectWaves: true,
    bgEffectBorders: true,
    bgEffectSwirls: true,
    bgEffectLightRays: true,
    bgEffectParticles: true,
    bgEffectVideoInfluence: true,
    bgEffectBloom: true,
    bgEffectFilmGrain: true,
    bgEffectVignette: true
  };
  
  public caseSettings: CaseSettings = {};

  // Add properties to store references
  private videoPlane!: THREE.Mesh;
  private backgroundPlane!: THREE.Mesh;
  private caseBackVideoPlane!: THREE.Mesh; // New property for the case back video plane
  private videoPlay!: () => void;
  private videoPause!: () => void;
  private updateVideoSource!: (videoPath: string) => void;
  
  // Flag to prevent position updates during manual animations
  private isManuallyAnimating: boolean = false;
  private manuallyAnimatedCaseId: number | null = null;
  private activeCaseExpanded: boolean = false; // Track if the active case is expanded
  
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

  // Track which cases are playing music
  private playingMusic: boolean[] = [];

  // Add property to track which cases have been clicked (tutorial completed)
  private tutorialCompleted: boolean[] = [];

  // Helper function to calculate cubic bezier curve point
  private cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
    // Standard cubic Bezier formula
    const oneMinusT = 1 - t;
    return (
      Math.pow(oneMinusT, 3) * p0 +
      3 * Math.pow(oneMinusT, 2) * t * p1 +
      3 * oneMinusT * Math.pow(t, 2) * p2 +
      Math.pow(t, 3) * p3
    );
  }

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
    this.loadModels().then(() => {
      // Initialize caseSettings for each CD case to prevent "Cannot read properties of undefined" errors
      this.cdCases.forEach(cdCase => {
        if (!this.caseSettings[cdCase.id]) {
          // Default settings if none exist
          this.caseSettings[cdCase.id] = {
            positionX: 0,
            positionY: 0,
            positionZ: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0
          };
        }
      });
      this.isLoading = false;
    });
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
    videoPlaneResult.mesh.visible = false; // Start invisible until a case is expanded
    
    // Add background plane behind video plane - KEEP VISIBLE
    const backgroundPlane = this.sceneService.setupBackgroundPlane(this.scene, this.config, videoPlaneResult.videoTexture);
    backgroundPlane.visible = true; // Background remains visible
    
    // Create a new video plane that will be attached to the back of the CD case - INITIALLY INVISIBLE
    const caseBackVideoPlane = this.createCaseBackVideoPlane(videoPlaneResult.videoTexture);
    caseBackVideoPlane.visible = false; // Start invisible until a case is expanded
    this.scene.add(caseBackVideoPlane);
    
    // Store references for later use
    this.videoPlane = videoPlaneResult.mesh;
    this.backgroundPlane = backgroundPlane;
    this.caseBackVideoPlane = caseBackVideoPlane;
    this.videoPlay = videoPlaneResult.play;
    this.videoPause = videoPlaneResult.pause;
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
      
      // Initialize playingMusic array to match CD cases
      this.playingMusic = new Array(this.cdCases.length).fill(false);
      
      // Initialize tutorialCompleted array to match CD cases
      this.tutorialCompleted = new Array(this.cdCases.length).fill(false);
      
      // Initialize caseSettings for each CD case to prevent "Cannot read properties of undefined" errors
      this.cdCases.forEach(cdCase => {
        if (!this.caseSettings[cdCase.id]) {
          // Default settings if none exist
          this.caseSettings[cdCase.id] = {
            positionX: 0,
            positionY: 0,
            positionZ: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0
          };
        }
      });
      
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
        
        // Initialize videoPlane2 alignment with active case
        this.updateVideoPlane2Alignment();
      }

    } catch (error) {
      console.error('Error loading scene:', error);
      this.isLoading = false;
    }
  }

  private addEventListeners(): void {
    const canvas = this.canvasRef.nativeElement;
    
    // Modified event handler to handle case click
    canvas.addEventListener('mousedown', (e) => {
      // Check if click is on active case
      const clickedCase = this.eventsService.handleMouseDown(e, canvas, this.camera, this.cdCases);
      
      // Get the index of the clicked case
      const clickedIndex = clickedCase ? this.cdCases.indexOf(clickedCase) : -1;
      
      // If active case is clicked
      if (clickedCase && clickedCase.isActive) {
        // Mark tutorial as completed for this case
        if (clickedIndex >= 0) {
          this.tutorialCompleted[clickedIndex] = true;
        }
        
        // If the case is already expanded, collapse it fully and stop
        if (this.activeCaseExpanded) {
          console.log("Case is already expanded, collapsing it fully");
          
          // Immediately hide the case back video plane
          if (this.caseBackVideoPlane) {
            this.caseBackVideoPlane.visible = false;
          }
          
          // Use the same animation logic as scrolling away
          // Keep the same index to stay on this case, don't switch
          this.animateActiveCaseBack(clickedCase, clickedIndex, false);
          return;
        }
        
        // If not expanded, expand the case using the new method
        this.expandActiveCase(clickedCase);
      }
    });
    
    canvas.addEventListener('mousemove', (e) => this.eventsService.handleMouseMove(e, canvas));
    canvas.addEventListener('mouseup', () => this.eventsService.handleMouseUp());
    canvas.addEventListener('contextmenu', (e) => this.eventsService.handleContextMenu(e, canvas, this.camera, this.cdCases));
  }
  
  // Method to start playback on video and background planes
  private revealVideoAndBackground(): void {
    if (this.videoPlane && this.backgroundPlane) {
      // The planes are already visible, so we only need to handle the video content
      
      // Get active case index to load the appropriate video
      const activeIndex = this.cdCases.findIndex(cdCase => cdCase.isActive);
      if (activeIndex >= 0 && activeIndex < this.videoPaths.length) {
        // Update video source to match active case
        this.updateVideoSource(this.videoPaths[activeIndex]);
        
        // The case back video plane is already using the same video texture
        // so it will automatically update with the new video
      }
      
      // Start video playback
      this.videoPlay();
      
      // Now that animation is complete, make the caseBackVideoPlane visible and fade it in
      if (this.caseBackVideoPlane && this.activeCaseExpanded) {
        console.log('Animation complete, revealing video plane 2');
        this.caseBackVideoPlane.visible = true;
        
        // Apply fade-in for the material opacity
        const startOpacity = 0;
        const targetOpacity = 0.95;
        const fadeDuration = 0.3; // Short fade-in
        
        // Get starting time
        const startTime = this.clock.getElapsedTime();
        
        // Create fade-in animation
        const fadeIn = () => {
          const currentTime = this.clock.getElapsedTime();
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / fadeDuration, 1.0);
          
          // Calculate current opacity
          const currentOpacity = startOpacity + (targetOpacity - startOpacity) * progress;
          
          // Update opacity based on material type
          if (this.caseBackVideoPlane.material instanceof THREE.ShaderMaterial && 
              this.caseBackVideoPlane.material.uniforms) {
            const opacityUniform = this.caseBackVideoPlane.material.uniforms['opacity'];
            if (opacityUniform) {
              opacityUniform.value = currentOpacity;
            }
          } else if (this.caseBackVideoPlane.material instanceof THREE.MeshBasicMaterial) {
            this.caseBackVideoPlane.material.opacity = currentOpacity;
          }
          
          // Continue animation until complete
          if (progress < 1.0) {
            requestAnimationFrame(fadeIn);
          } else {
            console.log('Fade-in complete, video plane 2 opacity:', currentOpacity);
          }
        };
        
        // Start fade-in animation
        fadeIn();
      }
    }
  }
  
  // Helper method to remove silhouette effect by restoring original materials
  private removeSilhouetteEffect(cdCase: CDCase): void {
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
  
  // Method to create pulsating silhouette for active case
  private createActiveCaseSilhouette(cdCase: CDCase): void {
    // Check if tutorial has been completed for this case - don't show silhouette if so
    const caseIndex = this.cdCases.indexOf(cdCase);
    if (caseIndex >= 0 && this.tutorialCompleted[caseIndex]) {
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

  private animate(): void {
    this.animationId = requestAnimationFrame(this.animate.bind(this));
    
    // Update animations and physics
    this.animationService.updateAnimations(this.cdCases);

    // Update case positions - ONLY if we're not manually animating
    const isManualAnimation = this.isManuallyAnimating;
    
    if (!isManualAnimation) {
      this.stateService.updatePositions(this.cdCases);
      
      // Keep videoPlane2 aligned with the active case if one exists
      const activeIndex = this.cdCases.findIndex(cdCase => cdCase.isActive);
      if (activeIndex >= 0) {
        this.updateVideoPlane2Alignment();
      }
    } else {
      // Only apply automatic position updates to cases we're not manually animating
      this.cdCases.forEach(cdCase => {
        if (cdCase.id !== this.manuallyAnimatedCaseId) {
          // Update positions for other cases only
          cdCase.position.lerp(cdCase.targetPosition, this.stateService.getPositionLerpFactor());
          cdCase.model.position.copy(cdCase.position);
        }
      });
      
      // Also keep videoPlane2 aligned during manual animation
      this.updateVideoPlane2Alignment();
    }
    
    // Update silhouette animation for active case
    const activeIndex = this.cdCases.findIndex(cdCase => cdCase.isActive && !cdCase.isOpen);
    if (activeIndex >= 0 && !this.playingMusic[activeIndex] && !this.tutorialCompleted[activeIndex]) {
      const activeCase = this.cdCases[activeIndex];
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
    
    // Always update background animations - don't check for visibility
    // This ensures continuous shader animation even when the plane is toggled
    this.sceneService.updateBackgroundAnimations();
    
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
      // Check if any automatic animations are currently running
      // But allow scrolling when a case is expanded (isManuallyAnimating is true but no active animation)
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
        
        // Create silhouette for new active case if it's not playing music
        const activeCase = this.cdCases.find(cdCase => cdCase.isActive);
        if (activeCase && !this.playingMusic[0]) {
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
      
      // Get the active case that we will animate back
      const activeCase = this.cdCases[currentActiveIndex];
      
      // Track if the case was expanded before we navigate away
      const wasExpandedBefore = this.activeCaseExpanded;
      
      // Animate current active case back to its original position ONLY if it's expanded
      if (activeCase && activeCase.isActive && this.activeCaseExpanded) {
        // Pass the expanded state to the animateActiveCaseBack method
        // so it can be used when setting up the new case
        this.animateActiveCaseBack(activeCase, newIndex, wasExpandedBefore);
      } else {
        // If the case isn't expanded, just set the new active case directly
        this.stateService.setActiveCase(this.cdCases, newIndex);
        this.updateVideoForNewActiveCase(newIndex, wasExpandedBefore);
      }
    }
    // If controls are not locked, the event will propagate to OrbitControls naturally
  }

  // New method to animate active case back to its original position
  private animateActiveCaseBack(activeCase: CDCase, newIndex: number, wasExpandedBefore: boolean): void {
    console.log("Animating case back: ", activeCase.id, "New index: ", newIndex);
    console.log("Initial position: ", activeCase.initialPosition);
    console.log("Current position: ", activeCase.model.position);
    
    // Store current rotation and position
    const currentRotation = new THREE.Euler().copy(activeCase.model.rotation);
    const currentPosition = new THREE.Vector3().copy(activeCase.model.position);
    
    // IMPORTANT: Calculate the active position (where we want to end up)
    // Active position = initialPosition + Z_OFFSET from the state service (1.0)
    const targetActivePosition = new THREE.Vector3().copy(activeCase.initialPosition);
    targetActivePosition.z += 1.0; // This is the Z_OFFSET from CDCasesStateService
    
    console.log("Using active position as target:", targetActivePosition);
    console.log("Starting from current position:", currentPosition);
    
    // Set flag to prevent position updates during animation
    this.isManuallyAnimating = true;
    this.manuallyAnimatedCaseId = activeCase.id;
    
    // Hide the case back video plane gradually during the animation
    let videoPlaneOriginalOpacity = 0;
    if (this.caseBackVideoPlane) {
      const material = this.caseBackVideoPlane.material as THREE.MeshBasicMaterial;
      videoPlaneOriginalOpacity = material.opacity;
    }
    
    // Get final case position offset - but we will use negative values to go back
    const finalCasePosOffset = this.config.finalCasePosition || {
      offsetX: -1, 
      offsetY: 0.0,
      offsetZ: 2
    };

    // Get final case rotation offset - but we will use negative values to go back
    const finalCaseRotOffset = this.config.finalCaseRotation || {
      offsetX: 3.14,
      offsetY: 0.0,
      offsetZ: 0.0
    };
    
    console.log("Final position offset: ", finalCasePosOffset);
    
    // Get animation settings from config
    const animConfig = this.config.menuAnimation || {
      duration: 0.5, // Use a faster animation for going back
      bezierCurve: { p1: 0.25, p2: 0.1, p3: 0.25, p4: 1.0 }
    };

    // Create animation
    const startTime = this.clock.getElapsedTime();
    const duration = animConfig.duration; // Use configured duration

    const animateBack = () => {
      const currentTime = this.clock.getElapsedTime();
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(elapsed / duration, 1.0);
      
      // Apply bezier curve easing for time interpolation
      const bezierParams = animConfig.bezierCurve;
      const t = this.cubicBezier(
        rawProgress, 
        0,             // Start at 0
        bezierParams.p1,
        bezierParams.p2,
        1              // End at 1
      );
      
      // For collapse, calculate the needed offset to reach the target position
      // These offsets will decrease as t increases from 0 to 1
      
      // Calculate the total offsets we need to remove
      // This is the difference between our current expanded position and the target active position
      const totalOffsetX = currentPosition.x - targetActivePosition.x;
      const totalOffsetY = currentPosition.y - targetActivePosition.y;
      const totalOffsetZ = currentPosition.z - targetActivePosition.z;
      
      // Calculate current frame offsets by applying (1-t) to gradually remove them
      const offsetX = totalOffsetX * (1 - t);
      const offsetY = totalOffsetY * (1 - t);
      const offsetZ = totalOffsetZ * (1 - t);
      
      // Create offset vector for this frame
      const offsetVector = new THREE.Vector3(offsetX, offsetY, offsetZ);
      
      // Calculate position for this frame - starting from target and adding remaining offset
      const posX = targetActivePosition.x + offsetX;
      const posY = targetActivePosition.y + offsetY; 
      const posZ = targetActivePosition.z + offsetZ;
      
      if (rawProgress === 0 || rawProgress >= 0.99) {
        console.log(`Animation progress: ${t.toFixed(2)}`);
        console.log(`Current pos: (${activeCase.model.position.x.toFixed(2)}, ${activeCase.model.position.y.toFixed(2)}, ${activeCase.model.position.z.toFixed(2)})`);
        console.log(`Total offsets to remove: X=${totalOffsetX.toFixed(2)}, Y=${totalOffsetY.toFixed(2)}, Z=${totalOffsetZ.toFixed(2)}`);
        console.log(`Remaining offsets: X=${offsetX.toFixed(2)}, Y=${offsetY.toFixed(2)}, Z=${offsetZ.toFixed(2)}`);
        console.log(`Target pos: (${posX.toFixed(2)}, ${posY.toFixed(2)}, ${posZ.toFixed(2)})`);
        console.log(`Final target: (${targetActivePosition.x.toFixed(2)}, ${targetActivePosition.y.toFixed(2)}, ${targetActivePosition.z.toFixed(2)})`);
      }
      
      // Set the position
      activeCase.model.position.set(posX, posY, posZ);
      // Also update the case's internal position
      activeCase.position.copy(activeCase.model.position);
      
      // Get the base rotation - this is what we want to return to
      const baseRotation = this.config.caseSettings?.baseRotation || { x: 0, y: 0, z: 0 };
      
      // Calculate the total rotation offset to remove
      const totalRotX = currentRotation.x - baseRotation.x;
      const totalRotY = currentRotation.y - baseRotation.y;
      const totalRotZ = currentRotation.z - baseRotation.z;
      
      // Calculate remaining rotation offset for this frame
      const remainingRotX = totalRotX * (1 - t);
      const remainingRotY = totalRotY * (1 - t);
      const remainingRotZ = totalRotZ * (1 - t);
      
      // Apply rotation: target + remaining offset
      const rotX = baseRotation.x + remainingRotX;
      const rotY = baseRotation.y + remainingRotY;
      const rotZ = baseRotation.z + remainingRotZ;
      
      // Debug rotation info
      if (rawProgress === 0 || rawProgress >= 0.99) {
        console.log(`Rotation progress: t=${t.toFixed(2)}`);
        console.log(`Current rotation: (${activeCase.model.rotation.x.toFixed(2)}, ${activeCase.model.rotation.y.toFixed(2)}, ${activeCase.model.rotation.z.toFixed(2)})`);
        console.log(`Total rotation to remove: X=${totalRotX.toFixed(2)}, Y=${totalRotY.toFixed(2)}, Z=${totalRotZ.toFixed(2)}`);
        console.log(`Remaining rotation: X=${remainingRotX.toFixed(2)}, Y=${remainingRotY.toFixed(2)}, Z=${remainingRotZ.toFixed(2)}`);
        console.log(`Target rotation: (${rotX.toFixed(2)}, ${rotY.toFixed(2)}, ${rotZ.toFixed(2)})`);
      }
      
      activeCase.model.rotation.set(rotX, rotY, rotZ);
      
      // Fade out the video plane
      if (this.caseBackVideoPlane) {
        const material = this.caseBackVideoPlane.material as THREE.MeshBasicMaterial;
        material.opacity = videoPlaneOriginalOpacity * (1 - t);
        this.updateVideoPlane2Alignment();
      }
      
      if (rawProgress < 1.0) {
        requestAnimationFrame(animateBack);
      } else {
        console.log("Return animation complete: Case returned to active position");
        // Animation is complete - clear flags
        this.isManuallyAnimating = false;
        this.manuallyAnimatedCaseId = null;
        this.activeCaseExpanded = false; // Reset the expanded state
        
        // Set exact active position - should be the original active position with no offsets
        activeCase.model.position.copy(targetActivePosition);
        activeCase.position.copy(targetActivePosition);
        activeCase.targetPosition.copy(targetActivePosition);
        
        // Set exact base rotation
        const baseRotation = this.config.caseSettings?.baseRotation || { x: 0, y: 0, z: 0 };
        activeCase.model.rotation.set(baseRotation.x, baseRotation.y, baseRotation.z);
        
        // Hide both video planes completely
        if (this.caseBackVideoPlane) {
          const material = this.caseBackVideoPlane.material as THREE.MeshBasicMaterial;
          material.opacity = 0;
          this.caseBackVideoPlane.visible = false;
        }
        this.videoPlane.visible = false;
        
        // If the new index is different than the current index (scrolling to another case),
        // set the new active case. Otherwise (clicking on the same case), just reset UI elements
        const currentIndex = this.cdCases.findIndex(cdCase => cdCase.isActive);
        if (newIndex !== currentIndex) {
          // Now set the new active case
          this.stateService.setActiveCase(this.cdCases, newIndex);
        }
        this.updateVideoForNewActiveCase(newIndex, wasExpandedBefore);
        
        console.log("Final position after animation:", activeCase.model.position);
      }
    };
    
    // Start the animation
    animateBack();
  }
  
  // Helper method to update video for new active case
  private updateVideoForNewActiveCase(newIndex: number, wasExpandedBefore: boolean = false): void {
    // Reset the expanded state for the new active case
    this.activeCaseExpanded = false;
    
    // Reset the case back video plane with opacity 0 (invisible until clicked)
    this.resetCaseBackVideoPlane(0);
    
    // Create silhouette for new active case if it's not playing music and tutorial not completed
    const activeCase = this.cdCases.find(cdCase => cdCase.isActive);
    if (activeCase && !this.playingMusic[newIndex] && !this.tutorialCompleted[newIndex]) {
      this.createActiveCaseSilhouette(activeCase);
    }
    
    // If we're navigating to a case that is playing music, update the video
    if (this.playingMusic[newIndex] && this.videoPlane) {
      // Update video source to match new active case
      if (newIndex >= 0 && newIndex < this.videoPaths.length) {
        this.updateVideoSource(this.videoPaths[newIndex]);
        
        // If the case is playing music, also start the video
        this.videoPlay();
      }
    } else {
      // If case is not playing music, we keep planes visible but pause video
      this.videoPause(); // Pause the video when no music is playing
    }
    
    // If the previous case was expanded, automatically expand the new case
    // but only after the activation animation has completed
    if (wasExpandedBefore && activeCase) {
      // We need to properly wait for the position animation to complete
      // This is determined by checking when the case's position has reached (or very close to)
      // its target position
      
      // Create a flag to ensure we only trigger the expansion once
      let expansionTriggered = false;
      
      // Create a function to check if case is in position
      const checkPosition = () => {
        // Skip if expansion was already triggered
        if (expansionTriggered) return;

        // Calculate the distance between current position and target position
        const distanceToTarget = activeCase.position.distanceTo(activeCase.targetPosition);
        
        // Consider the position reached when very close to target (within a small threshold)
        const POSITION_THRESHOLD = 0.05; // Small distance threshold
        
        if (distanceToTarget <= POSITION_THRESHOLD) {
          // Case has reached its target position, now expand it
          console.log("Case reached target position, auto-expanding because previous case was expanded");
          console.log("Distance to target:", distanceToTarget);
          
          // Set flag to prevent multiple expansions
          expansionTriggered = true;
          
          // Expand the case
          this.expandActiveCase(activeCase);
        } else {
          // Keep checking until position is reached
          console.log("Waiting for case to reach position before auto-expanding. Current distance:", distanceToTarget);
          
          // Continue checking until position reached
          requestAnimationFrame(checkPosition);
        }
      };
      
      // Start checking for position
      checkPosition();
    }
  }

  // New method to handle case expansion, extracted from click handler to be reusable
  private expandActiveCase(clickedCase: CDCase): void {
    // Only expand if the case is active and not already expanded
    if (!clickedCase.isActive || this.activeCaseExpanded) {
      return;
    }
    
    // Get the index of the clicked case
    const clickedIndex = this.cdCases.indexOf(clickedCase);
    
    // Mark tutorial as completed for this case
    if (clickedIndex >= 0) {
      this.tutorialCompleted[clickedIndex] = true;
    }
    
    // Reset the back video plane with opacity 0 (it will fade in after animation)
    this.resetCaseBackVideoPlane(0);
    
    // Show the main video plane when a case is expanded
    this.videoPlane.visible = true;
    
    // Remove silhouette immediately by restoring original materials
    this.removeSilhouetteEffect(clickedCase);
    
    // Store original rotation and current position (not initial position)
    const originalRotation = new THREE.Euler().copy(clickedCase.model.rotation);
    // Use the current position instead of initialPosition to prevent teleporting
    const startPosition = new THREE.Vector3().copy(clickedCase.model.position);
    
    console.log("Starting expansion from current position:", startPosition);
    console.log("Initial position (for reference):", clickedCase.initialPosition);
    
    // Set flag to prevent position updates during animation
    this.isManuallyAnimating = true;
    this.manuallyAnimatedCaseId = clickedCase.id;
    this.activeCaseExpanded = true; // Mark that the active case is now expanded
    
    // Get video plane configuration values
    const videoPlane2Pos = this.config.videoPlane2Position || { 
      offsetX: 0.8, 
      offsetY: 0.01, 
      offsetZ: 0.02 
    };
    
    // Get video plane rotation values
    const videoPlane2Rot = this.config.videoPlane2Rotation || { 
      offsetX: 0,
      offsetY: -1.57, 
      offsetZ: 0
    };
    
    // Get final case position offset
    const finalCasePosOffset = this.config.finalCasePosition || {
      offsetX: -2.5,
      offsetY: 3.0,
      offsetZ: -2.0
    };

    // Get final case rotation offset
    const finalCaseRotOffset = this.config.finalCaseRotation || {
      offsetX: 3.14,
      offsetY: 0.0,
      offsetZ: 0.0
    };
    
    // Debug logging to track position configurations
    console.log('Original Position:', startPosition);
    console.log('videoPlane2Position offsets:', videoPlane2Pos);
    console.log('finalCasePosition offsets (added to original):', finalCasePosOffset);
    console.log('finalCaseRotation offsets (added to original):', finalCaseRotOffset);
    
    // Get animation settings from config
    const animConfig = this.config.menuAnimation || {
      duration: 1.0,
      bezierCurve: { p1: 0.25, p2: 0.1, p3: 0.25, p4: 1.0 }
    };

    // Create animation
    const startTime = this.clock.getElapsedTime();
    const duration = animConfig.duration; // Use configured duration

    const animateTransform = () => {
      const currentTime = this.clock.getElapsedTime();
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(elapsed / duration, 1.0);
      
      // Apply bezier curve easing for time interpolation
      const bezierParams = animConfig.bezierCurve;
      const t = this.cubicBezier(
        rawProgress, 
        0,             // Start at 0
        bezierParams.p1,
        bezierParams.p2,
        1              // End at 1
      );
      
      // Use the same offset approach as with the video planes
      // Store current position before applying offsets
      const currentPosition = new THREE.Vector3().copy(clickedCase.model.position);
      
      // Calculate offsets that will be applied for this frame
      const offsetX = finalCasePosOffset.offsetX * t;
      const offsetY = finalCasePosOffset.offsetY * t;
      const offsetZ = finalCasePosOffset.offsetZ * t;
      
      // Apply rotation offsets
      const currentRotation = new THREE.Euler().copy(clickedCase.model.rotation);
      clickedCase.model.rotation.x = originalRotation.x + (finalCaseRotOffset.offsetX * t);
      clickedCase.model.rotation.y = originalRotation.y + (finalCaseRotOffset.offsetY * t);
      clickedCase.model.rotation.z = originalRotation.z + (finalCaseRotOffset.offsetZ * t);
      
      // Get rotation as quaternion to apply to position offset
      const caseQuaternion = new THREE.Quaternion().setFromEuler(clickedCase.model.rotation);
      
      // Create an offset vector based on the final offset scaled by progress
      const offsetVector = new THREE.Vector3(offsetX, offsetY, offsetZ);
      
      // Calculate final position by applying offsets to original position
      const posX = startPosition.x + offsetVector.x;
      const posY = startPosition.y + offsetVector.y;
      const posZ = startPosition.z + offsetVector.z;
      
      // Debug info
      if (rawProgress === 0 || rawProgress >= 0.99) {
        console.log(`Animation progress: ${rawProgress.toFixed(2)}, t=${t.toFixed(2)}`);
        console.log(`Original position:`, startPosition);
        console.log(`Applied offsets: X=${offsetX.toFixed(2)}, Y=${offsetY.toFixed(2)}, Z=${offsetZ.toFixed(2)}`);
        console.log(`Final position: X=${posX.toFixed(2)}, Y=${posY.toFixed(2)}, Z=${posZ.toFixed(2)}`);
      }
      
      // Apply calculated position directly to the case
      clickedCase.model.position.set(posX, posY, posZ);
      // Also update the case's internal position
      clickedCase.position.copy(clickedCase.model.position);
      
      // Update the case back video plane position to follow the case
      if (this.caseBackVideoPlane) {
        // Calculate position for the video plane based on current animated case position
        const casePosition = new THREE.Vector3().copy(clickedCase.model.position);
        const caseQuaternion = new THREE.Quaternion().setFromEuler(clickedCase.model.rotation);
        
        // Create a position offset vector
        const offsetVector = new THREE.Vector3(
          videoPlane2Pos.offsetX,
          videoPlane2Pos.offsetY,
          videoPlane2Pos.offsetZ
        );
        
        // Apply case rotation to the offset vector so it rotates with the case
        offsetVector.applyQuaternion(caseQuaternion);
        
        // Calculate final position by adding the rotated offset to the case position
        const videoPlanePosition = new THREE.Vector3(
          casePosition.x + offsetVector.x,
          casePosition.y + offsetVector.y,
          casePosition.z + offsetVector.z
        );
        
        // Apply the position to the video plane
        this.caseBackVideoPlane.position.copy(videoPlanePosition);
        
        // Create a new quaternion for the CD case
        const caseQuat = new THREE.Quaternion().setFromEuler(clickedCase.model.rotation);
        
        // Create a quaternion for our additional rotation
        const offsetQuat = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(videoPlane2Rot.offsetX, videoPlane2Rot.offsetY, videoPlane2Rot.offsetZ, 'YXZ')
        );
        
        // Combine the quaternions (case rotation first, then offset rotation)
        const finalQuat = new THREE.Quaternion().multiplyQuaternions(caseQuat, offsetQuat);
        
        // Apply the combined rotation
        this.caseBackVideoPlane.setRotationFromQuaternion(finalQuat);
      }
      
      if (rawProgress < 1.0) {
        requestAnimationFrame(animateTransform);
      }
      else {
        console.log("Animation complete: Keeping case in final position");
        // Animation is complete - keep the case in this position permanently!
        // We don't reset the animation flags, so the case position won't be overridden
        
        // Update the case's internal position to match its model position
        // This ensures if we later want to animate from here, we have the correct starting point
        clickedCase.position.copy(clickedCase.model.position);
        clickedCase.targetPosition.copy(clickedCase.model.position);
      }
    };
    
    // Start animation
    animateTransform();
    
    // After animation completes, show video and background planes
    setTimeout(() => {
      // Mark this case as playing music
      if (clickedIndex >= 0) {
        this.playingMusic[clickedIndex] = true;
      }
      
      this.revealVideoAndBackground();
    }, duration * 1000); // Convert duration to milliseconds
  }

  // Helper method to reset the caseBackVideoPlane properties
  private resetCaseBackVideoPlane(initialOpacity: number = 0.95): void {
    if (this.caseBackVideoPlane) {
      if (this.caseBackVideoPlane.material instanceof THREE.ShaderMaterial && 
          this.caseBackVideoPlane.material.uniforms) {
        // Set opacity for fade-in later using shader uniform
        const opacityUniform = this.caseBackVideoPlane.material.uniforms['opacity'];
        if (opacityUniform) {
          opacityUniform.value = initialOpacity;
        }
      } else if (this.caseBackVideoPlane.material instanceof THREE.MeshBasicMaterial) {
        // Fallback for MeshBasicMaterial if used
        this.caseBackVideoPlane.material.opacity = initialOpacity;
      }
      // Always start with plane hidden, regardless of opacity
      this.caseBackVideoPlane.visible = false;
    }
  }

  // New method to create a video plane for the case back
  private createCaseBackVideoPlane(videoTexture: THREE.VideoTexture): THREE.Mesh {
    // Get size from config with fallback values
    const width = this.config.videoPlane2Size?.width || 1.2;
    const height = this.config.videoPlane2Size?.height || 0.8;
    const radius = this.config.videoPlane2Size?.cornerRadius || 0.05; // Get radius from config or use default
    
    // Create a simple plane geometry with correct UVs
    const geometry = new THREE.PlaneGeometry(width, height);
    
    // Create a shader material that handles rounded corners in the fragment shader
    const material = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: videoTexture },
        opacity: { value: 0.95 },
        size: { value: new THREE.Vector2(width, height) },
        radius: { value: radius },
        ambient: { value: new THREE.Color(0xfcfcfc) }, // Ambient light color for scene integration
        ambientIntensity: { value: 0.75 } // Controls darkness level (lower = darker)
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform float opacity;
        uniform vec2 size;
        uniform float radius;
        uniform vec3 ambient;
        uniform float ambientIntensity;
        varying vec2 vUv;
        
        float roundedRectangle(vec2 position, vec2 size, float radius) {
          // Convert UV to pixel coordinates
          vec2 q = abs(position) - size + vec2(radius);
          return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - radius;
        }
        
        void main() {
          // Convert UV from 0-1 to -size/2 to size/2
          vec2 position = (vUv - 0.5) * size;
          
          // Calculate distance to rounded rectangle edge
          float distance = roundedRectangle(position, size * 0.5, radius);
          
          // Apply a sharp cutoff for rounded corners
          if (distance > 0.0) {
            discard; // Discard fragments outside the rounded rectangle
          }
          
          // Sample texture
          vec4 texColor = texture2D(map, vUv);
          
          // Apply subtle darkening for scene integration
          vec3 finalColor = texColor.rgb * ambientIntensity;
          
          // Apply opacity
          gl_FragColor = vec4(finalColor, texColor.a * opacity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
    
    // Create the mesh
    const videoPlane = new THREE.Mesh(geometry, material);
    
    // Add slight random rotation offset to make it look more realistic
    const randomX = (Math.random() - 0.5) * 0.01;
    const randomY = (Math.random() - 0.5) * 0.01;
    const randomZ = (Math.random() - 0.5) * 0.01;
    videoPlane.rotation.set(randomX, randomY, randomZ);
    
    // Set render order to ensure proper layering
    videoPlane.renderOrder = 2; // Highest render order to ensure it's always on top
    
    // Cast shadows for better realism
    videoPlane.castShadow = true;
    videoPlane.receiveShadow = true;
    
    return videoPlane;
  }

  // Add method to update background effects
  public updateBackgroundEffects(): void {
    this.sceneService.updateBackgroundEffects(this.sceneSettings);
  }

  // New method to keep videoPlane2 aligned with active case
  private updateVideoPlane2Alignment(): void {
    if (!this.caseBackVideoPlane) return;

    // Find the case to align with - either the manually animated case or the active case
    let caseToAlignWith: CDCase | undefined;

    if (this.isManuallyAnimating && this.manuallyAnimatedCaseId !== null) {
      // During manual animation, use the case being manually animated
      caseToAlignWith = this.cdCases.find(c => c.id === this.manuallyAnimatedCaseId);
    } else {
      // Otherwise, use the active case (if any), or try to find a case that was recently active
      // and is being automatically animated back to its position
      caseToAlignWith = this.cdCases.find(c => c.isActive);
      
      // If no active case but we have a previously animated case that might be in transition
      if (!caseToAlignWith && this.manuallyAnimatedCaseId !== null) {
        caseToAlignWith = this.cdCases.find(c => c.id === this.manuallyAnimatedCaseId);
      }
    }
    
    if (!caseToAlignWith) return;
    
    // Get configuration values
    const videoPlane2Pos = this.config.videoPlane2Position || { 
      offsetX: 0.8, 
      offsetY: 0.01, 
      offsetZ: 0.02 
    };
    
    const videoPlane2Rot = this.config.videoPlane2Rotation || { 
      offsetX: 0,
      offsetY: -1.57, 
      offsetZ: 0
    };
    
    // Debug logging (optional)
    if (this.isManuallyAnimating) {
      console.log('Aligning videoPlane2 with manually animated case:', caseToAlignWith.id);
    }
    
    // Get case position and rotation
    const casePosition = new THREE.Vector3().copy(caseToAlignWith.model.position);
    const caseQuaternion = new THREE.Quaternion().setFromEuler(caseToAlignWith.model.rotation);
    
    // Create offset vector and apply case rotation
    const offsetVector = new THREE.Vector3(
      videoPlane2Pos.offsetX,
      videoPlane2Pos.offsetY,
      videoPlane2Pos.offsetZ
    );
    
    // Apply case rotation to the offset vector so it rotates with the case
    offsetVector.applyQuaternion(caseQuaternion);
    
    // Calculate final position by adding the rotated offset to the case position
    const videoPlanePosition = new THREE.Vector3(
      casePosition.x + offsetVector.x,
      casePosition.y + offsetVector.y,
      casePosition.z + offsetVector.z
    );
    
    // Apply the position to the video plane
    this.caseBackVideoPlane.position.copy(videoPlanePosition);
    
    // Create a new quaternion for the CD case
    const caseQuat = new THREE.Quaternion().setFromEuler(caseToAlignWith.model.rotation);
    
    // Create a quaternion for our additional rotation
    const offsetQuat = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(videoPlane2Rot.offsetX, videoPlane2Rot.offsetY, videoPlane2Rot.offsetZ, 'YXZ')
    );
    
    // Combine the quaternions (case rotation first, then offset rotation)
    const finalQuat = new THREE.Quaternion().multiplyQuaternions(caseQuat, offsetQuat);
    
    // Apply the combined rotation
    this.caseBackVideoPlane.setRotationFromQuaternion(finalQuat);

    // If case is not active and we have a material that should fade out
    // Gradually reduce opacity as the case moves back to its position
    if (!caseToAlignWith.isActive && !this.isManuallyAnimating) {
      const material = this.caseBackVideoPlane.material as THREE.MeshBasicMaterial;
      // Calculate distance from current to target position as a percentage
      const currentPos = new THREE.Vector3().copy(caseToAlignWith.position);
      const targetPos = new THREE.Vector3().copy(caseToAlignWith.targetPosition);
      // Use the same Z offset as defined in the config.finalCasePosition
      const Z_OFFSET_ACTIVE = 2.0; // Match the finalCasePosition.offsetZ value
      const totalDistance = caseToAlignWith.initialPosition.distanceTo(targetPos.add(new THREE.Vector3(0, 0, Z_OFFSET_ACTIVE)));
      const currentDistance = caseToAlignWith.initialPosition.distanceTo(currentPos);
      
      // Fade out based on proximity to final position
      if (totalDistance > 0) {
        const progress = 1 - (currentDistance / totalDistance);
        material.opacity = Math.max(0, 0.95 * (1 - progress));
      } else {
        material.opacity = 0;
      }
    }
  }
} 