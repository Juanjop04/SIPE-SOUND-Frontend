// Los colores salen de src/styles/tokens.css (contrato 05 §2): aquí no hay ningún hex.
const token = (nombre) => `rgb(var(--color-${nombre}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: token("ink"), 2: token("ink-2") },
        surface: { DEFAULT: token("surface"), 2: token("surface-2") },
        // "linea" y no "border": evita la clase ambigua border-border.
        linea: { DEFAULT: token("linea"), fuerte: token("linea-fuerte") },
        primary: {
          DEFAULT: token("primary"),
          hover: token("primary-hover"),
          claro: token("primary-claro"),
        },
        accent: token("accent"),
        success: token("success"),
        suena: token("suena"),
        "sobre-primary": token("sobre-primary"),
        relleno: { inicio: token("relleno-inicio"), fin: token("relleno-fin") },
        logro: { inicio: token("logro-inicio"), fin: token("logro-fin") },
        barra: {
          DEFAULT: token("barra"),
          texto: token("barra-texto"),
          "texto-2": token("barra-texto-2"),
          hover: token("barra-hover"),
        },
        danger: token("danger"),
        aviso: token("aviso"),
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
        // Entre comillas: un nombre sin comillas con un "2" suelto invalida la regla y los títulos
        // caían en Inter (HU-F-312).
        display: ['"Baloo 2"', "sans-serif"],
        sans: ["Inter Variable", "sans-serif"],
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
      // Movimiento con significado (contrato 05 §2.4): la cuerda vibra al completar algo.
      keyframes: {
        vibrar: {
          "0%, 100%": { transform: "translateY(0)" },
          "25%": { transform: "translateY(-2px)" },
          "75%": { transform: "translateY(2px)" },
        },
      },
      animation: {
        vibrar: "vibrar 80ms ease-in-out 6",
      },
      boxShadow: {
        // La única sombra del sistema: diálogos y menús flotantes.
        dialogo: "0 12px 32px rgb(var(--color-sombra) / 0.35)",
      },
    },
  },
  plugins: [],
};
