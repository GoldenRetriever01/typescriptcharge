// @ts-expect-error: the eslint patch doesn't have types
require("@rushstack/eslint-patch/modern-module-resolution")

/** @type {import('eslint').Linter.Config} */
module.exports = {
  plugins: ["tailwindcss"],
  extends: [
    require.resolve("@itsmapleleaf/configs/eslint"),
    "plugin:tailwindcss/recommended",
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
  },
  settings: {
    tailwindcss: {
      whitelist: ["font-body", "font-header"],
    },
  },
  rules: {
    "tailwindcss/migration-from-tailwind-2": "off",
  },
}
