import { Injectable } from '@angular/core';

// 【✓】 Type definition for UI sounds
export type UISound = 'menu-click' | 'page-turn' | 'success' | 'error';

@Injectable({
  providedIn: 'root'
})
export class UISoundService {
  private readonly isDebugMode = false;
  
  // 【✓】 UI sound paths
  private readonly uiSounds: Record<UISound, string> = {
    'menu-click': 'assets/audio/ui/menu-click.mp3',
    'page-turn': 'assets/audio/ui/page-turn.mp3',
    'success': 'assets/audio/ui/success.mp3',
    'error': 'assets/audio/ui/error.mp3'
  };

  constructor() {
    if (this.isDebugMode) {
      console.log('[UISoundService] Initialized');
    }
  }

  // 【✓】 Play a UI sound
  playUISound(soundName: UISound): void {
    if (!this.uiSounds[soundName]) {
      if (this.isDebugMode) {
        console.error(`[UISoundService] UI sound not found: ${soundName}`);
      }
      return;
    }
    
    try {
      const sound = new Audio(this.uiSounds[soundName]);
      sound.volume = 0.5;
      sound.play().catch(error => {
        if (this.isDebugMode) {
          console.error(`[UISoundService] Error playing sound: ${error}`);
        }
      });
    } catch (error) {
      if (this.isDebugMode) {
        console.error(`[UISoundService] Failed to create sound: ${error}`);
      }
    }
  }
} 