import type { DemoFixture } from '../../demos/fixtures/types';

type SceneBase = {
  id: string;
  title: string;
  description: string;
};

export type SlideSceneDefinition = SceneBase & {
  type: 'slide';
  pencil?: {
    documentPath: string;
    frameId: string;
    height: 1080;
    width: 1920;
  };
};

export type DemoSceneDefinition = SceneBase & {
  type: 'demo';
  fixture: DemoFixture;
};

export type MediaSceneDefinition = SceneBase & {
  type: 'media';
  mediaKind: 'video' | 'animation' | 'mobile';
};

export type PresentationScene =
  SlideSceneDefinition | DemoSceneDefinition | MediaSceneDefinition;

export type PresentationConfig = {
  id: 'enterprise' | 'api' | 'small';
  title: string;
  scenes: readonly PresentationScene[];
};
