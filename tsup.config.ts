import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["./server.ts"],
  outDir: "dist/server",
  target: "node16",
  format: ["esm"],
})
