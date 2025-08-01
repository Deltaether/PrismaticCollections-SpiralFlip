import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AudioHandlerService } from './audio-handler.service';

export type UISoundType = 'click' | 'hover' | 'error' | 'success' | 'notification';

export interface UISound {
  type: UISoundType;
  src: string;
  volume?: number;
}

/**
 * Service responsible for managing UI sound effects and visual feedback
 * related to audio playback
 */
@Injectable({
  providedIn: 'root'
})
export class AudioUIService implements OnDestroy {
  // 【✓】 Service lifecycle management
  private readonly destroy$ = new Subject<void>();
  private readonly isDebugMode = true;

  // 【✓】 UI sounds configuration
  private uiSounds: Map<UISoundType, UISound> = new Map();
  private uiAudio: HTMLAudioElement | null = null;
  private uiSoundsEnabled = true;

  // 【✓】 UI states for visual feedback
  private readonly loadingStateSubject = new BehaviorSubject<boolean>(false);
  private readonly errorStateSubject = new BehaviorSubject<string | null>(null);
  private readonly visualStateSubject = new BehaviorSubject<{
    isPlaying: boolean;
    progress: number;
    buffering: boolean;
  }>({
    isPlaying: false,
    progress: 0,
    buffering: false
  });

  constructor(private audioHandler: AudioHandlerService) {
    if (this.isDebugMode) {
      console.log('[AudioUIService] Initializing UI service');
    }
    
    this.initializeUIAudio();
    this.setupAudioHandlerListeners();
  }

  // 【✓】 Initialize UI audio element
  private initializeUIAudio(): void {
    this.uiAudio = new Audio();
    
    // Configure default UI sounds
    this.registerUISound({
      type: 'click',
      src: 'assets/sounds/ui/click.mp3',
      volume: 0.5
    });
    
    this.registerUISound({
      type: 'hover',
      src: 'assets/sounds/ui/hover.mp3',
      volume: 0.3
    });
    
    this.registerUISound({
      type: 'error',
      src: 'assets/sounds/ui/error.mp3',
      volume: 0.6
    });
    
    this.registerUISound({
      type: 'success',
      src: 'assets/sounds/ui/success.mp3',
      volume: 0.5
    });
    
    this.registerUISound({
      type: 'notification',
      src: 'assets/sounds/ui/notification.mp3',
      volume: 0.4
    });
  }

  // 【✓】 Set up listeners to the audio handler events
  private setupAudioHandlerListeners(): void {
    // Listen for loading state changes
    this.audioHandler.onLoadingStateChange()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoading => {
        this.loadingStateSubject.next(isLoading);
        this.updateVisualState({ buffering: isLoading });
        
        if (this.isDebugMode) {
          console.log(`[AudioUIService] Loading state changed: ${isLoading}`);
        }
      });
    
    // Listen for playback state changes
    this.audioHandler.onPlayStateChange()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isPlaying => {
        this.updateVisualState({ isPlaying });
        
        if (this.isDebugMode) {
          console.log(`[AudioUIService] Play state changed: ${isPlaying}`);
        }
      });
    
    // Listen for audio events
    this.audioHandler.getAudioEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event.type === 'timeupdate' && event.data) {
          this.updateVisualState({ 
            progress: event.data.progress,
            buffering: false
          });
        }
        
        // Play UI sounds for certain events
        if (event.type === 'error') {
          this.playUISound('error');
          this.errorStateSubject.next(`Audio error occurred: ${event.data}`);
        }
        
        if (event.type === 'loaded') {
          this.playUISound('success');
          this.errorStateSubject.next(null);
        }
      });
    
    // Listen for errors
    this.audioHandler.getErrors()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        this.errorStateSubject.next(error.message);
        this.playUISound('error');
        
        if (this.isDebugMode) {
          console.error(`[AudioUIService] Error: ${error.type} - ${error.message}`);
        }
      });
  }

  // 【✓】 Register a UI sound
  registerUISound(sound: UISound): void {
    this.uiSounds.set(sound.type, sound);
    
    if (this.isDebugMode) {
      console.log(`[AudioUIService] Registered UI sound: ${sound.type}`);
    }
  }

  // 【✓】 Play a UI sound effect
  playUISound(type: UISoundType): void {
    if (!this.uiSoundsEnabled || !this.uiAudio) {
      return;
    }
    
    const sound = this.uiSounds.get(type);
    if (!sound) {
      if (this.isDebugMode) {
        console.warn(`[AudioUIService] UI sound not found: ${type}`);
      }
      return;
    }
    
    try {
      this.uiAudio.src = sound.src;
      this.uiAudio.volume = sound.volume || 0.5;
      this.uiAudio.play().catch(error => {
        if (this.isDebugMode) {
          console.error(`[AudioUIService] Failed to play UI sound: ${error.message}`);
        }
      });
      
      if (this.isDebugMode) {
        console.log(`[AudioUIService] Playing UI sound: ${type}`);
      }
    } catch (error: unknown) {
      if (this.isDebugMode) {
        console.error(`[AudioUIService] UI sound error: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  // 【✓】 Enable/disable UI sounds
  setUISoundsEnabled(enabled: boolean): void {
    this.uiSoundsEnabled = enabled;
    
    if (this.isDebugMode) {
      console.log(`[AudioUIService] UI sounds ${enabled ? 'enabled' : 'disabled'}`);
    }
  }

  // 【✓】 Update visual state
  private updateVisualState(partialState: Partial<{
    isPlaying: boolean;
    progress: number;
    buffering: boolean;
  }>): void {
    const currentState = this.visualStateSubject.value;
    this.visualStateSubject.next({
      ...currentState,
      ...partialState
    });
  }

  // 【✓】 Get loading state
  getLoadingState(): Observable<boolean> {
    return this.loadingStateSubject.asObservable();
  }

  // 【✓】 Get error state
  getErrorState(): Observable<string | null> {
    return this.errorStateSubject.asObservable();
  }

  // 【✓】 Get visual state for UI components
  getVisualState(): Observable<{
    isPlaying: boolean;
    progress: number;
    buffering: boolean;
  }> {
    return this.visualStateSubject.asObservable();
  }

  // 【✓】 Clear any error messages
  clearError(): void {
    this.errorStateSubject.next(null);
  }

  // 【✓】 Get current enabled state for UI sounds
  areUISoundsEnabled(): boolean {
    return this.uiSoundsEnabled;
  }

  // 【✓】 Cleanup resources
  ngOnDestroy(): void {
    if (this.isDebugMode) {
      console.log('[AudioUIService] Destroying service');
    }
    
    if (this.uiAudio) {
      this.uiAudio.pause();
      this.uiAudio.src = '';
      this.uiAudio = null;
    }
    
    // Complete all subjects
    this.loadingStateSubject.complete();
    this.errorStateSubject.complete();
    this.visualStateSubject.complete();
    
    // Signal completion to any active subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }
} 