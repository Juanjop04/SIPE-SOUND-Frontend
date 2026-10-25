import type { Intento } from "@/features/evaluaciones";
import type { BloqueRuta } from "@/features/ruta";
import { formatearFecha } from "@/shared/lib/formato";
import { Table, type ColumnaTabla } from "@/shared/ui";
import { MiniLineaEvolucion } from "./MiniLineaEvolucion";

const APROBACION_POR_DEFECTO = 80;

const COLUMNAS: ColumnaTabla<Intento>[] = [
  {
    id: "fecha",
    encabezado: "Fecha",
    celda: (i) => formatearFecha(i.creado_en),
    valorOrden: (i) => i.creado_en,
  },
  {
    id: "puntaje",
    encabezado: "Puntaje",
    numerica: true,
    celda: (i) => `${i.puntaje} %`,
    valorOrden: (i) => i.puntaje,
  },
  {
    id: "aprobado",
    encabezado: "Resultado",
    celda: (i) => (
      <span className="inline-flex items-center gap-2">
        <span aria-hidden="true" className={i.aprobado ? "text-success" : "text-muted"}>
          {i.aprobado ? "●" : "○"}
        </span>
        {i.aprobado ? "aprobado" : "no aprobado"}
      </span>
    ),
  },
];

/** Intentos de la evaluación de un bloque: tabla y mini-línea de evolución. */
export function HistorialEvaluacion({
  bloque,
  intentos,
}: {
  bloque: BloqueRuta;
  intentos: Intento[];
}) {
  const cronologicos = [...intentos].reverse();
  return (
    <section aria-labelledby={`historial-${bloque.id}`} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 id={`historial-${bloque.id}`} className="font-display text-lg font-semibold text-paper">
          Bloque {bloque.numero} · {bloque.titulo}
        </h3>
        <MiniLineaEvolucion
          puntajes={cronologicos.map((i) => i.puntaje)}
          aprobacion={APROBACION_POR_DEFECTO}
          aprobado={bloque.estado === "aprobado"}
        />
      </div>
      <Table
        etiqueta={`Intentos de la evaluación del bloque ${bloque.numero}`}
        filas={intentos}
        columnas={COLUMNAS}
        obtenerId={(i) => i.id}
      />
    </section>
  );
}
