import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Это нужно для некоторых специфических настроек MUI
      './runtimeConfig': './runtimeConfig.browser',
    },
    dedupe: [
      'react',
      'react-dom',
      '@emotion/react',
      '@emotion/styled',
    ],
  },
  optimizeDeps: {
    // Явно указываем Vite, что нужно предварительно обработать @emotion/styled и связанные пакеты
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      '@emotion/styled',
      '@emotion/react',
      '@mui/material',
      '@mui/icons-material',
      '@mui/styled-engine',
      '@mui/system',
      '@mui/x-data-grid',
    ],
    esbuildOptions: {
      jsx: 'automatic',
    },
  },
  ssr: {
    noExternal: [
      '@mui/material',
      '@mui/icons-material',
      '@emotion/styled',
      '@emotion/react',
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/testSetup.ts'],
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    server: {
      deps: {
        inline: ['@mui/x-data-grid'],
      },
    },
  },
})