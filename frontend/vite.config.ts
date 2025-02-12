import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define:{
    API_URL: JSON.stringify("https://investorhub.devsouptik.tech/api"),
  }
});
