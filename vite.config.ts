import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    strictPort: true,
    allowedHosts: [
      'capture-ventures-remedies-does.trycloudflare.com', // add your tunnel host here
      'rev-raymond-hits-space.trycloudflare.com'
    ]
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
