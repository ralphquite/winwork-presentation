import { SceneFrame } from '../../components/shared/SceneFrame';
import { PencilSlide } from '../slides/PencilSlide';
import type { SlideSceneDefinition } from '../engine/types';

type SlideSceneProps = {
  scene: SlideSceneDefinition;
};

export function SlideScene({ scene }: SlideSceneProps) {
  if (scene.pencil) {
    return (
      <PencilSlide
        documentPath={scene.pencil.documentPath}
        height={scene.pencil.height}
        title={scene.title}
        width={scene.pencil.width}
      />
    );
  }

  return (
    <SceneFrame
      description={scene.description}
      kind="Slide placeholder"
      title={scene.title}
    />
  );
}
