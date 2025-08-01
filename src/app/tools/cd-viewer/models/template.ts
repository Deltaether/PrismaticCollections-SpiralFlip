import { CaseConfig } from '../../shared/interfaces';
import config from '../config/config.json';

/**
 * Creates a standardized CD case configuration
 * Generates properties for a new CD case with default values
 * Used as a factory method for creating multiple cases with consistent properties
 * 【✓】
 */
export const createCaseConfig = (
  id: number,
  title: string,
  artist: string
): CaseConfig => ({
  id,
  title,
  artist,
  position: { ...config.caseSettings.basePosition },
  rotation: { ...config.caseSettings.baseRotation },
  materials: { ...config.caseSettings.materials }
}); 