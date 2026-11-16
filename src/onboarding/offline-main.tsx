import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import { OnboardingPrototype } from './OnboardingPrototype';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found.');

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary fallbackTitle="Не удалось открыть прототип">
      <OnboardingPrototype />
    </ErrorBoundary>
  </StrictMode>,
);
