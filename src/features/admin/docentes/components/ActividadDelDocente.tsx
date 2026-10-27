import { useState, type ReactNode } from "react";
import { ClipboardCheck, FileText, LogIn, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import {
  CifraCompacta,
  claseBoton,
  EstadoVacio,
  Field,
  MensajeError,
  Paginacion,
  Select,
  Skeleton,
} from "@/shared/ui";
import { BarrasPorDia } from "@/shared/ui/graficos";
import { useLineaDeTiempo, useResumenActividad } from "../hooks";
import type { EventoActividad, FiltroTipo, ResumenActividad, TipoActividad } from "../tipos";

const RANGOS = [7, 28, 90] as const;

const TIPOS: Record<TipoActividad, string> = {
  sesion: "Inicios de sesión",
  leccion: "Lecciones",
  ejercicio: "Ejercicios",
  evaluacion: "Evaluaciones",
  retroalimentacion: "Retroalimentaciones",
  mensaje: "Mensajes",
  curso: "Cursos",
};

const ACCIONES: Record<string, string> = {
  inicio: "Inició sesión",
  creo: "Creó",
  edito: "Editó",
  publico: "Publicó",
  archivo: "Archivó",
  elimino: "Eliminó",
  comento: "Comentó",
  envio: "Envió",
  retiro_estudiante: "Retiró a un estudiante",
  regenero_codigo: "Regeneró el código",
  definio_ruta: "Definió la ruta",
};

const OBJETO: Record<TipoActividad, string> = {
  sesion: "",
  leccion: "una lección",
  ejercicio: "un ejercicio",
  evaluacion: "una evaluación",
  retroalimentacion: "una retroalimentación",
  mensaje: "un mensaje",
  curso: "",
};

/** "Publicó una evaluación". */
function frase(e: EventoActividad): string {
  const accion = ACCIONES[e.accion] ?? e.accion;
  const objeto = OBJETO[e.tipo];
  const queHizo = objeto ? `${accion} ${objeto}` : accion;
  return queHizo;
}

const FECHA_HORA = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

// Opciones del filtro "Tipo": las mismas cuatro familias que ve el administrador.
const FILTROS_TIPO: { valor: FiltroTipo | ""; etiqueta: string }[] = [
  { valor: "", etiqueta: "Todos" },
  { valor: "contenido", etiqueta: "Contenido" },
  { valor: "evaluacion", etiqueta: "Evaluaciones" },
  { valor: "mensaje", etiqueta: "Mensajes" },
  { valor: "sesion", etiqueta: "Inicios de sesión" },
];

const ICONO: Record<TipoActividad, ReactNode> = {
  sesion: <LogIn size={16} aria-hidden="true" />,
  leccion: <FileText size={16} aria-hidden="true" />,
  ejercicio: <FileText size={16} aria-hidden="true" />,
  curso: <FileText size={16} aria-hidden="true" />,
  evaluacion: <ClipboardCheck size={16} aria-hidden="true" />,
  retroalimentacion: <ClipboardCheck size={16} aria-hidden="true" />,
  mensaje: <Mail size={16} aria-hidden="true" />,
};

/** Una línea: fecha y hora en mono, ícono del tipo, qué hizo y en qué curso. */
function EventoFila({ evento: e }: { evento: EventoActividad }) {
  return (
    <li className="grid grid-cols-[32px_minmax(0,1fr)] items-start gap-x-3 gap-y-1 border-t border-linea px-4 py-3.5 first:border-t-0 min-[821px]:grid-cols-[120px_32px_minmax(0,1fr)]">
      <span className="col-start-2 row-start-2 pt-0.5 font-mono text-xs text-muted min-[821px]:col-start-1 min-[821px]:row-start-1 min-[821px]:pt-2">
        {FECHA_HORA.format(new Date(e.creado_en))}
      </span>
      <span
        aria-hidden="true"
        className="flex h-8 w-8 items-center justify-center rounded-md bg-ink-2 text-accent min-[821px]:col-start-2"
      >
        {ICONO[e.tipo]}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5 pt-1 min-[821px]:col-start-3">
        <span className="text-sm text-paper">{frase(e)}</span>
        {e.curso_nombre && <span className="text-xs text-muted">{e.curso_nombre}</span>}
      </span>
    </li>
  );
}

/** Primer día del periodo (AAAA-MM-DD, hora local) para filtrar la línea de tiempo. */
function desdeHace(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() - dias + 1);
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

// Agrupa los tipos del backend en las cifras del periodo.
const GRUPOS: { etiqueta: string; tipos: TipoActividad[] }[] = [
  { etiqueta: "Contenidos", tipos: ["leccion", "ejercicio", "curso"] },
  { etiqueta: "Calificaciones", tipos: ["evaluacion", "retroalimentacion"] },
  { etiqueta: "Mensajes", tipos: ["mensaje"] },
];

/** Qué tipo de cosas hizo: cada fila lleva el número y una barra proporcional (texto + forma). */
function DistribucionPorTipo({ tipos }: { tipos: { tipo: TipoActividad; acciones: number }[] }) {
  const mayor = Math.max(1, ...tipos.map((t) => t.acciones));
  return (
    <section aria-labelledby="por-tipo" className="flex flex-col gap-3">
      <h3 id="por-tipo" className="font-display text-lg font-semibold text-paper">
        Qué hizo
      </h3>
      <ul className="flex flex-col gap-3">
        {tipos.map((t) => (
          <li key={t.tipo} className="flex flex-col gap-1">
            <p className="flex justify-between text-sm text-paper">
              <span>{TIPOS[t.tipo]}</span>
              <span className="font-mono tabular-nums">{t.acciones}</span>
            </p>
            <div aria-hidden="true" className="h-2 rounded-sm bg-linea">
              <div
                className="h-2 rounded-sm bg-primary-claro"
                style={{ width: `${Math.round((t.acciones / mayor) * 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Cifras({ resumen, total }: { resumen: ResumenActividad; total: number }) {
  const suma = (tipos: TipoActividad[]) =>
    resumen.por_tipo.filter((t) => tipos.includes(t.tipo)).reduce((s, t) => s + t.acciones, 0);
  return (
    <div
      role="group"
      aria-label="Actividad del periodo"
      className="grid grid-cols-2 gap-2 min-[821px]:grid-cols-[repeat(auto-fill,minmax(170px,220px))]"
    >
      <CifraCompacta etiqueta="Acciones" valor={total} />
      {GRUPOS.map((g) => (
        <CifraCompacta key={g.etiqueta} etiqueta={g.etiqueta} valor={suma(g.tipos)} />
      ))}
    </div>
  );
}

function Graficas({
  resumen,
  total,
  dias,
}: {
  resumen: ResumenActividad;
  total: number;
  dias: number;
}) {
  return (
    <div className="grid gap-x-10 gap-y-10 lg:grid-cols-2">
      <BarrasPorDia
        titulo="Acciones por día"
        unidad={"Acciones del docente en los últimos " + dias + " días"}
        lectura={`${total} acciones en ${resumen.dias_activos} días con actividad.`}
        etiquetaValor="acciones"
        hoy={resumen.por_dia.at(-1)?.fecha}
        datos={resumen.por_dia.map((d) => ({ fecha: d.fecha, valor: d.acciones }))}
      />
      <DistribucionPorTipo tipos={resumen.por_tipo} />
    </div>
  );
}

interface LineaProps {
  docenteId: string;
  dias: number;
  tipo: FiltroTipo | "";
}

function LineaDeTiempo({ docenteId, dias, tipo }: LineaProps) {
  const [pagina, setPagina] = useState(1);
  const { data, isPending, error, refetch } = useLineaDeTiempo(docenteId, {
    tipo: tipo || undefined,
    desde: desdeHace(dias),
    pagina,
  });
  return (
    <section aria-label="Línea de tiempo" className="flex flex-col gap-3">
      {isPending && <Skeleton lineas={4} className="h-11 w-full" />}
      {error && !data && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {data && data.data.length === 0 && (
        <p className="text-sm text-muted">No hay eventos de este tipo en el periodo.</p>
      )}
      {data && data.data.length > 0 && (
        <>
          <ul
            aria-label="Línea de tiempo del docente"
            className="overflow-hidden rounded-caja border border-linea bg-surface"
          >
            {data.data.map((e) => (
              <EventoFila
                key={`${e.creado_en}-${e.tipo}-${e.accion}-${e.curso_id ?? 0}`}
                evento={e}
              />
            ))}
          </ul>
          <Paginacion meta={data.meta} onPagina={setPagina} />
        </>
      )}
    </section>
  );
}

interface ActividadProps {
  docenteId: string;
  /** Enlace para escribirle al docente (en el estado vacío). */
  mensaje: string;
}

function Filtros({
  dias,
  tipo,
  onDias,
  onTipo,
}: {
  dias: number;
  tipo: FiltroTipo | "";
  onDias: (dias: number) => void;
  onTipo: (tipo: FiltroTipo | "") => void;
}) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <Field etiqueta="Periodo">
        {(campo) => (
          <Select
            {...campo}
            value={dias}
            onChange={(e) => onDias(Number(e.target.value))}
            className="w-44"
          >
            {RANGOS.map((r) => (
              <option key={r} value={r}>
                Últimos {r} días
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field etiqueta="Tipo">
        {(campo) => (
          <Select
            {...campo}
            value={tipo}
            onChange={(e) => onTipo(e.target.value as FiltroTipo | "")}
            className="w-52"
          >
            {FILTROS_TIPO.map((f) => (
              <option key={f.valor} value={f.valor}>
                {f.etiqueta}
              </option>
            ))}
          </Select>
        )}
      </Field>
    </div>
  );
}

/**
 * Actividad de un docente: periodo y tipo, cifras del periodo, gráfica por día (con su tabla),
 * distribución por tipo y línea de tiempo. Sin actividad hay un solo mensaje, no uno por bloque.
 */
export default function ActividadDelDocente({ docenteId, mensaje }: ActividadProps) {
  const [dias, setDias] = useState<number>(28);
  const [tipo, setTipo] = useState<FiltroTipo | "">("");
  const { data, isPending, error, refetch } = useResumenActividad(docenteId, dias);
  const total = data?.por_dia.reduce((suma, d) => suma + d.acciones, 0) ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <Filtros dias={dias} tipo={tipo} onDias={setDias} onTipo={setTipo} />
      {isPending && <Skeleton lineas={5} className="h-10 w-full" />}
      {error && !data && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {data && total === 0 && (
        <EstadoVacio
          titulo={`Sin actividad en los últimos ${dias} días`}
          descripcion="Este docente no hizo nada en la plataforma en este periodo. Puedes escribirle para saber cómo va."
          accion={
            <Link to={mensaje} className={claseBoton({ variante: "secundario" })}>
              Enviar mensaje
            </Link>
          }
        />
      )}
      {data && total > 0 && (
        <>
          <Cifras resumen={data} total={total} />
          <LineaDeTiempo docenteId={docenteId} dias={dias} tipo={tipo} />
          <details className="rounded-caja border border-linea p-4">
            <summary className="cursor-pointer text-sm font-semibold text-paper">
              Ver la gráfica por día y la distribución por tipo
            </summary>
            <div className="mt-4">
              <Graficas resumen={data} total={total} dias={dias} />
            </div>
          </details>
        </>
      )}
    </div>
  );
}
