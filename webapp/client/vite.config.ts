import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  server: {
    proxy: {
      '/api': {
        target: 'http://pizero.local:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
});
