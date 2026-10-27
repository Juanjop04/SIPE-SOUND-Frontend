import { useCallback, useState } from "react";
import { TrasteDivider } from "@/shared/music";
import {
  Button,
  EstadoVacio,
  MensajeError,
  Paginacion,
  Skeleton,
  Table,
  type ColumnaTabla,
} from "@/shared/ui";
import { DetalleCurso } from "../cursos/components/DetalleCurso";
import { DrawerNuevoCurso } from "../cursos/components/DrawerNuevoCurso";
import { FiltrosCursos } from "../cursos/components/FiltrosCursos";
import { useCursos } from "../cursos/hooks";
import type { CursoAdmin } from "../cursos/tipos";
import { useFiltrosCursos } from "../cursos/useFiltrosCursos";

const COLUMNAS: ColumnaTabla<CursoAdmin>[] = [
  { id: "curso", encabezado: "Curso", celda: (c) => c.nombre },
  {
    id: "docente",
    encabezado: "Docente",
    celda: (c) => [c.docente, c.docente_apellido].filter(Boolean).join(" ") || "Sin docente",
  },
  {
    id: "estado",
    encabezado: "Estado",
    celda: (c) => (c.estado === "activo" ? "Activo" : "Archivado"),
  },
  { id: "estudiantes", encabezado: "Estudiantes", numerica: true, celda: (c) => c.estudiantes },
  { id: "bloques", encabezado: "Bloques", numerica: true, celda: (c) => c.bloques_en_ruta },
  {
    id: "codigo",
    encabezado: "Código",
    celda: (c) => <span className="font-mono text-xs">{c.codigo_invitacion}</span>,
  },
];

/** Todos los cursos (solo admin, HU-F-405 / HU-B-406): filtros en la URL y estudiantes por curso. */
export default function CursosPage() {
  const { filtros, cambiar, hayFiltros } = useFiltrosCursos();
  const [abierto, setAbierto] = useState<CursoAdmin | null>(null);
  const [creando, setCreando] = useState(false);
  const quitar = useCallback(() => cambiar({ docente: null, estado: null, q: null }), [cambiar]);
  const { data, isPending, error, refetch } = useCursos(filtros);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-paper">Cursos</h1>
          <p className="mt-2 max-w-prose text-sm text-muted">
            Todos los cursos de la plataforma, con sus estudiantes inscritos. Aquí asignas o quitas
            al docente de un curso, retiras el acceso de una persona sin tocar su progreso y creas
            cursos con o sin docente.
          </p>
        </div>
        <Button onClick={() => setCreando(true)}>Nuevo curso</Button>
      </div>
      <TrasteDivider className="my-6" />
      <div className="flex flex-col gap-6">
        <FiltrosCursos
          filtros={filtros}
          hayFiltros={hayFiltros}
          onCambiar={cambiar}
          onQuitar={quitar}
        />
        {isPending && (
          <div aria-busy="true">
            <Skeleton lineas={6} className="h-11 w-full" />
          </div>
        )}
        {error && !data && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
        {data && data.data.length === 0 && (
          <EstadoVacio
            titulo="No hay cursos con estos filtros."
            accion={
              hayFiltros ? (
                <Button variante="secundario" onClick={quitar}>
                  Quitar filtros
                </Button>
              ) : undefined
            }
          />
        )}
        {data && data.data.length > 0 && (
          <div className="flex flex-col gap-3">
            <Table
              etiqueta="Cursos"
              filas={data.data}
              columnas={COLUMNAS}
              obtenerId={(c) => c.id}
              onFilaClick={setAbierto}
            />
            <Paginacion
              meta={data.meta}
              onPagina={(pagina) => cambiar({ pagina: String(pagina) })}
            />
          </div>
        )}
      </div>
      <DetalleCurso curso={abierto} onCerrar={() => setAbierto(null)} />
      <DrawerNuevoCurso abierto={creando} onCerrar={() => setCreando(false)} />
    </main>
  );
}
