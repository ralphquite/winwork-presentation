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

export type PresentationScenePicker = {
  label: string;
  options: readonly { id: string; label: string }[];
  value: string;
};

export type PresentationControlsProps = {
  config: PresentationConfig;
  controlsVariant: 'default' | 'offline-court' | 'always-visible';
  currentIndex: number;
  isFullscreen: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
  onSceneChange: (sceneId: string) => void;
  onToggleFullscreen: () => void;
  scenePicker?: PresentationScenePicker;
};

export function PresentationControls({
  config,
  controlsVariant,
  currentIndex,
  isFullscreen,
  onNext,
  onPrevious,
  onReset,
  onSceneChange,
  onToggleFullscreen,
  scenePicker,
}: PresentationControlsProps) {
  const homePath = config.homePath === undefined ? '/' : config.homePath;
  const handleSceneChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onSceneChange(event.target.value);
  };

  if (controlsVariant === 'offline-court') {
    return (
      <nav
        aria-label="Управление офлайн-презентацией"
        className="presentation-offline-controls"
      >
        <button
          aria-label="Предыдущий слайд"
          className="control-button presentation-control-button"
          disabled={currentIndex === 0}
          onClick={onPrevious}
          title="Предыдущий слайд"
          type="button"
        >
          <ChevronLeft aria-hidden="true" size={21} />
        </button>
        <button
          aria-label="Следующий слайд"
          className="control-button presentation-control-button"
          disabled={currentIndex === config.scenes.length - 1}
          onClick={onNext}
          title="Следующий слайд"
          type="button"
        >
          <ChevronRight aria-hidden="true" size={21} />
        </button>
        <button
          aria-label="Вернуться на первый слайд"
          className="control-button presentation-control-button"
          onClick={onReset}
          title="На первый слайд"
          type="button"
        >
          <RotateCcw aria-hidden="true" size={19} />
        </button>
      </nav>
    );
  }

  const alwaysVisible = controlsVariant === 'always-visible';
  const fullscreenLabel = isFullscreen
    ? 'Выйти из полноэкранного режима'
    : 'Открыть во весь экран';
  const fullscreenButton = (
    <button
      aria-label={fullscreenLabel}
      className={
        alwaysVisible
          ? 'control-button presentation-control-button'
          : 'presentation-fullscreen-corner-button'
      }
      onClick={onToggleFullscreen}
      title={fullscreenLabel}
      type="button"
    >
      {isFullscreen ? (
        <Minimize2 aria-hidden="true" size={16} />
      ) : (
        <Maximize2 aria-hidden="true" size={16} />
      )}
    </button>
  );
  const options =
    scenePicker?.options ??
    config.scenes.map(({ id, title }, index) => ({
      id,
      label: `${index + 1}. ${title}`,
    }));

  return (
    <>
      {!alwaysVisible ? (
        <>
          <span
            aria-label={`Слайд ${currentIndex + 1} из ${config.scenes.length}`}
            className="presentation-slide-number"
          >
            {currentIndex + 1}/{config.scenes.length}
          </span>
          {fullscreenButton}
        </>
      ) : null}
      <div className="presentation-control-zone">
        <nav
          aria-label="Управление презентацией"
          className="presentation-controls"
        >
          {homePath ? (
            <Link
              aria-label="К выбору презентаций"
              className="control-button presentation-control-button"
              to={homePath}
            >
              <Home aria-hidden="true" size={17} />
            </Link>
          ) : null}

          <span className="presentation-scene-counter">
            {currentIndex + 1} / {config.scenes.length}
          </span>

          {import.meta.env.DEV ? (
            <span className="presentation-debug-label">
              {config.title} · {config.scenes[currentIndex]?.id}
            </span>
          ) : null}

          <label className="sr-only" htmlFor="scene-picker">
            {scenePicker?.label ?? 'Перейти к сцене'}
          </label>
          <select
            className="control-select presentation-scene-picker"
            id="scene-picker"
            onChange={handleSceneChange}
            value={scenePicker?.value ?? config.scenes[currentIndex]?.id}
          >
            {options.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
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
          {alwaysVisible ? fullscreenButton : null}
        </nav>
      </div>
    </>
  );
}
