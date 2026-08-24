import type { DemoFixture } from './types';

export const exampleDemoFixture = {
  id: 'synthetic-demo-placeholder',
  initialStep: 0,
  steps: [
    { id: 'placeholder-a', label: 'Локальный шаг A' },
    { id: 'placeholder-b', label: 'Локальный шаг B' },
    { id: 'placeholder-c', label: 'Локальный шаг C' },
  ],
} as const satisfies DemoFixture;
