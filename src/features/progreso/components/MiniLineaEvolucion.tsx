// Mini-línea de evolución de puntajes en SVG propio (sin librería de gráficas, HU-F-306).
const ANCHO = 120;
const ALTO = 32;
const MARGEN = 4;

interface MiniLineaEvolucionProps {
  /** Puntajes 0–100 en orden cronológico (del más antiguo al más reciente). */
  puntajes: number[];
  /** Porcentaje de aprobación: línea punteada de referencia. */
  aprobacion: number;
  aprobado: boolean;
}

const y = (puntaje: number) => ALTO - MARGEN - (puntaje / 100) * (ALTO - MARGEN * 2);

export function MiniLineaEvolucion({ puntajes, aprobacion, aprobado }: MiniLineaEvolucionProps) {
  if (puntajes.length === 0) return null;
  const paso = puntajes.length > 1 ? (ANCHO - MARGEN * 2) / (puntajes.length - 1) : 0;
  const puntos = puntajes.map((p, i) => [MARGEN + i * paso, y(p)] as const);
  const [ultimoX, ultimoY] = puntos[puntos.length - 1];

  return (
    <svg
      viewBox={`0 0 ${ANCHO} ${ALTO}`}
      width={ANCHO}
      height={ALTO}
      role="img"
      aria-label={"Evolución: " + puntajes.map((p) => `${p} %`).join(", ")}
    >
      <line
        x1={0}
        x2={ANCHO}
        y1={y(aprobacion)}
        y2={y(aprobacion)}
        className="stroke-linea-fuerte"
        strokeDasharray="2 3"
      />
      <polyline
        points={puntos.map(([px, py]) => `${px},${py}`).join(" ")}
        fill="none"
        className="stroke-paper"
        strokeOpacity={0.55}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <circle
        cx={ultimoX}
        cy={ultimoY}
        r={3}
        className={aprobado ? "fill-success" : "fill-paper"}
      />
    </svg>
  );
}
