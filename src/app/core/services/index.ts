/**
 * Core services barrel export
 * Centralizes all core application services for clean imports
 */

// Audio services
export * from './audio';

// Phantasia data services
export { PhantasiaDataService } from './phantasia-data.service';

// Device detection
export { DeviceDetectionService } from '../../services/device-detection.service';

// Navigation services
export { ScrollHelperService } from '../../shared/services/scroll-helper.service';