import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Target modern browsers for smaller output (no unnecessary polyfills)
    target: 'es2020',
    // Use lightningcss for faster CSS minification (already in devDependencies)
    cssMinify: 'lightningcss',
    // Surface oversized chunks during build
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split heavy vendor libraries into separate cacheable chunks
          'vendor-charts': ['chart.js', 'react-chartjs-2', 'recharts'],
          'vendor-motion': ['framer-motion', 'motion'],
          'vendor-pdf': ['jspdf', 'jspdf-autotable', 'html2canvas'],
          'vendor-data': ['xlsx'],
          'vendor-ocr': ['tesseract.js'],
        },
      },
    },
  },
})