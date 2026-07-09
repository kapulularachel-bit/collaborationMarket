/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        gula: {
          green: "#2E7D32",
          "green-dark": "#1B5E20",
          "green-light": "#4CAF50"
        }
      },
      fontFamily: {
        sans: ["Inter", "System", "sans-serif"]
      }
    },
  },
  plugins: [],
};
