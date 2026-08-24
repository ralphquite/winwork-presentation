import { RotateCcw } from 'lucide-react';
import { useState } from 'react';

import { SceneFrame } from '../../components/shared/SceneFrame';
import type { DemoSceneDefinition } from '../engine/types';

type DemoSceneProps = {
  scene: DemoSceneDefinition;
};

export function DemoScene({ scene }: DemoSceneProps) {
  const [currentStep, setCurrentStep] = useState(scene.fixture.initialStep);
  const activeStep = scene.fixture.steps[currentStep];

  return (
    <SceneFrame
      description={scene.description}
      kind="Demo placeholder"
      title={scene.title}
    >
      <div className="max-w-xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">
          Synthetic fixture: {scene.fixture.id}
        </p>
        <p className="mt-3 text-lg font-medium text-slate-950">
          {activeStep?.label ?? 'Шаг не найден'}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {scene.fixture.steps.map((step, index) => (
            <button
              aria-pressed={currentStep === index}
              className="control-button"
              key={step.id}
              onClick={() => setCurrentStep(index)}
              type="button"
            >
              {index + 1}
            </button>
          ))}
          <button
            className="control-button"
            onClick={() => setCurrentStep(scene.fixture.initialStep)}
            type="button"
          >
            <RotateCcw aria-hidden="true" size={16} />
            Reset demo
          </button>
        </div>
      </div>
    </SceneFrame>
  );
}
