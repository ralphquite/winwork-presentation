import { useLayoutEffect, useRef, useState } from 'react';

import { DemoFlowModal } from '../flows/DemoFlowModal';
import type { DemoFlowDefinition } from '../engine/types';

type PencilSlideProps = {
  demoFlow?: DemoFlowDefinition;
  documentPath: string;
  height: number;
  title: string;
  width: number;
};

export function PencilSlide({
  demoFlow,
  documentPath,
  height,
  title,
  width,
}: PencilSlideProps) {
  const stageRef = useRef<HTMLElement>(null);
  const demoTriggerRef = useRef<HTMLButtonElement>(null);
  const [scale, setScale] = useState(0);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  useLayoutEffect(() => {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    const updateScale = () => {
      const bounds = stage.getBoundingClientRect();
      const nextScale = Math.min(bounds.width / width, bounds.height / height);
      setScale(nextScale);
    };

    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(stage);

    return () => resizeObserver.disconnect();
  }, [height, width]);

  return (
    <section aria-label={title} className="pencil-slide-stage" ref={stageRef}>
      <div
        className="pencil-slide-canvas"
        style={{
          height,
          opacity: scale === 0 ? 0 : 1,
          transform: `translate(-50%, -50%) scale(${scale})`,
          width,
        }}
      >
        <iframe
          aria-label={title}
          className="pencil-slide-document"
          height={height}
          loading="eager"
          src={documentPath}
          tabIndex={-1}
          title={title}
          width={width}
        />
        {demoFlow ? (
          <button
            aria-expanded={isDemoOpen}
            aria-haspopup="dialog"
            aria-label={demoFlow.triggerLabel}
            className="pencil-demo-hotspot"
            onClick={() => setIsDemoOpen(true)}
            ref={demoTriggerRef}
            style={{
              height: demoFlow.hotspot.height,
              left: demoFlow.hotspot.x,
              top: demoFlow.hotspot.y,
              width: demoFlow.hotspot.width,
            }}
            type="button"
          />
        ) : null}
      </div>
      {demoFlow ? (
        <DemoFlowModal
          flow={demoFlow}
          isOpen={isDemoOpen}
          onClose={() => setIsDemoOpen(false)}
          triggerRef={demoTriggerRef}
        />
      ) : null}
    </section>
  );
}
