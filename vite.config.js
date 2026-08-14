import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Served from the root of daniel-mehler.com, not the /professional-info/
  // subfolder github.io used. public/CNAME is what tells Pages to keep the
  // custom domain on each deploy.
  base: '/',
  plugins: [react()],
  server: { port: Number(process.env.PORT) || 5173 },
})
