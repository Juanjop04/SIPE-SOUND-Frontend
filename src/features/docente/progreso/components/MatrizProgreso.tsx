import { Cuerda, MarcaEstado } from "@/shared/music";
import { ESCRITORIO_MEDIO, useMediaQuery } from "@/shared/hooks/useMediaQuery";
import type { BloqueDelCurso, ColumnaMatriz, FilaMatriz } from "../tipos";
import { nombreCompleto, textoCelda } from "../utils";

interface MatrizProgresoProps {
  filas: FilaMatriz[];
  columnas: ColumnaMatriz[];
  /** Aprobados, intentos y pregunta más fallada de cada bloque (pie de la matriz). */
  bloques: BloqueDelCurso[];
  estudiantesDelCurso: number;
  onVer: (estudianteId: string) => void;
}

function Celda({ fila, columna }: { fila: FilaMatriz; columna: ColumnaMatriz }) {
  const celda = fila.bloques.find((b) => b.bloque_id === columna.bloque_id);
  if (!celda) return <td className="px-2 text-center text-muted">—</td>;
  return (
    <td className="px-2 text-center">
      <span className="sr-only">
        {textoCelda(fila, columna, celda.estado, celda.mejor_puntaje)}
      </span>
      <span aria-hidden="true" className="inline-flex items-center gap-1">
        <MarcaEstado estado={celda.estado} className="[&_.sr-only]:hidden" />
        {celda.mejor_puntaje !== null && (
          <span className="font-mono text-xs tabular-nums text-muted">{celda.mejor_puntaje}</span>
        )}
      </span>
    </td>
  );
}

function PieDeBloque({ bloque, total }: { bloque: BloqueDelCurso | undefined; total: number }) {
  if (!bloque) return <td className="px-2" />;
  const pregunta = bloque.pregunta_mas_fallada;
  return (
    <td className="px-2 text-center align-top text-xs text-muted">
      <p className="font-mono tabular-nums text-paper">
        {bloque.aprobados}/{total}
      </p>
      <p className="font-mono tabular-nums">{bloque.intentos} int.</p>
      {pregunta && (
        <p
          title={`${pregunta.enunciado} (${pregunta.fallos} fallos)`}
          className="max-w-[7rem] truncate"
        >
          {pregunta.enunciado}
        </p>
      )}
    </td>
  );
}

function Tabla({ filas, columnas, bloques, estudiantesDelCurso, onVer }: MatrizProgresoProps) {
  return (
    <div className="max-h-[70vh] overflow-auto rounded-caja border border-linea">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">Progreso de cada estudiante en cada bloque de la ruta</caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky left-0 top-0 z-20 min-w-[11rem] border-b border-linea bg-surface px-3 py-2 text-left font-medium text-muted"
            >
              Estudiante
            </th>
            {columnas.map((c) => (
              <th
                key={c.bloque_id}
                scope="col"
                title={c.titulo}
                className="sticky top-0 z-10 border-b border-linea bg-surface px-2 py-2 text-center font-mono font-medium text-muted"
              >
                <span aria-hidden="true">{c.numero}</span>
                <span className="sr-only">
                  Bloque {c.numero}, {c.titulo}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((f) => (
            <tr key={f.estudiante_id} className="border-b border-linea last:border-b-0">
              <th
                scope="row"
                className="sticky left-0 z-10 bg-ink px-3 py-2 text-left font-normal text-paper"
              >
                <button
                  type="button"
                  onClick={() => onVer(f.estudiante_id)}
                  className="text-left hover:underline"
                >
                  {nombreCompleto(f)}
                </button>
                <Cuerda
                  valor={f.avance_pct}
                  etiqueta={`Avance de ${nombreCompleto(f)}`}
                  grosor={1}
                  className="mt-1"
                />
              </th>
              {columnas.map((c) => (
                <Celda key={c.bloque_id} fila={f} columna={c} />
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-linea bg-surface">
            <th
              scope="row"
              className="sticky left-0 z-10 bg-surface px-3 py-2 text-left text-xs font-medium text-muted"
            >
              Por bloque
              <span className="block font-normal">aprobados · intentos · pregunta más fallada</span>
            </th>
            {columnas.map((c) => (
              <PieDeBloque
                key={c.bloque_id}
                bloque={bloques.find((b) => b.bloque_id === c.bloque_id)}
                total={estudiantesDelCurso}
              />
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

/** Móvil: una tarjeta por estudiante; los símbolos se desplazan dentro de la fila, no de la página. */
function Lista({ filas, columnas, onVer }: MatrizProgresoProps) {
  return (
    <ul className="divide-y divide-linea rounded-caja border border-linea">
      {filas.map((f) => (
        <li key={f.estudiante_id} className="flex flex-col gap-2 p-3">
          <button
            type="button"
            onClick={() => onVer(f.estudiante_id)}
            className="w-fit text-left text-paper hover:underline"
          >
            {nombreCompleto(f)}
          </button>
          <Cuerda valor={f.avance_pct} etiqueta={`Avance de ${nombreCompleto(f)}`} grosor={1} />
          <ul className="flex gap-3 overflow-x-auto pb-1">
            {columnas.map((c) => {
              const celda = f.bloques.find((b) => b.bloque_id === c.bloque_id);
              if (!celda) return null;
              return (
                <li key={c.bloque_id} className="flex shrink-0 flex-col items-center text-xs">
                  <span className="sr-only">
                    {textoCelda(f, c, celda.estado, celda.mejor_puntaje)}
                  </span>
                  <span aria-hidden="true" className="font-mono text-muted">
                    {c.numero}
                  </span>
                  <span aria-hidden="true">
                    <MarcaEstado estado={celda.estado} className="[&_.sr-only]:hidden" />
                  </span>
                  <span aria-hidden="true" className="font-mono tabular-nums text-muted">
                    {celda.mejor_puntaje ?? "·"}
                  </span>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
}

/** Matriz estudiantes × bloques al estilo tablatura: cada fila es una cuerda y cada columna un traste. */
export function MatrizProgreso(props: MatrizProgresoProps) {
  const ancha = useMediaQuery(ESCRITORIO_MEDIO);
  return ancha ? <Tabla {...props} /> : <Lista {...props} />;
}
