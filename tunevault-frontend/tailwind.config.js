// ---> ĐÂY LÀ PHẦN CONFIG TAILWIND (MÀU CHUẨN SPOTIFY) <---
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
          base: '#121212',      // Nền chính
          elevated: '#242424',  // Nền các box nổi
          highlight: '#2a2a2a', // Màu khi hover
          primary: '#1DB954',   // Xanh Spotify
          text: '#FFFFFF',      // Text chính
          subtext: '#B3B3B3'    // Text phụ
        }
      }
    },
  },
  plugins: [],
}
// ---> END: ĐÂY LÀ PHẦN CONFIG TAILWIND (MÀU CHUẨN SPOTIFY) <---