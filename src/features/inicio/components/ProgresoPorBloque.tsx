import type { BloqueRuta } from "@/features/ruta";
import { Cuerda, MarcaEstado } from "@/shared/music";
import { avanceDeBloque } from "../utils/siguientePaso";

/** Una fila por bloque: estado (símbolo + texto accesible), nombre, cuerda y porcentaje. */
export function ProgresoPorBloque({ bloques }: { bloques: BloqueRuta[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {bloques.map((bloque) => {
        const avance = avanceDeBloque(bloque);
        return (
          <li
            key={bloque.id}
            className="grid grid-cols-[auto_1fr_3.5rem] items-center gap-x-3 gap-y-1"
          >
            <MarcaEstado estado={bloque.estado} />
            <span className="truncate text-sm text-paper">
              <span className="font-mono text-muted">{String(bloque.numero).padStart(2, "0")}</span>{" "}
              {bloque.titulo}
            </span>
            <span className="text-right font-mono text-sm tabular-nums text-muted">
              {avance === null ? "—" : `${avance} %`}
            </span>
            <Cuerda
              grosor={4}
              className="col-span-3"
              valor={avance ?? 0}
              etiqueta={`Avance del bloque ${bloque.numero}`}
              sonando={avance === 100}
            />
          </li>
        );
      })}
    </ul>
  );
}
