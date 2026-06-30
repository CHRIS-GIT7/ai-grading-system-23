/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#003366',
          light: '#1060a8',
          dark: '#02263a',
        },
        accent: {
          DEFAULT: '#D4AF37',
        }
      }
    },
  },
  plugins: [],
}
