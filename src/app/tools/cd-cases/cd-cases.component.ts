import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as dat from 'dat.gui';

interface CDCase {
  id: number;
  title: string;
  artist: string;
  imageUrl: string;
  model: THREE.Group;
  isFlipped: boolean;
  isDragging: boolean;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  momentum: THREE.Vector2;
  mixer?: THREE.AnimationMixer;  // Animation mixer
  animations?: THREE.AnimationClip[];  // Available animations
  openAction?: THREE.AnimationAction;  // Action for opening/closing
}

interface SceneSettings {
  cameraX: number;
  cameraY: number;
  cameraZ: number;
  lookAtX: number;
  lookAtY: number;
  lookAtZ: number;
  ambientIntensity: number;
  mainLightIntensity: number;
  exposure: number;
  groundY: number;
  groundOpacity: number;
  orbitMinPolarAngle: number;
  orbitMaxPolarAngle: number;
  orbitMinDistance: number;
  orbitMaxDistance: number;
  orbitDampingFactor: number;
}

interface CaseSettings {
  positionX: number;
  positionY: number;
  positionZ: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
}

@Component({
  selector: 'app-cd-cases',
  standalone: true,
  imports: [CommonModule],
  template: '<canvas #canvas></canvas>',
  styles: [`
    canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: all;
      z-index: 10;
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
  private cdCases: CDCase[] = [];
  private selectedCase: CDCase | null = null;
  private dragStartPosition = new THREE.Vector2();
  private dragOffset = new THREE.Vector3();
  private planeNormal = new THREE.Vector3(0, 0, 1);
  private dragPlane = new THREE.Plane(this.planeNormal);
  private clock = new THREE.Clock();  // Add clock for animation timing
  private gui!: dat.GUI;
  private sceneSettings: SceneSettings = {
    cameraX: 0,
    cameraY: 6,
    cameraZ: 12,
    lookAtX: 0,
    lookAtY: -1,
    lookAtZ: 0,
    ambientIntensity: 0.7,
    mainLightIntensity: 1.2,
    exposure: 1.2,
    groundY: -2,
    groundOpacity: 0.3,
    orbitMinPolarAngle: Math.PI / 4,
    orbitMaxPolarAngle: Math.PI / 2.2,
    orbitMinDistance: 5,
    orbitMaxDistance: 20,
    orbitDampingFactor: 0.05
  };
  
  private caseSettings: { [key: number]: CaseSettings } = {};
  private ambientLight!: THREE.AmbientLight;
  private mainLight!: THREE.DirectionalLight;

  constructor() {
    this.initScene();
  }

  private initScene(): void {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = null;

    // Camera setup - Adjusted for table-like perspective
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 4, 10); // Higher and further back
    this.camera.lookAt(0, 0, 0);
  }

  private async loadModels(): Promise<void> {
    const loader = new GLTFLoader();

    try {
      // Load the model with animations
      const gltf = await loader.loadAsync('assets/3d/CD_Case/CD_Case.glb');
      
      // Debug logging
      console.log('Loading model...');
      gltf.scene.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          console.log('Found mesh:', node.name, 'with material:', node.material);
          
          // Clone materials while preserving their original properties
          if (Array.isArray(node.material)) {
            node.material = node.material.map(mat => {
              const clonedMat = mat.clone();
              // Ensure proper color space for textures
              if (clonedMat.map) {
                clonedMat.map.colorSpace = THREE.SRGBColorSpace;
              }
              if (clonedMat.normalMap) {
                clonedMat.normalMap.colorSpace = THREE.LinearSRGBColorSpace;
              }
              if (clonedMat.roughnessMap) {
                clonedMat.roughnessMap.colorSpace = THREE.LinearSRGBColorSpace;
              }
              if (clonedMat.metalnessMap) {
                clonedMat.metalnessMap.colorSpace = THREE.LinearSRGBColorSpace;
              }
              clonedMat.needsUpdate = true;
              return clonedMat;
            });
          } else {
            const clonedMat = node.material.clone();
            // Ensure proper color space for textures
            if (clonedMat.map) {
              clonedMat.map.colorSpace = THREE.SRGBColorSpace;
            }
            if (clonedMat.normalMap) {
              clonedMat.normalMap.colorSpace = THREE.LinearSRGBColorSpace;
            }
            if (clonedMat.roughnessMap) {
              clonedMat.roughnessMap.colorSpace = THREE.LinearSRGBColorSpace;
            }
            if (clonedMat.metalnessMap) {
              clonedMat.metalnessMap.colorSpace = THREE.LinearSRGBColorSpace;
            }
            clonedMat.needsUpdate = true;
            node.material = clonedMat;
          }

          // Add debug logging for materials
          if (node.name === 'Case Back Proper') {
            console.log('Case Back materials:', node.material);
          } else if (node.name === 'CD') {
            console.log('CD materials:', node.material);
          } else if (node.name === 'Case Front') {
            console.log('Case Front materials:', node.material);
          }

          // Enable shadows
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });

      // Create environment map for reflections
      const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      const envMapTexture = new THREE.TextureLoader().load('assets/graphic/envmap.jpg', (texture) => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        this.scene.environment = envMap;
        texture.dispose();
        pmremGenerator.dispose();
      });

      // Create CD cases
      const cdData = [
    {
      id: 1,
      title: 'Disc One',
      artist: 'An × Feryquitous',
          position: new THREE.Vector3(-2, -1, 0)  // Adjusted Y position
    },
    {
      id: 2,
      title: 'Disc Two',
      artist: 'An × Feryquitous',
          position: new THREE.Vector3(2, -1, 0)   // Adjusted Y position
        }
      ];

      for (const data of cdData) {
        // Deep clone the scene to preserve hierarchy and materials
        const model = gltf.scene.clone(true);
        
        // Position and rotate the model to lay more flat
        model.position.copy(data.position);
        model.rotation.x = -Math.PI * 0.2; // Tilt backward
        model.rotation.y = Math.PI * 0.1;  // Slight rotation for better view
        
        // Add to scene
        this.scene.add(model);

        // Create CDCase object
        const cdCase: CDCase = {
          id: data.id,
          title: data.title,
          artist: data.artist,
          imageUrl: '',
          model,
          isFlipped: false,
          isDragging: false,
          position: data.position.clone(),
          rotation: new THREE.Euler(-Math.PI * 0.2, Math.PI * 0.1, 0),
          momentum: new THREE.Vector2(),
          mixer: new THREE.AnimationMixer(model),
          animations: gltf.animations.map(anim => anim.clone())
        };

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

      // Enhanced lighting for better material visibility
      this.ambientLight = new THREE.AmbientLight(0xffffff, this.sceneSettings.ambientIntensity);
      
      this.mainLight = new THREE.DirectionalLight(0xffffff, this.sceneSettings.mainLightIntensity);
      this.mainLight.position.set(5, 5, 5);
      this.mainLight.castShadow = true;
      
      const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
      fillLight.position.set(-5, 3, 0);
      
      const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
      backLight.position.set(0, 2, -5);

      // Add a ground plane for better perspective
      const groundGeometry = new THREE.PlaneGeometry(20, 20);
      const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -2;
      ground.receiveShadow = true;
      this.scene.add(ground);
      
      this.scene.add(this.ambientLight, this.mainLight, fillLight, backLight);

      // Adjust camera for better viewing angle
      this.camera.position.set(0, 6, 12);
      this.camera.lookAt(0, -1, 0);

      // Set up renderer for proper material rendering
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = this.sceneSettings.exposure;

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
      this.setupDebugUI();
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
    this.renderer.toneMappingExposure = this.sceneSettings.exposure;
  }

  private setupControls(): void {
    this.controls = new OrbitControls(this.camera, this.canvasRef.nativeElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.enablePan = true;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 20;
    
    // Set up constraints for table-like view
    this.controls.minPolarAngle = Math.PI / 4; // Minimum 45 degrees from top
    this.controls.maxPolarAngle = Math.PI / 2.2; // Maximum ~82 degrees from top
    
    this.controls.target.set(0, -1, 0); // Looking slightly down at the "table"
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

  private setupDebugUI(): void {
    this.gui = new dat.GUI();
    
    // Scene settings folder
    const sceneFolder = this.gui.addFolder('Scene Settings');
    
    // Camera position
    const cameraFolder = sceneFolder.addFolder('Camera Position');
    cameraFolder.add(this.sceneSettings, 'cameraX', -20, 20).onChange(() => this.updateCamera());
    cameraFolder.add(this.sceneSettings, 'cameraY', -20, 20).onChange(() => this.updateCamera());
    cameraFolder.add(this.sceneSettings, 'cameraZ', -20, 20).onChange(() => this.updateCamera());
    
    // Look at point
    const lookAtFolder = sceneFolder.addFolder('Look At Point');
    lookAtFolder.add(this.sceneSettings, 'lookAtX', -20, 20).onChange(() => this.updateCamera());
    lookAtFolder.add(this.sceneSettings, 'lookAtY', -20, 20).onChange(() => this.updateCamera());
    lookAtFolder.add(this.sceneSettings, 'lookAtZ', -20, 20).onChange(() => this.updateCamera());
    
    // Orbit Controls
    const orbitFolder = sceneFolder.addFolder('Orbit Controls');
    orbitFolder.add(this.sceneSettings, 'orbitMinPolarAngle', 0, Math.PI).onChange(() => this.updateOrbitControls());
    orbitFolder.add(this.sceneSettings, 'orbitMaxPolarAngle', 0, Math.PI).onChange(() => this.updateOrbitControls());
    orbitFolder.add(this.sceneSettings, 'orbitMinDistance', 1, 50).onChange(() => this.updateOrbitControls());
    orbitFolder.add(this.sceneSettings, 'orbitMaxDistance', 1, 50).onChange(() => this.updateOrbitControls());
    orbitFolder.add(this.sceneSettings, 'orbitDampingFactor', 0, 1).onChange(() => this.updateOrbitControls());
    
    // Ground settings
    const groundFolder = sceneFolder.addFolder('Ground Plane');
    groundFolder.add(this.sceneSettings, 'groundY', -10, 10).onChange(() => this.updateGround());
    groundFolder.add(this.sceneSettings, 'groundOpacity', 0, 1).onChange(() => this.updateGround());
    
    // Lighting
    const lightingFolder = sceneFolder.addFolder('Lighting');
    lightingFolder.add(this.sceneSettings, 'ambientIntensity', 0, 2).onChange(() => this.updateLighting());
    lightingFolder.add(this.sceneSettings, 'mainLightIntensity', 0, 2).onChange(() => this.updateLighting());
    lightingFolder.add(this.sceneSettings, 'exposure', 0, 2).onChange(() => this.updateRenderer());
    
    // CD Cases folders with enhanced material controls
    const casesFolder = this.gui.addFolder('CD Cases');
    
    this.cdCases.forEach(cdCase => {
      this.caseSettings[cdCase.id] = {
        positionX: cdCase.position.x,
        positionY: cdCase.position.y,
        positionZ: cdCase.position.z,
        rotationX: cdCase.rotation.x,
        rotationY: cdCase.rotation.y,
        rotationZ: cdCase.rotation.z
      };
      
      const caseFolder = casesFolder.addFolder(`Case ${cdCase.id}`);
      
      // Position controls
      const posFolder = caseFolder.addFolder('Position');
      posFolder.add(this.caseSettings[cdCase.id], 'positionX', -10, 10, 0.01).onChange(() => this.updateCaseTransform(cdCase));
      posFolder.add(this.caseSettings[cdCase.id], 'positionY', -10, 10, 0.01).onChange(() => this.updateCaseTransform(cdCase));
      posFolder.add(this.caseSettings[cdCase.id], 'positionZ', -10, 10, 0.01).onChange(() => this.updateCaseTransform(cdCase));
      
      // Rotation controls
      const rotFolder = caseFolder.addFolder('Rotation');
      rotFolder.add(this.caseSettings[cdCase.id], 'rotationX', -Math.PI, Math.PI, 0.01).onChange(() => this.updateCaseTransform(cdCase));
      rotFolder.add(this.caseSettings[cdCase.id], 'rotationY', -Math.PI, Math.PI, 0.01).onChange(() => this.updateCaseTransform(cdCase));
      rotFolder.add(this.caseSettings[cdCase.id], 'rotationZ', -Math.PI, Math.PI, 0.01).onChange(() => this.updateCaseTransform(cdCase));
      
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
    this.gui.add({ resetToDefault: () => this.resetToDefault() }, 'resetToDefault').name('Reset to Default');
  }

  private updateCamera(): void {
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

  private updateLighting(): void {
    this.ambientLight.intensity = this.sceneSettings.ambientIntensity;
    this.mainLight.intensity = this.sceneSettings.mainLightIntensity;
  }

  private updateRenderer(): void {
    this.renderer.toneMappingExposure = this.sceneSettings.exposure;
  }

  private updateCaseTransform(cdCase: CDCase): void {
    const settings = this.caseSettings[cdCase.id];
    cdCase.position.set(settings.positionX, settings.positionY, settings.positionZ);
    cdCase.rotation.set(settings.rotationX, settings.rotationY, settings.rotationZ);
    cdCase.model.position.copy(cdCase.position);
    cdCase.model.rotation.copy(cdCase.rotation);
  }

  private printCurrentSettings(): void {
    console.log('Current Scene Settings:', JSON.stringify(this.sceneSettings, null, 2));
    console.log('Current Case Settings:', JSON.stringify(this.caseSettings, null, 2));
  }

  private resetToDefault(): void {
    // Reset scene settings
    Object.assign(this.sceneSettings, {
      cameraX: 0,
      cameraY: 6,
      cameraZ: 12,
      lookAtX: 0,
      lookAtY: -1,
      lookAtZ: 0,
      ambientIntensity: 0.7,
      mainLightIntensity: 1.2,
      exposure: 1.2,
      groundY: -2,
      groundOpacity: 0.3,
      orbitMinPolarAngle: Math.PI / 4,
      orbitMaxPolarAngle: Math.PI / 2.2,
      orbitMinDistance: 5,
      orbitMaxDistance: 20,
      orbitDampingFactor: 0.05
    });
    
    // Reset case settings
    this.cdCases.forEach(cdCase => {
      Object.assign(this.caseSettings[cdCase.id], {
        positionX: cdCase.id === 1 ? -2 : 2,
        positionY: -1,
        positionZ: 0,
        rotationX: -Math.PI * 0.2,
        rotationY: Math.PI * 0.1,
        rotationZ: 0
      });
    });
    
    // Update everything
    this.updateCamera();
    this.updateLighting();
    this.updateRenderer();
    this.cdCases.forEach(cdCase => this.updateCaseTransform(cdCase));
  }

  private updateOrbitControls(): void {
    this.controls.minPolarAngle = this.sceneSettings.orbitMinPolarAngle;
    this.controls.maxPolarAngle = this.sceneSettings.orbitMaxPolarAngle;
    this.controls.minDistance = this.sceneSettings.orbitMinDistance;
    this.controls.maxDistance = this.sceneSettings.orbitMaxDistance;
    this.controls.dampingFactor = this.sceneSettings.orbitDampingFactor;
    this.controls.update();
  }

  private updateGround(): void {
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
                    this.updateCamera();
                    this.updateLighting();
                    this.updateRenderer();
                    this.updateOrbitControls();
                    this.updateGround();
                    this.cdCases.forEach(cdCase => this.updateCaseTransform(cdCase));
                } catch (error) {
                    console.error('Error loading settings:', error);
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
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

    if (this.gui) {
      this.gui.destroy();
    }
    
    this.renderer.dispose();
  }
} 