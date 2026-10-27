import { useState, type ReactNode } from "react";
import { Activity, ClipboardCheck, FileText, LogIn, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import {
  CifraCompacta,
  claseBoton,
  Field,
  MensajeError,
  Paginacion,
  Select,
  Skeleton,
} from "@/shared/ui";
import { useLineaDeTiempo, useResumenActividad } from "../hooks";
import type { EventoActividad, FiltroTipo, ResumenActividad, TipoActividad } from "../tipos";

const RANGOS = [7, 28, 90] as const;

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
  return objeto ? `${accion} ${objeto}` : accion;
}

// Opciones del filtro "Tipo": las mismas cuatro familias del diseño.
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

// Agrupa los tipos del backend en las cifras del periodo.
const GRUPOS: { etiqueta: string; tipos: TipoActividad[] }[] = [
  { etiqueta: "Contenidos", tipos: ["leccion", "ejercicio", "curso"] },
  { etiqueta: "Calificaciones", tipos: ["evaluacion", "retroalimentacion"] },
  { etiqueta: "Mensajes", tipos: ["mensaje"] },
];

const DIA_MS = 86_400_000;
const HORA = new Intl.DateTimeFormat("es-CO", {
  hour: "numeric",
  minute: "2-digit",
  hour12: false,
});
const DIA_MES = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short" });

function inicioDelDia(fecha: Date): number {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()).getTime();
}

/** "Hoy · 9:42", "Ayer · 16:10" o "21 oct · 11:05" (con el año si no es el actual). */
function cuando(iso: string, ahora: Date = new Date()): string {
  const fecha = new Date(iso);
  const dias = Math.round((inicioDelDia(ahora) - inicioDelDia(fecha)) / DIA_MS);
  const hora = HORA.format(fecha);
  if (dias === 0) return `Hoy · ${hora}`;
  if (dias === 1) return `Ayer · ${hora}`;
  const anio = fecha.getFullYear() === ahora.getFullYear() ? "" : ` ${fecha.getFullYear()}`;
  return `${DIA_MES.format(fecha)}${anio} · ${hora}`;
}

/** Primer día del periodo (AAAA-MM-DD, hora local) para filtrar la línea de tiempo. */
function desdeHace(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() - dias + 1);
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

/** Una línea: fecha y hora en mono, ícono del tipo, qué hizo y en qué curso. */
function EventoFila({ evento: e }: { evento: EventoActividad }) {
  return (
    <li className="grid grid-cols-[32px_minmax(0,1fr)] items-start gap-x-3 gap-y-1 border-t border-linea px-4 py-3.5 first:border-t-0 min-[821px]:grid-cols-[120px_32px_minmax(0,1fr)]">
      <span className="col-start-2 row-start-2 pt-0.5 font-mono text-xs text-muted min-[821px]:col-start-1 min-[821px]:row-start-1 min-[821px]:pt-2">
        {cuando(e.creado_en)}
      </span>
      <span
        aria-hidden="true"
        className="flex h-8 w-8 items-center justify-center rounded-md bg-ink-2 text-accent min-[821px]:col-start-2"
      >
        {ICONO[e.tipo]}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5 pt-1 min-[821px]:col-start-3">
        <span className="text-sm leading-snug text-paper">{frase(e)}</span>
        {e.curso_nombre && <span className="text-xs text-muted">{e.curso_nombre}</span>}
      </span>
    </li>
  );
}

function Cifras({ resumen }: { resumen: ResumenActividad | undefined }) {
  const suma = (tipos: TipoActividad[]) =>
    resumen?.por_tipo.filter((t) => tipos.includes(t.tipo)).reduce((s, t) => s + t.acciones, 0);
  const total = resumen?.por_dia.reduce((s, d) => s + d.acciones, 0);
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

interface VacioProps {
  dias: number;
  nombre: string;
  mensaje: string;
}

/** Un solo mensaje, dentro de la tarjeta de eventos. */
function SinActividad({ dias, nombre, mensaje }: VacioProps) {
  return (
    <div className="flex flex-col items-center gap-2.5 px-5 py-11 text-center">
      <Activity size={28} aria-hidden="true" className="text-muted" />
      <p className="text-[15px] font-semibold text-paper">
        Sin actividad en los últimos {dias} días
      </p>
      <p className="max-w-[420px] text-[13px] leading-normal text-muted">
        {nombre} no ha publicado contenido, calificado evaluaciones ni enviado mensajes en este
        periodo.
      </p>
      <Link
        to={mensaje}
        className={claseBoton({ variante: "fantasma", tamano: "sm", className: "mt-1" })}
      >
        Enviar mensaje
      </Link>
    </div>
  );
}

interface LineaProps extends VacioProps {
  docenteId: string;
  tipo: FiltroTipo | "";
}

function LineaDeTiempo({ docenteId, dias, tipo, nombre, mensaje }: LineaProps) {
  const [pagina, setPagina] = useState(1);
  const { data, isPending, error, refetch } = useLineaDeTiempo(docenteId, {
    tipo: tipo || undefined,
    desde: desdeHace(dias),
    pagina,
  });
  if (isPending) return <Skeleton lineas={4} className="h-11 w-full" />;
  if (error && !data) {
    return <MensajeError mensaje={error.message} onReintentar={() => refetch()} />;
  }
  const eventos = data?.data ?? [];
  return (
    <section aria-label="Línea de tiempo" className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-caja border border-linea bg-surface">
        {eventos.length === 0 ? (
          <SinActividad dias={dias} nombre={nombre} mensaje={mensaje} />
        ) : (
          <ul aria-label="Línea de tiempo del docente">
            {eventos.map((e) => (
              <EventoFila
                key={`${e.creado_en}-${e.tipo}-${e.accion}-${e.curso_id ?? 0}`}
                evento={e}
              />
            ))}
          </ul>
        )}
      </div>
      {data && eventos.length > 0 && <Paginacion meta={data.meta} onPagina={setPagina} />}
    </section>
  );
}

interface FiltrosProps {
  dias: number;
  tipo: FiltroTipo | "";
  onDias: (dias: number) => void;
  onTipo: (tipo: FiltroTipo | "") => void;
}

function Filtros({ dias, tipo, onDias, onTipo }: FiltrosProps) {
  return (
    <div className="grid gap-3 min-[561px]:grid-cols-[repeat(2,minmax(0,220px))]">
      <Field etiqueta="Periodo">
        {(campo) => (
          <Select {...campo} value={dias} onChange={(e) => onDias(Number(e.target.value))}>
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

interface ActividadProps {
  docenteId: string;
  nombre: string;
  /** Enlace para escribirle al docente (en el estado vacío). */
  mensaje: string;
}

/**
 * Actividad de un docente, como en el diseño: periodo y tipo, cuatro cifras del periodo y una
 * sola tarjeta con la línea de tiempo. Sin eventos, el mensaje vacío va dentro de esa tarjeta.
 */
export default function ActividadDelDocente({ docenteId, nombre, mensaje }: ActividadProps) {
  const [dias, setDias] = useState<number>(28);
  const [tipo, setTipo] = useState<FiltroTipo | "">("");
  const resumen = useResumenActividad(docenteId, dias);

  return (
    <div className="flex flex-col gap-5">
      <Filtros dias={dias} tipo={tipo} onDias={setDias} onTipo={setTipo} />
      <Cifras resumen={resumen.data} />
      {resumen.error && !resumen.data && (
        <MensajeError mensaje={resumen.error.message} onReintentar={() => resumen.refetch()} />
      )}
      {/* key: al cambiar periodo o tipo, la línea de tiempo vuelve a la página 1. */}
      <LineaDeTiempo
        key={`${dias}-${tipo}`}
        docenteId={docenteId}
        dias={dias}
        tipo={tipo}
        nombre={nombre}
        mensaje={mensaje}
      />
    </div>
  );
}
