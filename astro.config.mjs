import node from "@astrojs/node"
import tailwind from "@astrojs/tailwind"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node(),
  integrations: [tailwind()],
  vite: {
    server: {
      hmr: {
        port: 3001,
      },
    },
  },
})
