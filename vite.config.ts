import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 700,
    // three.js in its own long-cached chunk, shared by every scene
    rollupOptions: { output: { manualChunks: id => (id.includes('node_modules/three/') ? 'three' : undefined) } },
  },
});
