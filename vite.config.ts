import preact from "@preact/preset-vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      "react": "preact/compat",
      "react-dom": "preact/compat",
    },
  },
  build: {
    sourcemap: true,
  },
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
})
