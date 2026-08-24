import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  RotateCcw,
} from 'lucide-react';
import type { ChangeEvent } from 'react';
import { NavLink } from 'react-router-dom';

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

const trackLinks = [
  { label: 'Enterprise', path: '/enterprise' },
  { label: 'API', path: '/api' },
  { label: 'Small', path: '/small' },
] as const;

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
    <header className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3">
        <nav className="flex items-center gap-1" aria-label="Sales-маршруты">
          {trackLinks.map((track) => (
            <NavLink
              className={({ isActive }) =>
                `track-link${isActive ? ' track-link-active' : ''}`
              }
              key={track.path}
              to={track.path}
            >
              {track.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
          {import.meta.env.DEV ? (
            <span className="hidden text-xs text-slate-500 md:inline">
              {config.title} · Scene {currentIndex + 1}/{config.scenes.length} ·{' '}
              {config.scenes[currentIndex]?.id}
            </span>
          ) : null}

          <label className="sr-only" htmlFor="scene-picker">
            Перейти к сцене
          </label>
          <select
            className="control-select"
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
            className="control-button"
            disabled={currentIndex === 0}
            onClick={onPrevious}
            type="button"
          >
            <ChevronLeft aria-hidden="true" size={18} />
          </button>
          <button
            aria-label="Следующая сцена"
            className="control-button"
            disabled={currentIndex === config.scenes.length - 1}
            onClick={onNext}
            type="button"
          >
            <ChevronRight aria-hidden="true" size={18} />
          </button>
          <button
            aria-label="Начать презентацию заново"
            className="control-button"
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
            className="control-button"
            onClick={onToggleFullscreen}
            type="button"
          >
            {isFullscreen ? (
              <Minimize2 aria-hidden="true" size={17} />
            ) : (
              <Maximize2 aria-hidden="true" size={17} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
