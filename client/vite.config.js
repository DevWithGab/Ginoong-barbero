import { defineConfig } from 'vite'
import path from 'path'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  resolve: {
    alias: {
      'gsap/ScrollTrigger': path.resolve(__dirname, 'node_modules/gsap/ScrollTrigger.js'),
    },
  },
  optimizeDeps: {
    include: ['gsap', 'gsap/ScrollTrigger'],
  },
})
