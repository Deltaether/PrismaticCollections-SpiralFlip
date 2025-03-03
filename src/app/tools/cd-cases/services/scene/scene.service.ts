import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { Injectable } from '@angular/core';
import { Config, SceneSettings } from '../../../shared/interfaces';

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
  
  // Add effect toggle properties with default values
  private effectToggles = {
    continents: true,
    mountains: true,
    waves: true,
    borders: true,
    swirls: true,
    lightRays: true,
    particles: true,
    videoInfluence: true,
    bloom: true,
    filmGrain: true,
    vignette: true
  };
  
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
    pause: () => void,
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
    video.preload = 'auto';  // Preload the video data to reduce loading delays
    video.crossOrigin = 'anonymous'; // Handle cross-origin issues
    
    // Add event listeners to help with debugging
    video.addEventListener('loadeddata', () => console.log('Video loaded data'));
    video.addEventListener('error', (e) => console.error('Video error:', e));
    
    // Create video texture
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    
    // Prevent texture seams and improve quality
    videoTexture.wrapS = THREE.ClampToEdgeWrapping;
    videoTexture.wrapT = THREE.ClampToEdgeWrapping;
    videoTexture.needsUpdate = true;
    
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
    
    // Set render order to ensure proper layering
    planeMesh.renderOrder = 1; // Higher render order so it renders after the background
    
    scene.add(planeMesh);
    
    // Function to update video source
    const updateVideoSource = (videoPath: string) => {
      console.log('Updating video source to:', videoPath);
      
      // Only update if the source is different
      if (video.src.endsWith(videoPath)) {
        console.log('Video source already set to', videoPath);
        return;
      }
      
      // Pause current video if playing
      if (!video.paused) {
        video.pause();
      }
      
      // Store the previous playing state
      const wasPlaying = this.isVideoPlaying;
      
      // Add a listener for the loadeddata event
      const loadHandler = () => {
        console.log('New video loaded:', videoPath);
        videoTexture.needsUpdate = true;
        
        // If video was playing before, restart it
        if (wasPlaying) {
          video.play().catch(e => console.warn('Video play failed after source update:', e));
        }
        
        // Remove this event listener
        video.removeEventListener('loadeddata', loadHandler);
      };
      
      // Add the event listener
      video.addEventListener('loadeddata', loadHandler);
      
      // Update video source - this triggers the loading process
      video.src = videoPath;
      video.load(); // Explicitly call load to start loading the new video
    };
    
    // Return the mesh, play/pause functions, videoTexture, and update function
    return {
      mesh: planeMesh,
      play: () => {
        this.isVideoPlaying = true;
        return video.play().catch(e => console.warn('Video play failed:', e));
      },
      pause: () => {
        this.isVideoPlaying = false;
        video.pause();
      },
      videoTexture: videoTexture,
      updateVideoSource: updateVideoSource
    };
  }

  setupBackgroundPlane(scene: THREE.Scene, config: Config, videoTexture?: THREE.VideoTexture): THREE.Mesh {
    const { backgroundPlane } = config.sceneSettings;
    // Create a background plane with config dimensions
    const planeGeometry = new THREE.PlaneGeometry(backgroundPlane.size.width, backgroundPlane.size.height);
    
    // Define an updated, more sophisticated color palette that still maintains a gold theme
    const primaryGold = new THREE.Color(0xf5d884);      // Softer gold
    const secondaryGold = new THREE.Color(0xbfa26f);    // Muted antique gold
    const accentColor = new THREE.Color(0xa86d3d);      // Rich amber/copper
    const deepColor = new THREE.Color(0x453024);        // Deep umber/mahogany
    const highlightColor = new THREE.Color(0xfff4d4);   // Warm cream highlight
    
    // Create a shader material for an elegant background with video influence
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        primaryGold: { value: new THREE.Vector3(primaryGold.r, primaryGold.g, primaryGold.b) },
        secondaryGold: { value: new THREE.Vector3(secondaryGold.r, secondaryGold.g, secondaryGold.b) },
        accentColor: { value: new THREE.Vector3(accentColor.r, accentColor.g, accentColor.b) },
        deepColor: { value: new THREE.Vector3(deepColor.r, deepColor.g, deepColor.b) },
        highlightColor: { value: new THREE.Vector3(highlightColor.r, highlightColor.g, highlightColor.b) },
        videoTexture: { value: videoTexture || null },
        // Add effect toggle uniforms with default values enabled
        enableContinents: { value: this.effectToggles.continents ? 1.0 : 0.0 },
        enableMountains: { value: this.effectToggles.mountains ? 1.0 : 0.0 },
        enableWaves: { value: this.effectToggles.waves ? 1.0 : 0.0 },
        enableBorders: { value: this.effectToggles.borders ? 1.0 : 0.0 },
        enableSwirls: { value: this.effectToggles.swirls ? 1.0 : 0.0 },
        enableLightRays: { value: this.effectToggles.lightRays ? 1.0 : 0.0 },
        enableParticles: { value: this.effectToggles.particles ? 1.0 : 0.0 },
        enableVideoInfluence: { value: this.effectToggles.videoInfluence ? 1.0 : 0.0 },
        enableBloom: { value: this.effectToggles.bloom ? 1.0 : 0.0 },
        enableFilmGrain: { value: this.effectToggles.filmGrain ? 1.0 : 0.0 },
        enableVignette: { value: this.effectToggles.vignette ? 1.0 : 0.0 }
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
        uniform vec3 primaryGold;
        uniform vec3 secondaryGold;
        uniform vec3 accentColor;
        uniform vec3 deepColor;
        uniform vec3 highlightColor;
        uniform sampler2D videoTexture;
        
        // Effect toggle uniforms
        uniform float enableContinents;
        uniform float enableMountains;
        uniform float enableWaves;
        uniform float enableBorders;
        uniform float enableSwirls;
        uniform float enableLightRays;
        uniform float enableParticles;
        uniform float enableVideoInfluence;
        uniform float enableBloom;
        uniform float enableFilmGrain;
        uniform float enableVignette;
        
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
        
        // Fractal Brownian Motion for richer texture
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
        
        // Domain warping for more interesting patterns
        vec2 warp(vec2 p) {
            float d1 = fbm(p + time * 0.1);
            float d2 = fbm(p - time * 0.15);
            return p + vec2(d1, d2) * 0.3;
        }
        
        // Enhanced domain warping for continent-like shapes
        vec2 continentWarp(vec2 p) {
            // Multiple layers of warping for more natural, organic terrain shapes
            vec2 q = vec2(
                fbm(p + vec2(0.0, 0.1) + time * 0.05),
                fbm(p + vec2(0.2, 0.3) - time * 0.03)
            );
            
            vec2 r = vec2(
                fbm(p + 2.0 * q + vec2(1.7, 9.2) + time * 0.02),
                fbm(p + 2.0 * q + vec2(8.3, 2.8) - time * 0.01)
            );
            
            // Final warped coordinates
            return p + 0.5 * r;
        }
        
        // Height map for terrain elevation
        float terrainHeight(vec2 p) {
            vec2 warped = continentWarp(p * 0.5);
            float height = fbm(warped * 2.0);
            
            // Add ridges for mountain ranges
            float ridges = 1.0 - abs(0.5 - fbm(warped * 4.0)) * 2.0;
            ridges = ridges * ridges * 0.7;
            
            // Combine for final height map
            return smoothstep(0.2, 0.75, height) + ridges * 0.3;
        }
        
        // Create fantasy continent shapes
        float continentShape(vec2 uv) {
            // Scale to create larger continent forms
            vec2 scaled = uv * 1.5;
            
            // Create main landmass shape
            float terrain = terrainHeight(scaled);
            
            // Erode the edges for coastlines
            float coast = smoothstep(0.4, 0.45, terrain);
            
            // Add inner terrain details
            float details = fbm(continentWarp(scaled * 3.0)) * coast;
            
            return coast + details * 0.2;
        }
        
        // Enhanced wave pattern for more realistic ocean waves
        float wavePattern(vec2 uv, float scale, float speed) {
          // Use domain warping for more organic wave shapes
          vec2 warpedUV = warp(uv);
          float t = time * speed;
          
          // Create circular/concentric wave patterns that expand outward
          float concentricWaves = 0.0;
          for (int i = 0; i < 3; i++) {
            // Create multiple wave centers with offsets
            vec2 waveCenter = vec2(
              0.5 + 0.3 * sin(time * 0.1 + float(i) * 2.1),
              0.5 + 0.3 * cos(time * 0.15 + float(i) * 1.7)
            );
            
            // Distance from center creates circular patterns
            float dist = length(warpedUV - waveCenter) * (2.0 + float(i) * 0.5);
            
            // Create rippling circles
            float rings = 0.5 + 0.5 * sin(dist * scale - t * (0.5 + float(i) * 0.2));
            
            // Apply falloff with distance
            float falloff = smoothstep(1.0, 0.2, length(warpedUV - waveCenter) * 2.0);
            
            concentricWaves += rings * falloff * (0.5 - float(i) * 0.1);
          }
          
          // Add swirling vortex patterns
          float vortex = 0.0;
          vec2 vortexCenter = vec2(0.7, 0.3);
          float vortexDist = length(warpedUV - vortexCenter);
          float vortexAngle = atan(warpedUV.y - vortexCenter.y, warpedUV.x - vortexCenter.x);
          vortex = 0.5 + 0.5 * sin(vortexAngle * 5.0 + vortexDist * 10.0 - t * 1.5);
          vortex = smoothstep(0.0, 0.7, vortex) * smoothstep(0.8, 0.0, vortexDist);
          
          // Create cross-hatched wave lines
          float waveLinesX = 0.5 + 0.5 * sin(warpedUV.x * scale * 2.0 + t);
          float waveLinesY = 0.5 + 0.5 * sin(warpedUV.y * scale * 2.0 - t * 0.8);
          float crossLines = smoothstep(0.4, 0.6, max(waveLinesX, waveLinesY));
          
          // Create geometric wave patterns
          float geometricPattern = 0.0;
          for (int i = 0; i < 3; i++) {
            float phase = float(i) * 0.5;
            // Hex grid-like pattern
            vec2 hexUV = warpedUV * scale * (1.0 + float(i) * 0.5);
            hexUV.y *= 1.73; // Sqrt(3) for hexagonal scaling
            
            vec2 gridPos = floor(hexUV);
            vec2 gridFract = fract(hexUV);
            
            // Offset alternating rows
            if (mod(gridPos.y, 2.0) == 1.0) {
              gridFract.x = fract(gridFract.x + 0.5);
            }
            
            // Create cell patterns
            float cellPattern = length(gridFract - 0.5);
            cellPattern = smoothstep(0.3 + 0.1 * sin(time + gridPos.x * 0.3 + gridPos.y * 0.5), 
                                     0.5, 
                                     cellPattern);
            
            geometricPattern += cellPattern * (0.5 - float(i) * 0.15);
          }
          
          // Add some fractal noise detail
          float noiseDetail = fbm(warpedUV * scale * 0.5 + vec2(t * 0.2, t * 0.1)) * 0.3;
          
          // Combine all patterns with different weights
          float finalPattern = 
            concentricWaves * 0.4 + 
            vortex * 0.3 + 
            crossLines * 0.25 + 
            geometricPattern * 0.35 + 
            noiseDetail;
            
          // Normalize to keep values in expected range
          finalPattern = clamp(finalPattern, 0.0, 1.0);
          
          return finalPattern;
        }
        
        // Replace light rays with magical ley lines
        float leyLines(vec2 uv, float density, float speed) {
          float result = 0.0;
          
          // Create several ley line paths with different properties
          for(int i = 0; i < 5; i++) {
            float lineIndex = float(i);
            
            // Create curved paths using sine waves
            float curve = sin(uv.x * 2.0 + time * (0.1 + lineIndex * 0.05) + lineIndex * 3.1415) * 
                          sin(uv.y * 2.0 + time * (0.15 + lineIndex * 0.03) + lineIndex * 1.5);
            
            // Create paths that connect important "nodes" on the map
            vec2 nodeCenter = vec2(
              0.3 + lineIndex * 0.15,
              0.3 + sin(lineIndex * 0.8) * 0.4
            );
            
            // Distance to the curved path
            float dist = abs(uv.y - nodeCenter.y - curve * 0.2) / (density * (0.05 + 0.02 * sin(time * speed + lineIndex)));
            
            // Pulse effect along the ley lines
            float pulse = 0.5 + 0.5 * sin(uv.x * 10.0 + time * (1.0 + lineIndex * 0.2));
            
            // Intensity falloff with distance from line center
            float intensity = 0.03 / (dist + 0.001) * pulse;
            
            // Fade based on x position to create flowing energy
            float xFade = smoothstep(0.0, 0.2, uv.x) * smoothstep(1.0, 0.8, uv.x);
            intensity *= xFade;
            
            // Add glowing nodes at intersections
            float node = smoothstep(0.05, 0.0, length(uv - nodeCenter)) * 2.0;
            
            // Add flickering effect
            float flicker = 0.8 + 0.2 * sin(time * 5.0 + lineIndex * 10.0);
            
            result += intensity * flicker + node;
          }
          
          return min(result, 1.0) * 0.6; // Cap and scale the effect
        }
        
        // Create soft gradient swirls
        float swirl(vec2 uv, vec2 center, float radius, float intensity) {
          vec2 toCenter = uv - center;
          float dist = length(toCenter);
          
          // Angular distortion
          float angle = atan(toCenter.y, toCenter.x) + dist * intensity + time * 0.2;
          
          // Radial gradient
          float radialGradient = smoothstep(radius, radius * 0.6, dist);
          
          // Combine with smooth wave
          float wave = 0.5 + 0.5 * sin(angle * 5.0);
          
          return radialGradient * wave;
        }
        
        // Create floating particles effect
        float particles(vec2 uv) {
          float result = 0.0;
          
          // Create multiple particle layers
          for (int i = 0; i < 3; i++) {
            float speed = 0.1 + float(i) * 0.05;
            float scale = 100.0 + float(i) * 50.0;
            float timeOffset = time * speed + float(i) * 10.0;
            
            // Create particle grid and animate
            vec2 gridUV = uv * scale;
            vec2 gridPos = floor(gridUV);
            
            // Unique random properties for each particle
            float random = hash(gridPos);
            float size = 0.3 + 0.7 * hash(gridPos + 1.2);
            float particleTime = timeOffset * (0.5 + 0.5 * random);
            
            // Particle movement path
            vec2 center = gridPos + 0.5;
            center.x += 0.3 * sin(particleTime * 0.7 + random * 6.28);
            center.y += 0.3 * cos(particleTime * 0.5 + random * 6.28);
            
            // Particle glow
            float dist = length(gridUV - center);
            float glow = size * 0.5 * (0.1 / (dist + 0.01));
            
            // Fade particles in and out
            float fade = 0.5 + 0.5 * sin(particleTime);
            glow *= fade;
            
            result += glow;
          }
          
          return smoothstep(0.0, 1.0, result * 0.25); // Normalize and smooth
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
          vec4 blurredVideo1 = sampleVideoBlurred(uv, 0.1, vec2(sin(time * 0.2) * 0.05, cos(time * 0.15) * 0.05));
          vec4 blurredVideo2 = sampleVideoBlurred(uv + 0.2, 0.15, vec2(cos(time * 0.15) * 0.05, sin(time * 0.25) * 0.05));
          
          // Extract luminance and motion from video
          float vidLuma1 = dot(blurredVideo1.rgb, vec3(0.2126, 0.7152, 0.0722));
          float vidLuma2 = dot(blurredVideo2.rgb, vec3(0.2126, 0.7152, 0.0722));
          float videoMotion = abs(vidLuma1 - vidLuma2) * 3.0; // Motion detection
          
          // Generate continent shapes with toggle
          float continent = enableContinents > 0.5 ? continentShape(uv) : 0.0;
          
          // Create subtle rotating and flowing terrain details
          vec2 rotatedUV = vec2(
            uv.x * cos(time * 0.02) - uv.y * sin(time * 0.02),
            uv.x * sin(time * 0.02) + uv.y * cos(time * 0.02)
          );
          float terrainDetail = fbm(continentWarp(rotatedUV * 5.0));
          
          // Create mountain ridges and terrain variations with toggle
          float mountains = enableMountains > 0.5 ? terrainHeight(uv * 3.0 + time * 0.01) * continent : 0.0;
          
          // Base wave pattern for water/oceans with toggle
          float waves = enableWaves > 0.5 ? wavePattern(uv, 3.0, 0.05 + videoMotion * 0.1) * (1.0 - continent * 0.7) : 0.0;
          
          // Create subtle "kingdom borders" or territory lines with toggle
          float borders = 0.0;
          if (enableBorders > 0.5) {
            vec2 borderUV = continentWarp(uv * 2.0);
            // Cellular-like patterns for territory divisions
            float cellValue = fract(sin(borderUV.x * 12.0) * 43758.5453 + cos(borderUV.y * 13.0) * 93728.3462);
            float territoryEdge = smoothstep(0.02, 0.0, abs(fract(cellValue * 3.0) - 0.5) - 0.2) * 0.4;
            // Only show borders on land
            borders = territoryEdge * continent;
          }
          
          // Create layered swirls for magical elements with toggle
          float swirlPattern = 0.0;
          if (enableSwirls > 0.5) {
            swirlPattern += swirl(uv, vec2(0.3, 0.3), 0.5, 3.0) * 0.3;
            swirlPattern += swirl(uv, vec2(0.7, 0.7), 0.6, 2.0) * 0.2;
          }
          
          // Replace light rays with ley lines
          float leyLineEffect = enableLightRays > 0.5 ? leyLines(uv, 15.0, 0.3) * 0.7 : 0.0;
          
          // Add subtle particles for magical dust with toggle
          float particleEffect = enableParticles > 0.5 ? particles(uv) * (0.5 + continent * 0.5) : 0.0;
          
          // Soft vignette with toggle
          float vignette = enableVignette > 0.5 ? smoothstep(0.0, 0.7, 1.0 - length((uv - 0.5) * 1.3)) : 1.0;
          
          // Base color gradient from deep to primary gold
          vec3 baseColor = mix(deepColor, primaryGold, vignette * 0.7);
          
          // Layer visual elements for fantasy map appearance
          // Land areas
          baseColor = mix(baseColor, mix(secondaryGold, accentColor, terrainDetail), continent * 0.8);
          // Mountains and elevated terrain
          baseColor = mix(baseColor, highlightColor * 0.9, mountains * 0.6);
          // Water/ocean areas with wave patterns
          baseColor = mix(baseColor, deepColor * 0.8 + secondaryGold * 0.2, waves * (1.0 - continent * 0.8));
          // Kingdom/territory borders
          baseColor = mix(baseColor, highlightColor, borders);
          // Magical elements
          baseColor = mix(baseColor, mix(accentColor, highlightColor, 0.5), swirlPattern * 0.3);
          baseColor = mix(baseColor, vec3(0.7, 0.9, 1.0), leyLineEffect * 0.5);
          baseColor = mix(baseColor, highlightColor, particleEffect * 0.4);
          
          // Add subtle video influence for magical shimmer with toggle
          if (enableVideoInfluence > 0.5) {
            vec3 videoColor = blurredVideo1.rgb;
            float videoInfluence = videoMotion * 0.15;
            baseColor = mix(baseColor, videoColor * vec3(1.2, 1.1, 0.8), videoInfluence * continent);
          }
          
          // Add subtle bloom to bright areas with toggle
          if (enableBloom > 0.5) {
            float luminance = dot(baseColor, vec3(0.2126, 0.7152, 0.0722));
            float bloom = smoothstep(0.7, 0.9, luminance);
            baseColor += bloom * highlightColor * 0.3;
          }
          
          // Apply gentle film grain with toggle
          if (enableFilmGrain > 0.5) {
            float grain = hash(uv + time) * 0.03;
            baseColor = mix(baseColor, deepColor, grain);
          }
          
          // Final vignette
          baseColor *= vignette;
          
          gl_FragColor = vec4(baseColor, 1.0);
        }
      `,
      side: THREE.BackSide  // Use BackSide to show it behind the video plane
    });
    
    // Store the material for later updates
    this.backgroundShaderMaterial = shaderMaterial;
    
    const planeMesh = new THREE.Mesh(planeGeometry, shaderMaterial);
    
    // Position based on config
    planeMesh.position.set(
      backgroundPlane.position.x,
      backgroundPlane.position.y,
      backgroundPlane.position.z - 0.01 // Slight offset to prevent z-fighting with video plane
    );
    
    planeMesh.rotation.set(
      backgroundPlane.rotation.x,
      backgroundPlane.rotation.y,
      backgroundPlane.rotation.z
    );
    
    // Set render order to ensure proper layering
    planeMesh.renderOrder = 0; // Lower render order so it renders first
    
    scene.add(planeMesh);
    return planeMesh;
  }

  // Add method to update shader animations with smoother transitions
  updateBackgroundAnimations(): void {
    if (this.backgroundShaderMaterial) {
      // Use a consistent time update to avoid glitches
      const currentTime = this.clock.getElapsedTime();
      
      // Update the shader time uniform
      this.backgroundShaderMaterial.uniforms['time'].value = currentTime;
      
      // Force material update to ensure shader gets the latest values
      this.backgroundShaderMaterial.needsUpdate = true;
    }
  }

  // Add new methods to toggle background effects
  updateBackgroundEffects(settings: SceneSettings): void {
    if (this.backgroundShaderMaterial) {
      // Update all effect toggles based on settings
      this.effectToggles.continents = settings.bgEffectContinents;
      this.effectToggles.mountains = settings.bgEffectMountains;
      this.effectToggles.waves = settings.bgEffectWaves;
      this.effectToggles.borders = settings.bgEffectBorders;
      this.effectToggles.swirls = settings.bgEffectSwirls;
      this.effectToggles.lightRays = settings.bgEffectLightRays;
      this.effectToggles.particles = settings.bgEffectParticles;
      this.effectToggles.videoInfluence = settings.bgEffectVideoInfluence;
      this.effectToggles.bloom = settings.bgEffectBloom;
      this.effectToggles.filmGrain = settings.bgEffectFilmGrain;
      this.effectToggles.vignette = settings.bgEffectVignette;
      
      // Update shader uniforms
      this.backgroundShaderMaterial.uniforms['enableContinents'].value = this.effectToggles.continents ? 1.0 : 0.0;
      this.backgroundShaderMaterial.uniforms['enableMountains'].value = this.effectToggles.mountains ? 1.0 : 0.0;
      this.backgroundShaderMaterial.uniforms['enableWaves'].value = this.effectToggles.waves ? 1.0 : 0.0;
      this.backgroundShaderMaterial.uniforms['enableBorders'].value = this.effectToggles.borders ? 1.0 : 0.0;
      this.backgroundShaderMaterial.uniforms['enableSwirls'].value = this.effectToggles.swirls ? 1.0 : 0.0;
      this.backgroundShaderMaterial.uniforms['enableLightRays'].value = this.effectToggles.lightRays ? 1.0 : 0.0;
      this.backgroundShaderMaterial.uniforms['enableParticles'].value = this.effectToggles.particles ? 1.0 : 0.0;
      this.backgroundShaderMaterial.uniforms['enableVideoInfluence'].value = this.effectToggles.videoInfluence ? 1.0 : 0.0;
      this.backgroundShaderMaterial.uniforms['enableBloom'].value = this.effectToggles.bloom ? 1.0 : 0.0;
      this.backgroundShaderMaterial.uniforms['enableFilmGrain'].value = this.effectToggles.filmGrain ? 1.0 : 0.0;
      this.backgroundShaderMaterial.uniforms['enableVignette'].value = this.effectToggles.vignette ? 1.0 : 0.0;
      
      // Force material update
      this.backgroundShaderMaterial.needsUpdate = true;
    }
  }

  createLightLabel(text: string): CSS2DObject {
    const div = document.createElement('div');
    div.className = 'light-label';
    div.textContent = text;
    return new CSS2DObject(div);
  }
} 