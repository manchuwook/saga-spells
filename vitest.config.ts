import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'SAGA Spells Manager',
        short_name: 'SAGA Spells',
        description: 'A spell manager for SAGA TTRPG with advanced filtering and spellbook organization capabilities',
        theme_color: '#4c6ef5',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mantine-core': ['@mantine/core', '@mantine/hooks'],
          'mantine-extras': [
            '@mantine/dates',
            '@mantine/form',
            '@mantine/modals',
            '@mantine/notifications',
          ],
          'pdf-vendor': ['jspdf', 'jspdf-autotable', 'html2canvas'],
          'data-vendor': ['@tanstack/react-query', '@tanstack/react-table', 'zod'],
          'icons': ['@tabler/icons-react'],
        }
      },
    },
    emptyOutDir: true,
    reportCompressedSize: true,
    sourcemap: false,
    cssCodeSplit: true,
    manifest: true,
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@mantine/core',
      '@mantine/hooks',
    ],
  },
  server: {
    open: true,
    port: 5173,
  },
  preview: {
    port: 5174,
    open: true,
    headers: {
      'Alt-Svc': 'h3=":443"; ma=86400',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/']
    }
  }
});
