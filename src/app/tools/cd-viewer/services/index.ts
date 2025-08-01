/**
 * CD Viewer services barrel export
 * Provides clean imports for all 3D viewer functionality
 */

export * from './scene.service';
export * from './animation.service';
export * from './materials.service';
export * from './events.service';

// Re-export types for external consumption
export type {
  SceneConfig,
  RenderingContext
} from './scene.service';

export type {
  AnimationQueueItem,
  AnimationConfig,
  CDCaseAnimations
} from './animation.service';

export type {
  MaterialConfig,
  ShaderUniforms
} from './materials.service';

export type {
  MouseInteraction,
  KeyboardEvent,
  TouchInteraction,
  ViewportChange
} from './events.service';