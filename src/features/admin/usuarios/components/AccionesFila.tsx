import type { ReactNode } from "react";
import { BadgeCheck, Eye, Mail, Trash2 } from "lucide-react";
import type { Usuario } from "../tipos";
import { nombreCompleto } from "../utils";
import { Interruptor } from "@/shared/ui";

export type AccionUsuario =
  | "detalle"
  | "reenviar"
  | "verificar"
  | "suspender"
  | "reactivar"
  | "permitir"
  | "bloquear"
  | "eliminar";

interface AccionesFilaProps {
  usuario: Usuario;
  onAccion: (accion: AccionUsuario, usuario: Usuario) => void;
}

function tituloCuenta(usuario: Usuario): string {
  if (usuario.rol === "admin") return "Los administradores no se suspenden";
  if (usuario.estado === "suspendida") return "Cuenta suspendida: enciéndela para reactivarla";
  return "Cuenta activa: apágala para suspenderla";
}

function tituloNombre(usuario: Usuario): string {
  if (usuario.rol === "admin") return "Los administradores siempre pueden cambiar su nombre";
  if (usuario.puede_editar_nombre) return "Puede cambiar su nombre: apágalo para bloquearlo";
  return "No puede cambiar su nombre: enciéndelo para permitirlo";
}

const BOTON =
  "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors duration-rapida hover:bg-surface hover:text-paper";

function BotonIcono({
  etiqueta,
  onClick,
  peligro,
  children,
}: {
  etiqueta: string;
  onClick: () => void;
  peligro?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={etiqueta}
      title={etiqueta}
      onClick={onClick}
      className={`${BOTON} ${peligro ? "hover:text-danger" : ""}`}
    >
      {children}
    </button>
  );
}

/**
 * Acciones de una fila, siempre visibles como iconos. Los dos interruptores son estados (cuenta
 * activa, cambio de nombre permitido): apagarlos pide confirmación en un diálogo; encenderlos no.
 * Los administradores no se suspenden ni se eliminan, y siempre pueden cambiar su nombre.
 */
export function AccionesFila({ usuario, onAccion }: AccionesFilaProps) {
  const nombre = nombreCompleto(usuario);
  const esAdmin = usuario.rol === "admin";
  const suspendida = usuario.estado === "suspendida";
  const pendiente = usuario.estado === "pendiente_verificacion";

  return (
    <div className="flex items-center gap-1">
      <BotonIcono
        etiqueta={`Ver detalle de ${nombre}`}
        onClick={() => onAccion("detalle", usuario)}
      >
        <Eye size={16} aria-hidden="true" />
      </BotonIcono>
      {pendiente && (
        <>
          <BotonIcono
            etiqueta={`Reenviar código a ${nombre}`}
            onClick={() => onAccion("reenviar", usuario)}
          >
            <Mail size={16} aria-hidden="true" />
          </BotonIcono>
          <BotonIcono
            etiqueta={`Verificar manualmente a ${nombre}`}
            onClick={() => onAccion("verificar", usuario)}
          >
            <BadgeCheck size={16} aria-hidden="true" />
          </BotonIcono>
        </>
      )}
      <div className="flex flex-col gap-1">
        <Interruptor
          activo={!suspendida}
          etiqueta={`Cuenta de ${nombre}`}
          texto={suspendida ? "Cuenta suspendida" : "Cuenta activa"}
          titulo={tituloCuenta(usuario)}
          disabled={esAdmin}
          onCambiar={() => onAccion(suspendida ? "reactivar" : "suspender", usuario)}
        />
        <Interruptor
          activo={esAdmin || usuario.puede_editar_nombre}
          etiqueta={`Cambio de nombre de ${nombre}`}
          texto={esAdmin || usuario.puede_editar_nombre ? "Nombre editable" : "Nombre bloqueado"}
          titulo={tituloNombre(usuario)}
          disabled={esAdmin}
          onCambiar={() => onAccion(usuario.puede_editar_nombre ? "bloquear" : "permitir", usuario)}
        />
      </div>
      {!esAdmin && (
        <BotonIcono
          etiqueta={`Eliminar a ${nombre}`}
          peligro
          onClick={() => onAccion("eliminar", usuario)}
        >
          <Trash2 size={16} aria-hidden="true" />
        </BotonIcono>
      )}
    </div>
  );
}
