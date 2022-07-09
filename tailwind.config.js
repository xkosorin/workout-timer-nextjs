/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    './node_modules/xtendui/src/*.mjs'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  presets: [
    require('tailwindcss/defaultConfig'),
    require('xtendui/tailwind.preset')
  ],
};
