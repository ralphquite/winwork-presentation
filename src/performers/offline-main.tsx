import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ContractingShell } from '../contracting/ContractingShell';
import { PerformersTable } from './PerformersTable';

import '../styles/winwork-fonts.css';
import '../styles/demo-product.css';
import './performers.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found.');

createRoot(root).render(
  <StrictMode>
    <div className="ww-performers-workspace">
      <ContractingShell role="customer" section="performers">
        <PerformersTable />
      </ContractingShell>
    </div>
  </StrictMode>,
);
