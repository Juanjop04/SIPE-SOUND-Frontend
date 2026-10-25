import { useId, useState, type ReactNode } from "react";
import { Button } from "../Button";

export interface TablaGrafico {
  columnas: string[];
  filas: (string | number)[][];
}

export interface MarcoGraficoProps {
  titulo: string;
  /** Qué mide y en qué unidad ("Porcentaje de avance por bloque"). */
  unidad: string;
  /** Frase de lectura: lo que dice el gráfico en palabras ("Llevas 40 % del bloque 3"). */
  lectura?: string;
  /** Los mismos datos, para quien no puede o no quiere leer el gráfico (contrato 05 §6). */
  tabla: TablaGrafico;
  children: ReactNode;
}

function Tabla({ tabla, titulo }: { tabla: TablaGrafico; titulo: string }) {
  return (
    <div className="overflow-auto rounded-caja border border-linea">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{titulo}</caption>
        <thead>
          <tr>
            {tabla.columnas.map((c) => (
              <th
                key={c}
                scope="col"
                className="border-b border-linea bg-surface px-3 py-2 text-left font-medium text-muted"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tabla.filas.map((fila) => (
            <tr key={fila.join("|")} className="border-b border-linea last:border-b-0">
              {fila.map((celda, i) => (
                <td
                  key={tabla.columnas[i]}
                  className={i === 0 ? "px-3 py-2 text-paper" : "px-3 py-2 font-mono text-muted"}
                >
                  {celda}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Marco de todo gráfico: título, unidad, frase de lectura y "Ver como tabla" (los mismos datos).
 * Los gráficos son de Recharts (SVG) y se importan solo desde páginas cargadas bajo demanda.
 */
export function MarcoGrafico({ titulo, unidad, lectura, tabla, children }: MarcoGraficoProps) {
  const [comoTabla, setComoTabla] = useState(false);
  const id = useId();
  return (
    <figure aria-labelledby={id} className="flex flex-col gap-3">
      <figcaption className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={id} className="font-display text-lg font-semibold text-paper">
            {titulo}
          </h3>
          <p className="text-sm text-muted">{unidad}</p>
          {lectura && <p className="mt-1 text-sm text-paper">{lectura}</p>}
        </div>
        <Button
          variante="fantasma"
          tamano="sm"
          aria-pressed={comoTabla}
          onClick={() => setComoTabla((valor) => !valor)}
        >
          {comoTabla ? "Ver como gráfico" : "Ver como tabla"}
        </Button>
      </figcaption>
      {comoTabla ? <Tabla tabla={tabla} titulo={titulo} /> : children}
    </figure>
  );
}
