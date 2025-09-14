import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If deploying to GitHub Pages under /<repo>/ path, change base to '/<repo>/'
export default defineConfig({
  plugins: [react()],
  base: '/',
})
