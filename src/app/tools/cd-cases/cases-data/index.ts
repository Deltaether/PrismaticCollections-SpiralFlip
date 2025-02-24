import { CaseConfig } from '../../shared/interfaces';
import config from '../config.json';
import { discOne } from './disc-one';
import { discTwo } from './disc-two';

export const allCases: CaseConfig[] = [
  discOne,
  discTwo,
  // Add more cases here
];

export const updateCasePositions = (cases: CaseConfig[]): CaseConfig[] => {
  return cases.map((caseConfig, index) => ({
    ...caseConfig,
    position: {
      ...caseConfig.position,
      y: config.caseSettings.basePosition.y + (index * config.caseSettings.stackOffset)
    }
  }));
};
