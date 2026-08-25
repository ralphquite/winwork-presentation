import {
  ChevronLeft,
  ChevronRight,
  Home,
  Maximize2,
  Minimize2,
  RotateCcw,
} from 'lucide-react';
import type { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';

import type { PresentationConfig } from './types';

type PresentationControlsProps = {
  config: PresentationConfig;
  currentIndex: number;
  isFullscreen: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
  onSceneChange: (sceneId: string) => void;
  onToggleFullscreen: () => void;
};

export function PresentationControls({
  config,
  currentIndex,
  isFullscreen,
  onNext,
  onPrevious,
  onReset,
  onSceneChange,
  onToggleFullscreen,
}: PresentationControlsProps) {
  const handleSceneChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onSceneChange(event.target.value);
  };

  return (
    <div className="presentation-control-zone">
      <header
        aria-label="Управление презентацией"
        className="presentation-controls"
      >
        <Link
          aria-label="К выбору презентаций"
          className="control-button presentation-control-button"
          to="/"
        >
          <Home aria-hidden="true" size={17} />
        </Link>

        <span className="presentation-scene-counter">
          {currentIndex + 1} / {config.scenes.length}
        </span>

        {import.meta.env.DEV ? (
          <span className="presentation-debug-label">
            {config.title} · {config.scenes[currentIndex]?.id}
          </span>
        ) : null}

        <label className="sr-only" htmlFor="scene-picker">
          Перейти к сцене
        </label>
        <select
          className="control-select presentation-scene-picker"
          id="scene-picker"
          onChange={handleSceneChange}
          value={config.scenes[currentIndex]?.id}
        >
          {config.scenes.map((scene, index) => (
            <option key={scene.id} value={scene.id}>
              {index + 1}. {scene.title}
            </option>
          ))}
        </select>

        <button
          aria-label="Предыдущая сцена"
          className="control-button presentation-control-button"
          disabled={currentIndex === 0}
          onClick={onPrevious}
          type="button"
        >
          <ChevronLeft aria-hidden="true" size={18} />
        </button>
        <button
          aria-label="Следующая сцена"
          className="control-button presentation-control-button"
          disabled={currentIndex === config.scenes.length - 1}
          onClick={onNext}
          type="button"
        >
          <ChevronRight aria-hidden="true" size={18} />
        </button>
        <button
          aria-label="Начать презентацию заново"
          className="control-button presentation-control-button"
          onClick={onReset}
          type="button"
        >
          <RotateCcw aria-hidden="true" size={17} />
        </button>
        <button
          aria-label={
            isFullscreen
              ? 'Выйти из полноэкранного режима'
              : 'Открыть во весь экран'
          }
          className="control-button presentation-control-button"
          onClick={onToggleFullscreen}
          type="button"
        >
          {isFullscreen ? (
            <Minimize2 aria-hidden="true" size={17} />
          ) : (
            <Maximize2 aria-hidden="true" size={17} />
          )}
        </button>
      </header>
    </div>
  );
}
