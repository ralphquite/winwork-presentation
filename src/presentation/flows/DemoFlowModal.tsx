import { RotateCcw, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';

import type { DemoFlowDefinition } from '../engine/types';
import { DemoProduct } from './DemoProduct';

type DemoFlowModalProps = {
  flow: DemoFlowDefinition;
  isOpen: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [contenteditable="true"], [tabindex]:not([tabindex="-1"])';

export function DemoFlowModal({
  flow,
  isOpen,
  onClose,
  triggerRef,
}: DemoFlowModalProps) {
  const [revision, setRevision] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobileFlow =
    flow.id === 'manager-app' || flow.id === 'performer-registration';
  const isScreenshotFlow = flow.id === 'performer-registration';

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const triggerElement = triggerRef.current;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      triggerElement?.focus();
    };
  }, [isOpen, triggerRef]);

  const closeDialog = () => {
    setRevision((current) => current + 1);
    onClose();
  };

  const handleDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    event.stopPropagation();

    if (event.key === 'Escape') {
      event.preventDefault();
      closeDialog();
      return;
    }

    if (event.key !== 'Tab' || !dialogRef.current) return;

    const focusableElements = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements.at(-1);

    if (!firstElement || !lastElement) return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="demo-flow-backdrop"
          data-presentation-modal="true"
          exit={{ opacity: prefersReducedMotion ? 1 : 0 }}
          initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.16 }}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            aria-labelledby={`${flow.id}-dialog-title`}
            aria-modal="true"
            className={`demo-flow-dialog${isMobileFlow ? ' is-mobile-demo' : ''}${isScreenshotFlow ? ' is-screenshot-demo' : ''}`}
            exit={{
              opacity: prefersReducedMotion ? 1 : 0,
              scale: prefersReducedMotion ? 1 : 0.99,
              y: prefersReducedMotion ? 0 : 8,
            }}
            initial={{
              opacity: prefersReducedMotion ? 1 : 0,
              scale: prefersReducedMotion ? 1 : 0.99,
              y: prefersReducedMotion ? 0 : 8,
            }}
            onKeyDown={handleDialogKeyDown}
            ref={dialogRef}
            role="dialog"
            transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
          >
            <header className="demo-flow-header">
              <div className="demo-flow-heading">
                <span>
                  {isScreenshotFlow
                    ? 'Мобильный flow по скриншотам'
                    : 'Интерактивное демо WinWork'}
                </span>
                <h2 id={`${flow.id}-dialog-title`}>{flow.title}</h2>
              </div>
              <div className="demo-flow-header-actions">
                <button
                  aria-label={
                    isScreenshotFlow
                      ? 'Вернуться к первому экрану'
                      : 'Сбросить демо'
                  }
                  className="demo-flow-icon-button"
                  onClick={() => setRevision((current) => current + 1)}
                  title={
                    isScreenshotFlow
                      ? 'Вернуться к первому экрану'
                      : 'Сбросить демо'
                  }
                  type="button"
                >
                  <RotateCcw aria-hidden="true" size={20} />
                </button>
                <button
                  aria-label="Закрыть демо"
                  className="demo-flow-icon-button"
                  onClick={closeDialog}
                  ref={closeButtonRef}
                  type="button"
                >
                  <X aria-hidden="true" size={22} />
                </button>
              </div>
            </header>
            <div className="demo-flow-stage">
              <div
                className="demo-product-app-surface"
                key={`${flow.id}-${revision}`}
              >
                <DemoProduct flowId={flow.id} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
