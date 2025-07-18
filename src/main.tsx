import {
  ColorSchemeScript,
  localStorageColorSchemeManager,
  MantineProvider,
} from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { SpellbooksProvider } from "./context/SpellbooksContext";
import { logPerformanceMetrics, reportWebVitals } from "./lib/performance";
import { router } from "./lib/router";
import { baseTheme } from "./theme/mantineTheme";

// Create a client
const queryClient = new QueryClient();

// Create a color scheme manager
const colorSchemeManager = localStorageColorSchemeManager({
  key: "saga-spells-color-scheme",
});

// Initialize performance monitoring
reportWebVitals();
logPerformanceMetrics();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ColorSchemeScript defaultColorScheme="dark" />
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        theme={baseTheme}
        defaultColorScheme="dark"
        colorSchemeManager={colorSchemeManager}
      >
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
