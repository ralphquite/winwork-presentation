import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';

import { DemoFlowModal } from '../flows/DemoFlowModal';
import { publicAssetDocument, publicAssetUrl } from '../publicAssetUrl';
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
  nextAction?: { label: string; onClick: () => void };
  title: string;
  width: number;
};

const nextHotspot = '[data-presentation-next]';

export function PencilSlide({
  demoFlow,
  demoFlows = [],
  documentPath,
  externalLinks = [],
  height,
  nextAction,
  title,
  width,
}: PencilSlideProps) {
  const stageRef = useRef<HTMLElement>(null);
  const documentRef = useRef<HTMLIFrameElement>(null);
  const demoTriggerRef = useRef<HTMLButtonElement>(null);
  const embeddedDocument = useMemo(
    () => publicAssetDocument(documentPath),
    [documentPath],
  );
  const [hotspotStyles, setHotspotStyles] = useState<
    Record<string, CSSProperties>
  >({});
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
    const frame = documentRef.current;
    if (!frame) return;

    let observer: ResizeObserver | undefined;
    let disposed = false;

    const observeTargets = () => {
      observer?.disconnect();
      const slideDocument = frame.contentDocument;
      const slideWindow = slideDocument?.defaultView;
      if (!slideDocument?.body || !slideWindow) return;

      const targets = Array.from(
        slideDocument.querySelectorAll<HTMLElement>(
          `[data-demo-flow], a[href], ${nextHotspot}`,
        ),
      );
      if (targets.length === 0) return;

      const updateBounds = () => {
        if (disposed) return;

        const styles: Record<string, CSSProperties> = {};

        for (const target of targets) {
          const key = target.matches(nextHotspot)
            ? nextHotspot
            : (target.dataset.demoFlow ?? target.getAttribute('href'));
          if (!key) continue;

          const bounds = target.getBoundingClientRect();
          styles[key] = {
            borderRadius:
              slideDocument.defaultView?.getComputedStyle(target).borderRadius,
            height: bounds.height,
            left: bounds.x,
            top: bounds.y,
            width: bounds.width,
          };
        }

        setHotspotStyles(styles);
      };

      updateBounds();
      // Observe iframe elements in their own rendering context.
      observer = new slideWindow.ResizeObserver(updateBounds);
      observer.observe(slideDocument.body);
      targets.forEach((target) => observer?.observe(target));
      void slideDocument.fonts.ready.then(updateBounds);
    };

    frame.addEventListener('load', observeTargets);
    observeTargets();

    return () => {
      disposed = true;
      frame.removeEventListener('load', observeTargets);
      observer?.disconnect();
    };
  }, [documentPath]);

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
          ref={documentRef}
          src={embeddedDocument ? undefined : publicAssetUrl(documentPath)}
          srcDoc={embeddedDocument}
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
              ...hotspotStyles[flow.id],
            }}
            type="button"
          />
        ))}
        {nextAction && hotspotStyles[nextHotspot] ? (
          <button
            aria-label={nextAction.label}
            className="pencil-demo-hotspot"
            onClick={nextAction.onClick}
            style={hotspotStyles[nextHotspot]}
            type="button"
          />
        ) : null}
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
              ...hotspotStyles[link.href],
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
