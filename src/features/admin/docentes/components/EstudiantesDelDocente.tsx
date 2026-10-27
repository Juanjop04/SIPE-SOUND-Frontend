import { Link } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { paths } from "@/shared/config/paths.js";
import { fechaRelativa } from "@/shared/lib/formato";
import { EstadoVacio, MensajeError, Skeleton, Table, type ColumnaTabla } from "@/shared/ui";
import { cursosAdminApi, cursosAdminKeys, type EstudianteDeCurso } from "../externos";
import type { CursoResumen } from "../tipos";

interface Fila extends EstudianteDeCurso {
  cursoId: number;
  curso: string;
}

const COLUMNAS: ColumnaTabla<Fila>[] = [
  {
    id: "nombre",
    encabezado: "Estudiante",
    celda: (e) => [e.nombre, e.apellido].filter(Boolean).join(" "),
  },
  {
    id: "curso",
    encabezado: "Curso",
    celda: (e) => (
      <Link
        to={paths.docente.curso(e.cursoId)}
        className="text-accent underline underline-offset-2 hover:decoration-2"
      >
        {e.curso}
      </Link>
    ),
  },
  { id: "avance", encabezado: "Avance", numerica: true, celda: (e) => `${e.avance_pct} %` },
  {
    id: "ultimo",
    encabezado: "Último avance",
    celda: (e) => (e.ultimo_avance ? fechaRelativa(e.ultimo_avance) : "Sin avance"),
  },
];

/**
 * Estudiantes de los cursos del docente, con el enlace al seguimiento del curso (HU-F-506).
 * Sin correos: el administrador los ve en Todos los cursos si los necesita.
 */
export function EstudiantesDelDocente({ cursos }: { cursos: CursoResumen[] }) {
  const consultas = useQueries({
    queries: cursos.map((c) => ({
      queryKey: cursosAdminKeys.estudiantes(c.curso_id, 1),
      queryFn: () => cursosAdminApi.estudiantes(c.curso_id, 1),
    })),
  });
  if (cursos.length === 0) {
    return <EstadoVacio titulo="Este docente aún no tiene cursos activos." />;
  }
  if (consultas.some((q) => q.isPending)) {
    return (
      <div aria-busy="true">
        <Skeleton lineas={4} className="h-11 w-full" />
      </div>
    );
  }
  const fallida = consultas.find((q) => q.error);
  if (fallida?.error) {
    return <MensajeError mensaje={fallida.error.message} onReintentar={() => fallida.refetch()} />;
  }
  const filas: Fila[] = consultas.flatMap((q, i) =>
    (q.data?.data ?? []).map((e) => ({
      ...e,
      cursoId: cursos[i].curso_id,
      curso: cursos[i].nombre,
    })),
  );
  const incompleta = consultas.some((q) => q.data && q.data.meta.total > q.data.data.length);
  if (filas.length === 0) {
    return <EstadoVacio titulo="Sus cursos aún no tienen estudiantes inscritos." />;
  }
  return (
    <div className="flex flex-col gap-3">
      <Table
        etiqueta="Estudiantes de los cursos del docente"
        filas={filas}
        columnas={COLUMNAS}
        obtenerId={(e) => `${e.cursoId}-${e.estudiante_id}`}
      />
      {incompleta && (
        <p className="text-sm text-muted">
          Se muestran los primeros 20 de cada curso. Abre el curso para ver a todos.
        </p>
      )}
    </div>
  );
}
