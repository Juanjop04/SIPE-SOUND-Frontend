import { useState } from "react";
import { formatearFecha } from "@/shared/lib/formato";
import { Button, Drawer, EstadoVacio, MensajeError, Paginacion, Skeleton } from "@/shared/ui";
import { useEstudiantesDeCurso } from "../hooks";
import type { CursoAdmin } from "../tipos";
import { DialogoQuitarDocente, type DocentePorQuitar } from "./DialogoQuitarDocente";
import { DialogoReasignar, type CursoPorReasignar } from "./DialogoReasignar";
import { DialogoRetirar, type RetiroPendiente } from "./DialogoRetirar";

const nombreDe = (p: { nombre: string; apellido?: string | null }) =>
  [p.nombre, p.apellido].filter(Boolean).join(" ");

interface DetalleCursoProps {
  /** null = cerrado. */
  curso: CursoAdmin | null;
  onCerrar: () => void;
}

function Estudiantes({ curso }: { curso: CursoAdmin }) {
  const [pagina, setPagina] = useState(1);
  const [retiro, setRetiro] = useState<RetiroPendiente | null>(null);
  const { data, isPending, error, refetch } = useEstudiantesDeCurso(curso.id, pagina);

  if (isPending) return <Skeleton lineas={4} />;
  if (error && !data)
    return <MensajeError mensaje={error.message} onReintentar={() => refetch()} />;
  if (!data || data.data.length === 0) {
    return <EstadoVacio titulo="Este curso aún no tiene estudiantes inscritos." />;
  }
  return (
    <div className="flex flex-col gap-4">
      <ul className="divide-y divide-linea">
        {data.data.map((e) => (
          <li key={e.estudiante_id} className="flex items-start justify-between gap-3 py-3">
            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-paper">{nombreDe(e)}</p>
              <p className="break-all font-mono text-xs text-muted">{e.email ?? "—"}</p>
              <p className="font-mono text-xs text-muted">
                Inscrito el {formatearFecha(e.inscrito_en)} · avance {e.avance_pct} %
              </p>
            </div>
            <Button
              variante="secundario"
              tamano="sm"
              aria-label={`Retirar a ${nombreDe(e)} del curso`}
              onClick={() =>
                setRetiro({
                  cursoId: curso.id,
                  curso: curso.nombre,
                  estudianteId: e.estudiante_id,
                  estudiante: nombreDe(e),
                })
              }
            >
              Retirar del curso
            </Button>
          </li>
        ))}
      </ul>
      <Paginacion meta={data.meta} onPagina={setPagina} />
      <DialogoRetirar retiro={retiro} onCerrar={() => setRetiro(null)} />
    </div>
  );
}

/** Estudiantes inscritos en un curso (correo completo) con "Retirar del curso". */
/** "Marta Ríos · código K7M2Q9XA"; sin docente lo dice (HU-B-413). */
function descripcionDe(curso: CursoAdmin): string {
  const docente = curso.docente
    ? nombreDe({ nombre: curso.docente, apellido: curso.docente_apellido })
    : "Sin docente";
  return `${docente} · código ${curso.codigo_invitacion}`;
}

/** Asignar, reasignar o quitar al docente del curso (solo el administrador, HU-F-518). */
function AccionesDocente({ curso, onHecho }: { curso: CursoAdmin; onHecho: () => void }) {
  const [asignando, setAsignando] = useState<CursoPorReasignar | null>(null);
  const [quitando, setQuitando] = useState<DocentePorQuitar | null>(null);
  const docente = curso.docente
    ? nombreDe({ nombre: curso.docente, apellido: curso.docente_apellido })
    : null;
  return (
    <div className="mb-4 flex flex-wrap gap-3">
      <Button
        variante="secundario"
        tamano="sm"
        onClick={() =>
          setAsignando({
            id: curso.id,
            nombre: curso.nombre,
            estudiantes: curso.estudiantes,
            docenteId: curso.docente_id,
            docente,
          })
        }
      >
        {docente ? "Reasignar" : "Asignar docente"}
      </Button>
      {docente && (
        <Button
          variante="secundario"
          tamano="sm"
          onClick={() =>
            setQuitando({
              cursoId: curso.id,
              curso: curso.nombre,
              estudiantes: curso.estudiantes,
              docente,
            })
          }
        >
          Quitar docente
        </Button>
      )}
      <DialogoReasignar curso={asignando} onCerrar={() => setAsignando(null)} onHecho={onHecho} />
      <DialogoQuitarDocente
        quitar={quitando}
        onCerrar={() => setQuitando(null)}
        onHecho={onHecho}
      />
    </div>
  );
}

export function DetalleCurso({ curso, onCerrar }: DetalleCursoProps) {
  return (
    <Drawer
      ancho="amplio"
      abierto={curso !== null}
      onCerrar={onCerrar}
      titulo={curso ? curso.nombre : "Curso"}
      descripcion={curso ? descripcionDe(curso) : undefined}
    >
      {curso && !curso.archivado_en && <AccionesDocente curso={curso} onHecho={onCerrar} />}
      {curso && <Estudiantes key={curso.id} curso={curso} />}
    </Drawer>
  );
}
