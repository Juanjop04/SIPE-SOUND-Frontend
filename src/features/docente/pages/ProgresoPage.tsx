import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { TrasteDivider } from "@/shared/music";
import { EstadoVacio, MensajeError, Skeleton, claseBoton } from "@/shared/ui";
import { DrawerProgreso } from "../progreso/components/DrawerProgreso";
import { FranjaProgreso } from "../progreso/components/FranjaProgreso";
import { NecesitanApoyo } from "../progreso/components/NecesitanApoyo";
import { SelectorCurso } from "../progreso/components/SelectorCurso";
import { SeccionMatriz } from "../progreso/components/SeccionMatriz";
import { useResumenProgreso } from "../progreso/hooks";
import { useFiltrosProgreso } from "../progreso/useFiltrosProgreso";
import { cifrasDe } from "../progreso/utils";

function SinCursos() {
  return (
    <EstadoVacio
      titulo="Aún no tienes cursos."
      descripcion="Crea el primero y comparte su código con tu grupo."
      accion={
        <Link to={paths.docente.cursos} className={claseBoton()}>
          Ir a Cursos
        </Link>
      }
    />
  );
}

/** Cómo van los estudiantes en cada bloque de la ruta (HU-F-406 / HU-B-408). */
export default function ProgresoPage() {
  const { filtros, estudianteId, cambiar } = useFiltrosProgreso();
  // Todos los cursos alimentan el selector; con uno elegido, "Necesitan apoyo" sale solo de él.
  const todos = useResumenProgreso(null);
  const actual = useResumenProgreso(filtros.curso);
  const cursos = todos.data?.cursos ?? [];
  const elegido = cursos.find((c) => c.id === filtros.curso) ?? null;
  const nombres = Object.fromEntries(cursos.map((c) => [c.id, c.nombre]));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
      <h1 className="font-display text-3xl font-semibold text-paper">Progreso</h1>
      <p className="mt-2 max-w-prose text-sm text-muted">
        Qué bloques van aprobando tus estudiantes y a quién escribirle hoy.
      </p>
      {todos.isPending && <Skeleton lineas={4} className="mt-6 h-10 w-full" />}
      {todos.error && (
        <MensajeError mensaje={todos.error.message} onReintentar={() => todos.refetch()} />
      )}
      {todos.data && cursos.length === 0 && <SinCursos />}
      {cursos.length > 0 && (
        <>
          <div className="mt-6">
            <SelectorCurso
              cursos={cursos}
              valor={filtros.curso}
              onCambiar={(curso) => cambiar({ curso })}
            />
          </div>
          <div className="mt-6">
            <FranjaProgreso cifras={cifrasDe(elegido ? [elegido] : cursos)} />
          </div>
          <TrasteDivider className="my-8" />
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
            <section aria-labelledby="apoyo" className="lg:order-2">
              <h2 id="apoyo" className="mb-2 font-display text-xl font-semibold text-paper">
                Necesitan apoyo
              </h2>
              {actual.error && <MensajeError mensaje={actual.error.message} />}
              {actual.data && (
                <NecesitanApoyo
                  filas={actual.data.necesitan_apoyo}
                  onVer={(id) => cambiar({ estudiante: id })}
                />
              )}
            </section>
            <section aria-labelledby="matriz" className="min-w-0 lg:order-1">
              <h2 id="matriz" className="mb-3 font-display text-xl font-semibold text-paper">
                Matriz por bloque
              </h2>
              {elegido ? (
                <SeccionMatriz
                  curso={elegido}
                  filtros={filtros}
                  onCambiar={cambiar}
                  onVer={(id) => cambiar({ estudiante: id })}
                />
              ) : (
                <p className="text-sm text-muted">
                  Elige un curso para ver a cada estudiante en cada bloque de su ruta.
                </p>
              )}
            </section>
          </div>
        </>
      )}
      <DrawerProgreso
        estudianteId={estudianteId}
        nombresDeCursos={nombres}
        onCerrar={() => cambiar({ estudiante: null })}
      />
    </main>
  );
}
