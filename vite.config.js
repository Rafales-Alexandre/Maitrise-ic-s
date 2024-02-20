// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Assuming you're using the react plugin
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'src/': '/src/', // This will resolve `src/` to the absolute path of the src directory
    },
  },
});
