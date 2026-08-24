import type { PresentationConfig } from '../engine/types';
import {
  sharedDemoPlaceholder,
  sharedFinalPlaceholder,
  sharedMediaPlaceholder,
} from './shared';

export const enterprisePresentation = {
  id: 'enterprise',
  title: 'Enterprise / Operations',
  scenes: [
    {
      id: 'intro',
      type: 'slide',
      title: 'Enterprise intro — placeholder',
      description:
        'Временная стартовая сцена маршрута Enterprise / Operations.',
    },
    {
      id: 'example-slide',
      type: 'slide',
      title: 'Enterprise slide — placeholder',
      description:
        'Место для будущего утверждённого содержания и дизайна из Pencil.',
    },
    sharedDemoPlaceholder,
    sharedMediaPlaceholder,
    sharedFinalPlaceholder,
  ],
} as const satisfies PresentationConfig;
