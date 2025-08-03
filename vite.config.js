import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: false,
    }),
    react(),
  ],
  server: {
    port: 3000,
    open: true,
    historyApiFallback: true
  },
  optimizeDeps: {
    include: ['@react-pdf/renderer']
  },
  define: {
    global: 'globalThis',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate React and React DOM into their own chunk
          'react-vendor': ['react', 'react-dom'],
          // Separate PDF renderer into its own chunk (likely the largest)
          'pdf-renderer': ['@react-pdf/renderer'],
          // Separate TanStack Router into its own chunk
          'router': ['@tanstack/react-router'],
          // Separate UI icons into their own chunk
          'icons': ['lucide-react'],
          // Separate utility libraries
          'utils': ['nanoid']
        }
      }
    },
    // Increase chunk size warning limit to reduce noise for intentionally large chunks
    chunkSizeWarningLimit: 1000
  }
})