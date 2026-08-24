import { exampleDemoFixture } from '../../demos/fixtures/exampleDemo';
import type {
  DemoSceneDefinition,
  MediaSceneDefinition,
  SlideSceneDefinition,
} from '../engine/types';

export const sharedDemoPlaceholder = {
  id: 'example-demo',
  type: 'demo',
  title: 'Интерактивная demo-сцена — placeholder',
  description:
    'Временная локальная сцена проверяет изолированное и сбрасываемое состояние без backend и реальных данных.',
  fixture: exampleDemoFixture,
} as const satisfies DemoSceneDefinition;

export const sharedMediaPlaceholder = {
  id: 'media-placeholder',
  type: 'media',
  title: 'Media-сцена — placeholder',
  description: 'Здесь позже появится утверждённый видео- или animation-asset.',
  mediaKind: 'video',
} as const satisfies MediaSceneDefinition;

export const sharedFinalPlaceholder = {
  id: 'final',
  type: 'slide',
  title: 'Финальная сцена — placeholder',
  description:
    'Временная точка завершения маршрута. Sales-текст будет добавлен отдельно.',
} as const satisfies SlideSceneDefinition;
