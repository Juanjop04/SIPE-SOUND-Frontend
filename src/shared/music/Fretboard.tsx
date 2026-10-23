import { CUERDAS, curva, useAnimacionCuerdas } from "./animacionCuerdas";

export interface FretboardProps {
  /** true: todas las cuerdas vibran (se está enviando un formulario). */
  tocando?: boolean;
}

const TRASTES = [60, 190, 310, 420, 520];
const PUNTOS = [
  { x: 125, y: 140 },
  { x: 365, y: 140 },
];

// Siempre se van pulsando cuerdas sueltas; con `tocando`, vibran todas.
export function Fretboard({ tocando = false }: FretboardProps) {
  const cuerdasRef = useAnimacionCuerdas(tocando);

  return (
    <svg
      viewBox="0 0 600 280"
      className="w-full max-w-lg"
      role="img"
      aria-label="Mástil de guitarra con seis cuerdas"
    >
      {TRASTES.map((x) => (
        <line
          key={x}
          x1={x}
          y1="30"
          x2={x}
          y2="250"
          className="stroke-primary"
          strokeOpacity="0.35"
          strokeWidth="2"
        />
      ))}
      {PUNTOS.map((p) => (
        <circle key={p.x} cx={p.x} cy={p.y} r="9" className="fill-accent" fillOpacity="0.28" />
      ))}
      {CUERDAS.map((c, i) => (
        <path
          key={c.y}
          ref={(el) => {
            cuerdasRef.current[i] = el;
          }}
          d={curva(c.y, 0)}
          fill="none"
          className="stroke-paper"
          strokeOpacity="0.55"
          strokeWidth={c.grosor}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
