/** @type {import('tailwindcss').Config} */

// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {

      colors: {
        mainColor: '#6500FE',
        alternativeMain: '#610fe1',
        secondaryColor: '#13003B',
        customGray: '#67697c',
        softGray: '#9899a5',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
