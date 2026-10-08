import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "state-vendor": ["@reduxjs/toolkit", "react-redux", "redux-persist", "@tanstack/react-query"],
          "stripe-vendor": ["@stripe/stripe-js", "@stripe/react-stripe-js"],
          "motion-vendor": ["framer-motion", "gsap"],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
})
