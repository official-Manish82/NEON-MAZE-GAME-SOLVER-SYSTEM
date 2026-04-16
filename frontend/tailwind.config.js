/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neonRed: '#ff2e2e',
        darkRed: '#2b0000'
      },
      boxShadow: {
        'neon': '0 0 5px #ff2e2e, 0 0 15px #ff2e2e',
        'neon-white': '0 0 5px #ffffff, 0 0 15px #00ffff',
        'neon-portal': '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff',
        'neon-path': '0 0 5px #ffff00, 0 0 10px #ffff00'
      }
    },
  },
  plugins: [],
}
