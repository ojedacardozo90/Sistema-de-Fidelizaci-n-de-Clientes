/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        /* ---------------------------
           PALETA ORIGINAL DEL PROYECTO
        ---------------------------- */
        primary: "#003566",
        primaryLight: "#00509D",
        lightBg: "#F8F9FA",
        grayLight: "#E0E4EA",
        grayDark: "#444B57",

        /* ---------------------------
           PALETA EXACTA DEL FIGMA
        ---------------------------- */
        figmaPrimary: "#2563EB",
        figmaPrimaryDark: "#1E3A8A",
        figmaBgLight: "#F5F5F7",
        success: "#16A34A",

        /* usamos warning y danger del Figma porque son más “UI-friendly” */
        warning: "#FBBF24",
        danger: "#DC2626",
      },

      fontFamily: {
        /* IMPORTANT: Poppins coincide con la fuente del PDF */
        sans: ["Poppins", "Inter", "system-ui", "sans-serif"],
      },

      borderRadius: {
        md: "8px",
        lg: "12px",
      },

      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
