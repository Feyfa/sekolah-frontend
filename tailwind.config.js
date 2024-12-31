/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif']
      },
      spacing: {
        'screen-minus-12': 'calc(100vh - 3rem)'
      }
    },
  },
  plugins: [],
}