import { formatearFecha } from "@/shared/lib/formato";
import { Button, Drawer, EstadoVacio, MensajeError, Skeleton } from "@/shared/ui";
import { useCursosDeDocente } from "../hooks";
import type { CursoDeDocente, DocenteAdmin } from "../tipos";
import type { DocentePorQuitar } from "./DialogoQuitarDocente";
import type { CursoPorReasignar } from "./DialogoReasignar";

interface DrawerDocenteProps {
  /** null = cerrado. */
  docente: DocenteAdmin | null;
  nombre: string;
  onCerrar: () => void;
  onReasignar: (curso: CursoPorReasignar) => void;
  onQuitar: (curso: DocentePorQuitar) => void;
}

function FilaCurso({
  curso,
  onReasignar,
  onQuitar,
}: {
  curso: CursoDeDocente;
  onReasignar: (curso: CursoDeDocente) => void;
  onQuitar: (curso: CursoDeDocente) => void;
}) {
  return (
    <li className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1">
        <p className="font-medium text-paper">
          {curso.nombre}
          {curso.archivado_en && <span className="font-normal text-muted"> · Archivado</span>}
        </p>
        <p className="text-sm text-muted">
          <span className="font-mono tabular-nums">{curso.estudiantes}</span> estudiantes ·{" "}
          <span className="font-mono tabular-nums">{curso.bloques_en_ruta}</span> bloques en ruta
        </p>
        <p className="font-mono text-xs text-muted">
          Código {curso.codigo_invitacion} · creado el {formatearFecha(curso.creado_en)}
        </p>
      </div>
      <div className="flex gap-2">
        <Button variante="secundario" tamano="sm" onClick={() => onReasignar(curso)}>
          Reasignar
        </Button>
        {!curso.archivado_en && (
          <Button variante="secundario" tamano="sm" onClick={() => onQuitar(curso)}>
            Quitar docente
          </Button>
        )}
      </div>
    </li>
  );
}

/** Cursos de un docente, activos primero y luego archivados, cada uno con "Reasignar". */
export function DrawerDocente({
  docente,
  nombre,
  onCerrar,
  onReasignar,
  onQuitar,
}: DrawerDocenteProps) {
  const { data, isPending, error, refetch } = useCursosDeDocente(docente?.id ?? null);
  return (
    <Drawer
      ancho="amplio"
      abierto={docente !== null}
      onCerrar={onCerrar}
      titulo={`Cursos de ${nombre}`}
      descripcion={docente?.email}
    >
      {isPending && docente && (
        <div aria-busy="true">
          <Skeleton lineas={4} />
        </div>
      )}
      {error && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {data && data.length === 0 && <EstadoVacio titulo="Este docente aún no tiene cursos." />}
      {data && docente && data.length > 0 && (
        <ul className="divide-y divide-linea">
          {data.map((curso) => (
            <FilaCurso
              key={curso.id}
              curso={curso}
              onReasignar={(c) =>
                onReasignar({
                  id: c.id,
                  nombre: c.nombre,
                  estudiantes: c.estudiantes,
                  docenteId: docente.id,
                  docente: nombre,
                })
              }
              onQuitar={(c) =>
                onQuitar({
                  cursoId: c.id,
                  curso: c.nombre,
                  estudiantes: c.estudiantes,
                  docente: nombre,
                })
              }
            />
          ))}
        </ul>
      )}
    </Drawer>
  );
}
