import type { PresentationConfig } from '../engine/types';
import {
  sharedDemoPlaceholder,
  sharedFinalPlaceholder,
  sharedMediaPlaceholder,
} from './shared';

export const apiPresentation = {
  id: 'api',
  title: 'API / Embedded',
  scenes: [
    {
      id: 'intro',
      type: 'slide',
      title: 'API intro — placeholder',
      description: 'Временная стартовая сцена маршрута API / Embedded.',
    },
    {
      id: 'architecture-placeholder',
      type: 'slide',
      title: 'Architecture slide — placeholder',
      description:
        'Место для будущей утверждённой схемы без преждевременных product claims.',
    },
    sharedDemoPlaceholder,
    sharedMediaPlaceholder,
    sharedFinalPlaceholder,
  ],
} as const satisfies PresentationConfig;
