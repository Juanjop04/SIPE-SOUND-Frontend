import { Button, EstadoVacio, MensajeError, Skeleton } from "@/shared/ui";
import {
  useAsignarme,
  useCursosDisponibles,
  type CursoDisponible,
} from "../hooks/useCursosDisponibles";

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

function FilaDisponible({ curso }: { curso: CursoDisponible }) {
  const asignarme = useAsignarme();
  return (
    <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-paper">{curso.nombre}</p>
        {curso.descripcion && (
          <p className="line-clamp-2 text-sm text-muted">{curso.descripcion}</p>
        )}
        <p className="mt-1 font-mono text-xs text-muted">
          {curso.nivel} · {plural(curso.estudiantes, "estudiante", "estudiantes")} ·{" "}
          {plural(curso.bloques_en_ruta, "bloque", "bloques")}
        </p>
      </div>
      <Button
        cargando={asignarme.isPending}
        onClick={() => asignarme.mutate(curso.id)}
        aria-label={`Asignarme al curso ${curso.nombre}`}
      >
        Asignarme
      </Button>
    </li>
  );
}

/**
 * Cursos que el administrador dejó sin docente (HU-F-516): se toman con "Asignarme". Sus
 * estudiantes, si ya los tiene, siguen inscritos.
 */
export function CursosDisponibles() {
  const { data, isPending, error, refetch } = useCursosDisponibles(true);
  return (
    <section aria-labelledby="disponibles" className="mt-12">
      <h2 id="disponibles" className="font-display text-xl font-semibold text-paper">
        Cursos disponibles
      </h2>
      <p className="mt-1 text-sm text-muted">
        Cursos sin docente. Si te asignas, quedas a cargo de su ruta y de sus estudiantes.
      </p>
      <div className="mt-3">
        {isPending && <Skeleton lineas={2} className="h-14 w-full" />}
        {error && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
        {data && data.length === 0 && <EstadoVacio titulo="No hay cursos disponibles ahora." />}
        {data && data.length > 0 && (
          <ul className="divide-y divide-linea">
            {data.map((curso) => (
              <FilaDisponible key={curso.id} curso={curso} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
