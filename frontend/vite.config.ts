import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import seo from './plugins/seo.ts'

export default defineConfig({
  plugins: [react(), seo()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Never publish source maps: they would expose the original source.
    sourcemap: false,
  },
})
