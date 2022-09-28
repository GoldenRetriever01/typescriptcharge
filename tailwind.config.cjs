const plugin = require("tailwindcss/plugin")

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
  plugins: [
    plugin(function thinScrollbarComponent({ addComponents, theme }) {
      addComponents({
        ".thin-scrollbar": {
          "&::-webkit-scrollbar": {
            width: theme("width.1"),
            height: theme("width.1"),
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255, 255, 255, 0.25)",
            borderRadius: theme("borderRadius.full"),
          },
          "&::-webkit-scrollbar-track-piece:start, &::-webkit-scrollbar-track-piece:start":
            {
              backgroundColor: theme("colors.transparent"),
            },
        },
      })
    }),
  ],
}
