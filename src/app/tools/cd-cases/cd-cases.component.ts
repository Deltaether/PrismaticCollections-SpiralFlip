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
  private caseBackVideoPlane!: THREE.Mesh; // New property for the case back video plane
  private videoPlay!: () => void;
  private videoPause!: () => void;
  private updateVideoSource!: (videoPath: string) => void;
  
  // Flag to prevent position updates during manual animations
  private isManuallyAnimating: boolean = false;
  private manuallyAnimatedCaseId: number | null = null;
  
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

    // Add video plane (formerly red plane) - NOW VISIBLE BY DEFAULT
    const videoPlaneResult = this.sceneService.setupVideoPlane(this.scene, this.config);
    videoPlaneResult.mesh.visible = true; // Show from the beginning
    
    // Add background plane behind video plane - NOW VISIBLE BY DEFAULT
    const backgroundPlane = this.sceneService.setupBackgroundPlane(this.scene, this.config, videoPlaneResult.videoTexture);
    backgroundPlane.visible = true; // Show from the beginning
    
    // Create a new video plane that will be attached to the back of the CD case - NOW VISIBLE BY DEFAULT
    const caseBackVideoPlane = this.createCaseBackVideoPlane(videoPlaneResult.videoTexture);
    caseBackVideoPlane.visible = true; // Show from the beginning
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
    
    // Modified event handler to handle case click
    canvas.addEventListener('mousedown', (e) => {
      // Check if click is on active case
      const clickedCase = this.eventsService.handleMouseDown(e, canvas, this.camera, this.cdCases);
      
      // Get the index of the clicked case
      const clickedIndex = clickedCase ? this.cdCases.indexOf(clickedCase) : -1;
      
      // If active case is clicked - don't open it anymore
      if (clickedCase && clickedCase.isActive) {
        // Mark tutorial as completed for this case
        if (clickedIndex >= 0) {
          this.tutorialCompleted[clickedIndex] = true;
        }
        
        // Remove silhouette immediately by restoring original materials
        this.removeSilhouetteEffect(clickedCase);
        
        // Store original rotation and position
        const originalRotation = new THREE.Euler().copy(clickedCase.model.rotation);
        const originalPosition = new THREE.Vector3().copy(clickedCase.model.position);
        
        // Set flag to prevent position updates during animation
        this.isManuallyAnimating = true;
        this.manuallyAnimatedCaseId = clickedCase.id;
        
        // Get video plane configuration values
        const videoPlane2Pos = this.config.videoPlane2Position || { 
          offsetX: -1.0, 
          offsetY: 0.2, 
          offsetZ: 0.0 
        };
        
        // Get video plane rotation values
        const videoPlane2Rot = this.config.videoPlane2Rotation || { 
          offsetX: 3.14,
          offsetY: 0.0, 
          offsetZ: 0.0 
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
        console.log('Original Position:', originalPosition);
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
          
          // SIMPLIFIED: Use direct linear interpolation for position like we do for rotation
          // This ensures consistent behavior between position and rotation
          const posX = originalPosition.x + (finalCasePosOffset.offsetX * t);
          const posY = originalPosition.y + (finalCasePosOffset.offsetY * t);
          const posZ = originalPosition.z + (finalCasePosOffset.offsetZ * t);
          
          // Output more detailed debug info
          if (rawProgress === 0 || rawProgress >= 0.99) {
            console.log(`Animation progress: ${rawProgress.toFixed(2)}, t=${t.toFixed(2)}`);
            console.log(`Original position:`, originalPosition);
            console.log(`Calculated position: X=${posX.toFixed(2)}, Y=${posY.toFixed(2)}, Z=${posZ.toFixed(2)}`);
            console.log(`finalCasePosOffset:`, finalCasePosOffset);
          }
          
          // Interpolate rotation - adding finalCaseRotation offsets to original rotation
          clickedCase.model.rotation.x = originalRotation.x + (finalCaseRotOffset.offsetX * t);
          clickedCase.model.rotation.y = originalRotation.y + (finalCaseRotOffset.offsetY * t);
          clickedCase.model.rotation.z = originalRotation.z + (finalCaseRotOffset.offsetZ * t);
          
          // Apply calculated position directly to the case
          clickedCase.model.position.set(posX, posY, posZ);
          
          // Debug check for position application
          if (rawProgress >= 0.99) {
            console.log(`Final position after set:`, clickedCase.model.position);
            // Verify that position was really applied
            const casePosAfterSet = new THREE.Vector3().copy(clickedCase.model.position);
            if (Math.abs(casePosAfterSet.x - posX) > 0.001 ||
                Math.abs(casePosAfterSet.y - posY) > 0.001 ||
                Math.abs(casePosAfterSet.z - posZ) > 0.001) {
              console.error('Position was not applied correctly!');
              console.log('Calculated:', posX, posY, posZ);
              console.log('Actual after set:', casePosAfterSet);
            } else {
              console.log('Position set successfully');
            }
          }
          
          // Update the case back video plane position to follow the case
          if (this.caseBackVideoPlane) {
            // Calculate position for the video plane based on current animated case position
            const casePosition = new THREE.Vector3().copy(clickedCase.model.position);
            
            // FIXED: Position the video plane relative to the current case position (not original)
            // This ensures it follows the case as it moves
            const videoPlanePosition = new THREE.Vector3(
              // Use the current case position + videoPlane2Pos offset
              casePosition.x + videoPlane2Pos.offsetX,
              casePosition.y + videoPlane2Pos.offsetY,
              casePosition.z + videoPlane2Pos.offsetZ
            );
            
            // Apply the position to the video plane
            this.caseBackVideoPlane.position.copy(videoPlanePosition);
            
            // Debug logging to verify positions
            if (rawProgress === 0 || rawProgress >= 0.99) {
              console.log(`Case position: `, clickedCase.model.position);
              console.log(`Video plane position: `, this.caseBackVideoPlane.position);
            }
            
            // Match the case rotation (with adjustment to face upward)
            this.caseBackVideoPlane.rotation.copy(clickedCase.model.rotation);
            // Apply video plane specific rotation offsets
            this.caseBackVideoPlane.rotation.x += videoPlane2Rot.offsetX - Math.PI / 2;
            this.caseBackVideoPlane.rotation.y += videoPlane2Rot.offsetY;
            this.caseBackVideoPlane.rotation.z += videoPlane2Rot.offsetZ;
            
            // Note: Video plane is already visible, no need to toggle visibility here
            // The animation of the plane is handled by positioning it relative to the CD case
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
    if (!this.isManuallyAnimating) {
      this.stateService.updatePositions(this.cdCases);
    } else {
      // Only apply automatic position updates to cases we're not manually animating
      this.cdCases.forEach(cdCase => {
        if (cdCase.id !== this.manuallyAnimatedCaseId) {
          // Update positions for other cases only
          cdCase.position.lerp(cdCase.targetPosition, this.stateService.getPositionLerpFactor());
          cdCase.model.position.copy(cdCase.position);
        }
      });
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
      
      this.stateService.setActiveCase(this.cdCases, newIndex);
      
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
        // (Note: We don't hide the planes anymore, they stay visible)
        this.videoPause(); // Pause the video when no music is playing
      }
    }
    // If controls are not locked, the event will propagate to OrbitControls naturally
  }

  // New method to create a video plane for the case back
  private createCaseBackVideoPlane(videoTexture: THREE.VideoTexture): THREE.Mesh {
    // Create a plane geometry for the video
    // Using smaller dimensions that will fit on the back of the CD case
    const geometry = new THREE.PlaneGeometry(1.2, 0.8);
    
    // Create a material that uses the same video texture
    const material = new THREE.MeshBasicMaterial({
      map: videoTexture,
      side: THREE.FrontSide,
      transparent: true,
      opacity: 0.9
    });
    
    // Create the mesh
    const videoPlane = new THREE.Mesh(geometry, material);
    
    // Set render order to ensure proper layering
    videoPlane.renderOrder = 2; // Highest render order to ensure it's always on top
    
    // Position and rotation will be set when the case is clicked
    // as it needs to follow the case
    
    return videoPlane;
  }
} 