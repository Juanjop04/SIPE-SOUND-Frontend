import type { ReactNode } from "react";
import { Check, Pencil, Send, Trash2 } from "lucide-react";
import type { Usuario } from "../tipos";
import { nombreCompleto } from "../utils";

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
  /** La cuenta del administrador conectado: no se elimina desde aquí. */
  propia: boolean;
  onAccion: (accion: AccionUsuario, usuario: Usuario) => void;
}

const BOTON =
  "inline-flex h-9 w-9 flex-none items-center justify-center rounded-md border border-transparent text-accent transition-colors duration-rapida disabled:cursor-not-allowed disabled:opacity-40";

function BotonIcono({
  etiqueta,
  onClick,
  clase,
  disabled,
  children,
}: {
  etiqueta: string;
  onClick: () => void;
  clase: string;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={etiqueta}
      title={etiqueta}
      disabled={disabled}
      onClick={onClick}
      className={`${BOTON} ${clase}`}
    >
      {children}
    </button>
  );
}

/**
 * Acciones de una fila, como botones de icono de 36 px con nombre accesible: reenviar el código y
 * verificar (solo si la cuenta está pendiente), editar y eliminar.
 */
export function AccionesFila({ usuario, propia, onAccion }: AccionesFilaProps) {
  const nombre = nombreCompleto(usuario);
  const pendiente = usuario.estado === "pendiente_verificacion";

  return (
    <div className="flex flex-wrap items-center justify-end gap-0.5 max-[820px]:justify-start">
      {pendiente && (
        <>
          <BotonIcono
            etiqueta={`Reenviar código a ${nombre}`}
            clase="hover:bg-surface-2 hover:text-paper"
            onClick={() => onAccion("reenviar", usuario)}
          >
            <Send size={17} aria-hidden="true" />
          </BotonIcono>
          <BotonIcono
            etiqueta={`Verificar manualmente a ${nombre}`}
            clase="hover:bg-surface-2 hover:text-success"
            onClick={() => onAccion("verificar", usuario)}
          >
            <Check size={17} aria-hidden="true" />
          </BotonIcono>
        </>
      )}
      <BotonIcono
        etiqueta={`Editar a ${nombre}`}
        clase="border-linea-fuerte hover:border-primary hover:bg-primary hover:text-sobre-primary"
        onClick={() => onAccion("detalle", usuario)}
      >
        <Pencil size={17} aria-hidden="true" />
      </BotonIcono>
      <BotonIcono
        etiqueta={`Eliminar a ${nombre}`}
        clase="hover:bg-danger/10 hover:text-danger"
        disabled={propia}
        onClick={() => onAccion("eliminar", usuario)}
      >
        <Trash2 size={17} aria-hidden="true" />
      </BotonIcono>
    </div>
  );
}
