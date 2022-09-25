/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["app/**/*.{ts,tsx}"],
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
