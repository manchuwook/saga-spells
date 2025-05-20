import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, ColorSchemeScript, localStorageColorSchemeManager } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './lib/router';
import { SpellbooksProvider } from './context/SpellbooksContext';
import { baseTheme } from './theme/mantineTheme';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';

// Create a client
const queryClient = new QueryClient();

// Create a color scheme manager
const colorSchemeManager = localStorageColorSchemeManager({ key: 'saga-spells-color-scheme' });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ColorSchemeScript defaultColorScheme="dark" />
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={baseTheme} defaultColorScheme="dark" colorSchemeManager={colorSchemeManager}>
        <Notifications />
        <ModalsProvider>
          <SpellbooksProvider>
            <RouterProvider router={router} />
          </SpellbooksProvider>
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
