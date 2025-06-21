import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: 'localhost',
    port: 5173,
    open: true, // This will open the browser automatically
    fs: {
      // Explicitly deny access to sensitive files and folders
      deny: ['.env', '.git', 'node_modules', 'package-lock.json', 'yarn.lock'],
    },
  },
});
