// @ts-expect-error: the eslint patch doesn't have types
require("@rushstack/eslint-patch/modern-module-resolution")

/** @type {import('eslint').Linter.Config} */
module.exports = {
  plugins: ["tailwindcss"],
  extends: [
    require.resolve("@itsmapleleaf/configs/eslint"),
    "plugin:tailwindcss/recommended",
    "plugin:astro/recommended",
  ],
  ignorePatterns: [
    "**/node_modules/**",
    "**/build/**",
    "**/dist/**",
    "**/.cache/**",
    "**/public/**",
  ],
  parserOptions: {
    project: require.resolve("./tsconfig.json"),
    extraFileExtensions: [".astro"],
  },
  overrides: [
    {
      files: ["**/*.astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
      rules: {
        "react/no-unknown-property": "off",
      },
    },
  ],
  settings: {
    tailwindcss: {
      whitelist: ["font-body", "font-header"],
    },
  },
}
