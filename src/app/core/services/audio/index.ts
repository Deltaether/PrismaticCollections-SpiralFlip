/**
 * Consolidated audio services barrel export
 * Provides clean imports for all audio-related functionality
 */

export * from './audio.service';

// Re-export types for external consumption
export type {
  Track,
  AudioState,
  AudioEvent,
  Section,
  AudioError,
  UISound,
  TrackEvent
} from './audio.service';