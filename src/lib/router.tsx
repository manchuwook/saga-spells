import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import App from '../App';
import ErrorPage from '../pages/ErrorPage';
import { Loader, Center } from '@mantine/core';

// Lazy load page components for code splitting
const SpellsPage = lazy(() => import('../pages/SpellsPage'));
const SpellbooksPage = lazy(() => import('../pages/SpellbooksPage'));
const SpellbookDetailPage = lazy(() => import('../pages/SpellbookDetailPage'));

// Loading component
const PageLoader = () => (
  <Center style={{ width: '100%', height: '70vh' }}>
    <Loader size="xl" />
  </Center>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <SpellsPage />
          </Suspense>
        ),
      },
      {
        path: 'spellbooks',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SpellbooksPage />
          </Suspense>
        ),
      },
      {
        path: 'spellbooks/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SpellbookDetailPage />
          </Suspense>
        ),
      },
    ],
  },
]);
