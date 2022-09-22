import { build } from "esbuild"

await build({
  entryPoints: [
    "@fontsource/rubik/variable.css",
    "@fontsource/oswald/variable.css",
  ],
  bundle: true,
  outdir: "public/build/fonts",
  loader: { ".woff2": "file" },
  logLevel: "info",
})
