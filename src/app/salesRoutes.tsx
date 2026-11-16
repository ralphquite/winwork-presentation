import type { RouteObject } from 'react-router-dom';

import { OnboardingPrototype } from '../onboarding/OnboardingPrototype';
import { salesPresentations } from '../presentation/config/sales';
import { Presentation } from '../presentation/engine/Presentation';
import { NotFound } from './NotFound';
import { TrackSelector } from './TrackSelector';

export function createSalesRoutes(offline = false): RouteObject[] {
  return [
    { path: '/', element: <TrackSelector offline={offline} /> },
    {
      path: '/onboarding',
      element: (
        <OnboardingPrototype
          hashPrefix={offline ? '/onboarding' : ''}
          homeHref={offline ? '#/' : undefined}
        />
      ),
    },
    ...salesPresentations.map((config) => ({
      path: `/${config.id}`,
      element: <Presentation key={config.id} config={config} />,
    })),
    { path: '*', element: <NotFound /> },
  ];
}
