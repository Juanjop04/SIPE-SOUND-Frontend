import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { Cuerda } from "@/shared/music";
import type { LeccionRuta } from "../types";

/** Lecciones como lista numerada en mono; cada una con su cuerda (suena si está completa). */
export function ListaLecciones({ lecciones }: { lecciones: LeccionRuta[] }) {
  if (lecciones.length === 0) {
    return <p className="text-sm text-muted">Este bloque aún no tiene lecciones publicadas.</p>;
  }
  return (
    <ol className="flex flex-col">
      {lecciones.map((leccion) => (
        <li
          key={leccion.id}
          className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 border-b border-linea py-3"
        >
          <span className="font-mono text-sm text-muted">
            {String(leccion.numero).padStart(2, "0")}
          </span>
          <Link
            to={paths.leccion(leccion.id)}
            className="text-paper underline decoration-linea-fuerte underline-offset-4 transition-colors duration-rapida hover:text-accent hover:decoration-accent"
          >
            {leccion.titulo}
          </Link>
          <span className="flex w-24 items-center gap-2 sm:w-32">
            {leccion.duracion_min && (
              <span className="font-mono text-xs text-muted">{leccion.duracion_min} min</span>
            )}
            <Cuerda
              valor={leccion.completado ? 100 : 0}
              sonando={leccion.completado}
              grosor={1}
              etiqueta={`Lección ${leccion.numero}: ${leccion.completado ? "completada" : "pendiente"}`}
            />
          </span>
        </li>
      ))}
    </ol>
  );
}
