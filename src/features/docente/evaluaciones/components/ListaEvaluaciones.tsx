import { useId } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { formatearFecha } from "@/shared/lib/formato";
import {
  claseBoton,
  EstadoVacio,
  MensajeError,
  Select,
  Skeleton,
  Table,
  type ColumnaTabla,
} from "@/shared/ui";
import { Autoria } from "../externos";
import { useEvaluacionesDocente } from "../api";
import { useCursos, type Curso } from "../datos";
import type { EstadoEvaluacion, EvaluacionDocente } from "../tipos";

const ESTADOS: { valor: EstadoEvaluacion; etiqueta: string; punto: string }[] = [
  { valor: "borrador", etiqueta: "Borrador", punto: "bg-muted" },
  { valor: "publicada", etiqueta: "Publicada", punto: "bg-success" },
  { valor: "cerrada", etiqueta: "Cerrada", punto: "bg-linea-fuerte" },
];

/** Punto + texto: el estado nunca depende solo del color. */
function Estado({ estado }: { estado: EstadoEvaluacion }) {
  const datos = ESTADOS.find((e) => e.valor === estado) ?? ESTADOS[0];
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${datos.punto}`} />
      {datos.etiqueta}
    </span>
  );
}

function columnasDe(
  cursos: Curso[] | undefined,
  conCurso: boolean,
): ColumnaTabla<EvaluacionDocente>[] {
  const nombreCurso = (e: EvaluacionDocente) =>
    e.curso_id === null
      ? `Bloque ${e.bloque_id ?? "—"} · ruta general`
      : (cursos?.find((c) => c.id === e.curso_id)?.nombre ?? `Curso ${e.curso_id}`);
  const curso: ColumnaTabla<EvaluacionDocente>[] = conCurso
    ? [
        {
          id: "curso",
          encabezado: "Curso",
          celda: (e) => <span className="text-muted">{nombreCurso(e)}</span>,
        },
      ]
    : [];
  return [
    {
      id: "titulo",
      encabezado: "Título",
      celda: (e) => (
        <Link
          to={paths.docente.evaluacion(e.id)}
          className="text-paper underline decoration-linea-fuerte underline-offset-4 hover:text-accent hover:decoration-accent"
        >
          {e.titulo}
        </Link>
      ),
    },
    ...curso,
    { id: "preguntas", encabezado: "Preguntas", numerica: true, celda: (e) => e.preguntas },
    {
      id: "autoria",
      encabezado: "Autoría",
      celda: (e) => <Autoria autor={e.autor} modificadoPor={e.modificado_por} />,
    },
    { id: "estado", encabezado: "Estado", celda: (e) => <Estado estado={e.estado} /> },
    {
      id: "limite",
      encabezado: "Fecha límite",
      celda: (e) => (
        <span className="font-mono text-sm text-muted">
          {e.fecha_limite ? formatearFecha(e.fecha_limite) : "—"}
        </span>
      ),
    },
    {
      id: "intentos",
      encabezado: "Intentos máx.",
      numerica: true,
      celda: (e) => e.intentos_max ?? "—",
    },
    {
      id: "acciones",
      encabezado: "Acciones",
      celda: (e) => (
        <span className="flex gap-3 text-sm">
          <Link
            to={paths.docente.evaluacion(e.id)}
            className="text-accent underline underline-offset-2 hover:decoration-2"
          >
            Editar
          </Link>
          {e.estado !== "borrador" && (
            <Link
              to={paths.docente.resultados(e.id)}
              className="text-accent underline underline-offset-2 hover:decoration-2"
            >
              Resultados
            </Link>
          )}
        </span>
      ),
    },
  ];
}

interface FiltrosProps {
  cursos: Curso[] | undefined;
  conCurso: boolean;
  curso: number | undefined;
  estado: EstadoEvaluacion | undefined;
  onFiltrar: (clave: string, valor: string) => void;
}

function Filtros({ cursos, conCurso, curso, estado, onFiltrar }: FiltrosProps) {
  const id = useId();
  return (
    <div className="flex flex-wrap gap-3">
      {conCurso && (
        <div className="flex flex-col gap-1">
          <label htmlFor={`${id}-curso`} className="text-sm text-muted">
            Curso
          </label>
          <Select
            id={`${id}-curso`}
            value={curso ?? ""}
            onChange={(e) => onFiltrar("curso", e.target.value)}
          >
            <option value="">Todos</option>
            {(cursos ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </Select>
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label htmlFor={`${id}-estado`} className="text-sm text-muted">
          Estado
        </label>
        <Select
          id={`${id}-estado`}
          value={estado ?? ""}
          onChange={(e) => onFiltrar("estado", e.target.value)}
        >
          <option value="">Todos</option>
          {ESTADOS.map((e) => (
            <option key={e.valor} value={e.valor}>
              {e.etiqueta}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}

/** Evaluaciones del docente con filtros de curso y estado en la URL (HU-F-310). */
export function ListaEvaluaciones({ cursoFijo }: { cursoFijo?: number }) {
  const [parametros, setParametros] = useSearchParams();
  const estado = ESTADOS.find((e) => e.valor === parametros.get("estado"))?.valor;
  const cursoUrl = Number(parametros.get("curso")) || undefined;
  const { data, isPending, error, refetch } = useEvaluacionesDocente({
    curso_id: cursoFijo ?? cursoUrl,
    estado,
  });
  const cursos = useCursos("activo");
  const nueva = cursoFijo
    ? `${paths.docente.evaluacion("nueva")}?curso=${cursoFijo}`
    : paths.docente.evaluacion("nueva");
  const filtrar = (clave: string, valor: string) =>
    setParametros(
      (p) => {
        const nuevos = new URLSearchParams(p);
        if (valor) nuevos.set(clave, valor);
        else nuevos.delete(clave);
        return nuevos;
      },
      { replace: true },
    );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <Filtros
          cursos={cursos.data}
          conCurso={!cursoFijo}
          curso={cursoUrl}
          estado={estado}
          onFiltrar={filtrar}
        />
        <Link to={nueva} className={claseBoton()}>
          Nueva evaluación
        </Link>
      </div>
      {isPending && <Skeleton lineas={4} className="h-11 w-full" />}
      {error && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {data?.length === 0 && (
        <EstadoVacio
          titulo={estado ? "No hay evaluaciones con ese estado." : "Aún no tienes evaluaciones."}
          descripcion="Arma una con preguntas de opción única y publícala cuando esté lista."
        />
      )}
      {data && data.length > 0 && (
        <Table
          etiqueta="Evaluaciones"
          filas={data}
          columnas={columnasDe(cursos.data, !cursoFijo)}
          obtenerId={(e) => e.id}
        />
      )}
    </div>
  );
}
