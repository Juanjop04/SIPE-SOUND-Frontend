/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B1030",
        surface: "#2A1B4D",
        border: "#4a3470",
        primary: {
          DEFAULT: "#7C3AED",
          hover: "#6B2FD1",
        },
        accent: "#E29DE0",
        success: "#F5B942",
        danger: "#F2545B",
        muted: "#C9BEE0",
        paper: "#F3EEFB",
      },
      fontFamily: {
        display: ["Baloo 2", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        xl: "14px",
      },
    },
  },
  plugins: [],
};
