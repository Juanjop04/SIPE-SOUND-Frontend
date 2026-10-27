import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { fechaRelativa } from "@/shared/lib/formato";
import {
  claseBoton,
  EstadoVacio,
  MensajeError,
  Skeleton,
  Table,
  type ColumnaTabla,
} from "@/shared/ui";
import { useCursosSinDocente, useDocentesEnEstado } from "../hooks";
import type { DocenteActividad } from "../tipos";
import { EstadoDeActividad } from "./EstadoDeActividad";

function Cifra({ etiqueta, valor }: { etiqueta: string; valor: number | undefined }) {
  return (
    <div className="rounded-caja border border-linea bg-surface p-4">
      <dt className="text-sm text-muted">{etiqueta}</dt>
      <dd className="mt-1 font-mono text-2xl tabular-nums text-paper">{valor ?? "—"}</dd>
    </div>
  );
}

const COLUMNAS: ColumnaTabla<DocenteActividad>[] = [
  { id: "nombre", encabezado: "Docente", celda: (d) => d.nombre },
  {
    id: "estado",
    encabezado: "Estado",
    celda: (d) => <EstadoDeActividad estado={d.estado_actividad} />,
  },
  {
    id: "ultima",
    encabezado: "Último movimiento",
    celda: (d) => (d.ultima_actividad ? fechaRelativa(d.ultima_actividad) : "Nunca"),
  },
  { id: "cursos", encabezado: "Cursos", numerica: true, celda: (d) => d.cursos_asignados },
  {
    id: "abrir",
    encabezado: "Detalle",
    celda: (d) => (
      <Link
        to={paths.admin.docente(d.docente_id)}
        aria-label={`Abrir a ${d.nombre}`}
        className={claseBoton({ variante: "secundario", tamano: "sm" })}
      >
        Abrir
      </Link>
    ),
  },
];

function Atencion() {
  const inactivos = useDocentesEnEstado("inactivo");
  const sinActividad = useDocentesEnEstado("sin_actividad");
  const error = inactivos.error ?? sinActividad.error;
  if (error) {
    return (
      <MensajeError
        mensaje={error.message}
        onReintentar={() => {
          void inactivos.refetch();
          void sinActividad.refetch();
        }}
      />
    );
  }
  if (!inactivos.data || !sinActividad.data) {
    return (
      <div aria-busy="true">
        <Skeleton lineas={4} className="h-11 w-full" />
      </div>
    );
  }
  // Solo importan quienes dejaron cursos sin acompañar.
  const filas = [...sinActividad.data.data, ...inactivos.data.data].filter(
    (d) => d.cursos_asignados > 0,
  );
  if (filas.length === 0) {
    return <EstadoVacio titulo="Ningún docente con cursos requiere atención." />;
  }
  return (
    <Table
      etiqueta="Docentes que requieren atención"
      filas={filas}
      columnas={COLUMNAS}
      obtenerId={(d) => d.docente_id}
    />
  );
}

/** Pestaña "Resumen": cifras reales y los docentes con cursos que dejaron de moverse. */
export function ResumenDocentes() {
  const activos = useDocentesEnEstado("activo");
  const inactivos = useDocentesEnEstado("inactivo");
  const sinActividad = useDocentesEnEstado("sin_actividad");
  const sinDocente = useCursosSinDocente();
  return (
    <div className="flex flex-col gap-8">
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Cifra etiqueta="Docentes activos" valor={activos.data?.meta.total} />
        <Cifra etiqueta="Docentes inactivos" valor={inactivos.data?.meta.total} />
        <Cifra etiqueta="Docentes sin actividad" valor={sinActividad.data?.meta.total} />
        <Cifra etiqueta="Cursos sin docente" valor={sinDocente.data?.meta.total} />
      </dl>
      <section aria-labelledby="atencion">
        <h2 id="atencion" className="mb-3 font-display text-xl font-semibold text-paper">
          Requieren atención
        </h2>
        <p className="mb-3 max-w-prose text-sm text-muted">
          Docentes inactivos (8 a 30 días) o sin actividad (más de 30) que tienen cursos asignados.
        </p>
        <Atencion />
      </section>
    </div>
  );
}
