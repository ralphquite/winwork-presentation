import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { ErrorBoundary } from '../../components/shared/ErrorBoundary';
import { DemoScene } from '../scenes/DemoScene';
import { MediaScene } from '../scenes/MediaScene';
import { SlideScene } from '../scenes/SlideScene';
import type { PresentationScene } from './types';

type SceneRendererProps = {
  revision: number;
  scene: PresentationScene;
};

function SceneContent({ scene }: { scene: PresentationScene }) {
  switch (scene.type) {
    case 'slide':
      return <SlideScene scene={scene} />;
    case 'demo':
      return <DemoScene scene={scene} />;
    case 'media':
      return <MediaScene scene={scene} />;
  }
}

export function SceneRenderer({ revision, scene }: SceneRendererProps) {
  const prefersReducedMotion = useReducedMotion();
  const motionOffset = prefersReducedMotion ? 0 : 12;
  const motionDuration = prefersReducedMotion ? 0 : 0.18;

  return (
    <div className="min-h-0 flex-1 overflow-auto" aria-live="polite">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="h-full min-h-[28rem]"
          exit={{ opacity: prefersReducedMotion ? 1 : 0, y: -motionOffset }}
          initial={{ opacity: prefersReducedMotion ? 1 : 0, y: motionOffset }}
          key={`${scene.id}:${revision}`}
          transition={{ duration: motionDuration, ease: 'easeOut' }}
        >
          <ErrorBoundary
            fallbackTitle="Сцену не удалось отобразить"
            resetKey={scene.id}
          >
            <SceneContent scene={scene} />
          </ErrorBoundary>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
