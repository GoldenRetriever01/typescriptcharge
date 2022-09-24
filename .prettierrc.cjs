// @ts-check
/** @type {import('prettier').Config} */
module.exports = {
  ...require("@itsmapleleaf/configs/prettier"),
  htmlWhitespaceSensitivity: "ignore",
  plugins: [require.resolve("prettier-plugin-astro")],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
}
