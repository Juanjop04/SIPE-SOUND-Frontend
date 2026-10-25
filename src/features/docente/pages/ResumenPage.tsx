import { useState } from "react";
import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { TrasteDivider } from "@/shared/music";
import { EstadoVacio, MensajeError, Skeleton, claseBoton } from "@/shared/ui";
import { DialogoComentario, type Destinatario } from "../resumen/components/DialogoComentario";
import {
  ActividadDocente,
  FranjaResumen,
  SinActividad,
} from "../resumen/components/SeccionesResumen";
import { useResumenDocente } from "../resumen/hooks/useResumenDocente";

const FECHA = new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long" });

/** "Martes 21 de octubre · 3 cursos activos": saludo funcional, no de marketing. */
function encabezado(cursosActivos: number): string {
  const fecha = FECHA.format(new Date()).replace(",", "");
  const cursos = `${cursosActivos} ${cursosActivos === 1 ? "curso activo" : "cursos activos"}`;
  return `${fecha.charAt(0).toUpperCase()}${fecha.slice(1)} · ${cursos}`;
}

export default function ResumenPage() {
  const { data, isPending, error, refetch } = useResumenDocente();
  const [destinatario, setDestinatario] = useState<Destinatario | null>(null);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      {isPending && <Skeleton lineas={4} className="h-10 w-full" />}
      {error && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {data && data.cursos_activos === 0 && (
        <EstadoVacio
          titulo="Aún no tienes cursos."
          descripcion="Crea el primero y comparte su código con tu grupo."
          accion={
            <Link to={paths.docente.cursos} className={claseBoton()}>
              Ir a Cursos
            </Link>
          }
        />
      )}
      {data && data.cursos_activos > 0 && (
        <>
          <h1 className="font-display text-3xl font-semibold text-paper">
            {encabezado(data.cursos_activos)}
          </h1>
          <div className="mt-6">
            <FranjaResumen resumen={data} />
          </div>
          <TrasteDivider className="my-10" />
          <section aria-labelledby="empujon">
            <h2 id="empujon" className="font-display text-xl font-semibold text-paper">
              Necesitan un empujón
            </h2>
            <p className="mb-3 mt-1 text-sm text-muted">Sin actividad en los últimos 14 días.</p>
            <SinActividad filas={data.sin_actividad_14_dias} onComentar={setDestinatario} />
          </section>
          <section aria-labelledby="actividad" className="mt-12">
            <h2 id="actividad" className="mb-3 font-display text-xl font-semibold text-paper">
              Actividad reciente
            </h2>
            <ActividadDocente filas={data.actividad_reciente} />
          </section>
        </>
      )}
      <DialogoComentario destinatario={destinatario} onCerrar={() => setDestinatario(null)} />
    </main>
  );
}
