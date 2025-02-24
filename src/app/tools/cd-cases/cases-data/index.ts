import { CaseConfig } from '../../shared/interfaces';
import config from '../config.json';
import { createCaseConfig } from './template';

// Create 8 test cases
export const allCases: CaseConfig[] = Array.from({ length: 5 }, (_, i) => 
  createCaseConfig(
    i + 1,
    `Disc ${i + 1}`,
    "An × Feryquitous"
  )
);

export const updateCasePositions = (cases: CaseConfig[]): CaseConfig[] => {
  return cases.map((caseConfig, index) => ({
    ...caseConfig,
    position: {
      ...caseConfig.position,
      y: config.caseSettings.basePosition.y + (index * config.caseSettings.stackOffset)
    }
  }));
};
