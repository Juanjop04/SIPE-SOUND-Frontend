import { useCallback, useState } from "react";
import { Atril } from "@/shared/music/ilustraciones";
import { Drawer, EstadoVacio, MensajeError, Paginacion, Skeleton } from "@/shared/ui";
import { DialogoComentario, type CursoDetalle, type Destinatario } from "../datos";
import { useEstudiantesCurso } from "../hooks";
import type { OrdenEstudiantes } from "../tipos";
import { useFiltrosEstudiantes } from "../useFiltrosEstudiantes";
import { aCsv, descargar } from "../utils";
import { BarraEstudiantes } from "./BarraEstudiantes";
import { DetalleEstudiante } from "./DetalleEstudiante";
import { DialogoRetirar, type ARetirar } from "./DialogoRetirar";
import { TablaEstudiantes } from "./TablaEstudiantes";

/** Pestaña Estudiantes del curso (HU-F-309): filtros y detalle en la URL. */
export function PestanaEstudiantes({ curso }: { curso: CursoDetalle }) {
  const { filtros, estudianteId, cambiar } = useFiltrosEstudiantes();
  const { data, isPending, error, refetch } = useEstudiantesCurso(curso.id, filtros);
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
        onExportar={() =>
          data &&
          descargar(
            `estudiantes-${curso.codigo_invitacion}.csv`,
            aCsv(data.data, totalBloques ?? 0),
          )
        }
      />
      {isPending && <Skeleton lineas={5} className="h-11 w-full" />}
      {error && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {data && data.meta.total === 0 && !filtros.q && (
        <EstadoVacio
          titulo="Aún no tienes estudiantes."
          descripcion={`Comparte el código ${curso.codigo_invitacion} con tu grupo.`}
          accion={<Atril className="h-auto w-40" />}
        />
      )}
      {data && data.meta.total === 0 && filtros.q && (
        <EstadoVacio titulo={`Nadie coincide con «${filtros.q}».`} />
      )}
      {data && data.data.length > 0 && (
        <>
          <TablaEstudiantes
            filas={data.data}
            totalBloques={totalBloques}
            soloLectura={soloLectura}
            onVer={(e) => cambiar({ estudiante: e.estudiante_id })}
            onComentar={(e) => comentarA(e.estudiante_id, e.nombre)}
            onRetirar={(e) => setARetirar({ estudianteId: e.estudiante_id, nombre: e.nombre })}
          />
          <Paginacion meta={data.meta} onPagina={(p) => cambiar({ pagina: String(p) })} />
        </>
      )}
      <Drawer
        ancho="amplio"
        abierto={estudianteId !== null}
        onCerrar={() => cambiar({ estudiante: null })}
        titulo={nombreDetalle ?? "Estudiante"}
      >
        {estudianteId && (
          <DetalleEstudiante
            cursoId={curso.id}
            estudianteId={estudianteId}
            soloLectura={soloLectura}
            onComentar={(d) => comentarA(d.estudiante_id, d.nombre)}
            onRetirar={(d) => setARetirar({ estudianteId: d.estudiante_id, nombre: d.nombre })}
          />
        )}
      </Drawer>
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
