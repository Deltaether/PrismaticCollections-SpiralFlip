import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { Injectable } from '@angular/core';
import { Config } from '../../../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SceneService {
  private readonly FOG_COLOR = 0x000000;
  private readonly FOG_NEAR = 10;
  private readonly FOG_FAR = 40;
  
  // Property to track if the video is currently playing
  private isVideoPlaying = false;
  
  // Add getter and setter for isVideoPlaying
  get videoPlaying(): boolean {
    return this.isVideoPlaying;
  }
  
  set videoPlaying(value: boolean) {
    this.isVideoPlaying = value;
  }
  
  // Clock for animations
  private clock = new THREE.Clock();
  
  // Store instances of shaders for animations
  private backgroundShaderMaterial: THREE.ShaderMaterial | null = null;
  
  constructor() { }

  setupScene(config: Config): THREE.Scene {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a4f);
    scene.fog = new THREE.Fog(0x1a1a4f, 10, 50);

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
    
    // First set up base orbit control properties
    controls.enableDamping = orbitControls.enableDamping;
    controls.dampingFactor = orbitControls.dampingFactor;
    controls.minDistance = orbitControls.minDistance;
    controls.maxDistance = orbitControls.maxDistance;
    controls.minPolarAngle = orbitControls.minPolarAngle;
    controls.maxPolarAngle = orbitControls.maxPolarAngle;
    
    // Then apply lock controls setting
    const lockControls = config.sceneSettings.camera.lockControls;
    
    // Set master control
    controls.enabled = !lockControls;
    
    // Set individual control properties to match
    if (lockControls) {
      // Disable all individual controls
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableRotate = false;
    } else {
      // Enable individual controls based on config
      controls.enableZoom = orbitControls.enableZoom;
      controls.enablePan = orbitControls.enablePan;
      controls.enableRotate = true;
    }

    // Set look target
    controls.target.set(
      config.sceneSettings.camera.lookAt.x,
      config.sceneSettings.camera.lookAt.y,
      config.sceneSettings.camera.lookAt.z
    );

    controls.update();
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
  setupVideoPlane(scene: THREE.Scene, config: Config): { 
    mesh: THREE.Mesh, 
    play: () => void, 
    videoTexture: THREE.VideoTexture,
    updateVideoSource: (videoPath: string) => void 
  } {
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
    
    // Function to update video source
    const updateVideoSource = (videoPath: string) => {
      // Pause current video if playing
      if (!video.paused) {
        video.pause();
      }
      
      // Update video source
      video.src = videoPath;
      
      // If video was playing before, restart it
      if (this.isVideoPlaying) {
        video.play().catch(e => console.warn('Video play failed after source update:', e));
      }
      
      // Update texture
      videoTexture.needsUpdate = true;
    };
    
    // Return the mesh, play function, videoTexture, and update function
    return {
      mesh: planeMesh,
      play: () => {
        this.isVideoPlaying = true;
        return video.play().catch(e => console.warn('Video play failed:', e));
      },
      videoTexture: videoTexture,
      updateVideoSource: updateVideoSource
    };
  }

  setupBackgroundPlane(scene: THREE.Scene, config: Config, videoTexture?: THREE.VideoTexture): THREE.Mesh {
    const { backgroundPlane } = config.sceneSettings;
    // Create a background plane with config dimensions
    const planeGeometry = new THREE.PlaneGeometry(backgroundPlane.size.width, backgroundPlane.size.height);
    
    // Define colors for medieval fantasy theme with gold and brown/orange tones
    const goldColor = new THREE.Color(0xd4af37);      // Rich gold
    const darkGoldColor = new THREE.Color(0x8b6914);  // Dark gold/bronze
    const orangeColor = new THREE.Color(0xc86400);    // Deep orange
    const brownColor = new THREE.Color(0x4d2800);     // Dark brown
    
    // Create a shader material for medieval fantasy style background with video influence
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        goldColor: { value: new THREE.Vector3(goldColor.r, goldColor.g, goldColor.b) },
        darkGoldColor: { value: new THREE.Vector3(darkGoldColor.r, darkGoldColor.g, darkGoldColor.b) },
        orangeColor: { value: new THREE.Vector3(orangeColor.r, orangeColor.g, orangeColor.b) },
        brownColor: { value: new THREE.Vector3(brownColor.r, brownColor.g, brownColor.b) },
        videoTexture: { value: videoTexture || null }
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
        uniform sampler2D videoTexture;
        varying vec2 vUv;

        // Hash function for pseudo-random values
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        // Improved noise function for organic patterns
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f); // Smooth interpolation
          
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }
        
        // Fractal Brownian Motion for rich texture
        float fbm(vec2 p) {
          float sum = 0.0;
          float amp = 0.5;
          float freq = 1.0;
          
          for(int i = 0; i < 6; i++) {
            sum += noise(p * freq) * amp;
            amp *= 0.5;
            freq *= 2.0;
          }
          
          return sum;
        }
        
        // Create flowing wave pattern
        float flowPattern(vec2 uv, float scale, float speed) {
          float t = time * speed;
          vec2 dir = vec2(1.0, 0.5);
          float pattern = fbm(uv * scale + dir * t);
          pattern = smoothstep(0.2, 0.8, pattern);
          return pattern;
        }
        
        // Create elegant curves
        float elegantCurve(vec2 uv, float scale, float thickness, float offset) {
          // Distorted sine wave pattern
          float distortion = fbm(uv * 2.0 + time * 0.05) * 0.2;
          float wave = sin(uv.x * scale + uv.y * scale * 0.5 + offset + distortion);
          return smoothstep(1.0 - thickness, 1.0, wave + 1.0);
        }
        
        // Create modern light beam effect
        float lightBeam(vec2 uv, float angle, float width, float softness) {
          // Rotate space
          float s = sin(angle);
          float c = cos(angle);
          vec2 rotatedUV = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);
          
          // Create beam with soft edges
          float beam = smoothstep(width, width + softness, abs(rotatedUV.y));
          return 1.0 - beam;
        }
        
        // Create decorative swirl
        float swirl(vec2 uv, vec2 center, float radius, float thickness, float rotation) {
          vec2 toCenter = uv - center;
          float dist = length(toCenter);
          
          // Calculate angle with rotation
          float angle = atan(toCenter.y, toCenter.x) + rotation + dist * 3.0;
          
          // Create swirl pattern
          float swirl = sin(angle * 3.0);
          return smoothstep(thickness, thickness + 0.01, swirl) * 
                 smoothstep(radius + 0.1, radius, dist) * 
                 smoothstep(0.0, radius - 0.2, dist);
        }
        
        // Sample video with blur and offset
        vec4 sampleVideoBlurred(vec2 uv, float blurAmount, vec2 offset) {
          // Apply offset and scaling to create interesting sampling area
          vec2 videoUV = uv * 0.8 + 0.1 + offset;
          
          // Multi-sample blur
          vec4 blurredColor = vec4(0.0);
          float total = 0.0;
          
          // 9-tap gaussian-like blur
          for(float x = -2.0; x <= 2.0; x += 1.0) {
            for(float y = -2.0; y <= 2.0; y += 1.0) {
              float weight = 1.0 - length(vec2(x, y)) / 3.0;
              if(weight > 0.0) {
                vec2 sampleUV = videoUV + vec2(x, y) * blurAmount / resolution;
                blurredColor += texture2D(videoTexture, sampleUV) * weight;
                total += weight;
              }
            }
          }
          
          return blurredColor / total;
        }

        void main() {
          // Base coordinates
          vec2 uv = vUv;
          
          // Sample video for reactive elements
          vec4 blurredVideo1 = sampleVideoBlurred(uv, 0.1, vec2(sin(time * 0.3) * 0.05, cos(time * 0.2) * 0.05));
          vec4 blurredVideo2 = sampleVideoBlurred(uv + 0.2, 0.15, vec2(cos(time * 0.2) * 0.05, sin(time * 0.3) * 0.05));
          
          // Extract luminance and motion from video
          float vidLuma1 = dot(blurredVideo1.rgb, vec3(0.2126, 0.7152, 0.0722));
          float vidLuma2 = dot(blurredVideo2.rgb, vec3(0.2126, 0.7152, 0.0722));
          float videoMotion = abs(vidLuma1 - vidLuma2) * 5.0; // Motion detection
          
          // Base flowing pattern influenced by video
          float flow = flowPattern(uv, 3.0, 0.1 + videoMotion * 0.2);
          
          // Create layered elegant curves
          float curvePattern = 0.0;
          for (int i = 0; i < 3; i++) {
            float offset = float(i) * 2.0 + time * 0.2;
            curvePattern += elegantCurve(uv, 10.0 + float(i) * 5.0, 0.1, offset) * (0.5 - float(i) * 0.1);
          }
          
          // Create dynamic light beams
          float beams = 0.0;
          for (int i = 0; i < 4; i++) {
            float angle = time * 0.1 + float(i) * 1.57; // 90 degrees apart, slowly rotating
            beams += lightBeam(uv - 0.5, angle, 0.1 + vidLuma1 * 0.1, 0.05) * 0.2;
          }
          
          // Create decorative swirls
          float swirlPattern = 0.0;
          vec2 swirlCenter1 = vec2(0.25 + sin(time * 0.2) * 0.1, 0.25 + cos(time * 0.3) * 0.1);
          vec2 swirlCenter2 = vec2(0.75 + cos(time * 0.25) * 0.1, 0.75 + sin(time * 0.35) * 0.1);
          
          swirlPattern += swirl(uv, swirlCenter1, 0.15 + vidLuma1 * 0.05, 0.5, time * 0.5);
          swirlPattern += swirl(uv, swirlCenter2, 0.15 + vidLuma2 * 0.05, 0.5, -time * 0.5);
          
          // Use video content to create reactive highlight nodes
          float videoNodes = 0.0;
          for (int i = 0; i < 6; i++) {
            float t = time * 0.2 + float(i);
            vec2 nodePos = vec2(
              0.5 + sin(t) * 0.4 * sin(t * 0.5),
              0.5 + cos(t) * 0.4 * sin(t * 0.7)
            );
            float nodeBrightness = 0.3 + 0.7 * sin(t * 0.5);
            
            float distToNode = length(uv - nodePos);
            float nodeSize = 0.03 + vidLuma1 * 0.02;
            
            videoNodes += smoothstep(nodeSize, nodeSize * 0.5, distToNode) * nodeBrightness;
          }
          
          // Blend different pattern elements
          float combinedPattern = flow * 0.3 + curvePattern * 0.4 + beams * (0.3 + videoMotion) + swirlPattern * 0.5;
          
          // Base color from warm gold to dark gold with flow pattern
          vec3 baseColor = mix(darkGoldColor, goldColor, flow);
          
          // Apply layered visual elements
          vec3 color = baseColor;
          
          // Add curvature highlights
          color = mix(color, goldColor * 1.2, curvePattern * 0.8);
          
          // Add light beams with video influence
          color = mix(color, orangeColor, beams * (0.5 + vidLuma1 * 0.5));
          
          // Add swirl pattern
          color = mix(color, goldColor * 1.5, swirlPattern * 0.7);
          
          // Add nodes with video influence
          color = mix(color, goldColor * 1.8, videoNodes * (0.4 + videoMotion));
          
          // Subtle video color influence (tinted to match palette)
          vec3 tintedVideoColor = blurredVideo1.rgb * vec3(1.3, 1.0, 0.6); // Warm gold tint
          color = mix(color, tintedVideoColor, videoMotion * 0.15);
          
          // Add subtle glow based on video motion
          color += goldColor * videoMotion * 0.1;
          
          // Add subtle film grain for texture
          float grain = hash(uv + time) * 0.03;
          color = mix(color, brownColor, grain);
          
          // Vignette effect - darker at the edges
          float vignette = 1.0 - length((uv - 0.5) * 1.3);
          vignette = smoothstep(0.0, 0.7, vignette);
          color = mix(brownColor, color, vignette);
          
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