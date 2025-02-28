import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class CDCaseMaterialsService {
  setupMaterials(model: THREE.Object3D, caseConfig: any): void {
    model.traverse((node: THREE.Object3D) => {
      if (node instanceof THREE.Mesh && node.name === 'CD') {
        if (Array.isArray(node.material)) {
          node.material = node.material.map((mat, index) => {
            const matConfig = caseConfig.materials.cd[index];
            const clonedMat = mat.clone();
            Object.assign(clonedMat, {
              metalness: Math.min(matConfig.metalness, 0.6),  // Reduce metalness
              roughness: Math.max(matConfig.roughness, 0.4),  // Increase roughness
              envMapIntensity: Math.min(matConfig.envMapIntensity * 0.5, 1.0),  // Reduce environment map influence
              transparent: false,
              depthWrite: true,
              depthTest: true,
              side: THREE.DoubleSide
            });
            if ('clearcoat' in clonedMat && matConfig.clearcoat !== undefined) {
              clonedMat.clearcoat = Math.min(matConfig.clearcoat * 0.7, 0.7);  // Reduce clearcoat
              clonedMat.clearcoatRoughness = Math.max(matConfig.clearcoatRoughness, 0.3);  // Increase clearcoat roughness
            }
            clonedMat.needsUpdate = true;
            return clonedMat;
          });
        }
      }
    });
  }

  setupEnvironmentMap(scene: THREE.Scene, renderer: THREE.WebGLRenderer, texture: THREE.Texture): void {
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    
    // Create a custom post-processing shader to add red tint
    const tintShader = {
      uniforms: {
        tDiffuse: { value: texture },
        tintColor: { value: new THREE.Color(1.1, 0.9, 0.9) }, // Subtle red tint
        tintIntensity: { value: 0.3 } // Adjust intensity of the tint
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec3 tintColor;
        uniform float tintIntensity;
        varying vec2 vUv;
        
        void main() {
          vec4 texel = texture2D(tDiffuse, vUv);
          vec3 tinted = mix(texel.rgb, texel.rgb * tintColor, tintIntensity);
          gl_FragColor = vec4(tinted, texel.a);
        }
      `
    };

    // Create a temporary scene and camera for post-processing
    const tempScene = new THREE.Scene();
    const tempCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    // Create a plane with the tinted shader
    const material = new THREE.ShaderMaterial(tintShader);
    const plane = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(plane, material);
    tempScene.add(quad);

    // Render to a target
    const renderTarget = new THREE.WebGLRenderTarget(
      texture.image.width,
      texture.image.height,
      {
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType
      }
    );

    // Render the tinted texture
    renderer.setRenderTarget(renderTarget);
    renderer.render(tempScene, tempCamera);
    renderer.setRenderTarget(null);

    // Create environment map from the tinted texture
    const tintedTexture = renderTarget.texture;
    tintedTexture.colorSpace = THREE.SRGBColorSpace;
    
    // Set up tone mapping
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;

    // Generate environment map
    const envMap = pmremGenerator.fromEquirectangular(tintedTexture).texture;
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envMap;

    // Clean up
    texture.dispose();
    tintedTexture.dispose();
    renderTarget.dispose();
    material.dispose();
    plane.dispose();
    pmremGenerator.dispose();
  }
} 