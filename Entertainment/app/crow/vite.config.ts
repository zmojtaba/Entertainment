import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"

export default defineConfig({
  build: {
    sourcemap: true,
    outDir: 'build',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]', // Customize output file name if needed
      },
    },
  },
  server: {
    port: 3000,
    open: true,
     host:true
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "src": path.resolve(__dirname, "src"),
      "app": path.resolve(__dirname, "src/app"),
      "@core": path.resolve(__dirname, "src/@core"),
      "@lodash": path.resolve(__dirname, "src/@lodash"),
      "@history": path.resolve(__dirname, "src/@history"),
      "i18n": path.resolve(__dirname, "src/i18n"),
      "styles": path.resolve(__dirname, "src/styles"),
      "assets": path.resolve(__dirname, "src/assets"),
    }
  },
  css: {
    modules: {
      localsConvention: "camelCase",
      // generateScopedName: "[name]__[local]___[hash:base64:5]"
    },
    preprocessorOptions: {
      scss: {
        api: "modern-compiler"
      }
    }
  }
})
