import node from "@astrojs/node"
import preact from "@astrojs/preact"
import tailwind from "@astrojs/tailwind"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node(),
  integrations: [tailwind(), preact()],
  vite: {
    server: {
      hmr: {
        port: 3001,
      },
    },
  },
})
