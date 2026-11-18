import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Forward API calls to the local worker (apps/worker, `wrangler dev`).
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
})
