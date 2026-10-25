import { useCallback, useState, type ComponentProps } from "react";
import { Atril } from "@/shared/music/ilustraciones";
import {
  Drawer,
  EstadoVacio,
  MensajeError,
  Paginacion,
  Skeleton,
  type MetaPaginacion,
} from "@/shared/ui";
import { DialogoComentario, type CursoDetalle, type Destinatario } from "../datos";
import { useListaEstudiantes } from "../useListaEstudiantes";
import type { EstudianteCurso, OrdenEstudiantes } from "../tipos";
import { aCsv, descargar, type FiltroRapido } from "../utils";
import { BarraEstudiantes } from "./BarraEstudiantes";
import { FiltrosRapidos } from "./FiltrosRapidos";
import { DetalleEstudiante } from "./DetalleEstudiante";
import { DialogoRetirar, type ARetirar } from "./DialogoRetirar";
import { TablaEstudiantes } from "./TablaEstudiantes";

function SinFilas(props: { total: number; filas: number; q?: string; codigo: string }) {
  const { total, filas, q, codigo } = props;
  if (total === 0 && !q) {
    return (
      <EstadoVacio
        titulo="Aún no tienes estudiantes."
        descripcion={`Comparte el código ${codigo} con tu grupo.`}
        accion={<Atril className="h-auto w-40" />}
      />
    );
  }
  if (total === 0) return <EstadoVacio titulo={`Nadie coincide con «${q}».`} />;
  if (filas === 0) {
    return <EstadoVacio titulo="Nadie cumple este filtro." descripcion="Prueba con «Todos»." />;
  }
  return null;
}

interface PieProps {
  rapido: FiltroRapido;
  meta: MetaPaginacion;
  mostrados: number;
  onPagina: (pagina: number) => void;
}

/** Sin filtro rápido, la paginación del backend; con filtro, solo avisa si el curso no cupo entero. */
function PieDeLista({ rapido, meta, mostrados, onPagina }: PieProps) {
  if (rapido === "todos") return <Paginacion meta={meta} onPagina={onPagina} />;
  if (meta.total <= mostrados) return null;
  return (
    <p className="text-sm text-muted">
      Mostrando los primeros {mostrados} de {meta.total} estudiantes.
    </p>
  );
}

interface CajonProps {
  cursoId: number;
  estudianteId: string | null;
  nombre: string | undefined;
  soloLectura: boolean;
  onCerrar: () => void;
  onComentar: ComponentProps<typeof DetalleEstudiante>["onComentar"];
  onRetirar: ComponentProps<typeof DetalleEstudiante>["onRetirar"];
}

/** El progreso de un estudiante sin salir de la lista (el id va en la URL: `?estudiante=`). */
function CajonDeEstudiante({
  cursoId,
  estudianteId,
  nombre,
  soloLectura,
  ...acciones
}: CajonProps) {
  return (
    <Drawer
      ancho="amplio"
      abierto={estudianteId !== null}
      onCerrar={acciones.onCerrar}
      titulo={nombre ?? "Estudiante"}
    >
      {estudianteId && (
        <DetalleEstudiante
          cursoId={cursoId}
          estudianteId={estudianteId}
          soloLectura={soloLectura}
          onComentar={acciones.onComentar}
          onRetirar={acciones.onRetirar}
        />
      )}
    </Drawer>
  );
}

function exportarCsv(codigo: string, filas: EstudianteCurso[], totalBloques: number | null) {
  descargar(`estudiantes-${codigo}.csv`, aCsv(filas, totalBloques ?? 0));
}

/** Pestaña Estudiantes del curso (HU-F-309): filtros y detalle en la URL. */
export function PestanaEstudiantes({ curso }: { curso: CursoDetalle }) {
  const lista = useListaEstudiantes(curso.id);
  const { filtros, rapido, estudianteId, cambiar, apoyo, filas } = lista;
  const { data, isPending, error, refetch } = lista.consulta;
  const [comentario, setComentario] = useState<Destinatario | null>(null);
  const [aRetirar, setARetirar] = useState<ARetirar | null>(null);
  const soloLectura = curso.archivado_en !== null;
  const totalBloques = curso.ruta.length > 0 ? curso.ruta.length : null;
  const nombreDetalle = data?.data.find((e) => e.estudiante_id === estudianteId)?.nombre;

  const buscar = useCallback((q: string) => cambiar({ q: q || null, pagina: null }), [cambiar]);
  const comentarA = (estudiante: string, nombre: string) =>
    setComentario({ cursoId: curso.id, estudianteId: estudiante, nombre });

  return (
    <div className="flex flex-col gap-6">
      <BarraEstudiantes
        busqueda={filtros.q ?? ""}
        orden={filtros.orden}
        total={data?.meta.total ?? null}
        onBuscar={buscar}
        onOrdenar={(orden: OrdenEstudiantes) => cambiar({ orden, pagina: null })}
        onExportar={() => data && exportarCsv(curso.codigo_invitacion, data.data, totalBloques)}
      />
      <FiltrosRapidos
        actual={rapido}
        onElegir={(estado) => cambiar({ estado: estado === "todos" ? null : estado, pagina: null })}
      />
      {isPending && <Skeleton lineas={5} className="h-11 w-full" />}
      {error && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {data && (
        <SinFilas
          total={data.meta.total}
          filas={filas.length}
          q={filtros.q}
          codigo={curso.codigo_invitacion}
        />
      )}
      {data && filas.length > 0 && (
        <>
          <TablaEstudiantes
            filas={filas}
            apoyo={apoyo}
            totalBloques={totalBloques}
            soloLectura={soloLectura}
            onVer={(e) => cambiar({ estudiante: e.estudiante_id })}
            onComentar={(e) => comentarA(e.estudiante_id, e.nombre)}
            onRetirar={(e) => setARetirar({ estudianteId: e.estudiante_id, nombre: e.nombre })}
          />
          <PieDeLista
            rapido={rapido}
            meta={data.meta}
            mostrados={data.data.length}
            onPagina={(p) => cambiar({ pagina: String(p) })}
          />
        </>
      )}
      <CajonDeEstudiante
        cursoId={curso.id}
        estudianteId={estudianteId}
        nombre={nombreDetalle}
        soloLectura={soloLectura}
        onCerrar={() => cambiar({ estudiante: null })}
        onComentar={(d) => comentarA(d.estudiante_id, d.nombre)}
        onRetirar={(d) => setARetirar({ estudianteId: d.estudiante_id, nombre: d.nombre })}
      />
      <DialogoComentario destinatario={comentario} onCerrar={() => setComentario(null)} />
      <DialogoRetirar
        cursoId={curso.id}
        estudiante={aRetirar}
        onCerrar={() => setARetirar(null)}
        onRetirado={() => cambiar({ estudiante: null })}
      />
    </div>
  );
}
