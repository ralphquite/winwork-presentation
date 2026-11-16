import { apiPresentation } from './api';
import { enterprisePresentation } from './enterprise';
import { smallPresentation } from './small';

export const salesPresentations = [
  enterprisePresentation,
  smallPresentation,
  apiPresentation,
] as const;
