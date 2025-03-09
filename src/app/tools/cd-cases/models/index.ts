import { CaseConfig } from '../../shared/interfaces';
import config from '../config/config.json';
import { createCaseConfig } from './template';

/**
 * Defines all CD cases used in the application
 * Creates an array of case configurations with default properties
 * Currently generates 5 test cases with sequential numbering
 * 【✓】
 */
export const allCases: CaseConfig[] = Array.from({ length: 5 }, (_, i) => 
  createCaseConfig(
    i + 1,
    `Disc ${i + 1}`,
    "An × Feryquitous"
  )
);

/**
 * Updates vertical positioning of cases in the stack
 * Applies proper Y-coordinate spacing based on config settings
 * Ensures cases are properly stacked with consistent spacing
 * 【✓】
 */
export const updateCasePositions = (cases: CaseConfig[]): CaseConfig[] => {
  return cases.map((caseConfig, index) => ({
    ...caseConfig,
    position: {
      ...caseConfig.position,
      y: config.caseSettings.basePosition.y + (index * config.caseSettings.stackOffset)
    }
  }));
};
