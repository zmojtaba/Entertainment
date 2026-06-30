// vite.config.ts
import { defineConfig } from "file:///C:/Users/r/Desktop/LatestProjectAir/front-end-latest/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/r/Desktop/LatestProjectAir/front-end-latest/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\r\\Desktop\\LatestProjectAir\\front-end-latest";
var vite_config_default = defineConfig({
  build: {
    sourcemap: true,
    outDir: "build",
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[hash][extname]"
        // Customize output file name if needed
      }
    }
  },
  server: {
    port: 3e3,
    open: true,
    host: true
  },
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "src": path.resolve(__vite_injected_original_dirname, "src"),
      "app": path.resolve(__vite_injected_original_dirname, "src/app"),
      "@core": path.resolve(__vite_injected_original_dirname, "src/@core"),
      "@lodash": path.resolve(__vite_injected_original_dirname, "src/@lodash"),
      "@history": path.resolve(__vite_injected_original_dirname, "src/@history"),
      "i18n": path.resolve(__vite_injected_original_dirname, "src/i18n"),
      "styles": path.resolve(__vite_injected_original_dirname, "src/styles"),
      "assets": path.resolve(__vite_injected_original_dirname, "src/assets")
    }
  },
  css: {
    modules: {
      localsConvention: "camelCase"
      // generateScopedName: "[name]__[local]___[hash:base64:5]"
    },
    preprocessorOptions: {
      scss: {
        api: "modern-compiler"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxyXFxcXERlc2t0b3BcXFxcTGF0ZXN0UHJvamVjdEFpclxcXFxmcm9udC1lbmQtbGF0ZXN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxyXFxcXERlc2t0b3BcXFxcTGF0ZXN0UHJvamVjdEFpclxcXFxmcm9udC1lbmQtbGF0ZXN0XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9yL0Rlc2t0b3AvTGF0ZXN0UHJvamVjdEFpci9mcm9udC1lbmQtbGF0ZXN0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIlxyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiXHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCJcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgYnVpbGQ6IHtcclxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcclxuICAgIG91dERpcjogJ2J1aWxkJyxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLltoYXNoXVtleHRuYW1lXScsIC8vIEN1c3RvbWl6ZSBvdXRwdXQgZmlsZSBuYW1lIGlmIG5lZWRlZFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgcG9ydDogMzAwMCxcclxuICAgIG9wZW46IHRydWUsXHJcbiAgICBob3N0OnRydWUsXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJzcmNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmNcIiksXHJcbiAgICAgIFwiYXBwXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2FwcFwiKSxcclxuICAgICAgXCJAY29yZVwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9AY29yZVwiKSxcclxuICAgICAgXCJAbG9kYXNoXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL0Bsb2Rhc2hcIiksXHJcbiAgICAgIFwiQGhpc3RvcnlcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvQGhpc3RvcnlcIiksXHJcbiAgICAgIFwiaTE4blwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9pMThuXCIpLFxyXG4gICAgICBcInN0eWxlc1wiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9zdHlsZXNcIiksXHJcbiAgICAgIFwiYXNzZXRzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2Fzc2V0c1wiKSxcclxuICAgIH1cclxuICB9LFxyXG4gIGNzczoge1xyXG4gICAgbW9kdWxlczoge1xyXG4gICAgICBsb2NhbHNDb252ZW50aW9uOiBcImNhbWVsQ2FzZVwiLFxyXG4gICAgICAvLyBnZW5lcmF0ZVNjb3BlZE5hbWU6IFwiW25hbWVdX19bbG9jYWxdX19fW2hhc2g6YmFzZTY0OjVdXCJcclxuICAgIH0sXHJcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcbiAgICAgIHNjc3M6IHtcclxuICAgICAgICBhcGk6IFwibW9kZXJuLWNvbXBpbGVyXCJcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEwVixTQUFTLG9CQUFvQjtBQUN2WCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBRmpCLElBQU0sbUNBQW1DO0FBSXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE9BQU87QUFBQSxJQUNMLFdBQVc7QUFBQSxJQUNYLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGdCQUFnQjtBQUFBO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBSztBQUFBLEVBQ1A7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxPQUFPLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsTUFDcEMsT0FBTyxLQUFLLFFBQVEsa0NBQVcsU0FBUztBQUFBLE1BQ3hDLFNBQVMsS0FBSyxRQUFRLGtDQUFXLFdBQVc7QUFBQSxNQUM1QyxXQUFXLEtBQUssUUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDaEQsWUFBWSxLQUFLLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQ2xELFFBQVEsS0FBSyxRQUFRLGtDQUFXLFVBQVU7QUFBQSxNQUMxQyxVQUFVLEtBQUssUUFBUSxrQ0FBVyxZQUFZO0FBQUEsTUFDOUMsVUFBVSxLQUFLLFFBQVEsa0NBQVcsWUFBWTtBQUFBLElBQ2hEO0FBQUEsRUFDRjtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0gsU0FBUztBQUFBLE1BQ1Asa0JBQWtCO0FBQUE7QUFBQSxJQUVwQjtBQUFBLElBQ0EscUJBQXFCO0FBQUEsTUFDbkIsTUFBTTtBQUFBLFFBQ0osS0FBSztBQUFBLE1BQ1A7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
