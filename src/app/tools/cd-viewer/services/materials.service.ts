import { Injectable } from '@angular/core';
import * as THREE from 'three';

/**
 * Consolidated materials service for CD Viewer
 * Handles material creation, shader management, and texture loading
 * Optimizes material reuse and provides consistent visual styling
 */

export interface MaterialConfig {
  readonly color?: number;
  readonly metalness?: number;
  readonly roughness?: number;
  readonly transparent?: boolean;
  readonly opacity?: number;
  readonly emissive?: number;
  readonly emissiveIntensity?: number;
}

export interface ShaderUniforms {
  time: { value: number };
  resolution: { value: THREE.Vector2 };
  [key: string]: { value: any };
}

@Injectable({
  providedIn: 'root'
})
export class MaterialsService {
  private readonly textureLoader = new THREE.TextureLoader();
  private readonly materialCache = new Map<string, THREE.Material>();
  private readonly textureCache = new Map<string, THREE.Texture>();
  
  // Default material configurations
  private readonly DEFAULT_MATERIALS = {
    cdCase: {
      color: 0x333333,
      metalness: 0.1,
      roughness: 0.8,
      transparent: false,
      opacity: 1.0
    },
    cdDisc: {
      color: 0x9999ff,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.8,
      emissive: 0x112244,
      emissiveIntensity: 0.2
    },
    highlight: {
      color: 0xffffff,
      metalness: 0.0,
      roughness: 0.0,
      transparent: true,
      opacity: 0.3,
      emissive: 0xffffff,
      emissiveIntensity: 0.5
    },
    glass: {
      color: 0xffffff,
      metalness: 0.0,
      roughness: 0.0,
      transparent: true,
      opacity: 0.1
    }
  };

  /**
   * Get or create a standard CD case material
   */
  public getCDCaseMaterial(config: Partial<MaterialConfig> = {}): THREE.MeshStandardMaterial {
    const key = `cdCase_${JSON.stringify(config)}`;
    
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key) as THREE.MeshStandardMaterial;
    }

    const finalConfig = { ...this.DEFAULT_MATERIALS.cdCase, ...config };
    const material = new THREE.MeshStandardMaterial({
      color: finalConfig.color,
      metalness: finalConfig.metalness,
      roughness: finalConfig.roughness,
      transparent: finalConfig.transparent,
      opacity: finalConfig.opacity
    });

    this.materialCache.set(key, material);
    return material;
  }

  /**
   * Get or create a CD disc material with iridescent effect
   */
  public getCDDiscMaterial(config: Partial<MaterialConfig> = {}): THREE.MeshStandardMaterial {
    const key = `cdDisc_${JSON.stringify(config)}`;
    
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key) as THREE.MeshStandardMaterial;
    }

    const finalConfig = { ...this.DEFAULT_MATERIALS.cdDisc, ...config };
    const material = new THREE.MeshStandardMaterial({
      color: finalConfig.color,
      metalness: finalConfig.metalness,
      roughness: finalConfig.roughness,
      transparent: finalConfig.transparent,
      opacity: finalConfig.opacity,
      emissive: finalConfig.emissive,
      emissiveIntensity: finalConfig.emissiveIntensity
    });

    // Add environment map for reflections if available
    const envMapTexture = this.getEnvironmentMap();
    if (envMapTexture) {
      material.envMap = envMapTexture;
      material.envMapIntensity = 1.0;
    }

    this.materialCache.set(key, material);
    return material;
  }

  /**
   * Get or create a highlight material for UI feedback
   */
  public getHighlightMaterial(config: Partial<MaterialConfig> = {}): THREE.MeshStandardMaterial {
    const key = `highlight_${JSON.stringify(config)}`;
    
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key) as THREE.MeshStandardMaterial;
    }

    const finalConfig = { ...this.DEFAULT_MATERIALS.highlight, ...config };
    const material = new THREE.MeshStandardMaterial({
      color: finalConfig.color,
      metalness: finalConfig.metalness,
      roughness: finalConfig.roughness,
      transparent: finalConfig.transparent,
      opacity: finalConfig.opacity,
      emissive: finalConfig.emissive,
      emissiveIntensity: finalConfig.emissiveIntensity
    });

    this.materialCache.set(key, material);
    return material;
  }

  /**
   * Create animated background shader material
   */
  public createBackgroundShaderMaterial(): THREE.ShaderMaterial {
    const uniforms: ShaderUniforms = {
      time: { value: 0.0 },
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float time;
      uniform vec2 resolution;
      varying vec2 vUv;
      
      // Noise function for organic movement
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      // Fractional Brownian Motion for complex patterns
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        for(int i = 0; i < 4; i++) {
          value += amplitude * noise(p * frequency);
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        return value;
      }
      
      void main() {
        vec2 uv = vUv;
        vec2 center = uv - 0.5;
        
        // Create radial gradient from center
        float dist = length(center);
        float radialGradient = 1.0 - smoothstep(0.0, 0.8, dist);
        
        // Add animated noise patterns
        float noiseValue = fbm(uv * 3.0 + time * 0.1);
        float wave1 = sin(dist * 8.0 - time * 2.0) * 0.1;
        float wave2 = cos(uv.x * 10.0 + time * 1.5) * sin(uv.y * 10.0 + time * 1.5) * 0.05;
        
        // Color palette - deep blues and purples
        vec3 color1 = vec3(0.05, 0.0, 0.2);   // Deep purple
        vec3 color2 = vec3(0.0, 0.1, 0.3);    // Deep blue
        vec3 color3 = vec3(0.1, 0.05, 0.4);   // Purple-blue
        
        // Mix colors based on patterns
        float mixFactor1 = radialGradient + noiseValue * 0.3;
        float mixFactor2 = wave1 + wave2;
        
        vec3 finalColor = mix(color1, color2, mixFactor1);
        finalColor = mix(finalColor, color3, mixFactor2 * 0.5);
        
        // Add subtle brightness variation
        finalColor *= (0.8 + noiseValue * 0.4);
        
        // Fade out towards edges
        float edgeFade = smoothstep(0.8, 1.0, dist);
        float alpha = (0.4 - edgeFade * 0.4) * radialGradient;
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    return new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide
    });
  }

  /**
   * Create glass material with realistic refraction
   */
  public getGlassMaterial(config: Partial<MaterialConfig> = {}): THREE.MeshPhysicalMaterial {
    const key = `glass_${JSON.stringify(config)}`;
    
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key) as THREE.MeshPhysicalMaterial;
    }

    const finalConfig = { ...this.DEFAULT_MATERIALS.glass, ...config };
    const material = new THREE.MeshPhysicalMaterial({
      color: finalConfig.color,
      metalness: finalConfig.metalness,
      roughness: finalConfig.roughness,
      transparent: finalConfig.transparent,
      opacity: finalConfig.opacity,
      transmission: 0.9,
      thickness: 0.1,
      ior: 1.5, // Index of refraction for glass
      clearcoat: 1.0,
      clearcoatRoughness: 0.0
    });

    this.materialCache.set(key, material);
    return material;
  }

  /**
   * Load texture with caching
   */
  public async loadTexture(url: string): Promise<THREE.Texture> {
    if (this.textureCache.has(url)) {
      return this.textureCache.get(url)!;
    }

    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        url,
        (texture) => {
          // Configure texture properties
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = true;
          
          this.textureCache.set(url, texture);
          resolve(texture);
        },
        undefined,
        (error) => {
          console.error(`Failed to load texture: ${url}`, error);
          reject(error);
        }
      );
    });
  }

  /**
   * Get environment map for reflections
   */
  private getEnvironmentMap(): THREE.Texture | null {
    // In a real implementation, you would load a proper environment map
    // For now, return null and materials will use scene lighting
    return null;
  }

  /**
   * Update shader uniforms (call in render loop)
   */
  public updateShaderUniforms(time: number): void {
    this.materialCache.forEach((material) => {
      if (material instanceof THREE.ShaderMaterial) {
        if (material.uniforms.time) {
          material.uniforms.time.value = time;
        }
        if (material.uniforms.resolution) {
          material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
        }
      }
    });
  }

  /**
   * Apply material to object and all its children
   */
  public applyMaterialToObject(object: THREE.Object3D, material: THREE.Material): void {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = material;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  /**
   * Create material variants for different states
   */
  public createMaterialVariants(baseMaterial: THREE.Material): {
    normal: THREE.Material;
    hover: THREE.Material;
    selected: THREE.Material;
  } {
    const normalMaterial = baseMaterial.clone();
    
    const hoverMaterial = baseMaterial.clone();
    if (hoverMaterial instanceof THREE.MeshStandardMaterial) {
      hoverMaterial.emissive.set(0x222222);
      hoverMaterial.emissiveIntensity = 0.2;
    }
    
    const selectedMaterial = baseMaterial.clone();
    if (selectedMaterial instanceof THREE.MeshStandardMaterial) {
      selectedMaterial.emissive.set(0x444444);
      selectedMaterial.emissiveIntensity = 0.4;
    }

    return {
      normal: normalMaterial,
      hover: hoverMaterial,
      selected: selectedMaterial
    };
  }

  /**
   * Dispose of all cached materials and textures
   */
  public dispose(): void {
    this.materialCache.forEach(material => material.dispose());
    this.materialCache.clear();
    
    this.textureCache.forEach(texture => texture.dispose());
    this.textureCache.clear();
  }
}