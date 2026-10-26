import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { fechaRelativa } from "@/shared/lib/formato";
import { useComentarios, useMisCursos } from "../api";

const MAXIMO = 2;

/**
 * Inicio (HU-F-311): los 2 comentarios sin leer más recientes del primer curso que los tenga.
 * Mostrarlos cuenta como leerlos (el backend los marca); sin comentarios nuevos no aparece.
 */
export function TuDocenteTeEscribio() {
  const { data: cursos } = useMisCursos();
  const curso = cursos?.find((c) => c.retroalimentaciones_sin_leer > 0) ?? null;
  const { data } = useComentarios(curso?.id ?? null, { refrescarLista: false });
  const nuevos = (data ?? []).filter((c) => c.nueva).slice(0, MAXIMO);
  if (!curso || nuevos.length === 0) return null;

  return (
    <section
      aria-labelledby="tu-docente"
      className="flex flex-col gap-3 rounded-caja border border-linea bg-surface p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="tu-docente" className="font-display text-xl font-semibold text-paper">
          Tu docente te escribió
        </h2>
        <Link
          to={paths.cursos}
          className="text-sm text-accent underline underline-offset-2 hover:decoration-2"
        >
          Ver todos
        </Link>
      </div>
      <ul className="flex flex-col gap-3">
        {nuevos.map((c) => (
          <li key={c.id} className="rounded-md border border-linea bg-ink-2 p-3 text-sm">
            <p className="flex items-center gap-2 font-mono text-xs text-muted">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
              {curso.nombre} · {fechaRelativa(c.creado_en)}
            </p>
            <p className="mt-1 text-paper">{c.mensaje}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
