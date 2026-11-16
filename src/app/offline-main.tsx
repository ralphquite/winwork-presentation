import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';

import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import { createSalesRoutes } from './salesRoutes';
import '../styles/globals.css';
import '../styles/demo-product.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found.');

const router = createHashRouter(createSalesRoutes(true));

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary fallbackTitle="Не удалось открыть презентации">
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
);
