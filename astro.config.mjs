import tailwind from "@astrojs/tailwind"
import {} from "astro"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  outDir: "dist/client",
  vite: {
    server: {
      hmr: {
        port: 3001,
      },
    },
  },
})
