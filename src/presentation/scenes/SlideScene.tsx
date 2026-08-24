import { SceneFrame } from '../../components/shared/SceneFrame';
import type { SlideSceneDefinition } from '../engine/types';

type SlideSceneProps = {
  scene: SlideSceneDefinition;
};

export function SlideScene({ scene }: SlideSceneProps) {
  return (
    <SceneFrame
      description={scene.description}
      kind="Slide placeholder"
      title={scene.title}
    />
  );
}
