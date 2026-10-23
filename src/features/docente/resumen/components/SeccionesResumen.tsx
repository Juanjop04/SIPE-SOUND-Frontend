import { Fragment } from "react";
import { formatearFecha } from "@/shared/lib/formato";
import { Button, EstadoVacio } from "@/shared/ui";
import type { ResumenDocente } from "../datos";
import type { Destinatario } from "./DialogoComentario";

/** Franja de cifras en mono separadas por trastes (no tarjetas KPI). */
export function FranjaResumen({ resumen }: { resumen: ResumenDocente }) {
  const cifras = [
    { clave: "estudiantes", etiqueta: "estudiantes", valor: resumen.estudiantes },
    { clave: "intentos", etiqueta: "intentos esta semana", valor: resumen.intentos_ultimos_7_dias },
    {
      clave: "evaluaciones",
      etiqueta: "evaluaciones publicadas",
      valor: resumen.evaluaciones_publicadas,
    },
  ];
  return (
    <dl className="flex flex-wrap gap-x-6 gap-y-3">
      {cifras.map((cifra, indice) => (
        <Fragment key={cifra.clave}>
          {indice > 0 && <span aria-hidden="true" className="w-px self-stretch bg-linea" />}
          <div>
            <dt className="font-mono text-xs text-muted">{cifra.etiqueta}</dt>
            <dd className="font-mono text-3xl tabular-nums text-paper">{cifra.valor}</dd>
          </div>
        </Fragment>
      ))}
    </dl>
  );
}

/** Estudiantes sin actividad en 14 días, con acción "Enviar comentario". */
export function SinActividad({
  filas,
  onComentar,
}: {
  filas: ResumenDocente["sin_actividad_14_dias"];
  onComentar: (destinatario: Destinatario) => void;
}) {
  if (filas.length === 0) {
    return <EstadoVacio titulo="Todos tus estudiantes practicaron en las últimas dos semanas." />;
  }
  return (
    <ul className="flex flex-col">
      {filas.map((fila) => (
        <li
          key={`${fila.curso_id}-${fila.estudiante_id}`}
          className="flex min-h-11 flex-wrap items-center justify-between gap-3 border-b border-linea py-2"
        >
          <span className="flex flex-col">
            <span className="text-paper">{fila.nombre}</span>
            <span className="text-xs text-muted">
              {fila.curso} ·{" "}
              <span className="font-mono">
                {fila.ultimo_avance
                  ? `último avance ${formatearFecha(fila.ultimo_avance)}`
                  : "sin actividad"}
              </span>
            </span>
          </span>
          <Button
            variante="secundario"
            tamano="sm"
            onClick={() =>
              onComentar({
                estudianteId: fila.estudiante_id,
                nombre: fila.nombre,
                cursoId: fila.curso_id,
              })
            }
          >
            Enviar comentario
          </Button>
        </li>
      ))}
    </ul>
  );
}

/** Últimos intentos de tus estudiantes: estudiante · evaluación · puntaje · fecha. */
export function ActividadDocente({ filas }: { filas: ResumenDocente["actividad_reciente"] }) {
  if (filas.length === 0) {
    return <EstadoVacio titulo="Aún no hay intentos de evaluación en tus cursos." />;
  }
  return (
    <ol className="flex flex-col">
      {filas.map((fila) => (
        <li
          key={`${fila.creado_en}-${fila.estudiante}`}
          className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-0.5 border-b border-linea py-2 text-sm sm:grid-cols-[7rem_1fr_1fr_auto]"
        >
          <span className="hidden font-mono text-muted sm:inline">
            {formatearFecha(fila.creado_en)}
          </span>
          <span className="text-paper">{fila.estudiante}</span>
          <span className="text-muted">{fila.evaluacion}</span>
          <span className="font-mono tabular-nums text-paper">{fila.puntaje} %</span>
        </li>
      ))}
    </ol>
  );
}
