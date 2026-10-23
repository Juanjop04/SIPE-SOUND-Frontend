// Los colores salen de src/styles/tokens.css (contrato 05 §2): aquí no hay ningún hex.
const token = (nombre) => `rgb(var(--color-${nombre}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: token("ink"), 2: token("ink-2") },
        surface: token("surface"),
        // "linea" y no "border": evita la clase ambigua border-border.
        linea: { DEFAULT: token("linea"), fuerte: token("linea-fuerte") },
        primary: {
          DEFAULT: token("primary"),
          hover: token("primary-hover"),
          claro: token("primary-claro"),
        },
        accent: token("accent"),
        success: token("success"),
        danger: token("danger"),
        muted: token("muted"),
        paper: token("paper"),
      },
      ringColor: {
        DEFAULT: token("accent"),
      },
      // Color de un "border" sin color explícito (el reset de Tailwind usaba un gris).
      borderColor: {
        DEFAULT: token("linea"),
      },
      fontFamily: {
        display: ["Baloo 2", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        xl: "14px",
        caja: "10px",
      },
      // Movimiento (contrato 05 §2.4): 120 ms en hover, 200 ms en paneles.
      transitionDuration: {
        rapida: "120ms",
        panel: "200ms",
      },
      boxShadow: {
        // La única sombra del sistema: diálogos y menús flotantes.
        dialogo: "0 12px 32px rgb(var(--color-ink) / 0.6)",
      },
    },
  },
  plugins: [],
};
