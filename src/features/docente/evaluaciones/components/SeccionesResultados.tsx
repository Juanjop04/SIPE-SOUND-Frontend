import { Fragment } from "react";
import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { formatearFecha } from "@/shared/lib/formato";
import { Cuerda } from "@/shared/music";
import { Button, Table, type ColumnaTabla } from "@/shared/ui";
import type { ResultadosEvaluacion } from "../tipos";

type FilaEstudiante = ResultadosEvaluacion["estudiantes"][number];
const pct = (n: number | null) => (n === null ? "—" : `${n} %`);

/** presentaron 22/25 │ aprobaron 68 % │ promedio 74 % (franja de cifras, sin tarjetas KPI). */
export function CifrasResultados({ r }: { r: ResultadosEvaluacion }) {
  const cifras = [
    {
      clave: "presentaron",
      valor:
        r.estudiantes_del_curso === null
          ? String(r.estudiantes_que_presentaron)
          : `${r.estudiantes_que_presentaron}/${r.estudiantes_del_curso}`,
    },
    { clave: "aprobaron", valor: pct(r.aprobaron_pct) },
    { clave: "promedio", valor: pct(r.promedio_mejor_puntaje) },
  ];
  return (
    <dl className="flex flex-wrap items-stretch gap-x-6 gap-y-3 rounded-caja border border-linea bg-surface p-5">
      {cifras.map((c, i) => (
        <Fragment key={c.clave}>
          {i > 0 && <span aria-hidden="true" className="w-px self-stretch bg-linea" />}
          <div>
            <dt className="text-sm text-muted">{c.clave}</dt>
            <dd className="font-mono text-2xl tabular-nums text-paper">{c.valor}</dd>
          </div>
        </Fragment>
      ))}
    </dl>
  );
}

/** "¿Qué repaso mañana?": de la más difícil a la más fácil, con su % de aciertos. */
export function PreguntasDificiles({ r }: { r: ResultadosEvaluacion }) {
  return (
    <ol className="flex flex-col gap-4">
      {r.preguntas.map((p) => (
        <li key={p.id} className="grid grid-cols-[1fr_4rem] items-center gap-x-4 gap-y-2">
          <p className="text-sm text-paper">
            <span className="mr-2 font-mono text-primary-claro">
              {String(p.orden).padStart(2, "0")}
            </span>
            {p.enunciado}
          </p>
          <span className="text-right font-mono text-sm tabular-nums text-paper">
            {pct(p.aciertos_pct)}
          </span>
          <Cuerda
            grosor={4}
            className="col-span-2"
            valor={p.aciertos_pct ?? 0}
            etiqueta={`Aciertos de la pregunta ${p.orden}`}
            sonando={(p.aciertos_pct ?? 0) >= r.minimo_requerido}
          />
        </li>
      ))}
    </ol>
  );
}

export function EstudiantesResultados({
  r,
  cursoId,
}: {
  r: ResultadosEvaluacion;
  cursoId: number | null;
}) {
  const detalle = (e: FilaEstudiante) =>
    cursoId === null
      ? null
      : `${paths.docente.curso(cursoId)}?pestana=estudiantes&estudiante=${e.estudiante_id}`;
  const columnas: ColumnaTabla<FilaEstudiante>[] = [
    {
      id: "nombre",
      encabezado: "Estudiante",
      celda: (e) => {
        const a = detalle(e);
        return a ? (
          <Link
            to={a}
            className="text-paper underline decoration-linea-fuerte underline-offset-4 hover:text-accent hover:decoration-accent"
          >
            {e.nombre}
          </Link>
        ) : (
          e.nombre
        );
      },
    },
    {
      id: "mejor",
      encabezado: "Mejor puntaje",
      numerica: true,
      celda: (e) => `${e.mejor_puntaje} %`,
    },
    { id: "intentos", encabezado: "Intentos", numerica: true, celda: (e) => e.intentos },
    {
      id: "aprobado",
      encabezado: "Aprobó",
      celda: (e) => (
        <span className={e.aprobado ? "text-success" : "text-muted"}>
          {e.aprobado ? "● sí" : "× no"}
        </span>
      ),
    },
    {
      id: "ultimo",
      encabezado: "Último intento",
      celda: (e) => (
        <span className="font-mono text-sm text-muted">{formatearFecha(e.ultimo_intento)}</span>
      ),
    },
  ];
  return (
    <Table
      etiqueta="Resultados por estudiante"
      filas={r.estudiantes}
      columnas={columnas}
      obtenerId={(e) => e.estudiante_id}
    />
  );
}

export function SinPresentar({
  r,
  onRecordar,
}: {
  r: ResultadosEvaluacion;
  onRecordar: (e: ResultadosEvaluacion["sin_presentar"][number]) => void;
}) {
  return (
    <ul className="flex flex-col divide-y divide-linea">
      {r.sin_presentar.map((e) => (
        <li key={e.estudiante_id} className="flex items-center justify-between gap-3 py-2">
          <span className="text-sm text-paper">{e.nombre}</span>
          <Button
            variante="fantasma"
            tamano="sm"
            onClick={() => onRecordar(e)}
            aria-label={`Enviar recordatorio a ${e.nombre}`}
          >
            Enviar recordatorio
          </Button>
        </li>
      ))}
    </ul>
  );
}
