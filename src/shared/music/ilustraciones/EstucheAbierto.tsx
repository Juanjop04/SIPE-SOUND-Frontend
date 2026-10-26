import type { IlustracionProps } from "./Atril";

// Estuche visto desde arriba, con la tapa abierta hacia atrás y la guitarra dentro.
const ESTUCHE =
  "M150 66C172 66 188 82 190 96L228 96Q234 96 234 102L234 106Q234 112 228 112L190 112" +
  "C188 126 172 142 150 142C136 142 128 136 116 138C104 140 96 156 70 156C40 156 18 132 18 104" +
  "C18 76 40 52 70 52C96 52 104 68 116 70C128 72 136 66 150 66Z";
const GUITARRA =
  "M148 78C163 78 174 89 176 100L226 100L226 108L176 108C174 119 163 130 148 130" +
  "C138 130 132 126 122 127C110 128 102 142 72 142C50 142 34 124 34 104C34 84 50 66 72 66" +
  "C102 66 110 80 122 81C132 82 138 78 148 78Z";
const CUERDAS = [101.5, 103.5, 105.5, 107];

/** Estuche abierto con la guitarra: estado "aún no empiezas" y página 404 (HU-F-316). */
export function EstucheAbierto({ className }: IlustracionProps) {
  return (
    <svg
      viewBox="0 0 240 160"
      width={240}
      height={160}
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <rect
        x={18}
        y={18}
        width={216}
        height={42}
        rx={20}
        className="fill-ink-2 stroke-linea-fuerte"
        strokeWidth={1.5}
      />
      <path d={ESTUCHE} className="fill-surface stroke-linea-fuerte" strokeWidth={1.5} />
      <path d={GUITARRA} className="fill-ink-2 stroke-muted" strokeWidth={1.5} />
      <circle cx={146} cy={104} r={10} className="fill-ink stroke-muted" strokeWidth={1.5} />
      <rect x={58} y={96} width={6} height={16} rx={2} className="fill-surface stroke-muted" />
      {CUERDAS.map((y) => (
        <line key={y} x1={61} x2={226} y1={y} y2={y} className="stroke-muted" strokeWidth={0.75} />
      ))}
    </svg>
  );
}
