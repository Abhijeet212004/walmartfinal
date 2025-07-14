/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        walmart: {
          blue: '#004c91',
          yellow: '#ffc220',
          orange: '#ff6600'
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
