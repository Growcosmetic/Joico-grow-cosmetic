/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#8B4B6B',
          600: '#7A4260',
          700: '#693954',
          800: '#582F48',
          900: '#47263C',
        }
      }
    },
  },
  plugins: [],
}
