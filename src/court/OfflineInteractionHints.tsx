import { useEffect } from 'react';

const INTERACTIVE_SELECTOR =
  'button, a, input, select, textarea, [role="button"], [role="tab"], [contenteditable="true"]';
const HINT_TARGET_SELECTOR =
  '[data-demo-action]:not(:disabled), [data-offline-hint-target="true"]:not(:disabled)';
const HINT_DURATION_MS = 1900;

function isVisible(element: HTMLElement) {
  const bounds = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);

  return (
    bounds.width > 0 &&
    bounds.height > 0 &&
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    element.getAttribute('aria-disabled') !== 'true'
  );
}

export function OfflineInteractionHints() {
  useEffect(() => {
    const cleanupTimers = new Map<HTMLElement, number>();

    const clearHints = () => {
      cleanupTimers.forEach((timer, target) => {
        window.clearTimeout(timer);
        target.classList.remove('offline-action-hint');
      });
      cleanupTimers.clear();
    };

    const highlightTargets = (scope: Element) => {
      const targets = Array.from(
        scope.querySelectorAll<HTMLElement>(HINT_TARGET_SELECTOR),
      ).filter(isVisible);

      for (const target of targets) {
        target.classList.add('offline-action-hint');
        cleanupTimers.set(
          target,
          window.setTimeout(() => {
            target.classList.remove('offline-action-hint');
            cleanupTimers.delete(target);
          }, HINT_DURATION_MS),
        );
      }

      return targets.length > 0;
    };

    const handleClick = (event: MouseEvent) => {
      clearHints();
      const target = event.target;

      if (
        !(target instanceof Element) ||
        target.closest(INTERACTIVE_SELECTOR)
      ) {
        return;
      }

      const dialog = document.querySelector('.demo-flow-dialog');

      if (
        !dialog ||
        !dialog.contains(target) ||
        dialog.querySelector('[data-offline-hints="off"]')
      ) {
        return;
      }

      const scope =
        dialog.querySelector('.ww-selection-reviews-drawer') ??
        dialog.querySelector('.ww-product-modal') ??
        dialog.querySelector('.ww-payment-drawer') ??
        dialog.querySelector('.ww-drawer') ??
        dialog;

      if (!highlightTargets(scope)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
      clearHints();
    };
  }, []);

  return null;
}
