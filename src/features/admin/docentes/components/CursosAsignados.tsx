import { useState } from "react";
import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
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
import { useCursosSinDocenteLista } from "../hooks";
import type { CursoResumen } from "../tipos";

interface Props {
  docenteId: string;
  nombre: string;
  /** Avance y estudiantes sin actividad por curso activo (resumen de HU-B-418). */
  resumen: CursoResumen[] | undefined;
}

function AsignarCurso({ docenteId, nombre }: { docenteId: string; nombre: string }) {
  const { data, isPending, error } = useCursosSinDocenteLista();
  const [curso, setCurso] = useState<CursoPorReasignar | null>(null);
  if (isPending || error) return null;
  if (data.data.length === 0) {
    return <p className="text-sm text-muted">No hay cursos sin docente para asignar.</p>;
  }
  return (
    <section aria-labelledby="sin-docente" className="flex flex-col gap-2">
      <h3 id="sin-docente" className="font-display text-lg font-semibold text-paper">
        Asignar curso
      </h3>
      <p className="text-sm text-muted">Cursos sin docente: {nombre} recibiría un correo.</p>
      <ul className="divide-y divide-linea rounded-caja border border-linea">
        {data.data.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-3 p-3">
            <span className="text-paper">
              {c.nombre}{" "}
              <span className="font-mono text-xs text-muted">· {c.estudiantes} estudiantes</span>
            </span>
            <Button
              variante="secundario"
              tamano="sm"
              aria-label={`Asignar ${c.nombre} a ${nombre}`}
              onClick={() =>
                setCurso({
                  id: c.id,
                  nombre: c.nombre,
                  estudiantes: c.estudiantes,
                  docenteId: null,
                  docente: null,
                  destino: { id: docenteId, nombre },
                })
              }
            >
              Asignar a {nombre.split(" ")[0]}
            </Button>
          </li>
        ))}
      </ul>
      <DialogoReasignar curso={curso} onCerrar={() => setCurso(null)} />
    </section>
  );
}

/** Cursos del docente (activos y archivados) con su avance, y las acciones del administrador. */
export function CursosAsignados({ docenteId, nombre, resumen }: Props) {
  const { data, isPending, error, refetch } = useCursosDeDocente(docenteId);
  const [reasignar, setReasignar] = useState<CursoPorReasignar | null>(null);
  const [quitar, setQuitar] = useState<DocentePorQuitar | null>(null);

  if (isPending) {
    return (
      <div aria-busy="true">
        <Skeleton lineas={4} className="h-11 w-full" />
      </div>
    );
  }
  if (error) return <MensajeError mensaje={error.message} onReintentar={() => refetch()} />;

  const avance = new Map((resumen ?? []).map((c) => [c.curso_id, c]));
  const columnas: ColumnaTabla<CursoDeDocente>[] = [
    {
      id: "curso",
      encabezado: "Curso",
      celda: (c) => (
        <Link
          to={paths.docente.curso(c.id)}
          className="text-accent underline underline-offset-2 hover:decoration-2"
        >
          {c.nombre}
          {c.archivado_en && <span className="text-muted"> · Archivado</span>}
        </Link>
      ),
    },
    { id: "estudiantes", encabezado: "Estudiantes", numerica: true, celda: (c) => c.estudiantes },
    {
      id: "avance",
      encabezado: "Avance promedio",
      numerica: true,
      celda: (c) => (avance.has(c.id) ? `${avance.get(c.id)?.avance_promedio_pct} %` : "—"),
    },
    {
      id: "sin7",
      encabezado: "Sin actividad 7 días",
      numerica: true,
      celda: (c) => avance.get(c.id)?.estudiantes_sin_actividad_7d ?? "—",
    },
    {
      id: "ultima",
      encabezado: "Último movimiento del docente",
      celda: (c) => {
        const ultima = avance.get(c.id)?.ultima_actividad_docente;
        return ultima ? fechaRelativa(ultima) : "—";
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
      celda: (c) => (
        <span className="flex gap-2">
          <Button
            variante="secundario"
            tamano="sm"
            aria-label={`Reasignar ${c.nombre}`}
            onClick={() =>
              setReasignar({
                id: c.id,
                nombre: c.nombre,
                estudiantes: c.estudiantes,
                docenteId,
                docente: nombre,
              })
            }
          >
            Reasignar
          </Button>
          {!c.archivado_en && (
            <Button
              variante="secundario"
              tamano="sm"
              aria-label={`Quitar a ${nombre} de ${c.nombre}`}
              onClick={() =>
                setQuitar({
                  cursoId: c.id,
                  curso: c.nombre,
                  estudiantes: c.estudiantes,
                  docente: nombre,
                })
              }
            >
              Quitar docente
            </Button>
          )}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {data.length === 0 ? (
        <EstadoVacio titulo="Este docente aún no tiene cursos." />
      ) : (
        <Table
          etiqueta="Cursos asignados"
          filas={data}
          columnas={columnas}
          obtenerId={(c) => c.id}
        />
      )}
      <AsignarCurso docenteId={docenteId} nombre={nombre} />
      <DialogoReasignar curso={reasignar} onCerrar={() => setReasignar(null)} />
      <DialogoQuitarDocente quitar={quitar} onCerrar={() => setQuitar(null)} />
    </div>
  );
}
