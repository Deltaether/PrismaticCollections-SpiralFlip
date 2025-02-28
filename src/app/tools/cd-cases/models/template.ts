import { CaseConfig } from '../../shared/interfaces';
import config from '../config/config.json';

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