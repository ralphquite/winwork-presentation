import { useLayoutEffect, useRef, useState } from 'react';

import { DemoFlowModal } from '../flows/DemoFlowModal';
import type {
  DemoFlowDefinition,
  SlideExternalLinkDefinition,
} from '../engine/types';

type PencilSlideProps = {
  demoFlow?: DemoFlowDefinition;
  demoFlows?: readonly DemoFlowDefinition[];
  documentPath: string;
  externalLinks?: readonly SlideExternalLinkDefinition[];
  height: number;
  title: string;
  width: number;
};

export function PencilSlide({
  demoFlow,
  demoFlows = [],
  documentPath,
  externalLinks = [],
  height,
  title,
  width,
}: PencilSlideProps) {
  const stageRef = useRef<HTMLElement>(null);
  const demoTriggerRef = useRef<HTMLButtonElement>(null);
  const [scale, setScale] = useState(0);
  const [activeFlowId, setActiveFlowId] = useState<
    DemoFlowDefinition['id'] | null
  >(null);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const availableDemoFlows = demoFlow ? [demoFlow, ...demoFlows] : demoFlows;
  const activeFlow = availableDemoFlows.find(
    (flow) => flow.id === activeFlowId,
  );

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
        {availableDemoFlows.map((flow) => (
          <button
            aria-expanded={isDemoOpen && activeFlowId === flow.id}
            aria-haspopup="dialog"
            aria-label={flow.triggerLabel}
            className="pencil-demo-hotspot"
            key={flow.id}
            onClick={(event) => {
              demoTriggerRef.current = event.currentTarget;
              setActiveFlowId(flow.id);
              setIsDemoOpen(true);
            }}
            style={{
              height: flow.hotspot.height,
              left: flow.hotspot.x,
              top: flow.hotspot.y,
              width: flow.hotspot.width,
            }}
            type="button"
          />
        ))}
        {externalLinks.map((link) => (
          <a
            aria-label={link.label}
            className="pencil-external-hotspot"
            href={link.href}
            key={link.href}
            rel="noreferrer"
            style={{
              height: link.bounds.height,
              left: link.bounds.x,
              top: link.bounds.y,
              width: link.bounds.width,
            }}
            target="_blank"
          />
        ))}
      </div>
      {activeFlow ? (
        <DemoFlowModal
          flow={activeFlow}
          isOpen={isDemoOpen}
          onClose={() => setIsDemoOpen(false)}
          triggerRef={demoTriggerRef}
        />
      ) : null}
    </section>
  );
}
