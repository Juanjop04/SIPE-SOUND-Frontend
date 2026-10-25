import type { ChordDiagramProps, TrasteCuerda } from "../ChordDiagram";

export interface ManoEnAcordeProps extends ChordDiagramProps {
  /** Nombre del acorde para el lector de pantalla ("Mano formando el acorde Am"). */
  nombre: string;
  className?: string;
}

// Misma orientación que ChordDiagram: cejuela arriba, Mi grave a la izquierda. Los dedos
// llegan por la derecha (lado de las cuerdas agudas), como en el instrumento real.
const CUERDAS = 6;
const TRASTES = 4;
const X0 = 20;
const SEP_CUERDAS = 20;
const Y0 = 34;
const SEP_TRASTES = 34;
const PALMA_X = 146;
const xCuerda = (i: number) => X0 + i * SEP_CUERDAS;
const yTraste = (t: number) => Y0 + t * SEP_TRASTES;

interface Punta {
  x: number;
  y: number;
  dedo: number | null;
}

/** Dedo: tubo con contorno desde la punta hasta la palma. */
function Dedo({ x, y }: { x: number; y: number }) {
  const d = `M${x} ${y}C${x + 24} ${y + 4} ${PALMA_X - 20} ${y + 26} ${PALMA_X} ${y + 34}`;
  return (
    <>
      <path d={d} className="stroke-linea-fuerte" strokeWidth={12} strokeLinecap="round" />
      <path d={d} className="stroke-surface" strokeWidth={9} strokeLinecap="round" />
    </>
  );
}

function puntas({ frets, fingers, baseFret = 1, barre }: ChordDiagramProps): Punta[] {
  const lista: Punta[] = [];
  (frets ?? []).forEach((f, i) => {
    if (typeof f !== "number" || f <= 0) return;
    // Bajo la cejilla no se dibuja una punta por cuerda: la cejilla es un solo dedo.
    if (barre && f === barre.fret && i >= barre.from && i <= barre.to) return;
    const t = f - baseFret + 1;
    lista.push({ x: xCuerda(i), y: yTraste(t) - SEP_TRASTES / 2, dedo: fingers?.[i] ?? null });
  });
  return lista;
}

/** Trastes, cuerdas, × / ○ sobre la cejuela y el traste base si no se empieza en 1. */
function Rejilla({ frets, baseFret }: { frets: TrasteCuerda[]; baseFret: number }) {
  return (
    <>
      {Array.from({ length: TRASTES + 1 }, (_, t) => (
        <line
          key={`t${t}`}
          x1={X0}
          x2={xCuerda(CUERDAS - 1)}
          y1={yTraste(t)}
          y2={yTraste(t)}
          className={t === 0 && baseFret === 1 ? "stroke-muted" : "stroke-linea-fuerte"}
          strokeWidth={t === 0 && baseFret === 1 ? 4 : 1.5}
        />
      ))}
      {frets.map((f, i) => (
        <g key={`c${xCuerda(i)}`}>
          <line
            x1={xCuerda(i)}
            x2={xCuerda(i)}
            y1={Y0}
            y2={yTraste(TRASTES)}
            className="stroke-linea-fuerte"
            strokeWidth={1.5}
          />
          {(f === "x" || f === 0) && (
            <text
              x={xCuerda(i)}
              y={Y0 - 10}
              textAnchor="middle"
              fontSize={11}
              className={f === "x" ? "fill-danger" : "fill-muted"}
            >
              {f === "x" ? "×" : "○"}
            </text>
          )}
        </g>
      ))}
      {baseFret > 1 && (
        <text x={2} y={Y0 + SEP_TRASTES / 2 + 4} fontSize={10} className="fill-muted">
          {baseFret}
        </text>
      )}
    </>
  );
}

/** Yemas de los dedos con su número, encima de los dedos y de la cejilla. */
function Puntas({ lista }: { lista: Punta[] }) {
  return (
    <>
      {lista.map((p) => (
        <g key={`p${p.x}`}>
          <ellipse cx={p.x} cy={p.y} rx={8} ry={7} className="fill-primary-claro" />
          {p.dedo !== null && (
            <text
              x={p.x}
              y={p.y + 3}
              textAnchor="middle"
              fontSize={9}
              className="fill-ink font-bold"
            >
              {p.dedo}
            </text>
          )}
        </g>
      ))}
    </>
  );
}

/** Ilustración informativa del acorde de la siguiente lección (HU-F-316). */
export function ManoEnAcorde({ nombre, className, ...diagrama }: ManoEnAcordeProps) {
  if (!diagrama.frets) return null;
  const { frets, baseFret = 1, barre } = diagrama;
  const lista = puntas(diagrama);
  const yCejilla = barre ? yTraste(barre.fret - baseFret + 1) - SEP_TRASTES / 2 : 0;

  return (
    <svg
      viewBox="0 0 192 190"
      width={192}
      height={190}
      className={className}
      role="img"
      fill="none"
    >
      <title>{`Mano formando el acorde ${nombre}`}</title>
      <Rejilla frets={frets} baseFret={baseFret} />

      <rect
        x={PALMA_X}
        y={Y0 + 10}
        width={40}
        height={TRASTES * SEP_TRASTES + 20}
        rx={16}
        className="fill-surface stroke-linea-fuerte"
        strokeWidth={1.5}
      />
      {barre && <Dedo x={xCuerda(barre.to)} y={yCejilla} />}
      {lista.map((p) => (
        <Dedo key={`d${p.x}`} x={p.x} y={p.y} />
      ))}

      {barre && (
        <rect
          x={xCuerda(barre.from) - 8}
          y={yCejilla - 7}
          width={xCuerda(barre.to) - xCuerda(barre.from) + 16}
          height={14}
          rx={7}
          className="fill-primary-claro"
        />
      )}
      {barre && (
        <text
          x={xCuerda(barre.from)}
          y={yCejilla + 3}
          textAnchor="middle"
          fontSize={9}
          className="fill-ink font-bold"
        >
          1
        </text>
      )}
      <Puntas lista={lista} />
    </svg>
  );
}
