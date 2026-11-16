import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  publicDir: false,
  plugins: [react()],
  build: {
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    cssCodeSplit: false,
    outDir: 'dist/onboarding-offline-build',
    rollupOptions: {
      input: 'onboarding-offline.html',
      output: {
        assetFileNames: 'assets/onboarding[extname]',
        entryFileNames: 'assets/onboarding.js',
        codeSplitting: false,
      },
    },
  },
});
