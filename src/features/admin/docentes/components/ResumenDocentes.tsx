import { useSearchParams } from "react-router-dom";
import { fechaRelativa } from "@/shared/lib/formato";
import {
  CifraCompacta,
  EstadoVacio,
  MensajeError,
  Skeleton,
  Table,
  type ColumnaTabla,
} from "@/shared/ui";
import { useCursosSinDocente, useDocentesEnEstado } from "../hooks";
import type { DocenteActividad, EstadoActividad } from "../tipos";
import { COLUMNA_DETALLE, COLUMNA_NOMBRE } from "./ColumnaDetalle";
import { EstadoDeActividad } from "./EstadoDeActividad";

const COLUMNAS: ColumnaTabla<DocenteActividad>[] = [
  { ...COLUMNA_NOMBRE, encabezado: "Docente" },
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
  COLUMNA_DETALLE,
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
    return <EstadoVacio titulo="Todos los docentes con cursos están activos." />;
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

/** Pestaña "Resumen": cifras reales que filtran, la leyenda de estados y quiénes requieren atención. */
export function ResumenDocentes() {
  const [, setParametros] = useSearchParams();
  const activos = useDocentesEnEstado("activo");
  const inactivos = useDocentesEnEstado("inactivo");
  const sinActividad = useDocentesEnEstado("sin_actividad");
  const sinDocente = useCursosSinDocente();
  const cursosSinDocente = sinDocente.data?.meta.total;

  // Abre la pestaña Docentes ya filtrada por ese estado de actividad.
  const abrir = (estado: EstadoActividad) => () => setParametros({ tab: "docentes", estado });

  return (
    <div className="flex flex-col gap-6">
      <div
        role="group"
        aria-label="Docentes por estado de actividad"
        className="grid grid-cols-2 gap-2 min-[821px]:grid-cols-[repeat(auto-fill,minmax(170px,220px))]"
      >
        <CifraCompacta
          etiqueta="Activos"
          valor={activos.data?.meta.total}
          colorValor="text-success"
          onClick={abrir("activo")}
        />
        <CifraCompacta
          etiqueta="Inactivos"
          valor={inactivos.data?.meta.total}
          colorValor="text-aviso"
          onClick={abrir("inactivo")}
        />
        <CifraCompacta
          etiqueta="Sin actividad"
          valor={sinActividad.data?.meta.total}
          colorValor="text-muted"
          onClick={abrir("sin_actividad")}
        />
        <CifraCompacta
          etiqueta="Cursos sin docente"
          valor={cursosSinDocente}
          colorValor={cursosSinDocente ? "text-danger" : "text-paper"}
        />
      </div>
      <p className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted">
        <span>
          <strong className="font-semibold text-success">Activo:</strong> movimiento en los últimos
          7 días
        </span>
        <span>
          <strong className="font-semibold text-aviso">Inactivo:</strong> de 8 a 30 días
        </span>
        <span>
          <strong className="font-semibold text-paper">Sin actividad:</strong> más de 30 días o
          nunca
        </span>
      </p>
      <section aria-labelledby="atencion" className="flex flex-col gap-3">
        <h2 id="atencion" className="font-display text-xl font-semibold text-paper">
          Requieren atención
        </h2>
        <p className="max-w-prose text-sm text-muted">
          Docentes inactivos o sin actividad que tienen cursos asignados.
        </p>
        <Atencion />
      </section>
    </div>
  );
}
