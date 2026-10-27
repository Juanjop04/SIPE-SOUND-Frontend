import { useState } from "react";
import { fechaRelativa } from "@/shared/lib/formato";
import {
  EstadoVacio,
  Field,
  MensajeError,
  Paginacion,
  Select,
  Skeleton,
  Table,
  type ColumnaTabla,
} from "@/shared/ui";
import { BarrasPorDia } from "@/shared/ui/graficos";
import { useLineaDeTiempo, useResumenActividad } from "../hooks";
import type { EventoActividad, TipoActividad } from "../tipos";

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

/** "Publicó una evaluación en Guitarra 7A". */
function frase(e: EventoActividad): string {
  const accion = ACCIONES[e.accion] ?? e.accion;
  const objeto = OBJETO[e.tipo];
  const lugar = e.curso_nombre ? ` en ${e.curso_nombre}` : "";
  const queHizo = objeto ? `${accion} ${objeto}` : accion;
  return queHizo + lugar;
}

const COLUMNAS: ColumnaTabla<EventoActividad>[] = [
  { id: "que", encabezado: "Qué hizo", celda: frase },
  { id: "tipo", encabezado: "Tipo", celda: (e) => TIPOS[e.tipo] },
  { id: "cuando", encabezado: "Cuándo", celda: (e) => fechaRelativa(e.creado_en) },
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

function Graficas({ docenteId, dias }: { docenteId: string; dias: number }) {
  const { data, isPending, error, refetch } = useResumenActividad(docenteId, dias);
  if (isPending) return <Skeleton lineas={5} className="h-10 w-full" />;
  if (error) return <MensajeError mensaje={error.message} onReintentar={() => refetch()} />;
  const total = data.por_dia.reduce((suma, d) => suma + d.acciones, 0);
  if (total === 0) {
    return <EstadoVacio titulo="Este docente aún no ha hecho nada en estos días." />;
  }
  const hoy = data.por_dia.at(-1)?.fecha;
  return (
    <div className="grid gap-x-10 gap-y-10 lg:grid-cols-2">
      <BarrasPorDia
        titulo="Acciones por día"
        unidad={"Acciones del docente en los últimos " + dias + " días"}
        lectura={`${total} acciones en ${data.dias_activos} días con actividad.`}
        etiquetaValor="acciones"
        hoy={hoy}
        datos={data.por_dia.map((d) => ({ fecha: d.fecha, valor: d.acciones }))}
      />
      <DistribucionPorTipo tipos={data.por_tipo} />
    </div>
  );
}

function LineaDeTiempo({ docenteId }: { docenteId: string }) {
  const [tipo, setTipo] = useState<TipoActividad | "">("");
  const [pagina, setPagina] = useState(1);
  const { data, isPending, error, refetch } = useLineaDeTiempo(docenteId, {
    tipo: tipo || undefined,
    pagina,
  });
  return (
    <section aria-labelledby="linea" className="flex flex-col gap-3">
      <h3 id="linea" className="font-display text-lg font-semibold text-paper">
        Línea de tiempo
      </h3>
      <Field etiqueta="Tipo">
        {(campo) => (
          <Select
            {...campo}
            value={tipo}
            onChange={(e) => {
              setTipo(e.target.value as TipoActividad | "");
              setPagina(1);
            }}
            className="max-w-xs"
          >
            <option value="">Todos</option>
            {(Object.keys(TIPOS) as TipoActividad[]).map((t) => (
              <option key={t} value={t}>
                {TIPOS[t]}
              </option>
            ))}
          </Select>
        )}
      </Field>
      {isPending && <Skeleton lineas={4} className="h-11 w-full" />}
      {error && !data && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {data && data.data.length === 0 && (
        <EstadoVacio titulo="Este docente aún no ha hecho nada en estos días." />
      )}
      {data && data.data.length > 0 && (
        <>
          <Table
            etiqueta="Línea de tiempo del docente"
            filas={data.data}
            columnas={COLUMNAS}
            obtenerId={(e) => `${e.creado_en}-${e.tipo}-${e.accion}-${e.curso_id ?? 0}`}
          />
          <Paginacion meta={data.meta} onPagina={setPagina} />
        </>
      )}
    </section>
  );
}

/** Actividad de un docente: gráfica por día (con su tabla), distribución por tipo y línea de tiempo. */
export default function ActividadDelDocente({ docenteId }: { docenteId: string }) {
  const [dias, setDias] = useState<number>(28);
  return (
    <div className="flex flex-col gap-8">
      <Field etiqueta="Periodo">
        {(campo) => (
          <Select
            {...campo}
            value={dias}
            onChange={(e) => setDias(Number(e.target.value))}
            className="max-w-xs"
          >
            {RANGOS.map((r) => (
              <option key={r} value={r}>
                Últimos {r} días
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Graficas docenteId={docenteId} dias={dias} />
      <LineaDeTiempo docenteId={docenteId} />
    </div>
  );
}
