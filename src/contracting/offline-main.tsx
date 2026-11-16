import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import { Presentation } from '../presentation/engine/Presentation';
import { ContractingPresentation } from './ContractingPresentation';
import { contractingCustomerBriefSlides } from './customerBriefSlides';

import '../assets/sales/inter.css';
import '../styles/winwork-fonts.css';
import '../styles/globals.css';
import '../styles/demo-product.css';
import '../styles/contracting.css';

declare const __CONTRACTING_CUSTOMER_BRIEF__: boolean;

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found.');

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary fallbackTitle="Не удалось открыть презентацию">
      <HashRouter>
        {__CONTRACTING_CUSTOMER_BRIEF__ ? (
          <Presentation
            config={{
              id: 'contracting',
              homePath: null,
              title: 'Подрядная схема для заказчика',
              scenes: contractingCustomerBriefSlides,
            }}
            controlsVariant="always-visible"
          />
        ) : (
          <ContractingPresentation />
        )}
      </HashRouter>
    </ErrorBoundary>
  </StrictMode>,
);
