import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

const SCREENSHOT_COUNT = 17;

export function PerformerRegistrationDemo() {
  const [screenIndex, setScreenIndex] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: 0 });
  }, [screenIndex]);

  const showPrevious = () => {
    setScreenIndex((current) => Math.max(0, current - 1));
  };

  const showNext = () => {
    setScreenIndex((current) => Math.min(SCREENSHOT_COUNT - 1, current + 1));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPrevious();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showNext();
    }
  };

  const screenNumber = screenIndex + 1;

  return (
    <div
      aria-label="Flow регистрации исполнителя"
      className="ww-screenshot-flow"
      onKeyDown={handleKeyDown}
    >
      <button
        aria-label="Предыдущий экран"
        className="ww-screenshot-flow-navigation is-previous"
        disabled={screenIndex === 0}
        onClick={showPrevious}
        type="button"
      >
        <ArrowLeft aria-hidden="true" size={22} />
      </button>

      <div
        aria-label={`Экран ${screenNumber} из ${SCREENSHOT_COUNT}. Длинный экран можно прокрутить вниз.`}
        className="ww-screenshot-flow-viewport"
        data-demo-viewport="mobile-screenshot"
        ref={viewportRef}
        tabIndex={0}
      >
        <img
          alt={`Регистрация исполнителя — экран ${screenNumber} из ${SCREENSHOT_COUNT}`}
          draggable="false"
          src={`/performer-registration-flow/${screenNumber}.png`}
        />
      </div>

      <button
        aria-label="Следующий экран"
        className="ww-screenshot-flow-navigation is-next"
        disabled={screenIndex === SCREENSHOT_COUNT - 1}
        onClick={showNext}
        type="button"
      >
        <ArrowRight aria-hidden="true" size={22} />
      </button>

      <output aria-live="polite" className="ww-screenshot-flow-counter">
        {screenNumber} / {SCREENSHOT_COUNT}
      </output>
    </div>
  );
}
