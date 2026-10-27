import { useMemo, useState } from "react";
import { EstadoVacio, MensajeError, Skeleton } from "@/shared/ui";
import { PaginaAtril } from "../components/PaginaAtril";
import { TarjetaCursoDocente } from "../cursos/components/TarjetaCursoDocente";
import { useCursos } from "../cursos/hooks/useCursos";
import { unirCursos } from "../cursos/utils/tarjetas";
import { useResumenProgreso } from "../progreso/hooks";

const REJILLA = "grid gap-5 sm:grid-cols-2 xl:grid-cols-3";

function Cargando() {
  return (
    <ul className={REJILLA} aria-busy="true">
      {[0, 1, 2].map((n) => (
        <li key={n}>
          <Skeleton lineas={4} className="h-40 w-full" />
        </li>
      ))}
    </ul>
  );
}

function CursosActivos() {
  const cursos = useCursos("activo");
  const resumen = useResumenProgreso(null);
  const datos = useMemo(
    () =>
      cursos.data
        ? unirCursos(cursos.data, resumen.data?.cursos ?? [], resumen.data?.necesitan_apoyo ?? [])
        : [],
    [cursos.data, resumen.data],
  );
  if (cursos.isPending) return <Cargando />;
  if (cursos.error)
    return <MensajeError mensaje={cursos.error.message} onReintentar={() => cursos.refetch()} />;
  if (datos.length === 0) {
    return (
      <EstadoVacio
        titulo="Aún no tienes cursos asignados"
        descripcion="El administrador te asignará uno y te avisaremos por correo. Cuando llegue, podrás crear su contenido."
      />
    );
  }
  return (
    <>
      {/* Si el resumen falla, las tarjetas siguen con lo básico; no se tapa la lista. */}
      {resumen.error && (
        <MensajeError mensaje={resumen.error.message} onReintentar={() => resumen.refetch()} />
      )}
      <ul className={REJILLA}>
        {datos.map((d) => (
          <TarjetaCursoDocente key={d.curso.id} datos={d} />
        ))}
      </ul>
    </>
  );
}

/** Los archivados van plegados: se piden solo al abrirlos. */
function CursosArchivados() {
  const [abierto, setAbierto] = useState(false);
  return (
    <details
      className="mt-10"
      open={abierto}
      onToggle={(e) => setAbierto((e.currentTarget as HTMLDetailsElement).open)}
    >
      <summary className="cursor-pointer text-sm text-accent underline underline-offset-2 hover:decoration-2">
        Cursos archivados
      </summary>
      <div className="mt-4">{abierto && <ListaArchivados />}</div>
    </details>
  );
}

function ListaArchivados() {
  const { data, isPending, error, refetch } = useCursos("archivado");
  const datos = useMemo(() => (data ? unirCursos(data, [], []) : []), [data]);
  if (isPending) return <Cargando />;
  if (error) return <MensajeError mensaje={error.message} onReintentar={() => refetch()} />;
  if (datos.length === 0) return <EstadoVacio titulo="No tienes cursos archivados." />;
  return (
    <ul className={REJILLA}>
      {datos.map((d) => (
        <TarjetaCursoDocente key={d.curso.id} datos={d} />
      ))}
    </ul>
  );
}

/** Cursos del docente como tarjetas (HU-F-505): avance, a quién escribirle y acceso directo. */
export default function CursosPage() {
  return (
    <PaginaAtril titulo="Cursos" descripcion="Tus grupos: avance, código y quién necesita apoyo.">
      <CursosActivos />
      <CursosArchivados />
    </PaginaAtril>
  );
}
