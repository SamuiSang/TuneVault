/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          base: '#121212',
          elevated: '#242424',
          highlight: '#1a1a1a',
          primary: '#1DB954',
          text: '#FFFFFF',
          subtext: '#B3B3B3'
        }
      }
    },
  },
  plugins: [],
}