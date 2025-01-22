/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-purple': {
          50: '#f3f3ff',
          100: '#e6e6ff',
          200: '#c4c5ff',
          300: '#a2a3ff',
          400: '#7f81ff',
          500: '#5D5FEF',
          600: '#4b4cbf',
          700: '#39398f',
          800: '#272760',
          900: '#141430',
        }
      }
    }
  },
  plugins: [],
}

