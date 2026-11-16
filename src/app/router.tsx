import { createBrowserRouter } from 'react-router-dom';

import { courtPresentation } from '../presentation/config/court';
import { Presentation } from '../presentation/engine/Presentation';
import { createSalesRoutes } from './salesRoutes';

export const router = createBrowserRouter([
  ...createSalesRoutes(),
  {
    path: '/court',
    element: <Presentation key="court" config={courtPresentation} />,
  },
]);
