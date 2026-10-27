import type { ReactNode } from "react";
import { formatearFecha } from "@/shared/lib/formato";
import type { DetalleUsuario as Detalle } from "../tipos";
import { ETIQUETA_ACCION, nombreCompleto } from "../utils";
import { Seccion } from "./SeccionesEdicion";

function Dato({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted">{etiqueta}</dt>
      <dd className="text-sm text-paper">{children}</dd>
    </div>
  );
}

export function Cursos({ u }: { u: Detalle }) {
  if (u.rol === "docente") {
    return (
      <Seccion titulo="Cursos a cargo">
        {u.cursos_a_cargo.length === 0 ? (
          <p className="text-sm text-muted">No tiene cursos a cargo.</p>
        ) : (
          <ul className="divide-y divide-linea text-sm">
            {u.cursos_a_cargo.map((c) => (
              <li key={c.id} className="flex justify-between gap-3 py-2">
                <span>
                  {c.nombre}
                  {c.archivado_en && <span className="text-muted"> · Archivado</span>}
                </span>
                <span className="font-mono text-xs text-muted">{c.estudiantes} estudiantes</span>
              </li>
            ))}
          </ul>
        )}
      </Seccion>
    );
  }
  return (
    <Seccion titulo="Inscripciones">
      {u.inscripciones.length === 0 ? (
        <p className="text-sm text-muted">No está inscrita en cursos activos.</p>
      ) : (
        <ul className="divide-y divide-linea text-sm">
          {u.inscripciones.map((i) => (
            <li key={i.curso_id} className="flex justify-between gap-3 py-2">
              <span>
                {i.curso}
                <span className="text-muted">
                  {" "}
                  · {nombreCompleto({ nombre: i.docente, apellido: i.docente_apellido })}
                </span>
              </span>
              <span className="font-mono text-xs text-muted">{formatearFecha(i.inscrito_en)}</span>
            </li>
          ))}
        </ul>
      )}
    </Seccion>
  );
}

export function Progreso({ u }: { u: Detalle }) {
  if (!u.progreso) return null;
  const { lecciones, ejercicios, bloques_aprobados, ultimo_avance } = u.progreso;
  return (
    <Seccion titulo="Progreso">
      <dl className="grid gap-3 sm:grid-cols-2">
        <Dato etiqueta="Lecciones">
          <span className="font-mono">
            {lecciones.completadas} de {lecciones.total}
          </span>
        </Dato>
        <Dato etiqueta="Ejercicios">
          <span className="font-mono">
            {ejercicios.completados} de {ejercicios.total}
          </span>
        </Dato>
        <Dato etiqueta="Bloques aprobados">
          <span className="font-mono">{bloques_aprobados}</span>
        </Dato>
        <Dato etiqueta="Último avance">
          <span className="font-mono text-xs">{formatearFecha(ultimo_avance)}</span>
        </Dato>
      </dl>
    </Seccion>
  );
}

export function Historia({ u }: { u: Detalle }) {
  return (
    <Seccion titulo="Historia de acciones">
      {u.acciones.length === 0 ? (
        <p className="text-sm text-muted">El administrador no ha hecho nada sobre esta cuenta.</p>
      ) : (
        <ul className="divide-y divide-linea text-sm">
          {u.acciones.map((a) => (
            <li key={`${a.accion}-${a.creado_en}`} className="flex justify-between gap-3 py-2">
              <span>
                {ETIQUETA_ACCION[a.accion] ?? a.accion}
                {a.admin && <span className="text-muted"> · {a.admin}</span>}
              </span>
              <span className="shrink-0 font-mono text-xs text-muted">
                {formatearFecha(a.creado_en)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Seccion>
  );
}
