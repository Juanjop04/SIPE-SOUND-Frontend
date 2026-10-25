import type { ReactNode } from "react";
import { Drawer, MensajeError, Skeleton } from "@/shared/ui";
import { formatearFecha } from "@/shared/lib/formato";
import { useDetalleUsuario } from "../hooks";
import type { DetalleUsuario as Detalle } from "../tipos";
import { ETIQUETA_ACCION, ETIQUETA_ESTADO, ETIQUETA_ROL, nombreCompleto } from "../utils";

function Dato({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted">{etiqueta}</dt>
      <dd className="text-sm text-paper">{children}</dd>
    </div>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section aria-label={titulo} className="flex flex-col gap-2">
      <h3 className="font-display text-lg font-semibold text-paper">{titulo}</h3>
      {children}
    </section>
  );
}

function Datos({ u }: { u: Detalle }) {
  return (
    <Seccion titulo="Datos">
      <dl className="grid gap-3 sm:grid-cols-2">
        <Dato etiqueta="Correo">
          <span className="break-all font-mono text-xs">{u.email}</span>
        </Dato>
        <Dato etiqueta="Rol">{ETIQUETA_ROL[u.rol]}</Dato>
        <Dato etiqueta="Estado">{ETIQUETA_ESTADO[u.estado]}</Dato>
        <Dato etiqueta="Cambio de nombre">{u.puede_editar_nombre ? "Permitido" : "Bloqueado"}</Dato>
        <Dato etiqueta="Creada">
          <span className="font-mono text-xs">{formatearFecha(u.creado_en)}</span>
        </Dato>
        <Dato etiqueta="Correo verificado">
          <span className="font-mono text-xs">{formatearFecha(u.correo_verificado_en)}</span>
        </Dato>
        <Dato etiqueta="Último acceso">
          <span className="font-mono text-xs">{formatearFecha(u.ultimo_acceso)}</span>
        </Dato>
        {u.estado === "suspendida" && (
          <Dato etiqueta="Motivo de la suspensión">{u.motivo_suspension ?? "—"}</Dato>
        )}
      </dl>
    </Seccion>
  );
}

function Cursos({ u }: { u: Detalle }) {
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

function Progreso({ u }: { u: Detalle }) {
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

function Historia({ u }: { u: Detalle }) {
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

interface DetalleUsuarioProps {
  /** null = cerrado. */
  usuarioId: string | null;
  onCerrar: () => void;
  /** Acciones extra bajo los cursos (retirar de todos, enlace a los cursos a cargo). */
  accionesCursos?: (cuenta: Detalle) => ReactNode;
}

/** Detalle de una cuenta en un Drawer: datos, cursos, progreso y la historia del administrador. */
export function DetalleUsuario({ usuarioId, onCerrar, accionesCursos }: DetalleUsuarioProps) {
  const { data, isPending, error, refetch } = useDetalleUsuario(usuarioId);
  return (
    <Drawer
      ancho="amplio"
      abierto={usuarioId !== null}
      onCerrar={onCerrar}
      titulo={data ? nombreCompleto(data) : "Detalle de la cuenta"}
    >
      {isPending && usuarioId && (
        <div aria-busy="true">
          <Skeleton lineas={6} />
        </div>
      )}
      {error && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {data && (
        <div className="flex flex-col gap-8">
          <Datos u={data} />
          <div className="flex flex-col gap-3">
            <Cursos u={data} />
            {accionesCursos?.(data)}
          </div>
          <Progreso u={data} />
          <Historia u={data} />
        </div>
      )}
    </Drawer>
  );
}
