/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './templates/index.html',
      './src/**/*.{js,jsx,ts,tsx}',],
    theme: {
      extend: {
        // Set dark mode as the default
        defaultMode: 'dark',
        colors: {
          "bg": "#333f63",
          "bg2": "#28314d",
          "inputBg": "#28314d",
          "link": "#c2b0ff",
          "linkHover": "#959cff",
          "border": "#a16b97",
          "accent": "#47588a",
          "accent2": "#715c8c",
          "accent3": "#656c96",
          "text": "#d7d4dd",
          "error": "#ff8284",
        }
      },
    },
    darkMode: 'media',
    plugins: [],
  }
  
  