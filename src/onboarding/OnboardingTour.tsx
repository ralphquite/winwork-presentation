import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useEffect, useRef, useState, type RefObject } from 'react';

type Position = {
  left: number;
  top: number;
  width: number;
  side: 'left' | 'right' | 'bottom' | 'top';
  arrow: number;
};

type Props = {
  flowName?: string;
  totalSteps?: number;
  root: RefObject<HTMLDivElement | null>;
  target: string;
  avoidTarget?: string;
  step: number;
  title: string;
  description: string;
  action?: string;
  onAction?: () => void;
  onBack?: () => void;
  onClose: () => void;
  note?: string;
};

export function OnboardingTour({
  flowName = 'Снижение комиссии',
  totalSteps = 4,
  root,
  target,
  avoidTarget,
  step,
  title,
  description,
  action,
  onAction,
  onBack,
  onClose,
  note,
}: Props) {
  const card = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position | null>(null);

  useEffect(() => {
    const anchor = root.current?.querySelector<HTMLElement>(
      `[data-tour-target="${target}"]`,
    );
    const panel = card.current;
    if (!anchor || !panel) return;
    let frame = 0;
    let revealFrame = 0;
    anchor.dataset.tourActive = 'true';
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = anchor.getBoundingClientRect();
        const host = root.current?.getBoundingClientRect();
        if (!host) return;
        const minX = Math.max(0, host.left) + 16;
        const maxX = Math.min(window.innerWidth, host.right) - 16;
        const minY = Math.max(0, host.top) + 16;
        const maxY = Math.min(window.innerHeight, host.bottom) - 16;
        const gap = 18;
        const avoid = avoidTarget
          ? root.current
              ?.querySelector<HTMLElement>(
                `[data-tour-target="${avoidTarget}"]`,
              )
              ?.getBoundingClientRect()
          : undefined;
        const bounds = avoid ?? rect;
        const rightSpace = maxX - bounds.right - gap;
        const leftSpace = bounds.left - minX - gap;
        const onRight = rightSpace >= 264 || rightSpace > leftSpace;
        const space = onRight ? rightSpace : leftSpace;
        const minCardWidth = avoid ? 220 : 244;
        const width = Math.min(340, Math.max(minCardWidth, space), maxX - minX);
        panel.style.width = `${width}px`;
        const height = panel.getBoundingClientRect().height;
        let side: Position['side'] = onRight ? 'right' : 'left';
        let left = onRight ? bounds.right + gap : bounds.left - gap - width;
        let top = Math.max(minY, Math.min(rect.top, maxY - height));
        let arrow = Math.max(
          24,
          Math.min(height - 24, rect.top + Math.min(rect.height / 2, 42) - top),
        );
        if (space < minCardWidth) {
          side = rect.top - minY > height + gap ? 'top' : 'bottom';
          left = Math.max(minX, Math.min(rect.left, maxX - width));
          top = side === 'top' ? rect.top - height - gap : rect.bottom + gap;
          top = Math.max(minY, Math.min(top, maxY - height));
          arrow = Math.max(
            24,
            Math.min(width - 24, rect.left + rect.width / 2 - left),
          );
        }
        setPosition({ left, top, width, side, arrow });
      });
    };
    // Keep the action visible in its nearest scroller before positioning the card.
    anchor.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
      behavior: 'instant',
    });
    revealFrame = requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(anchor);
    observer.observe(panel);
    const resize = () => {
      anchor.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        behavior: 'instant',
      });
      measure();
    };
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', measure, true);
    return () => {
      delete anchor.dataset.tourActive;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(revealFrame);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', measure, true);
    };
  }, [root, target, title, avoidTarget]);

  return (
    <div
      aria-describedby="ww-tour-description"
      aria-labelledby="ww-tour-title"
      aria-modal="false"
      className={`wo-tour is-${position?.side ?? 'right'}`}
      data-tour-card="true"
      ref={card}
      role="dialog"
      style={{
        left: position?.left ?? 0,
        top: position?.top ?? 0,
        width: position?.width ?? 340,
        visibility: position ? 'visible' : 'hidden',
      }}
    >
      <span
        aria-hidden="true"
        className="wo-tour-arrow"
        style={
          position?.side === 'left' || position?.side === 'right'
            ? { top: position.arrow }
            : { left: position?.arrow }
        }
      />
      <div className="wo-tour-eyebrow">
        {flowName}{' '}
        <span>{step ? `Шаг ${step} из ${totalSteps}` : 'Первые шаги'}</span>
      </div>
      <button
        aria-label="Закрыть подсказки"
        className="wo-tour-close"
        onClick={onClose}
        type="button"
      >
        <X size={17} />
      </button>
      <h2 id="ww-tour-title">{title}</h2>
      <p id="ww-tour-description">{description}</p>
      {note ? <p className="wo-tour-note">{note}</p> : null}
      <footer>
        {onBack ? (
          <button className="wo-tour-back" onClick={onBack} type="button">
            <ArrowLeft size={15} />
            Назад
          </button>
        ) : (
          <button className="wo-tour-back" onClick={onClose} type="button">
            Позже
          </button>
        )}
        {action && onAction ? (
          <button className="wo-tour-next" onClick={onAction} type="button">
            {action}
            <ArrowRight size={15} />
          </button>
        ) : (
          <span className="wo-tour-action-note">Действуйте в интерфейсе</span>
        )}
      </footer>
      <div aria-hidden="true" className="wo-tour-progress">
        {Array.from({ length: totalSteps }, (_, index) => index + 1).map(
          (item) => (
            <span className={item <= step ? 'is-done' : ''} key={item} />
          ),
        )}
      </div>
      <span aria-live="polite" className="wo-sr-only">
        {step ? `${flowName}. Шаг ${step} из ${totalSteps}. ` : ''}
        {title}. {description}
      </span>
    </div>
  );
}
