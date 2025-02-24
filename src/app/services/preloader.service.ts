import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, from, of } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Injectable({
  providedIn: 'root'
})
export class PreloaderService {
  private loadingProgress = new BehaviorSubject<number>(0);
  private loadingComplete = new BehaviorSubject<boolean>(false);
  private componentReady = new BehaviorSubject<boolean>(false);
  private totalAssets = 0;
  private loadedAssets = 0;

  // Cache storage
  private textureCache: Map<string, THREE.Texture> = new Map();
  private modelCache: Map<string, THREE.Object3D> = new Map();
  private audioCache: Map<string, AudioBuffer> = new Map();
  private htmlCache: Map<string, string> = new Map();

  constructor() {}

  getLoadingProgress(): Observable<number> {
    return this.loadingProgress.asObservable();
  }

  getLoadingComplete(): Observable<boolean> {
    return this.loadingComplete.asObservable();
  }

  getComponentReady(): Observable<boolean> {
    return this.componentReady.asObservable();
  }

  setComponentReady(ready: boolean) {
    this.componentReady.next(ready);
    this.checkAllComplete();
  }

  private checkAllComplete() {
    const isComplete = this.loadedAssets === this.totalAssets && this.componentReady.value;
    this.loadingComplete.next(isComplete);
  }

  private updateProgress(): void {
    const progress = (this.loadedAssets / this.totalAssets) * 100;
    this.loadingProgress.next(progress);
    this.checkAllComplete();
  }

  preloadAssets(): Observable<boolean> {
    const assets = {
      textures: [
        'assets/graphic/composite.png',
        'assets/graphic/jewel-case-_640.png',
      ],
      models: [
        'assets/3d/CD_Case/CD_Case.glb',
      ],
      audio: [
        'assets/audio/An - Incident.mp3',
        'assets/audio/Feryquitous - i can avoid it.mp3',
        'assets/audio/An - Quantum Resonance.mp3',
        'assets/audio/Feryquitous - Neural Network.mp3',
        'assets/audio/An × Feryquitous - Digital Entropy.mp3'
      ],
      components: [
        'introduction',
        'disc-one',
        'disc-two',
        'pv',
        'information',
        'music-player',
        'cd-cases'
      ]
    };

    // Count only required assets (textures, models, components)
    this.totalAssets = 
      assets.textures.length + 
      assets.models.length + 
      assets.components.length;

    const textureLoads = assets.textures.map(url => this.preloadTexture(url));
    const modelLoads = assets.models.map(url => this.preloadModel(url));
    const audioLoads = assets.audio.map(url => this.preloadAudio(url).pipe(
      catchError(error => {
        console.warn(`Audio file not found: ${url}`, error);
        return of(null);
      })
    ));
    const componentLoads = assets.components.map(component => this.preloadComponent(component));

    // Log model loading progress
    console.log('Starting model loading...');

    return forkJoin([
      forkJoin(textureLoads),
      forkJoin(modelLoads),
      forkJoin(audioLoads),
      forkJoin(componentLoads)
    ]).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error during asset loading:', error);
        return of(false);
      })
    );
  }

  private preloadTexture(url: string): Observable<void> {
    return new Observable(observer => {
      if (this.textureCache.has(url)) {
        this.loadedAssets++;
        this.updateProgress();
        observer.next();
        observer.complete();
        return;
      }

      const loader = new THREE.TextureLoader();
      loader.load(
        url,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          this.textureCache.set(url, texture);
          this.loadedAssets++;
          this.updateProgress();
          observer.next();
          observer.complete();
        },
        undefined,
        (error) => {
          console.error('Error loading texture:', error);
          observer.error(error);
        }
      );
    });
  }

  private preloadModel(url: string): Observable<void> {
    return new Observable(observer => {
      if (this.modelCache.has(url)) {
        this.loadedAssets++;
        this.updateProgress();
        observer.next();
        observer.complete();
        return;
      }

      console.log(`Loading model: ${url}`);
      const loader = new GLTFLoader();
      
      loader.load(
        url,
        (gltf) => {
          console.log(`Model loaded successfully: ${url}`);
          this.modelCache.set(url, gltf.scene.clone());
          this.loadedAssets++;
          this.updateProgress();
          observer.next();
          observer.complete();
        },
        (progress) => {
          // Log loading progress
          if (progress.lengthComputable) {
            const percentComplete = (progress.loaded / progress.total) * 100;
            console.log(`Model loading progress: ${percentComplete.toFixed(2)}%`);
          }
        },
        (error) => {
          console.error('Error loading model:', error);
          // Don't fail completely on model error, just log it
          this.loadedAssets++;
          this.updateProgress();
          observer.next();
          observer.complete();
        }
      );
    });
  }

  private preloadAudio(url: string): Observable<void> {
    return new Observable(observer => {
      if (this.audioCache.has(url)) {
        observer.next();
        observer.complete();
        return;
      }

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.arrayBuffer();
        })
        .then(arrayBuffer => {
          return new AudioContext().decodeAudioData(arrayBuffer);
        })
        .then(audioBuffer => {
          this.audioCache.set(url, audioBuffer);
          observer.next();
          observer.complete();
        })
        .catch(error => {
          console.warn(`Audio loading failed for ${url}:`, error);
          observer.error(error);
        });
    });
  }

  private preloadComponent(componentName: string): Observable<void> {
    return new Observable(observer => {
      if (this.htmlCache.has(componentName)) {
        this.loadedAssets++;
        this.updateProgress();
        observer.next();
        observer.complete();
        return;
      }

      // Simulate component preloading
      setTimeout(() => {
        this.htmlCache.set(componentName, 'loaded');
        this.loadedAssets++;
        this.updateProgress();
        observer.next();
        observer.complete();
      }, 100);
    });
  }

  // Getter methods for cached assets
  getTexture(url: string): THREE.Texture | undefined {
    return this.textureCache.get(url);
  }

  getModel(url: string): THREE.Object3D | undefined {
    const model = this.modelCache.get(url);
    return model ? model.clone() : undefined;
  }

  getAudio(url: string): AudioBuffer | undefined {
    return this.audioCache.get(url);
  }

  clearCache(): void {
    // Dispose of all cached resources
    this.textureCache.forEach(texture => texture.dispose());
    this.modelCache.forEach(model => {
      model.traverse(child => {
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
    
    this.textureCache.clear();
    this.modelCache.clear();
    this.audioCache.clear();
    this.htmlCache.clear();
  }
} 