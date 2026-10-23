// Dibuja un diagrama de acorde: cuadricula de trastes/cuerdas,
// con X/O arriba y numeros de dedo en los puntos.
//
// Props esperadas (vienen de la columna "diagram" en Supabase):
//   frets:   6 valores, de la cuerda Mi grave a la Mi aguda.
//            "x" = no se toca, 0 = al aire, numero = traste
//   fingers: que dedo (1-4) va en cada cuerda, o null
//   baseFret: desde que traste empieza a dibujarse (1 = normal)
//   barre:   opcional, { fret, from, to } para dibujar la cejilla

const NUM_TRASTES = 4;

export default function ChordDiagram({ frets, fingers, baseFret = 1, barre }) {
  if (!frets) return null;

  const width = 120;
  const height = 140;
  const marginTop = 26; // espacio para los simbolos X/O
  const marginSide = 14;
  const gridWidth = width - marginSide * 2;
  const gridHeight = height - marginTop - 10;
  const colGap = gridWidth / 5; // 6 cuerdas = 5 espacios
  const rowGap = gridHeight / NUM_TRASTES;

  const xCuerda = (i) => marginSide + i * colGap;
  const yTraste = (t) => marginTop + t * rowGap;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto w-full max-w-[110px]">
      {/* Numero de traste base, si no empieza en el 1 */}
      {baseFret > 1 && (
        <text x={2} y={marginTop + rowGap / 2 + 4} className="fill-muted" fontSize="9">
          {baseFret}
        </text>
      )}

      {/* X / O arriba de cada cuerda */}
      {frets.map((f, i) => (
        <text
          key={`marca-${i}`}
          x={xCuerda(i)}
          y={marginTop - 10}
          textAnchor="middle"
          fontSize="11"
          className={f === "x" ? "fill-danger" : "fill-muted"}
        >
          {f === "x" ? "×" : f === 0 ? "○" : ""}
        </text>
      ))}

      {/* Lineas verticales (cuerdas) */}
      {frets.map((_, i) => (
        <line
          key={`cuerda-${i}`}
          x1={xCuerda(i)}
          y1={marginTop}
          x2={xCuerda(i)}
          y2={marginTop + gridHeight}
          stroke="currentColor"
          className="text-border"
          strokeWidth={1}
        />
      ))}

      {/* Lineas horizontales (trastes) */}
      {Array.from({ length: NUM_TRASTES + 1 }).map((_, t) => (
        <line
          key={`traste-${t}`}
          x1={marginSide}
          y1={yTraste(t)}
          x2={marginSide + gridWidth}
          y2={yTraste(t)}
          stroke="currentColor"
          className="text-border"
          strokeWidth={t === 0 && baseFret === 1 ? 3 : 1}
        />
      ))}

      {/* Cejilla (barre), si aplica */}
      {barre && (
        <rect
          x={xCuerda(barre.from) - 4}
          y={yTraste(barre.fret - baseFret) + rowGap / 2 - 5}
          width={xCuerda(barre.to) - xCuerda(barre.from) + 8}
          height={10}
          rx={5}
          className="fill-primary"
        />
      )}

      {/* Puntos con el numero de dedo en cada cuerda */}
      {frets.map((f, i) => {
        if (f === "x" || f === 0 || f === undefined) return null;
        const traste = f - baseFret + 1;
        return (
          <circle
            key={`punto-${i}`}
            cx={xCuerda(i)}
            cy={yTraste(traste) - rowGap / 2}
            r={7}
            className="fill-primary"
          />
        );
      })}
      {frets.map((f, i) => {
        if (f === "x" || f === 0 || f === undefined || !fingers?.[i]) return null;
        const traste = f - baseFret + 1;
        return (
          <text
            key={`dedo-${i}`}
            x={xCuerda(i)}
            y={yTraste(traste) - rowGap / 2 + 3}
            textAnchor="middle"
            fontSize="8"
            className="fill-paper font-bold"
          >
            {fingers[i]}
          </text>
        );
      })}
    </svg>
  );
}
