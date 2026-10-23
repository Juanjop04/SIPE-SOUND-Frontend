// Dibuja un diagrama de acorde: cuadrícula de trastes/cuerdas, con × / ○ arriba y
// números de dedo en los puntos. Los datos vienen de la columna "diagram" de acordes.

/** Traste por cuerda, de Mi grave a Mi aguda: "x" = no se toca, 0 = al aire. */
export type TrasteCuerda = number | "x";

export interface Cejilla {
  fret: number;
  /** Índices de cuerda (0 = Mi grave). */
  from: number;
  to: number;
}

export interface ChordDiagramProps {
  frets?: TrasteCuerda[] | null;
  /** Dedo (1–4) en cada cuerda, o null. */
  fingers?: (number | null)[] | null;
  /** Traste desde el que se dibuja (1 = normal). */
  baseFret?: number;
  barre?: Cejilla | null;
}

const NUM_TRASTES = 4;
const ANCHO = 120;
const ALTO = 140;
const MARGEN_SUPERIOR = 26; // espacio para los símbolos × / ○
const MARGEN_LATERAL = 14;
const ANCHO_REJILLA = ANCHO - MARGEN_LATERAL * 2;
const ALTO_REJILLA = ALTO - MARGEN_SUPERIOR - 10;
const SEPARACION_CUERDAS = ANCHO_REJILLA / 5; // 6 cuerdas = 5 espacios
const SEPARACION_TRASTES = ALTO_REJILLA / NUM_TRASTES;
const TRASTES_REJILLA = Array.from({ length: NUM_TRASTES + 1 }, (_, t) => t);

const xCuerda = (i: number) => MARGEN_LATERAL + i * SEPARACION_CUERDAS;
const yTraste = (t: number) => MARGEN_SUPERIOR + t * SEPARACION_TRASTES;
const sePisa = (f: TrasteCuerda | undefined): f is number => typeof f === "number" && f > 0;

function simboloCuerda(f: TrasteCuerda): string {
  if (f === "x") return "×";
  return f === 0 ? "○" : "";
}

/** Cuerdas verticales y trastes horizontales; la cejuela (traste 0) es gruesa si se empieza en 1. */
function Rejilla({ cuerdas, conCejuela }: { cuerdas: number; conCejuela: boolean }) {
  const posiciones = Array.from({ length: cuerdas }, (_, i) => xCuerda(i));
  return (
    <>
      {posiciones.map((x) => (
        <line
          key={`cuerda-${x}`}
          x1={x}
          y1={MARGEN_SUPERIOR}
          x2={x}
          y2={MARGEN_SUPERIOR + ALTO_REJILLA}
          className="stroke-linea-fuerte"
          strokeWidth={1}
        />
      ))}
      {TRASTES_REJILLA.map((t) => (
        <line
          key={`traste-${t}`}
          x1={MARGEN_LATERAL}
          y1={yTraste(t)}
          x2={MARGEN_LATERAL + ANCHO_REJILLA}
          y2={yTraste(t)}
          className="stroke-linea-fuerte"
          strokeWidth={t === 0 && conCejuela ? 3 : 1}
        />
      ))}
    </>
  );
}

export function ChordDiagram({ frets, fingers, baseFret = 1, barre }: ChordDiagramProps) {
  if (!frets) return null;
  const centroTraste = (f: number) => yTraste(f - baseFret + 1) - SEPARACION_TRASTES / 2;

  return (
    <svg
      viewBox={`0 0 ${ANCHO} ${ALTO}`}
      className="mx-auto w-full max-w-[110px]"
      aria-hidden="true"
    >
      {baseFret > 1 && (
        <text
          x={2}
          y={MARGEN_SUPERIOR + SEPARACION_TRASTES / 2 + 4}
          className="fill-muted"
          fontSize="9"
        >
          {baseFret}
        </text>
      )}

      {/* La posición de cada cuerda es fija (6 cuerdas): el índice es su identidad. */}
      {frets.map((f, i) => (
        <text
          key={`marca-${xCuerda(i)}`}
          x={xCuerda(i)}
          y={MARGEN_SUPERIOR - 10}
          textAnchor="middle"
          fontSize="11"
          className={f === "x" ? "fill-danger" : "fill-muted"}
        >
          {simboloCuerda(f)}
        </text>
      ))}

      <Rejilla cuerdas={frets.length} conCejuela={baseFret === 1} />

      {barre && (
        <rect
          x={xCuerda(barre.from) - 4}
          y={yTraste(barre.fret - baseFret) + SEPARACION_TRASTES / 2 - 5}
          width={xCuerda(barre.to) - xCuerda(barre.from) + 8}
          height={10}
          rx={5}
          className="fill-primary-claro"
        />
      )}

      {frets.map((f, i) =>
        sePisa(f) ? (
          <g key={`punto-${xCuerda(i)}`}>
            <circle cx={xCuerda(i)} cy={centroTraste(f)} r={7} className="fill-primary-claro" />
            {fingers?.[i] ? (
              <text
                x={xCuerda(i)}
                y={centroTraste(f) + 3}
                textAnchor="middle"
                fontSize="8"
                className="fill-ink font-bold"
              >
                {fingers[i]}
              </text>
            ) : null}
          </g>
        ) : null,
      )}
    </svg>
  );
}
