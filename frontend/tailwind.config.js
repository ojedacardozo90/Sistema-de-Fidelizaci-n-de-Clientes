/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0A3A67",
        secondary: "#145A8D",
        lightGray: "#F5F6FA",
        midGray: "#D5D8DE",
        darkGray: "#4A4A4A",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "Arial"],
      },
    },
  },
  plugins: [],
}
