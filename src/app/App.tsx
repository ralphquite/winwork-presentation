import { RouterProvider } from 'react-router-dom';

import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import { router } from './router';

export function App() {
  return (
    <ErrorBoundary fallbackTitle="Приложение не удалось отобразить">
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
