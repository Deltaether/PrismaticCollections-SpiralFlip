import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { SceneService } from './scene.service';

// Configuration interface
interface Config {
  // Add proper config properties as needed
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class SetupHelperService {

  constructor() {}

  setupRenderer(
    canvas: HTMLCanvasElement, 
    sceneService: SceneService,
    config: Config
  ): THREE.WebGLRenderer {
    // Initialize WebGL renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true, // Ensure transparency to allow our background to show
      powerPreference: 'high-performance',
      stencil: true, // Needed for post-processing
      depth: true
    });
    
    // Clear color with full transparency
    renderer.setClearColor(0x000000, 0);
    
    return renderer;
  }
}