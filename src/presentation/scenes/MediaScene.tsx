import { Play } from 'lucide-react';

import { SceneFrame } from '../../components/shared/SceneFrame';
import type { MediaSceneDefinition } from '../engine/types';

type MediaSceneProps = {
  scene: MediaSceneDefinition;
};

export function MediaScene({ scene }: MediaSceneProps) {
  return (
    <SceneFrame
      description={scene.description}
      kind="Media placeholder"
      title={scene.title}
    >
      <div className="flex aspect-video max-w-2xl items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-100 text-slate-500">
        <div className="text-center">
          <Play
            aria-hidden="true"
            className="mx-auto"
            size={36}
            strokeWidth={1.5}
          />
          <p className="mt-3 text-sm">Asset type: {scene.mediaKind}</p>
        </div>
      </div>
    </SceneFrame>
  );
}
