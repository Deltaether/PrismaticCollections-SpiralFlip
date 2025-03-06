import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { Config, SceneSettings } from '../../../shared/interfaces';
import { vertexShader, fragmentShader } from './background-plane-shaders';

@Injectable({
  providedIn: 'root'
})
export class SceneEffectsService {
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
      vertexShader,
      fragmentShader,
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
} 