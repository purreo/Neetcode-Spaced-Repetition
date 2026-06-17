/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'oklch(0.65 0.15 250)',
        surface: 'oklch(0.98 0 0)',
        'surface-dark': 'oklch(0.15 0 0)',
      }
    },
  },
  plugins: [],
}
