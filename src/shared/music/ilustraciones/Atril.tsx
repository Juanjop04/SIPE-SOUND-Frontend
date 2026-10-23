export interface IlustracionProps {
  className?: string;
}

// Dos pentagramas vacíos de 5 líneas: la partitura en blanco del atril.
const PENTAGRAMAS = [50, 76].flatMap((y) => [0, 4, 8, 12, 16].map((d) => y + d));

/** Atril con una partitura en blanco: estados vacíos del atril docente (HU-F-316). */
export function Atril({ className }: IlustracionProps) {
  return (
    <svg
      viewBox="0 0 200 180"
      width={200}
      height={180}
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <g className="stroke-linea-fuerte" strokeWidth={1.5} strokeLinecap="round">
        <line x1={100} y1={112} x2={100} y2={170} />
        <line x1={100} y1={160} x2={55} y2={176} />
        <line x1={100} y1={160} x2={145} y2={176} />
        <line x1={100} y1={160} x2={100} y2={178} />
      </g>
      <rect
        x={30}
        y={20}
        width={140}
        height={86}
        rx={4}
        className="fill-surface stroke-linea-fuerte"
        strokeWidth={1.5}
      />
      <rect
        x={48}
        y={30}
        width={104}
        height={72}
        className="fill-ink-2 stroke-linea-fuerte"
        strokeWidth={1.5}
      />
      {PENTAGRAMAS.map((y) => (
        <line key={y} x1={58} x2={142} y1={y} y2={y} className="stroke-linea-fuerte" />
      ))}
      <rect
        x={26}
        y={104}
        width={148}
        height={8}
        rx={2}
        className="fill-ink-2 stroke-linea-fuerte"
        strokeWidth={1.5}
      />
    </svg>
  );
}
