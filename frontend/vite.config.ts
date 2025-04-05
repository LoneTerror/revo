import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  preview: {
    allowedHosts: ["revvote.site"],
  },
  build: {
    rollupOptions: {
    },
    chunkSizeWarningLimit: 1000, // Increased to 1000 KB (1MB)
  },
});
