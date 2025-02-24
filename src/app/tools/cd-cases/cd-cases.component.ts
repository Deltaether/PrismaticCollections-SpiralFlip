import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { DebugMenuComponent } from '../debug-menu/debug-menu.component';
import { CDCase, CaseSettings, SceneSettings, Config } from '../shared/interfaces';
import config from './config.json';
import { CDCasesService } from './cd-cases.service';
import { SceneService } from './scene.service';
import { allCases, updateCasePositions } from './cases-data';
import { PreloaderService } from '../../services/preloader.service';

@Component({
  selector: 'app-cd-cases',
  standalone: true,
  imports: [CommonModule, DebugMenuComponent],
  template: `
    <div class="cd-container">
      <canvas #canvas></canvas>
      <div #labelRenderer></div>
      <div class="case-indicators">
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
  styles: [`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
    }

    .cd-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
    }

    canvas {
      width: 100%;
      height: 100%;
      display: block;
    }

    .light-label {
      color: white;
      font-family: Arial, sans-serif;
      font-size: 12px;
      padding: 2px 4px;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 3px;
      pointer-events: none;
      user-select: none;
    }

    .case-indicators {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 100;
      background: rgba(0, 0, 0, 0.7);
      padding: 10px;
      border-radius: 5px;
    }

    .case-indicator {
      color: white;
      margin: 5px 0;
      font-family: Arial, sans-serif;
      transition: color 0.3s ease;
    }

    .case-indicator.open {
      color: #00ff00;
    }
  `]
})
export class CDCasesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('labelRenderer') private labelRendererElement!: ElementRef<HTMLDivElement>;

  private renderer!: THREE.WebGLRenderer;
  private labelRenderer!: CSS2DRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private animationId: number | null = null;
  public cdCases: CDCase[] = [];
  private selectedCase: CDCase | null = null;
  private dragStartPosition = new THREE.Vector2();
  private dragOffset = new THREE.Vector3();
  private planeNormal = new THREE.Vector3(0, 0, 1);
  private dragPlane = new THREE.Plane(this.planeNormal);
  private clock = new THREE.Clock();
  private config: Config = config;

  // Convert config to legacy format for debug menu compatibility
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

  private ambientLight!: THREE.AmbientLight;
  private mainLight!: THREE.DirectionalLight;
  private fillLight!: THREE.DirectionalLight;
  private backLight!: THREE.DirectionalLight;

  private gridHelper!: THREE.GridHelper;
  private axesHelper!: THREE.AxesHelper;
  private mainLightHelper!: THREE.DirectionalLightHelper;
  private fillLightHelper!: THREE.DirectionalLightHelper;
  private backLightHelper!: THREE.DirectionalLightHelper;

  private _boundListeners: {
    mouseDown: (event: MouseEvent) => void;
    mouseMove: (event: MouseEvent) => void;
    mouseUp: (event: MouseEvent) => void;
    contextMenu: (event: Event) => void;
  } | null = null;

  constructor(
    private cdCasesService: CDCasesService,
    private sceneService: SceneService,
    private preloaderService: PreloaderService
  ) {
    // Load cases data
    this.config.cdCases = updateCasePositions(allCases);
    
    this.initScene();
    this.initCaseSettings();
    this.initHelpers();
  }

  private initCaseSettings(): void {
    this.config.cdCases.forEach(caseConfig => {
      this.caseSettings[caseConfig.id] = {
        positionX: caseConfig.position.x,
        positionY: caseConfig.position.y,
        positionZ: caseConfig.position.z,
        rotationX: caseConfig.rotation.x,
        rotationY: caseConfig.rotation.y,
        rotationZ: caseConfig.rotation.z
      };
    });
  }

  private initScene(): void {
    this.scene = this.sceneService.setupScene(this.config);
    this.camera = this.sceneService.setupCamera(this.config);

    // Initialize CSS2D renderer for labels
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
  }

  private initHelpers(): void {
    // Grid helper
    this.gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    this.gridHelper.position.y = this.config.sceneSettings.ground.y;
    this.scene.add(this.gridHelper);

    // Axes helper (RGB = XYZ)
    this.axesHelper = new THREE.AxesHelper(5);
    this.scene.add(this.axesHelper);

    // Light helpers will be added after lights are created
  }

  private async loadModels(): Promise<void> {
    try {
      this.cdCases = await this.cdCasesService.loadModels(this.config, this.scene, this.renderer);
      
      // Set first case as active after 5 seconds
      setTimeout(() => {
        this.cdCasesService.setActiveCase(this.cdCases, 0);
      }, 5000);

      console.log('Loaded CD cases:', this.cdCases.map(c => ({
        id: c.id,
        modelName: c.model.name,
        hasArmature: !!c.armature
      })));
      
      // Set up lights from config
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
      const groundMesh = this.sceneService.setupGround(this.scene, this.config);

    } catch (error) {
      console.error('Error loading model:', error);
    }
  }

  ngAfterViewInit(): void {
    this.setupRenderer();
    this.setupControls();
    this.loadModels().then(() => {
      // Signal that CD cases component is ready
      this.preloaderService.setComponentReady(true);
      
      this.labelRendererElement.nativeElement.appendChild(this.labelRenderer.domElement);
      this.animate();
      this.addEventListeners();
    }).catch(error => {
      console.error('Error initializing CD cases:', error);
      // Handle error appropriately
    });
  }

  private setupRenderer(): void {
    this.renderer = this.sceneService.setupRenderer(this.canvasRef.nativeElement, this.config);
  }

  private setupControls(): void {
    this.controls = this.sceneService.setupControls(this.camera, this.canvasRef.nativeElement, this.config);
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
  }

  private addEventListeners(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    canvas.addEventListener('contextmenu', this.onContextMenu.bind(this));
  }

  private onMouseDown(event: MouseEvent): void {
    if (event.button === 0) { // Left click
      console.log('Left click detected');
      this.updateMousePosition(event);
      this.raycaster.setFromCamera(this.mouse, this.camera);

      // Create an array of all meshes in the CD cases
      const surfacesToCheck: THREE.Object3D[] = [];
      this.cdCases.forEach(cdCase => {
        cdCase.model.traverse((child) => {
          // Include any mesh that's part of the case
          if (child instanceof THREE.Mesh) {
            console.log('Found mesh:', child.name);
            surfacesToCheck.push(child);
          }
        });
      });

      // Check intersections with all case surfaces
      const intersects = this.raycaster.intersectObjects(surfacesToCheck, false);
      console.log('Checking all case surfaces, intersected:', intersects.length);

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        console.log('Clicked surface:', clickedObject.name);

        // Find which CD case was clicked
        const selectedCase = this.cdCases.find(cdCase => {
          let isPartOfCase = false;
          cdCase.model.traverse((child) => {
            if (child === clickedObject) {
              isPartOfCase = true;
            }
          });
          return isPartOfCase;
        });

        if (selectedCase) {
          console.log('Flipping case:', selectedCase.id);
          this.cdCasesService.flipCase(selectedCase);
        }
      }
    }
  }

  private onMouseMove(event: MouseEvent): void {
    this.updateMousePosition(event);
  }

  private onMouseUp(): void {
    // Keep only context menu related code if needed
  }

  private onContextMenu(event: Event): void {
    event.preventDefault();
    this.updateMousePosition(event as MouseEvent);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Create an array of all meshes in the CD cases
    const surfacesToCheck: THREE.Object3D[] = [];
    this.cdCases.forEach(cdCase => {
      cdCase.model.traverse((child) => {
        // Include any mesh that's part of the case
        if (child instanceof THREE.Mesh) {
          surfacesToCheck.push(child);
        }
      });
    });

    // Check intersections with all case surfaces
    const intersects = this.raycaster.intersectObjects(surfacesToCheck, false);
    console.log('Checking all case surfaces, intersected:', intersects.length);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      console.log('Clicked surface:', clickedObject.name);

      // Find which CD case was clicked
      const selectedCase = this.cdCases.find(cdCase => {
        let isPartOfCase = false;
        cdCase.model.traverse((child) => {
          if (child === clickedObject) {
            isPartOfCase = true;
          }
        });
        return isPartOfCase;
      });

      if (selectedCase) {
        console.log('Flipping case:', selectedCase.id);
        this.cdCasesService.flipCase(selectedCase);
      }
    }
  }

  private updateMousePosition(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(this.animate.bind(this));

    // Update animation mixers
    this.cdCasesService.updateAnimations(this.cdCases);

    // Update controls
    this.controls.update();

    // Update light helpers
    this.mainLightHelper.update();
    this.fillLightHelper.update();
    this.backLightHelper.update();

    // Apply physics and momentum
    this.cdCases.forEach(cdCase => {
      if (!cdCase.isDragging && (cdCase.momentum.x !== 0 || cdCase.momentum.y !== 0)) {
        cdCase.position.x += cdCase.momentum.x;
        cdCase.position.z += cdCase.momentum.y;
        cdCase.model.position.copy(cdCase.position);
        
        cdCase.momentum.multiplyScalar(0.95);
        if (cdCase.momentum.length() < 0.001) {
          cdCase.momentum.set(0, 0);
        }

        this.cdCasesService.checkCollisions(cdCase, this.cdCases);
      }
    });

    // Render both the scene and labels
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }

  public updateCamera(): void {
    this.camera.position.set(
      this.sceneSettings.cameraX,
      this.sceneSettings.cameraY,
      this.sceneSettings.cameraZ
    );
    this.controls.target.set(
      this.sceneSettings.lookAtX,
      this.sceneSettings.lookAtY,
      this.sceneSettings.lookAtZ
    );
    this.controls.update();
  }

  public updateLighting(): void {
    this.ambientLight.intensity = this.sceneSettings.ambientIntensity;
    this.mainLight.intensity = this.sceneSettings.mainLightIntensity;
    
    // Update light helpers
    this.mainLightHelper.update();
    this.fillLightHelper.update();
    this.backLightHelper.update();
  }

  public updateRenderer(): void {
    this.renderer.toneMappingExposure = this.sceneSettings.exposure;
  }

  public updateOrbitControls(): void {
    this.controls.minPolarAngle = this.sceneSettings.orbitMinPolarAngle;
    this.controls.maxPolarAngle = this.sceneSettings.orbitMaxPolarAngle;
    this.controls.minDistance = this.sceneSettings.orbitMinDistance;
    this.controls.maxDistance = this.sceneSettings.orbitMaxDistance;
    this.controls.dampingFactor = this.sceneSettings.orbitDampingFactor;
    this.controls.update();
  }

  public updateGround(): void {
    const ground = this.scene.children.find(child => 
        child instanceof THREE.Mesh && 
        child.geometry instanceof THREE.PlaneGeometry
    ) as THREE.Mesh;
    
    if (ground && ground.material instanceof THREE.ShadowMaterial) {
        ground.position.y = this.sceneSettings.groundY;
        ground.material.opacity = this.sceneSettings.groundOpacity;
        ground.material.needsUpdate = true;
    }
  }

  public updateCaseTransform(cdCase: CDCase): void {
    const settings = this.caseSettings[cdCase.id];
    cdCase.position.set(settings.positionX, settings.positionY, settings.positionZ);
    cdCase.rotation.set(settings.rotationX, settings.rotationY, settings.rotationZ);
    cdCase.model.position.copy(cdCase.position);
    cdCase.model.rotation.copy(cdCase.rotation);
  }

  public resetToDefault(): void {
    // Reset scene settings
    Object.assign(this.sceneSettings, {
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
    });
    
    // Reset case settings
    this.cdCases.forEach(cdCase => {
      Object.assign(this.caseSettings[cdCase.id], {
        positionX: cdCase.position.x,
        positionY: cdCase.position.y,
        positionZ: cdCase.position.z,
        rotationX: cdCase.rotation.x,
        rotationY: cdCase.rotation.y,
        rotationZ: cdCase.rotation.z
      });
    });
    
    // Update everything
    this.updateCamera();
    this.updateLighting();
    this.updateRenderer();
    this.updateOrbitControls();
    this.updateGround();
    this.cdCases.forEach(cdCase => this.updateCaseTransform(cdCase));
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
    this.scene.remove(this.gridHelper);
    this.scene.remove(this.axesHelper);
    this.scene.remove(this.mainLightHelper);
    this.scene.remove(this.fillLightHelper);
    this.scene.remove(this.backLightHelper);

    this.renderer.dispose();

    // Clean up label renderer
    this.labelRenderer.domElement.remove();
  }

  // Add wheel event handler for changing active case
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (this.config.sceneSettings.camera.lockControls) {
      event.preventDefault();
      
      // Find current active case index
      const currentActiveIndex = this.cdCases.findIndex(cdCase => cdCase.isActive);
      
      // Calculate new index based on scroll direction
      let newIndex = currentActiveIndex;
      if (event.deltaY > 0) { // Scrolling down
        newIndex = Math.min(currentActiveIndex + 1, this.cdCases.length - 1);
      } else { // Scrolling up
        newIndex = Math.max(currentActiveIndex - 1, 0);
      }
      
      // Update active case if index changed
      if (newIndex !== currentActiveIndex) {
        this.cdCasesService.setActiveCase(this.cdCases, newIndex);
      }
    }
  }
} 