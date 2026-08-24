import type { ReactNode } from 'react';

type SceneFrameProps = {
  children?: ReactNode;
  description: string;
  kind: string;
  title: string;
};

export function SceneFrame({
  children,
  description,
  kind,
  title,
}: SceneFrameProps) {
  return (
    <article className="mx-auto flex h-full w-full max-w-5xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
        {kind}
      </p>
      <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      <p className="mt-6 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
        {description}
      </p>
      {children ? <div className="mt-10">{children}</div> : null}
    </article>
  );
}
