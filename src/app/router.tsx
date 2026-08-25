import { createBrowserRouter } from 'react-router-dom';

import { apiPresentation } from '../presentation/config/api';
import { enterprisePresentation } from '../presentation/config/enterprise';
import { smallPresentation } from '../presentation/config/small';
import { Presentation } from '../presentation/engine/Presentation';
import { NotFound } from './NotFound';
import { TrackSelector } from './TrackSelector';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <TrackSelector />,
  },
  {
    path: '/enterprise',
    element: <Presentation key="enterprise" config={enterprisePresentation} />,
  },
  {
    path: '/api',
    element: <Presentation key="api" config={apiPresentation} />,
  },
  {
    path: '/small',
    element: <Presentation key="small" config={smallPresentation} />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
