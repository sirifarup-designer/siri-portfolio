import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set base to '/' for a custom domain, or '/repo-name/' for GitHub Pages project sites.
// e.g. base: '/siri-portfolio/'
export default defineConfig({
  plugins: [react()],
base: '/siri-portfolio/',
})
