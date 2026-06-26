/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bodyiq: {
          black: '#0A0A0A',
          white: '#FFFFFF',
          copper: '#C37663',
          'copper-light': '#D4957F',
          'copper-dark': '#A85F4D',
          gray: {
            100: '#F5F5F5',
            500: '#737373',
            900: '#171717',
          },
        },
      },
    },
  },
  plugins: [],
};
