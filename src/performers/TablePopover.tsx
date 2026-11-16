import { ArrowLeft, X } from 'lucide-react';
import { useId, useLayoutEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export function TablePopover({
  anchor,
  children,
  close,
  title,
  wide,
  back,
}: {
  anchor: HTMLButtonElement;
  children: ReactNode;
  close: (restoreFocus: boolean) => void;
  title: string;
  wide?: boolean;
  back?: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useLayoutEffect(() => {
    const element = panel.current!;
    function position() {
      const rect = anchor.getBoundingClientRect();
      const availableBelow = window.innerHeight - rect.bottom - 16;
      const availableAbove = rect.top - 16;
      const below =
        availableBelow >= Math.min(element.scrollHeight + 2, 300) ||
        availableBelow >= availableAbove;
      element.style.maxHeight = `${Math.max(112, below ? availableBelow : availableAbove)}px`;
      const width = element.offsetWidth;
      element.style.left = `${Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8))}px`;
      element.style.top = `${below ? rect.bottom + 8 : rect.top - element.offsetHeight - 8}px`;
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target;
      if (
        target instanceof Node &&
        !element.contains(target) &&
        !anchor.contains(target)
      )
        close(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close(true);
        return;
      }
      const target = event.target;
      if (!(target instanceof HTMLElement) || !element.contains(target)) return;
      const controls = [
        ...element.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input, select, [tabindex="0"]',
        ),
      ];
      if (event.key === 'Tab') {
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && (target === first || target === element)) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && target === last) {
          event.preventDefault();
          first?.focus();
        }
      }
      if (
        (event.key === 'ArrowDown' || event.key === 'ArrowUp') &&
        target.matches('button.wp-option')
      ) {
        const options = [
          ...element.querySelectorAll<HTMLButtonElement>(
            'button.wp-option:not(:disabled)',
          ),
        ];
        const index = options.indexOf(target as HTMLButtonElement);
        event.preventDefault();
        options[
          (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) %
            options.length
        ]?.focus();
      }
    }

    position();
    (
      element.querySelector<HTMLElement>('[data-initial-focus]') ?? element
    ).focus({ preventScroll: true });
    const observer = new ResizeObserver(position);
    observer.observe(element);
    window.addEventListener('resize', position);
    document.addEventListener('scroll', position, true);
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', position);
      document.removeEventListener('scroll', position, true);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [anchor, close, title]);

  return createPortal(
    <div
      aria-labelledby={titleId}
      className="wp-popover"
      data-wide={wide}
      ref={panel}
      role="dialog"
      tabIndex={-1}
    >
      <div className="wp-popover-heading">
        {back ? (
          <button
            aria-label="Назад к выбору столбца"
            className="wp-icon"
            onClick={back}
            type="button"
          >
            <ArrowLeft size={16} />
          </button>
        ) : null}
        <h2 id={titleId}>{title}</h2>
        <button
          aria-label="Закрыть настройки"
          className="wp-icon"
          onClick={() => close(true)}
          type="button"
        >
          <X size={16} />
        </button>
      </div>
      {children}
    </div>,
    document.body,
  );
}
