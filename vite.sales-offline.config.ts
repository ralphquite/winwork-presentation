import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { salesPresentations } from './src/presentation/config/sales';

export default defineConfig({
  base: './',
  publicDir: false,
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'sales-offline-slide-manifest',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'slides.json',
          source: JSON.stringify(
            salesPresentations.flatMap((config) =>
              config.scenes.map((scene) => scene.pencil.documentPath),
            ),
          ),
        });
      },
    },
  ],
  build: {
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    chunkSizeWarningLimit: 1800,
    cssCodeSplit: false,
    outDir: 'dist/sales-offline-build',
    rollupOptions: {
      input: 'sales-offline.html',
      output: {
        assetFileNames: 'assets/sales-offline[extname]',
        entryFileNames: 'assets/sales-offline.js',
        codeSplitting: false,
      },
    },
  },
});
