import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { ErrorBoundary } from '../../components/shared/ErrorBoundary';
import { DemoScene } from '../scenes/DemoScene';
import { MediaScene } from '../scenes/MediaScene';
import { SlideScene } from '../scenes/SlideScene';
import type { PresentationScene } from './types';

type SceneRendererProps = {
  onNext: () => void;
  revision: number;
  scene: PresentationScene;
};

function SceneContent({
  onNext,
  scene,
}: Pick<SceneRendererProps, 'onNext' | 'scene'>) {
  switch (scene.type) {
    case 'slide':
      return <SlideScene onNext={onNext} scene={scene} />;
    case 'demo':
      return <DemoScene scene={scene} />;
    case 'media':
      return <MediaScene scene={scene} />;
    case 'component':
      return scene.content;
  }
}

export function SceneRenderer({ onNext, revision, scene }: SceneRendererProps) {
  const prefersReducedMotion = useReducedMotion();
  const motionOffset = prefersReducedMotion ? 0 : 12;
  const motionDuration = prefersReducedMotion ? 0 : 0.18;
  const key = `${scene.id}:${revision}`;
  const content = (
    <ErrorBoundary
      fallbackTitle="Сцену не удалось отобразить"
      resetKey={scene.id}
    >
      <SceneContent onNext={onNext} scene={scene} />
    </ErrorBoundary>
  );

  return (
    <div className="min-h-0 flex-1 overflow-hidden" aria-live="polite">
      {scene.type === 'component' ? (
        // The role indicator and its corresponding product view change together.
        <div className="h-full" data-scene-id={scene.id} key={key}>
          {content}
        </div>
      ) : (
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="h-full"
            data-scene-id={scene.id}
            exit={{ opacity: prefersReducedMotion ? 1 : 0, y: -motionOffset }}
            initial={{ opacity: prefersReducedMotion ? 1 : 0, y: motionOffset }}
            key={key}
            transition={{ duration: motionDuration, ease: 'easeOut' }}
          >
            {content}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
