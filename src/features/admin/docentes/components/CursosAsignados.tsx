import { useState } from "react";
import { ArrowLeftRight, Plus, UserMinus } from "lucide-react";
import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { cn } from "@/shared/lib/cn.js";
import { fechaRelativa } from "@/shared/lib/formato";
import { Button, EstadoVacio, MensajeError, Skeleton, Table, type ColumnaTabla } from "@/shared/ui";
import {
  DialogoQuitarDocente,
  DialogoReasignar,
  useCursosDeDocente,
  type CursoDeDocente,
  type CursoPorReasignar,
  type DocentePorQuitar,
} from "../externos";
import { useCursosSinDocente } from "../hooks";
import type { CursoResumen } from "../tipos";
import { DialogoAsignarCurso } from "./DialogoAsignarCurso";

interface Props {
  docenteId: string;
  nombre: string;
  /** Avance y estudiantes sin actividad por curso activo (resumen de HU-B-418). */
  resumen: CursoResumen[] | undefined;
}

/** Barra de 72 px y porcentaje; sin estudiantes no hay promedio ("—"). */
function Avance({ curso }: { curso: CursoResumen | undefined }) {
  if (!curso || curso.estudiantes === 0) return <span aria-label="Sin estudiantes">—</span>;
  const pct = Math.floor(curso.avance_promedio_pct);
  return (
    <span className="inline-flex items-center justify-end gap-2.5">
      <span aria-hidden="true" className="h-1.5 w-[72px] overflow-hidden rounded-sm bg-ink-2">
        <span className="block h-full bg-primary" style={{ width: `${pct}%` }} />
      </span>
      {pct} %
    </span>
  );
}

const BOTON_ICONO =
  "inline-flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-accent transition-colors duration-rapida";

function lineaSinDocente(n: number | undefined): string {
  if (n === undefined) return "";
  if (n === 0) return "No hay cursos sin docente para asignar.";
  return `${n} ${n === 1 ? "curso sin docente" : "cursos sin docente"} para asignar`;
}

interface AccionesProps {
  curso: CursoDeDocente;
  docenteId: string;
  nombre: string;
  onReasignar: (curso: CursoPorReasignar) => void;
  onQuitar: (curso: DocentePorQuitar) => void;
}

function AccionesDelCurso({ curso: c, docenteId, nombre, onReasignar, onQuitar }: AccionesProps) {
  return (
    <span className="flex justify-end gap-1">
      <button
        type="button"
        title="Reasignar a otro docente"
        aria-label={`Reasignar ${c.nombre}`}
        className={cn(
          BOTON_ICONO,
          "border-linea-fuerte hover:border-primary hover:bg-primary hover:text-sobre-primary",
        )}
        onClick={() =>
          onReasignar({
            id: c.id,
            nombre: c.nombre,
            estudiantes: c.estudiantes,
            docenteId,
            docente: nombre,
          })
        }
      >
        <ArrowLeftRight size={17} aria-hidden="true" />
      </button>
      {!c.archivado_en && (
        <button
          type="button"
          title="Quitar docente del curso"
          aria-label={`Quitar a ${nombre} de ${c.nombre}`}
          className={cn(BOTON_ICONO, "hover:bg-peligro-texto/10 hover:text-peligro-texto")}
          onClick={() =>
            onQuitar({
              cursoId: c.id,
              curso: c.nombre,
              estudiantes: c.estudiantes,
              docente: nombre,
            })
          }
        >
          <UserMinus size={17} aria-hidden="true" />
        </button>
      )}
    </span>
  );
}

function columnasDe(
  avance: Map<number, CursoResumen>,
  acciones: Omit<AccionesProps, "curso">,
): ColumnaTabla<CursoDeDocente>[] {
  return [
    {
      id: "curso",
      encabezado: "Curso",
      celda: (c) => (
        <Link
          to={paths.docente.curso(c.id)}
          className="font-semibold text-accent underline underline-offset-2 hover:decoration-2"
        >
          {c.nombre}
          {c.archivado_en && <span className="font-normal text-muted"> · Archivado</span>}
        </Link>
      ),
    },
    { id: "estudiantes", encabezado: "Estudiantes", numerica: true, celda: (c) => c.estudiantes },
    {
      id: "avance",
      encabezado: "Avance promedio",
      numerica: true,
      celda: (c) => <Avance curso={avance.get(c.id)} />,
    },
    {
      id: "sin7",
      encabezado: "Sin avance 7 d",
      numerica: true,
      celda: (c) => {
        const n = avance.get(c.id)?.estudiantes_sin_actividad_7d;
        return <span className={n ? "text-aviso" : undefined}>{n ?? "—"}</span>;
      },
    },
    {
      id: "ultima",
      encabezado: "Último movimiento",
      celda: (c) => {
        const ultima = avance.get(c.id)?.ultima_actividad_docente;
        return (
          <span className="font-mono text-xs text-muted">
            {ultima ? fechaRelativa(ultima) : "—"}
          </span>
        );
      },
    },
    {
      id: "bloques",
      encabezado: "Bloques en ruta",
      numerica: true,
      celda: (c) => c.bloques_en_ruta,
    },
    {
      id: "acciones",
      encabezado: "Acciones",
      celda: (c) => <AccionesDelCurso curso={c} {...acciones} />,
    },
  ];
}

/** Cursos del docente (activos y archivados) con su avance, y las acciones del administrador. */
export function CursosAsignados({ docenteId, nombre, resumen }: Props) {
  const { data, isPending, error, refetch } = useCursosDeDocente(docenteId);
  const sinDocente = useCursosSinDocente();
  const [reasignar, setReasignar] = useState<CursoPorReasignar | null>(null);
  const [quitar, setQuitar] = useState<DocentePorQuitar | null>(null);
  const [asignando, setAsignando] = useState(false);

  if (isPending) {
    return (
      <div aria-busy="true">
        <Skeleton lineas={4} className="h-11 w-full" />
      </div>
    );
  }
  if (error) return <MensajeError mensaje={error.message} onReintentar={() => refetch()} />;

  const avance = new Map((resumen ?? []).map((c) => [c.curso_id, c]));
  const columnas = columnasDe(avance, {
    docenteId,
    nombre,
    onReasignar: setReasignar,
    onQuitar: setQuitar,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-muted">{lineaSinDocente(sinDocente.data?.meta.total)}</span>
        <Button variante="fantasma" tamano="sm" onClick={() => setAsignando(true)}>
          <Plus size={16} aria-hidden="true" />
          Asignar curso
        </Button>
      </div>
      {data.length === 0 ? (
        <EstadoVacio
          titulo="Este docente no tiene cursos asignados."
          accion={
            <Button variante="fantasma" tamano="sm" onClick={() => setAsignando(true)}>
              Asignar curso
            </Button>
          }
        />
      ) : (
        <Table
          etiqueta="Cursos asignados"
          filas={data}
          columnas={columnas}
          obtenerId={(c) => c.id}
        />
      )}
      <DialogoAsignarCurso
        abierto={asignando}
        docenteId={docenteId}
        nombre={nombre}
        onCerrar={() => setAsignando(false)}
      />
      <DialogoReasignar curso={reasignar} onCerrar={() => setReasignar(null)} />
      <DialogoQuitarDocente quitar={quitar} onCerrar={() => setQuitar(null)} />
    </div>
  );
}
