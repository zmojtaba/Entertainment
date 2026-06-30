import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    host: true
  },

  resolve: {
    alias: {
      "src": path.resolve(__dirname, "src"),
      '@': path.resolve(__dirname, './src'),
      '@pages': path.resolve(__dirname, './src/page'),
      '@assets': path.resolve(__dirname, './src/assets'),
    }
  },
  // assetsInclude:['global.d.ts']
})
