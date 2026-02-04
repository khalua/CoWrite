import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  // Use /frontend/ base only for production build (served by Rails)
  // In dev mode, use root path for easier navigation
  base: command === 'build' ? '/frontend/' : '/',
  build: {
    outDir: path.resolve(__dirname, '../public/frontend'),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/cable': {
        target: 'ws://localhost:3001',
        ws: true,
      },
    },
  },
}))
