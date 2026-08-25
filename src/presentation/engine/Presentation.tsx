import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { PresentationControls } from './PresentationControls';
import { SceneRenderer } from './SceneRenderer';
import type { PresentationConfig } from './types';

type PresentationProps = {
  config: PresentationConfig;
};

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest('input, select, textarea, [contenteditable="true"]'),
  );
}

export function Presentation({ config }: PresentationProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [revision, setRevision] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(
    Boolean(document.fullscreenElement),
  );
  const requestedSceneId = searchParams.get('scene');

  const requestedIndex = config.scenes.findIndex(
    (scene) => scene.id === requestedSceneId,
  );
  const currentIndex = requestedIndex >= 0 ? requestedIndex : 0;

  const currentScene = config.scenes[currentIndex] ?? config.scenes[0];

  if (!currentScene) {
    throw new Error(`Presentation "${config.id}" has no scenes.`);
  }

  const serializedSearchParams = searchParams.toString();

  useEffect(() => {
    if (requestedSceneId === currentScene.id) {
      return;
    }

    const nextSearchParams = new URLSearchParams(serializedSearchParams);
    nextSearchParams.set('scene', currentScene.id);
    setSearchParams(nextSearchParams, { replace: true });
  }, [
    currentScene.id,
    requestedSceneId,
    serializedSearchParams,
    setSearchParams,
  ]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const goToScene = useCallback(
    (target: number | string, replace = false) => {
      const targetIndex =
        typeof target === 'number'
          ? Math.min(Math.max(target, 0), config.scenes.length - 1)
          : config.scenes.findIndex((scene) => scene.id === target);
      const targetScene = config.scenes[targetIndex];

      if (!targetScene || targetScene.id === currentScene.id) {
        return;
      }

      const nextSearchParams = new URLSearchParams(serializedSearchParams);
      nextSearchParams.set('scene', targetScene.id);
      setSearchParams(nextSearchParams, { replace });
    },
    [config.scenes, currentScene.id, serializedSearchParams, setSearchParams],
  );

  const goToNextScene = useCallback(() => {
    goToScene(currentIndex + 1);
  }, [currentIndex, goToScene]);

  const goToPreviousScene = useCallback(() => {
    goToScene(currentIndex - 1);
  }, [currentIndex, goToScene]);

  const toggleFullscreen = useCallback(() => {
    const fullscreenRequest = document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen();

    void fullscreenRequest.catch((error: unknown) => {
      console.warn('Fullscreen request was not completed.', error);
    });
  }, []);

  const resetPresentation = useCallback(() => {
    setRevision((currentRevision) => currentRevision + 1);
    goToScene(0);
  }, [goToScene]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isEditableTarget(event.target)
      ) {
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToNextScene();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPreviousScene();
      } else if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextScene, goToPreviousScene, toggleFullscreen]);

  return (
    <main className="presentation-shell">
      <PresentationControls
        config={config}
        currentIndex={currentIndex}
        isFullscreen={isFullscreen}
        onNext={goToNextScene}
        onPrevious={goToPreviousScene}
        onReset={resetPresentation}
        onSceneChange={goToScene}
        onToggleFullscreen={toggleFullscreen}
      />
      <SceneRenderer revision={revision} scene={currentScene} />
    </main>
  );
}
