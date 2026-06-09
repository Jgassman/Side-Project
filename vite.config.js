import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Forward API calls to the Express server during development so the
    // browser only ever talks to the Vite origin (and never sees the API key).
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
