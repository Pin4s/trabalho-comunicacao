import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Bibliotecas em chunks próprios: cache separado do código do site.
const vendorChunks: Record<string, string[]> = {
  react: ['react', 'react-dom', 'scheduler'],
  flow: ['@xyflow', 'd3-'],
  motion: ['motion', 'framer-motion', 'motion-dom', 'motion-utils'],
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          for (const [chunk, packages] of Object.entries(vendorChunks)) {
            if (packages.some((name) => id.includes(`node_modules/${name}`))) return chunk;
          }
          return undefined;
        },
      },
    },
  },
});
