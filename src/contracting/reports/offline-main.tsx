import '../../styles/winwork-fonts.css';
import '../../styles/globals.css';
import '../../styles/demo-product.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

import { ErrorBoundary } from '../../components/shared/ErrorBoundary';
import { ContractingReports } from './ContractingReports';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found.');

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary fallbackTitle="Не удалось открыть отчёты">
      <HashRouter>
        <ContractingReports />
      </HashRouter>
    </ErrorBoundary>
  </StrictMode>,
);
