import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import { courtPresentation } from '../presentation/config/court';
import { Presentation } from '../presentation/engine/Presentation';
import { OfflineInteractionHints } from './OfflineInteractionHints';
import '../styles/demo-product.css';
import '../styles/globals.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found.');
}

document.documentElement.dataset.presentationMode = 'offline-court';

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary fallbackTitle="Не удалось открыть презентацию">
      <HashRouter>
        <OfflineInteractionHints />
        <Presentation
          config={courtPresentation}
          controlsVariant="offline-court"
        />
      </HashRouter>
    </ErrorBoundary>
  </StrictMode>,
);
