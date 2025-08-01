import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// 【✓】 Define interfaces for type safety
interface MenuPosition {
  readonly rightPercentage: number;
  readonly topPercentage: number;
}

interface MenuConfig {
  readonly position: MenuPosition;
  readonly isVisible: boolean;
  readonly isDraggable: boolean;
}

// 【✓】 Define error types
type MenuError = 'POSITION_ERROR' | 'CONFIG_ERROR' | 'STATE_ERROR';

@Injectable({
  providedIn: 'root'
})
export class MenuService implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly isDebugMode = true;

  // 【✓】 Default menu configuration
  private readonly DEFAULT_CONFIG: MenuConfig = {
    position: {
      rightPercentage: 20,
      topPercentage: 20
    },
    isVisible: true,
    isDraggable: true
  };

  // 【✓】 Menu state subject with proper typing
  private readonly menuStateSubject = new BehaviorSubject<MenuConfig>(this.DEFAULT_CONFIG);

  // 【✓】 Error subject with proper typing
  private readonly errorSubject = new Subject<{ type: MenuError; message: string }>();

  constructor() {
    this.loadSavedConfig();
  }

  // 【✓】 Load saved configuration
  private loadSavedConfig(): void {
    try {
      const savedConfig = localStorage.getItem('menuConfig');
      if (savedConfig) {
        const config = JSON.parse(savedConfig) as MenuConfig;
        this.validateConfig(config);
        this.menuStateSubject.next(config);
      }
    } catch (error: unknown) {
      this.handleError('CONFIG_ERROR', `Failed to load menu config: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 【✓】 Validate menu configuration
  private validateConfig(config: MenuConfig): void {
    if (!this.isValidPosition(config.position)) {
      throw new Error('Invalid menu position');
    }
    if (typeof config.isVisible !== 'boolean' || typeof config.isDraggable !== 'boolean') {
      throw new Error('Invalid menu state properties');
    }
  }

  // 【✓】 Check if position is valid
  private isValidPosition(position: MenuPosition): boolean {
    return (
      typeof position.rightPercentage === 'number' &&
      typeof position.topPercentage === 'number' &&
      position.rightPercentage >= 0 &&
      position.rightPercentage <= 100 &&
      position.topPercentage >= 0 &&
      position.topPercentage <= 100
    );
  }

  // 【✓】 Handle errors
  private handleError(type: MenuError, message: string): void {
    if (this.isDebugMode) {
      console.error(`[MenuService] ${type}: ${message}`);
    }
    this.errorSubject.next({ type, message });
  }

  // 【✓】 Update menu position
  updatePosition(rightPercentage: number, topPercentage: number): void {
    try {
      const position: MenuPosition = {
        rightPercentage: Math.max(0, Math.min(100, rightPercentage)),
        topPercentage: Math.max(0, Math.min(100, topPercentage))
      };

      const currentConfig = this.menuStateSubject.value;
      const newConfig: MenuConfig = {
        ...currentConfig,
        position
      };

      this.menuStateSubject.next(newConfig);
      this.saveConfig(newConfig);
    } catch (error: unknown) {
      this.handleError('POSITION_ERROR', `Failed to update menu position: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 【✓】 Toggle menu visibility
  toggleVisibility(): void {
    try {
      const currentConfig = this.menuStateSubject.value;
      const newConfig: MenuConfig = {
        ...currentConfig,
        isVisible: !currentConfig.isVisible
      };

      this.menuStateSubject.next(newConfig);
      this.saveConfig(newConfig);
    } catch (error: unknown) {
      this.handleError('STATE_ERROR', `Failed to toggle menu visibility: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 【✓】 Toggle menu draggability
  toggleDraggable(): void {
    try {
      const currentConfig = this.menuStateSubject.value;
      const newConfig: MenuConfig = {
        ...currentConfig,
        isDraggable: !currentConfig.isDraggable
      };

      this.menuStateSubject.next(newConfig);
      this.saveConfig(newConfig);
    } catch (error: unknown) {
      this.handleError('STATE_ERROR', `Failed to toggle menu draggability: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 【✓】 Save configuration to localStorage
  private saveConfig(config: MenuConfig): void {
    try {
      localStorage.setItem('menuConfig', JSON.stringify(config));
    } catch (error: unknown) {
      this.handleError('CONFIG_ERROR', `Failed to save menu config: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 【✓】 Get current menu configuration
  getConfig(): MenuConfig {
    return this.menuStateSubject.value;
  }

  // 【✓】 Get menu configuration observable
  getMenuConfig(): Observable<MenuConfig> {
    return this.menuStateSubject.asObservable();
  }

  // 【✓】 Get error stream
  getErrors(): Observable<{ type: MenuError; message: string }> {
    return this.errorSubject.asObservable();
  }

  // 【✓】 Reset to default configuration
  resetConfig(): void {
    try {
      this.menuStateSubject.next(this.DEFAULT_CONFIG);
      this.saveConfig(this.DEFAULT_CONFIG);
    } catch (error: unknown) {
      this.handleError('CONFIG_ERROR', `Failed to reset menu config: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 【✓】 Cleanup resources
  ngOnDestroy(): void {
    if (this.isDebugMode) {
      console.log('[MenuService] Destroying service');
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
} 