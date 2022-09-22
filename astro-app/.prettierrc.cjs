const config = require("@itsmapleleaf/configs/prettier")

/** @type {import('prettier').Config} */
module.exports = {
  ...config,
  htmlWhitespaceSensitivity: "ignore",
  plugins: [require.resolve("prettier-plugin-astro")],
  overrides: [{ files: ["*.astro"], options: { parser: "astro" } }],
}
