import node from "@astrojs/node"
import tailwind from "@astrojs/tailwind"
import { defineConfig } from "astro/config"

import react from "@astrojs/react"

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node(),
  integrations: [tailwind(), react()],
  vite: {
    server: {
      hmr: {
        port: 3001,
      },
    },
  },
})
