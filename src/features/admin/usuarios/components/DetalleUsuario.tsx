import { useState, type ReactNode } from "react";
import { cn } from "@/shared/lib/cn.js";
import { formatearFecha } from "@/shared/lib/formato";
import { Button, Drawer, MensajeError, Skeleton } from "@/shared/ui";
import { useDetalleUsuario } from "../hooks";
import { esquemaEdicionCuenta } from "../schemas";
import type { DetalleUsuario as Detalle, RolCuenta } from "../tipos";
import { ETIQUETA_ESTADO, ETIQUETA_ROL, nombreCompleto } from "../utils";
import type { AccionUsuario } from "./AccionesFila";
import { Cursos, Historia, Progreso } from "./SeccionesDetalle";
import {
  type Borrador,
  type ErroresBorrador,
  SeccionAcceso,
  SeccionCorreoPendiente,
  SeccionDatos,
  SeccionEliminar,
  SeccionRol,
} from "./SeccionesEdicion";

export type { Borrador } from "./SeccionesEdicion";

const COLOR_ESTADO = {
  pendiente_verificacion: "text-aviso",
  activa: "text-success",
  suspendida: "text-peligro-texto",
} as const;

function borradorDe(u: Detalle): Borrador {
  return {
    nombre: u.nombre,
    apellido: u.apellido ?? "",
    email: u.email,
    rol: u.rol,
    activa: u.estado !== "suspendida",
    puedeEditarNombre: u.puede_editar_nombre,
  };
}

function hayCambios(u: Detalle, b: Borrador): boolean {
  const origen = borradorDe(u);
  return (Object.keys(origen) as (keyof Borrador)[]).some((clave) => {
    const nuevo = b[clave];
    return (typeof nuevo === "string" ? nuevo.trim() : nuevo) !== origen[clave];
  });
}

/** Al promover se permite el cambio de nombre; al bajar de administrador se bloquea. */
function permisoTrasCambiarRol(u: Detalle, rol: RolCuenta): boolean {
  if (rol === "admin") return true;
  return u.rol === "admin" ? false : u.puede_editar_nombre;
}

function erroresDe(b: Borrador): { validos: boolean; errores: ErroresBorrador } {
  const resultado = esquemaEdicionCuenta.safeParse(b);
  const errores: ErroresBorrador = {};
  if (!resultado.success) {
    for (const problema of resultado.error.issues) {
      const campo = problema.path[0] as keyof ErroresBorrador;
      errores[campo] ??= problema.message;
    }
  }
  return { validos: resultado.success, errores };
}

function Encabezado({ u, propia }: { u: Detalle; propia: boolean }) {
  return (
    <div className="flex flex-col gap-1.5 pb-5">
      <span className="text-xl font-bold text-paper">{nombreCompleto(u)}</span>
      <span className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
        <span className={cn("font-semibold", COLOR_ESTADO[u.estado])}>
          {ETIQUETA_ESTADO[u.estado]}
        </span>
        <span>{ETIQUETA_ROL[u.rol]}</span>
        <span className="font-mono text-xs">Último acceso: {formatearFecha(u.ultimo_acceso)}</span>
      </span>
      {propia && (
        <p className="mt-2 text-sm text-paper">
          Es tu cuenta: puedes editar tus datos, pero no cambiar tu rol, suspenderte ni eliminarte.
        </p>
      )}
    </div>
  );
}

interface FormularioProps {
  usuario: Detalle;
  propia: boolean;
  guardando: boolean;
  accionesCursos?: (cuenta: Detalle) => ReactNode;
  onGuardar: (usuario: Detalle, borrador: Borrador) => void;
  onAccion: (accion: AccionUsuario, usuario: Detalle) => void;
  onCerrar: () => void;
}

function Formulario({
  usuario: u,
  propia,
  guardando,
  accionesCursos,
  onGuardar,
  onAccion,
  onCerrar,
}: FormularioProps) {
  const [b, setB] = useState<Borrador>(() => borradorDe(u));
  const { validos, errores } = erroresDe(b);
  const cambios = hayCambios(u, b);
  const correoCambia = b.email.trim().toLowerCase() !== u.email.toLowerCase();

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto pr-1">
        <Encabezado u={u} propia={propia} />
        <SeccionDatos
          borrador={b}
          errores={errores}
          correoCambia={correoCambia}
          propia={propia}
          onCambiar={(c) => setB({ ...b, ...c })}
        />
        <SeccionRol
          rolActual={u.rol}
          elegido={b.rol}
          propia={propia}
          onElegir={(rol) => setB({ ...b, rol, puedeEditarNombre: permisoTrasCambiarRol(u, rol) })}
        />
        <SeccionAcceso
          borrador={b}
          esAdminHoy={u.rol === "admin"}
          propia={propia}
          onCambiar={(c) => setB({ ...b, ...c })}
        />
        {u.estado === "pendiente_verificacion" && (
          <SeccionCorreoPendiente usuario={u} onAccion={onAccion} />
        )}
        <SeccionEliminar propia={propia} onEliminar={() => onAccion("eliminar", u)} />
        <div className="flex flex-col gap-1 border-t border-linea pt-2">
          <Cursos u={u} />
          {accionesCursos?.(u)}
          <Progreso u={u} />
          <Historia u={u} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-linea pt-4">
        <span className="min-w-36 flex-1 text-sm text-muted">
          {cambios ? "Hay cambios sin guardar" : "Sin cambios"}
        </span>
        <Button variante="fantasma" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button
          cargando={guardando}
          disabled={!cambios || !validos}
          onClick={() => onGuardar(u, b)}
        >
          Guardar cambios
        </Button>
      </div>
    </div>
  );
}

interface DetalleUsuarioProps {
  /** null = cerrado. */
  usuarioId: string | null;
  /** Id del administrador conectado (su cuenta no cambia de rol, no se suspende ni se elimina). */
  miId: string | undefined;
  guardando: boolean;
  onCerrar: () => void;
  onGuardar: (usuario: Detalle, borrador: Borrador) => void;
  onAccion: (accion: AccionUsuario, usuario: Detalle) => void;
  /** Acciones extra bajo los cursos (retirar de todos, enlace a los cursos a cargo). */
  accionesCursos?: (cuenta: Detalle) => ReactNode;
}

/**
 * Panel de edición de una cuenta (Drawer de 520 px): datos, rol, acceso y eliminación con pie
 * fijo (Guardar solo con cambios válidos), más los cursos, el progreso y la historia.
 */
export function DetalleUsuario({
  usuarioId,
  miId,
  guardando,
  onCerrar,
  onGuardar,
  onAccion,
  accionesCursos,
}: DetalleUsuarioProps) {
  const { data, isPending, error, refetch } = useDetalleUsuario(usuarioId);
  return (
    <Drawer ancho="medio" abierto={usuarioId !== null} onCerrar={onCerrar} titulo="Editar usuario">
      {isPending && usuarioId && (
        <div aria-busy="true">
          <Skeleton lineas={6} />
        </div>
      )}
      {error && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {data && data.id === usuarioId && (
        // key: un panel nuevo (otra cuenta) empieza con su propio borrador.
        <Formulario
          key={data.id}
          usuario={data}
          propia={data.id === miId}
          guardando={guardando}
          accionesCursos={accionesCursos}
          onGuardar={onGuardar}
          onAccion={onAccion}
          onCerrar={onCerrar}
        />
      )}
    </Drawer>
  );
}
