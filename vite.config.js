import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this repo from a subfolder, not the domain root.
  base: '/professional-info/',
  plugins: [react()],
  server: { port: Number(process.env.PORT) || 5173 },
})
