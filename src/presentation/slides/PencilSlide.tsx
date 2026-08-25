import { useLayoutEffect, useRef, useState } from 'react';

type PencilSlideProps = {
  documentPath: string;
  height: number;
  title: string;
  width: number;
};

export function PencilSlide({
  documentPath,
  height,
  title,
  width,
}: PencilSlideProps) {
  const stageRef = useRef<HTMLElement>(null);
  const [scale, setScale] = useState(0);

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
      </div>
    </section>
  );
}
