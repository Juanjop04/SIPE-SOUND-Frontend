import { Link } from "react-router-dom";
import { useAcordes, type Acorde } from "@/features/acordes";
import type { BloqueRuta } from "@/features/ruta";
import { paths } from "@/shared/config/paths.js";
import { ChordDiagram } from "@/shared/music";
import { estadoVisible } from "../utils/siguientePaso";
import { PildoraEstado } from "./PildoraEstado";

/** Miniatura del bloque: el diagrama de su primer acorde real (HU-B-324) o su número. */
function Miniatura({ bloque, acordes }: { bloque: BloqueRuta; acordes: Map<string, Acorde> }) {
  const primero = bloque.acordes?.map((n) => acordes.get(n)).find((a) => a?.diagram);
  if (primero?.diagram) {
    return (
      <span className="w-20">
        <ChordDiagram {...primero.diagram} />
      </span>
    );
  }
  return (
    <span aria-hidden="true" className="py-6 font-mono text-4xl text-primary-claro">
      {String(bloque.numero).padStart(2, "0")}
    </span>
  );
}

/** Teselas de los bloques de la ruta con su estado; enlazan al bloque en /ruta. */
export function BloquesRuta({ bloques }: { bloques: BloqueRuta[] }) {
  const { data } = useAcordes();
  const acordes = new Map((data ?? []).map((a) => [a.nombre, a]));
  return (
    <ul className="flex snap-x gap-3 overflow-x-auto pb-2">
      {bloques.map((bloque) => {
        const { estado, completadas, total } = estadoVisible(bloque);
        return (
          <li key={bloque.id} className="w-40 shrink-0 snap-start">
            <Link
              to={`${paths.ruta}?bloque=${bloque.id}`}
              className="flex h-full flex-col items-center gap-2 rounded-caja border border-linea bg-ink-2 p-3 text-center transition-colors duration-rapida hover:border-accent hover:bg-surface-2"
            >
              <Miniatura bloque={bloque} acordes={acordes} />
              <span className="line-clamp-2 text-sm font-medium text-paper">{bloque.titulo}</span>
              <span className="font-mono text-xs text-muted">
                {completadas} de {total} lecciones
              </span>
              <PildoraEstado estado={estado} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
