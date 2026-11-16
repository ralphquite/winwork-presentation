import type { ReactNode } from 'react';

import type { DemoFixture } from '../../demos/fixtures/types';

type SceneBase = {
  id: string;
  title: string;
  description: string;
};

export type SlideSceneDefinition = SceneBase & {
  type: 'slide';
  demoFlow?: DemoFlowDefinition;
  demoFlows?: readonly DemoFlowDefinition[];
  externalLinks?: readonly SlideExternalLinkDefinition[];
  nextButtonLabel?: string;
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

export type SlideExternalLinkDefinition = {
  href: string;
  label: string;
  bounds: DemoFlowBounds;
};

export type DemoFlowId =
  | 'registration'
  | 'performer-registration'
  | 'performer-response'
  | 'create-object'
  | 'manager-app'
  | 'create-activity'
  | 'document-templates'
  | 'single-task'
  | 'performer-selection'
  | 'task-payment';

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

export type ComponentSceneDefinition = SceneBase & {
  type: 'component';
  content: ReactNode;
};

export type PresentationScene =
  | SlideSceneDefinition
  | DemoSceneDefinition
  | MediaSceneDefinition
  | ComponentSceneDefinition;

export type PresentationConfig = {
  id: 'enterprise' | 'api' | 'small' | 'court' | 'contracting';
  homePath?: string | null;
  title: string;
  scenes: readonly PresentationScene[];
};
