import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { Injectable } from '@angular/core';
import { Config } from '../../../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SceneService {
  // Clock for animations
  private clock = new THREE.Clock();
  
  // Store instances of shaders for animations
  private backgroundShaderMaterial: THREE.ShaderMaterial | null = null;
  
  setupScene(config: Config): THREE.Scene {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x551919);
    scene.fog = new THREE.Fog(0x551919, 10, 50);

    // Add AxesHelper for orientation
    const axesHelper = new THREE.AxesHelper(5);
    // Red is X, Green is Y, Blue is Z
    axesHelper.setColors(
      new THREE.Color(0xff0000), // X axis - Red
      new THREE.Color(0x00ff00), // Y axis - Green
      new THREE.Color(0x0000ff)  // Z axis - Blue
    );
    scene.add(axesHelper);

    return scene;
  }

  setupCamera(config: Config): THREE.PerspectiveCamera {
    const { position, lookAt } = config.sceneSettings.camera;
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(position.x, position.y, position.z);
    camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
    return camera;
  }

  setupRenderer(canvas: HTMLCanvasElement, config: Config): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = config.sceneSettings.renderer.exposure;
    return renderer;
  }

  setupControls(camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement, config: Config): OrbitControls {
    const { orbitControls } = config.sceneSettings;
    const controls = new OrbitControls(camera, canvas);
    
    // Apply control settings
    controls.enableDamping = orbitControls.enableDamping;
    controls.dampingFactor = orbitControls.dampingFactor;
    controls.minDistance = orbitControls.minDistance;
    controls.maxDistance = orbitControls.maxDistance;
    controls.minPolarAngle = orbitControls.minPolarAngle;
    controls.maxPolarAngle = orbitControls.maxPolarAngle;
    
    // Lock controls if specified in config
    if (config.sceneSettings.camera.lockControls) {
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableRotate = false;
    } else {
      controls.enableZoom = orbitControls.enableZoom;
      controls.enablePan = orbitControls.enablePan;
      controls.enableRotate = true;
    }

    controls.target.set(
      config.sceneSettings.camera.lookAt.x,
      config.sceneSettings.camera.lookAt.y,
      config.sceneSettings.camera.lookAt.z
    );

    return controls;
  }

  setupLights(scene: THREE.Scene, config: Config): {
    ambientLight: THREE.AmbientLight;
    mainLight: THREE.DirectionalLight;
    fillLight: THREE.DirectionalLight;
    backLight: THREE.DirectionalLight;
  } {
    const { lighting } = config.sceneSettings;
    
    const ambientLight = new THREE.AmbientLight(0xffffff, lighting.ambient.intensity);
    
    const mainLight = new THREE.DirectionalLight(0xffffff, lighting.main.intensity);
    mainLight.position.set(
      lighting.main.position.x,
      lighting.main.position.y,
      lighting.main.position.z
    );
    mainLight.castShadow = true;
    
    const fillLight = new THREE.DirectionalLight(0xffffff, lighting.fill.intensity);
    fillLight.position.set(
      lighting.fill.position.x,
      lighting.fill.position.y,
      lighting.fill.position.z
    );
    
    const backLight = new THREE.DirectionalLight(0xffffff, lighting.back.intensity);
    backLight.position.set(
      lighting.back.position.x,
      lighting.back.position.y,
      lighting.back.position.z
    );

    scene.add(ambientLight, mainLight, fillLight, backLight);

    return { ambientLight, mainLight, fillLight, backLight };
  }

  setupGround(scene: THREE.Scene, config: Config): THREE.Mesh {
    const { ground } = config.sceneSettings;
    const groundGeometry = new THREE.PlaneGeometry(ground.size, ground.size);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: ground.opacity });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = ground.y;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);
    return groundMesh;
  }

  // Renamed from setupRedPlane to setupVideoPlane
  setupVideoPlane(scene: THREE.Scene, config: Config): { mesh: THREE.Mesh, play: () => void } {
    const { videoPlane } = config.sceneSettings;
    const planeGeometry = new THREE.PlaneGeometry(videoPlane.size.width, videoPlane.size.height);
    
    // Create video element
    const video = document.createElement('video');
    video.src = 'assets/3d/CD_Case/twitter_crossfade.mp4';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = false;  // Disable autoplay
    
    // Create video texture
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    
    // Create simple material with video
    const planeMaterial = new THREE.MeshBasicMaterial({
      map: videoTexture,
      side: THREE.FrontSide
    });
    
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    
    // Use the same position and rotation from config
    planeMesh.position.set(
      videoPlane.position.x,
      videoPlane.position.y,
      videoPlane.position.z
    );
    
    planeMesh.rotation.set(
      videoPlane.rotation.x,
      videoPlane.rotation.y,
      videoPlane.rotation.z
    );
    
    scene.add(planeMesh);
    
    // Return both the mesh and a play function
    return {
      mesh: planeMesh,
      play: () => video.play().catch(e => console.warn('Video play failed:', e))
    };
  }

  setupBackgroundPlane(scene: THREE.Scene, config: Config): THREE.Mesh {
    const { backgroundPlane } = config.sceneSettings;
    // Create a background plane with config dimensions
    const planeGeometry = new THREE.PlaneGeometry(backgroundPlane.size.width, backgroundPlane.size.height);
    
    // Parse color values from config
    const gold = new THREE.Color(backgroundPlane.colors.gold);
    const darkGold = new THREE.Color(backgroundPlane.colors.darkGold);
    const orange = new THREE.Color(backgroundPlane.colors.orange);
    const brown = new THREE.Color(backgroundPlane.colors.brown);
    
    // Create a shader material for dynamic background
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        goldColor: { value: new THREE.Vector3(gold.r, gold.g, gold.b) },
        darkGoldColor: { value: new THREE.Vector3(darkGold.r, darkGold.g, darkGold.b) },
        orangeColor: { value: new THREE.Vector3(orange.r, orange.g, orange.b) },
        brownColor: { value: new THREE.Vector3(brown.r, brown.g, brown.b) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        uniform vec3 goldColor;
        uniform vec3 darkGoldColor;
        uniform vec3 orangeColor;
        uniform vec3 brownColor;
        varying vec2 vUv;

        // Noise function for organic patterns
        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        // Smooth noise for more natural patterns
        float smoothNoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          
          float a = noise(i);
          float b = noise(i + vec2(1.0, 0.0));
          float c = noise(i + vec2(0.0, 1.0));
          float d = noise(i + vec2(1.0, 1.0));
          
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        void main() {
          // Create flowing pattern based on time
          vec2 uv = vUv;
          float speed = 0.1;
          
          // Multiple layers of noise for rich effect
          float n1 = smoothNoise(uv * 6.0 + time * speed);
          float n2 = smoothNoise(uv * 12.0 - time * speed * 0.7);
          float n3 = smoothNoise(uv * 3.0 + time * speed * 0.3);
          
          // Combine noise layers
          float n = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
          
          // Create flowing streaks
          float streak = sin(uv.x * 20.0 + time * 0.5) * 0.5 + 0.5;
          streak *= sin(uv.y * 15.0 - time * 0.3) * 0.5 + 0.5;
          
          // Blend between colors based on noise using uniform colors
          vec3 color;
          if (n < 0.3) {
            color = mix(brownColor, darkGoldColor, n / 0.3);
          } else if (n < 0.7) {
            color = mix(darkGoldColor, goldColor, (n - 0.3) / 0.4);
          } else {
            color = mix(goldColor, orangeColor, (n - 0.7) / 0.3);
          }
          
          // Add streaks and glow
          color += streak * 0.15 * orangeColor;
          
          // Vignette effect
          float vignette = 1.0 - length((uv - 0.5) * 1.5);
          vignette = smoothstep(0.0, 0.8, vignette);
          color *= vignette;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.BackSide  // Use BackSide to show it behind the video plane
    });
    
    // Store for animation updates
    this.backgroundShaderMaterial = shaderMaterial;
    
    const planeMesh = new THREE.Mesh(planeGeometry, shaderMaterial);
    
    // Position based on config
    planeMesh.position.set(
      backgroundPlane.position.x,
      backgroundPlane.position.y,
      backgroundPlane.position.z
    );
    
    planeMesh.rotation.set(
      backgroundPlane.rotation.x,
      backgroundPlane.rotation.y,
      backgroundPlane.rotation.z
    );
    
    scene.add(planeMesh);
    return planeMesh;
  }

  // Add method to update shader animations
  updateBackgroundAnimations(): void {
    if (this.backgroundShaderMaterial) {
      // Access uniforms with bracket notation to avoid TypeScript error
      this.backgroundShaderMaterial.uniforms['time'].value = this.clock.getElapsedTime();
    }
  }

  createLightLabel(text: string): CSS2DObject {
    const div = document.createElement('div');
    div.className = 'light-label';
    div.textContent = text;
    return new CSS2DObject(div);
  }
} 