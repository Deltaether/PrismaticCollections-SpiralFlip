import { CaseConfig } from '../../shared/interfaces';
import config from '../config/config.json';
import { createCaseConfig } from './template';

/**
 * Defines all CD cases used in the application
 * Creates an array of case configurations with custom titles and artists
 * Each case represents a different album release
 * 【✓】
 */
export const allCases: CaseConfig[] = Array.from({ length: 5 }, (_, i) => {
  // Define custom titles and artists for each CD case
  const titles = [
    "Phantasia",
    "Xronixle",
    "Fractalizer",
    "Serenism",
    "Archetype Engine"
  ];
  
  const artists = [
    "An × Feryquitous",
    "Feryquitous",
    "Voidheart",
    "Team Grimoire",
    "Sound Souler"
  ];
  
  return createCaseConfig(
    i + 1,
    titles[i],
    artists[i]
  );
});

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
