import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DebugMenuComponent } from '../debug-menu/debug-menu.component';
import { CDCase, CaseSettings, SceneSettings, Config } from '../shared/interfaces';
import config from './config.json';

@Component({
  selector: 'app-cd-cases',
  standalone: true,
  imports: [CommonModule, DebugMenuComponent],
  template: `
    <div class="cd-container">
      <canvas #canvas></canvas>
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
  `]
})
export class CDCasesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
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

  constructor() {
    this.initScene();
    this.initCaseSettings();
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
    this.scene = new THREE.Scene();
    this.scene.background = null;

    const { position, lookAt } = this.config.sceneSettings.camera;
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(position.x, position.y, position.z);
    this.camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
  }

  private async loadModels(): Promise<void> {
    const loader = new GLTFLoader();

    try {
      const gltf = await loader.loadAsync('assets/3d/CD_Case/CD_Case.glb');
      
      // Create environment map
      const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      const envMapTexture = new THREE.TextureLoader().load('assets/graphic/composite.png', (texture) => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        this.scene.environment = envMap;
        texture.dispose();
        pmremGenerator.dispose();
      });

      // Create CD cases from config
      for (const caseConfig of this.config.cdCases) {
        const model = gltf.scene.clone(true);
        const { position, rotation } = caseConfig;
        
        model.position.set(position.x, position.y, position.z);
        model.rotation.set(rotation.x, rotation.y, rotation.z);
        
        this.scene.add(model);

        const cdCase: CDCase = {
          id: caseConfig.id,
          title: caseConfig.title,
          artist: caseConfig.artist,
          imageUrl: '',
          model,
          isFlipped: false,
          isDragging: false,
          position: new THREE.Vector3(position.x, position.y, position.z),
          rotation: new THREE.Euler(rotation.x, rotation.y, rotation.z),
          momentum: new THREE.Vector2(),
          mixer: new THREE.AnimationMixer(model),
          animations: gltf.animations.map((anim: THREE.AnimationClip) => anim.clone())
        };

        // Set up CD materials from config
        model.traverse((node: THREE.Object3D) => {
          if (node instanceof THREE.Mesh && node.name === 'CD') {
            if (Array.isArray(node.material)) {
              node.material = node.material.map((mat, index) => {
                const matConfig = caseConfig.materials.cd[index];
                const clonedMat = mat.clone();
                Object.assign(clonedMat, {
                  metalness: matConfig.metalness,
                  roughness: matConfig.roughness,
                  envMapIntensity: matConfig.envMapIntensity
                });
                if ('clearcoat' in clonedMat && matConfig.clearcoat !== undefined) {
                  clonedMat.clearcoat = matConfig.clearcoat;
                  clonedMat.clearcoatRoughness = matConfig.clearcoatRoughness || 0;
                }
                clonedMat.needsUpdate = true;
                return clonedMat;
              });
            }
          }
        });

        // Set up animation
        const openAnim = cdCase.animations?.find(a => 
          a.name.toLowerCase().includes('open') || 
          a.name.toLowerCase().includes('armature')
        );
        
        if (openAnim && cdCase.mixer) {
          cdCase.openAction = cdCase.mixer.clipAction(openAnim);
          cdCase.openAction.setLoop(THREE.LoopOnce, 1);
          cdCase.openAction.clampWhenFinished = true;
        }

        this.cdCases.push(cdCase);
      }

      // Set up lights from config
      const { lighting } = this.config.sceneSettings;
      
      this.ambientLight = new THREE.AmbientLight(0xffffff, lighting.ambient.intensity);
      
      this.mainLight = new THREE.DirectionalLight(0xffffff, lighting.main.intensity);
      this.mainLight.position.set(
        lighting.main.position.x,
        lighting.main.position.y,
        lighting.main.position.z
      );
      this.mainLight.castShadow = true;
      
      this.fillLight = new THREE.DirectionalLight(0xffffff, lighting.fill.intensity);
      this.fillLight.position.set(
        lighting.fill.position.x,
        lighting.fill.position.y,
        lighting.fill.position.z
      );
      
      this.backLight = new THREE.DirectionalLight(0xffffff, lighting.back.intensity);
      this.backLight.position.set(
        lighting.back.position.x,
        lighting.back.position.y,
        lighting.back.position.z
      );

      // Set up ground from config
      const { ground } = this.config.sceneSettings;
      const groundGeometry = new THREE.PlaneGeometry(ground.size, ground.size);
      const groundMaterial = new THREE.ShadowMaterial({ opacity: ground.opacity });
      const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
      groundMesh.rotation.x = -Math.PI / 2;
      groundMesh.position.y = ground.y;
      groundMesh.receiveShadow = true;
      this.scene.add(groundMesh);
      
      this.scene.add(this.ambientLight, this.mainLight, this.fillLight, this.backLight);

      // Set up renderer from config
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = this.config.sceneSettings.renderer.exposure;

    } catch (error) {
      console.error('Error loading model:', error);
    }
  }

  ngAfterViewInit(): void {
    this.setupRenderer();
    this.setupControls();
    this.loadModels().then(() => {
      this.animate();
      this.addEventListeners();
    });
  }

  private setupRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = this.config.sceneSettings.renderer.exposure;
  }

  private setupControls(): void {
    const { orbitControls } = this.config.sceneSettings;
    this.controls = new OrbitControls(this.camera, this.canvasRef.nativeElement);
    this.controls.enableDamping = orbitControls.enableDamping;
    this.controls.dampingFactor = orbitControls.dampingFactor;
    this.controls.enableZoom = orbitControls.enableZoom;
    this.controls.enablePan = orbitControls.enablePan;
    this.controls.minDistance = orbitControls.minDistance;
    this.controls.maxDistance = orbitControls.maxDistance;
    this.controls.minPolarAngle = orbitControls.minPolarAngle;
    this.controls.maxPolarAngle = orbitControls.maxPolarAngle;
    this.controls.target.set(
      this.config.sceneSettings.camera.lookAt.x,
      this.config.sceneSettings.camera.lookAt.y,
      this.config.sceneSettings.camera.lookAt.z
    );
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private addEventListeners(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    canvas.addEventListener('contextmenu', this.onContextMenu.bind(this));
  }

  private onMouseDown(event: MouseEvent): void {
    if (event.button === 2) return;

    this.updateMousePosition(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    if (intersects.length > 0) {
      // Find the root model object
      let modelObject = intersects[0].object;
      while (modelObject.parent && modelObject.parent !== this.scene) {
        modelObject = modelObject.parent;
      }

      const selectedCase = this.cdCases.find(cd => cd.model === modelObject);
      if (selectedCase) {
        this.controls.enabled = false;
        this.selectedCase = selectedCase;
        selectedCase.isDragging = true;
        this.dragStartPosition.set(event.clientX, event.clientY);
        this.dragOffset.copy(selectedCase.model.position).sub(intersects[0].point);
      }
    }
  }

  private onMouseMove(event: MouseEvent): void {
    this.updateMousePosition(event);

    if (this.selectedCase?.isDragging) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersectPoint = new THREE.Vector3();
      this.raycaster.ray.intersectPlane(this.dragPlane, intersectPoint);
      
      const newPosition = intersectPoint.add(this.dragOffset);
      this.selectedCase.model.position.copy(newPosition);
      this.selectedCase.position.copy(newPosition);

      const deltaX = event.clientX - this.dragStartPosition.x;
      const deltaY = event.clientY - this.dragStartPosition.y;
      this.selectedCase.momentum.set(deltaX * 0.01, deltaY * 0.01);
      this.dragStartPosition.set(event.clientX, event.clientY);
    }
  }

  private onMouseUp(): void {
    if (this.selectedCase) {
      this.selectedCase.isDragging = false;
      this.selectedCase = null;
      this.controls.enabled = true;
    }
  }

  private onContextMenu(event: Event): void {
      event.preventDefault();
    this.updateMousePosition(event as MouseEvent);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    if (intersects.length > 0) {
      let modelObject = intersects[0].object;
      while (modelObject.parent && modelObject.parent !== this.scene) {
        modelObject = modelObject.parent;
      }

      const selectedCase = this.cdCases.find(cd => cd.model === modelObject);
      if (selectedCase) {
        this.flipCase(selectedCase);
      }
    }
  }

  private updateMousePosition(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private flipCase(cdCase: CDCase): void {
    if (!cdCase.openAction) return;

    cdCase.isFlipped = !cdCase.isFlipped;
    
    if (cdCase.isFlipped) {
      // Open the case
      cdCase.openAction.reset();
      cdCase.openAction.setEffectiveTimeScale(1);
      cdCase.openAction.play();
    } else {
      // Close the case
      cdCase.openAction.reset();
      cdCase.openAction.setEffectiveTimeScale(-1);  // Reverse the animation
      cdCase.openAction.play();
    }
  }

  private checkCollisions(currentCase: CDCase): void {
    const currentBox = new THREE.Box3().setFromObject(currentCase.model);
    
    this.cdCases.forEach(otherCase => {
      if (otherCase !== currentCase) {
        const otherBox = new THREE.Box3().setFromObject(otherCase.model);
        
        if (currentBox.intersectsBox(otherBox)) {
          // Calculate push direction
          const currentCenter = currentBox.getCenter(new THREE.Vector3());
          const otherCenter = otherBox.getCenter(new THREE.Vector3());
          const pushDir = currentCenter.sub(otherCenter).normalize();
          
          // Push both cases apart
          const pushStrength = 0.1;
          currentCase.position.add(pushDir.multiplyScalar(pushStrength));
          otherCase.position.sub(pushDir.multiplyScalar(pushStrength));
          
          // Update model positions
          currentCase.model.position.copy(currentCase.position);
          otherCase.model.position.copy(otherCase.position);
          
          // Dampen momentum
          currentCase.momentum.multiplyScalar(0.8);
          otherCase.momentum.multiplyScalar(0.8);
        }
      }
    });
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(this.animate.bind(this));

    // Update animation mixers
    const delta = this.clock.getDelta();
    
    this.cdCases.forEach(cdCase => {
      if (cdCase.mixer) {
        cdCase.mixer.update(delta);
      }
    });

    // Update controls
    this.controls.update();

    // Apply physics and momentum
    this.cdCases.forEach(cdCase => {
      if (!cdCase.isDragging && (cdCase.momentum.x !== 0 || cdCase.momentum.y !== 0)) {
        cdCase.position.x += cdCase.momentum.x;
        cdCase.position.z += cdCase.momentum.y; // Use Z instead of Y for table-like movement
        cdCase.model.position.copy(cdCase.position);
        
        cdCase.momentum.multiplyScalar(0.95);
        if (cdCase.momentum.length() < 0.001) {
          cdCase.momentum.set(0, 0);
        }

        // Check for collisions after movement
        this.checkCollisions(cdCase);
      }
    });

    this.renderer.render(this.scene, this.camera);
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

    this.renderer.dispose();
  }
} 