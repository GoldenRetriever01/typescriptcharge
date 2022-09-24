/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["src/**/*.{ts,tsx,astro}", "index.html"],
  theme: {
    extend: {
      fontFamily: {
        body: ["RubikVariable", "sans-serif"],
        header: ["OswaldVariable", "sans-serif"],
      },
    },
  },
  plugins: [],
}
