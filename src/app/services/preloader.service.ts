import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, from } from 'rxjs';
import { map } from 'rxjs/operators';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Injectable({
  providedIn: 'root'
})
export class PreloaderService {
  private loadingProgress = new BehaviorSubject<number>(0);
  private loadingComplete = new BehaviorSubject<boolean>(false);
  private totalAssets = 0;
  private loadedAssets = 0;

  // Cache storage
  private textureCache: Map<string, THREE.Texture> = new Map();
  private modelCache: Map<string, THREE.Object3D> = new Map();
  private audioCache: Map<string, AudioBuffer> = new Map();

  constructor() {}

  getLoadingProgress(): Observable<number> {
    return this.loadingProgress.asObservable();
  }

  getLoadingComplete(): Observable<boolean> {
    return this.loadingComplete.asObservable();
  }

  private updateProgress(): void {
    const progress = (this.loadedAssets / this.totalAssets) * 100;
    this.loadingProgress.next(progress);
    if (this.loadedAssets === this.totalAssets) {
      this.loadingComplete.next(true);
    }
  }

  preloadAssets(): Observable<boolean> {
    const assets = {
      textures: [
        'assets/graphic/composite.png',
        // Add other textures here
      ],
      models: [
        'assets/3d/CD_Case/CD_Case.glb',
        // Add other models here
      ],
      audio: [
        // Add audio files here
        'assets/audio/track1.mp3',
        'assets/audio/track2.mp3'
      ]
    };

    this.totalAssets = 
      assets.textures.length + 
      assets.models.length + 
      assets.audio.length;

    const textureLoads = assets.textures.map(url => this.preloadTexture(url));
    const modelLoads = assets.models.map(url => this.preloadModel(url));
    const audioLoads = assets.audio.map(url => this.preloadAudio(url));

    return forkJoin([
      ...textureLoads,
      ...modelLoads,
      ...audioLoads
    ]).pipe(
      map(() => true)
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

      const loader = new GLTFLoader();
      loader.load(
        url,
        (gltf) => {
          this.modelCache.set(url, gltf.scene);
          this.loadedAssets++;
          this.updateProgress();
          observer.next();
          observer.complete();
        },
        undefined,
        (error) => {
          console.error('Error loading model:', error);
          observer.error(error);
        }
      );
    });
  }

  private preloadAudio(url: string): Observable<void> {
    return new Observable(observer => {
      if (this.audioCache.has(url)) {
        this.loadedAssets++;
        this.updateProgress();
        observer.next();
        observer.complete();
        return;
      }

      fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
          return new AudioContext().decodeAudioData(arrayBuffer);
        })
        .then(audioBuffer => {
          this.audioCache.set(url, audioBuffer);
          this.loadedAssets++;
          this.updateProgress();
          observer.next();
          observer.complete();
        })
        .catch(error => {
          console.error('Error loading audio:', error);
          observer.error(error);
        });
    });
  }

  // Getter methods for cached assets
  getTexture(url: string): THREE.Texture | undefined {
    return this.textureCache.get(url);
  }

  getModel(url: string): THREE.Object3D | undefined {
    return this.modelCache.get(url);
  }

  getAudio(url: string): AudioBuffer | undefined {
    return this.audioCache.get(url);
  }
} 