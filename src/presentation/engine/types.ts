import type { DemoFixture } from '../../demos/fixtures/types';

type SceneBase = {
  id: string;
  title: string;
  description: string;
};

export type SlideSceneDefinition = SceneBase & {
  type: 'slide';
  demoFlow?: DemoFlowDefinition;
  pencil?: {
    documentPath: string;
    frameId: string;
    height: 1080;
    width: 1920;
  };
};

export type DemoFlowBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type DemoFlowId =
  | 'create-object'
  | 'manager-app'
  | 'create-activity'
  | 'document-templates'
  | 'single-task';

export type DemoFlowDefinition = {
  id: DemoFlowId;
  title: string;
  triggerLabel: string;
  hotspot: DemoFlowBounds;
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
