import { Link } from "react-router-dom";
import { formatearFecha } from "@/shared/lib/formato";
import { paths } from "@/shared/config/paths.js";
import type { Actividad } from "../utils/calculos";

/** Lista cronológica con la fecha en mono (hoy solo intentos: únicos con fecha en la API). */
export function ActividadReciente({ actividad }: { actividad: Actividad[] }) {
  if (actividad.length === 0) return null;
  return (
    <section aria-labelledby="actividad-reciente">
      <h2 id="actividad-reciente" className="font-display text-xl font-semibold text-paper">
        Actividad reciente
      </h2>
      <ol className="mt-3 flex flex-col">
        {actividad.map(({ id, fecha, bloque, intento }) => (
          <li
            key={id}
            className="grid grid-cols-[7rem_1fr_auto] gap-3 border-b border-linea py-2 text-sm"
          >
            <span className="font-mono text-muted">{formatearFecha(fecha)}</span>
            <Link
              to={`${paths.inicio}?bloque=${bloque.id}`}
              className="text-paper hover:text-accent"
            >
              Evaluación del bloque {bloque.numero}
            </Link>
            <span className={`font-mono ${intento.aprobado ? "text-success" : "text-muted"}`}>
              {intento.puntaje} %
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
