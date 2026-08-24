import type { PresentationConfig } from '../engine/types';
import {
  sharedDemoPlaceholder,
  sharedFinalPlaceholder,
  sharedMediaPlaceholder,
} from './shared';

export const smallPresentation = {
  id: 'small',
  title: 'Small Business',
  scenes: [
    {
      id: 'intro',
      type: 'slide',
      title: 'Small Business intro — placeholder',
      description: 'Временная стартовая сцена маршрута Small Business.',
    },
    {
      id: 'example-slide',
      type: 'slide',
      title: 'Small Business slide — placeholder',
      description:
        'Место для будущего утверждённого содержания и дизайна из Pencil.',
    },
    sharedDemoPlaceholder,
    sharedMediaPlaceholder,
    sharedFinalPlaceholder,
  ],
} as const satisfies PresentationConfig;
