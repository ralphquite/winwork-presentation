import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  publicDir: false,
  define: {
    __CONTRACTING_CUSTOMER_BRIEF__: 'false',
    __CONTRACTING_ROLE__: 'null',
    __CONTRACTING_WITH_SLIDES__: 'true',
  },
  plugins: [react(), tailwindcss()],
  build: {
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    chunkSizeWarningLimit: 850,
    cssCodeSplit: false,
    outDir: 'dist/contracting-offline-build',
    rollupOptions: {
      input: 'contracting-offline.html',
      output: { codeSplitting: false },
    },
  },
});
