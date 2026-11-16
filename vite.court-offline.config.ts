import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  publicDir: false,
  plugins: [react(), tailwindcss()],
  build: {
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    chunkSizeWarningLimit: 600,
    cssCodeSplit: false,
    emptyOutDir: true,
    outDir: 'dist/court-offline-build',
    rollupOptions: {
      input: 'court-offline.html',
      output: {
        assetFileNames: 'assets/court-offline[extname]',
        entryFileNames: 'assets/court-offline.js',
      },
    },
  },
});
