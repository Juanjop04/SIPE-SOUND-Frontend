import { useState } from "react";
import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { TrasteDivider } from "@/shared/music";
import { EstadoVacio, MensajeError, Skeleton, claseBoton } from "@/shared/ui";
import { Redactor, type Destinatario } from "@/features/mensajes";
import { BarraFiltros } from "../progreso/components/BarraFiltros";
import { DrawerProgreso } from "../progreso/components/DrawerProgreso";
import { EvaluacionesCurso } from "../progreso/components/EvaluacionesCurso";
import { FranjaProgreso } from "../progreso/components/FranjaProgreso";
import { EsqueletoGraficos, GraficosProgreso } from "../progreso/components/GraficosProgreso";
import { NecesitanApoyo } from "../progreso/components/NecesitanApoyo";
import { SeccionMatriz } from "../progreso/components/SeccionMatriz";
import { useResumenProgreso, useSeries } from "../progreso/hooks";
import type {
  CursoProgreso,
  FiltrosProgreso,
  FiltrosSeries,
  NecesitaApoyo,
} from "../progreso/tipos";
import { useFiltrosProgreso } from "../progreso/useFiltrosProgreso";
import { cifrasDe, nombreCompleto } from "../progreso/utils";

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

const aDestinatario = (f: NecesitaApoyo): Destinatario => ({
  tipo: "usuario",
  id: f.estudiante_id,
  etiqueta: nombreCompleto(f),
  detalle: f.curso,
});

function Seccion({
  id,
  titulo,
  children,
}: {
  id: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="min-w-0">
      <h2 id={id} className="mb-4 font-display text-xl font-semibold text-paper">
        {titulo}
      </h2>
      {children}
    </section>
  );
}

interface GraficasYEvaluacionesProps {
  series: ReturnType<typeof useSeries>;
  elegido: CursoProgreso | null;
  filtros: FiltrosSeries;
  onBloque: (bloqueId: number) => void;
}

/** Gráficas y evaluaciones del curso: ambas salen de la misma consulta de series. */
function GraficasYEvaluaciones({ series, elegido, filtros, onBloque }: GraficasYEvaluacionesProps) {
  return (
    <>
      <Seccion id="graficas" titulo="Cómo va el grupo">
        {series.isPending && <EsqueletoGraficos />}
        {series.error && !series.data && (
          <MensajeError mensaje={series.error.message} onReintentar={() => series.refetch()} />
        )}
        {series.data && (
          <GraficosProgreso
            series={series.data}
            curso={elegido}
            filtros={filtros}
            onBloque={onBloque}
          />
        )}
      </Seccion>
      <Seccion id="evaluaciones" titulo="Evaluaciones">
        {series.isPending && <Skeleton lineas={3} className="h-12 w-full" />}
        {series.data && (
          <EvaluacionesCurso
            evaluaciones={series.data.evaluaciones}
            bloques={elegido?.bloques ?? []}
          />
        )}
      </Seccion>
    </>
  );
}

interface ApoyoYMatrizProps {
  actual: ReturnType<typeof useResumenProgreso>;
  elegido: CursoProgreso | null;
  filtros: FiltrosProgreso;
  bloqueId: number | null;
  onCambiar: (cambios: Record<string, string | null>) => void;
  onEscribir: (fila: NecesitaApoyo) => void;
}

/** "Necesitan apoyo" y la matriz de HU-F-406, sin cambios de comportamiento. */
function ApoyoYMatriz({
  actual,
  elegido,
  filtros,
  bloqueId,
  onCambiar,
  onEscribir,
}: ApoyoYMatrizProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
      <section aria-labelledby="apoyo" className="lg:order-2">
        <h2 id="apoyo" className="mb-2 font-display text-xl font-semibold text-paper">
          Necesitan apoyo
        </h2>
        {actual.error && <MensajeError mensaje={actual.error.message} />}
        {actual.data && (
          <NecesitanApoyo
            filas={actual.data.necesitan_apoyo}
            onVer={(id) => onCambiar({ estudiante: id })}
            onEscribir={onEscribir}
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
            bloqueId={bloqueId}
            onCambiar={onCambiar}
            onVer={(id) => onCambiar({ estudiante: id })}
          />
        ) : (
          <p className="text-sm text-muted">
            Elige un curso para ver a cada estudiante en cada bloque de su ruta.
          </p>
        )}
      </section>
    </div>
  );
}

/**
 * Panel de progreso (HU-F-406 / HU-F-506): filtros → cifras → gráficas → evaluaciones → matriz y
 * apoyo. El resumen vive arriba y el detalle abajo, sin pestañas.
 */
export default function ProgresoPage() {
  const { filtros, series: filtrosSeries, estudianteId, cambiar } = useFiltrosProgreso();
  // Todos los cursos alimentan los filtros; con uno elegido, "Necesitan apoyo" sale solo de él.
  const todos = useResumenProgreso(null);
  const actual = useResumenProgreso(filtros.curso);
  const series = useSeries(filtrosSeries);
  const [escribiendoA, setEscribiendoA] = useState<Destinatario | null>(null);
  const cursos = todos.data?.cursos ?? [];
  const elegido = cursos.find((c) => c.id === filtros.curso) ?? null;
  const nombres = Object.fromEntries(cursos.map((c) => [c.id, c.nombre]));
  const abiertas = series.data?.evaluaciones.filter((e) => e.estado === "publicada").length;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
      <h1 className="font-display text-3xl font-semibold text-paper">Progreso</h1>
      <p className="mt-2 max-w-prose text-sm text-muted">
        Cómo va tu grupo, qué evaluaciones están abiertas y a quién escribirle hoy.
      </p>
      {todos.isPending && <Skeleton lineas={4} className="mt-6 h-10 w-full" />}
      {todos.error && (
        <MensajeError mensaje={todos.error.message} onReintentar={() => todos.refetch()} />
      )}
      {todos.data && cursos.length === 0 && <SinCursos />}
      {cursos.length > 0 && (
        <>
          <div className="mt-6">
            <BarraFiltros cursos={cursos} filtros={filtrosSeries} onCambiar={cambiar} />
          </div>
          <div className="mt-6">
            <FranjaProgreso
              cifras={{
                ...cifrasDe(elegido ? [elegido] : cursos),
                evaluacionesAbiertas: abiertas,
              }}
            />
          </div>
          <TrasteDivider className="my-8" />
          <div className="flex flex-col gap-14">
            <GraficasYEvaluaciones
              series={series}
              elegido={elegido}
              filtros={filtrosSeries}
              onBloque={(bloque) => cambiar({ bloque: String(bloque) })}
            />
            <ApoyoYMatriz
              actual={actual}
              elegido={elegido}
              filtros={filtros}
              bloqueId={filtrosSeries.bloque}
              onCambiar={cambiar}
              onEscribir={(fila) => setEscribiendoA(aDestinatario(fila))}
            />
          </div>
        </>
      )}
      <DrawerProgreso
        estudianteId={estudianteId}
        nombresDeCursos={nombres}
        onCerrar={() => cambiar({ estudiante: null })}
      />
      <Redactor
        abierto={escribiendoA !== null}
        onCerrar={() => setEscribiendoA(null)}
        soloDocentes={false}
        para={escribiendoA ?? undefined}
      />
    </main>
  );
}
