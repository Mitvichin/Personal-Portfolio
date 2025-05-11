/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import { replaceImportMetaUrl } from './vite-plugins/replaceImportMetaUrl';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), replaceImportMetaUrl(), svgr()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './setupTests.ts',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://backend:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
