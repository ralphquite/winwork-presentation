import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/court-app/',
  plugins: [react(), tailwindcss()],
  build: {
    emptyOutDir: false,
    outDir: 'dist/court-app',
    rollupOptions: {
      input: 'court.html',
      output: {
        assetFileNames: 'assets/court-[hash][extname]',
        chunkFileNames: 'assets/court-[hash].js',
        entryFileNames: 'assets/court-[hash].js',
      },
    },
  },
});
