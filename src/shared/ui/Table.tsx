import { useState, type ReactNode } from "react";
import { cn } from "@/shared/lib/cn.js";
import { ordenarFilas, siguienteOrden, type OrdenTabla } from "./ordenarFilas";

export type { DireccionOrden, OrdenTabla } from "./ordenarFilas";

export interface ColumnaTabla<T> {
  id: string;
  encabezado: string;
  celda: (fila: T) => ReactNode;
  /** Cifras: mono, tabular y alineadas a la derecha (contrato 05 §2.3). */
  numerica?: boolean;
  /** Si existe, la columna es ordenable por este valor. */
  valorOrden?: (fila: T) => string | number;
}

export interface TableProps<T> {
  /** Título accesible de la tabla (caption oculto). */
  etiqueta: string;
  filas: T[];
  columnas: ColumnaTabla<T>[];
  obtenerId: (fila: T) => string | number;
  /** Controlado (p. ej. desde la URL). Sin onOrdenChange, la tabla ordena por su cuenta. */
  orden?: OrdenTabla | null;
  onOrdenChange?: (orden: OrdenTabla) => void;
  /** Fila clicable: la primera celda es un botón que cubre la fila (teclado: Tab + Enter). */
  onFilaClick?: (fila: T) => void;
  className?: string;
}

const ARIA_SORT = { asc: "ascending", desc: "descending" } as const;

export function Table<T>({
  etiqueta,
  filas,
  columnas,
  obtenerId,
  orden: ordenExterno,
  onOrdenChange,
  onFilaClick,
  className,
}: TableProps<T>) {
  const [ordenPropio, setOrdenPropio] = useState<OrdenTabla | null>(null);
  const orden = onOrdenChange ? (ordenExterno ?? null) : ordenPropio;
  const columnaOrden = columnas.find((c) => c.id === orden?.columna);
  const visibles = ordenarFilas(filas, columnaOrden?.valorOrden, orden?.direccion ?? "asc");

  function ordenarPor(columna: string) {
    const nuevo = siguienteOrden(orden, columna);
    if (onOrdenChange) onOrdenChange(nuevo);
    else setOrdenPropio(nuevo);
  }

  return (
    <div className={cn("overflow-auto", className)}>
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{etiqueta}</caption>
        <thead>
          <tr>
            {columnas.map((columna) => (
              <Cabecera key={columna.id} columna={columna} orden={orden} onOrdenar={ordenarPor} />
            ))}
          </tr>
        </thead>
        <tbody>
          {visibles.map((fila) => (
            <tr
              key={obtenerId(fila)}
              className={cn(
                "relative h-11 border-b border-linea",
                onFilaClick && "cursor-pointer hover:bg-ink-2",
              )}
            >
              {columnas.map((columna, indice) => (
                <td
                  key={columna.id}
                  className={cn(
                    "px-3 text-paper",
                    columna.numerica && "text-right font-mono tabular-nums",
                  )}
                >
                  {onFilaClick && indice === 0 ? (
                    <button
                      type="button"
                      onClick={() => onFilaClick(fila)}
                      className="text-left after:absolute after:inset-0"
                    >
                      {columna.celda(fila)}
                    </button>
                  ) : (
                    columna.celda(fila)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface CabeceraProps<T> {
  columna: ColumnaTabla<T>;
  orden: OrdenTabla | null;
  onOrdenar: (columna: string) => void;
}

// Cabecera fija; si la columna es ordenable, un botón (Enter/Espacio) y aria-sort.
function Cabecera<T>({ columna, orden, onOrdenar }: CabeceraProps<T>) {
  const activa = orden?.columna === columna.id ? orden : null;
  return (
    <th
      scope="col"
      aria-sort={activa ? ARIA_SORT[activa.direccion] : undefined}
      className={cn(
        "sticky top-0 z-10 h-11 border-b border-linea bg-ink-2 px-3 font-medium text-muted",
        columna.numerica ? "text-right" : "text-left",
      )}
    >
      {columna.valorOrden ? (
        <button
          type="button"
          onClick={() => onOrdenar(columna.id)}
          className="inline-flex items-center gap-1 hover:text-paper"
        >
          {columna.encabezado}
          {activa && <span aria-hidden="true">{activa.direccion === "asc" ? "↑" : "↓"}</span>}
        </button>
      ) : (
        columna.encabezado
      )}
    </th>
  );
}
