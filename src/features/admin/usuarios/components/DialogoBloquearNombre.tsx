import { Button, Dialog } from "@/shared/ui";
import type { Usuario } from "../tipos";
import { nombreCompleto } from "../utils";

interface DialogoBloquearNombreProps {
  /** null = cerrado. */
  usuario: Usuario | null;
  onConfirmar: (usuario: Usuario, alExito: () => void) => void;
  enviando: boolean;
  onCerrar: () => void;
}

/** Apagar el permiso de nombre pide confirmación (encenderlo no). */
export function DialogoBloquearNombre({
  usuario,
  onConfirmar,
  enviando,
  onCerrar,
}: DialogoBloquearNombreProps) {
  return (
    <Dialog
      abierto={usuario !== null}
      onCerrar={onCerrar}
      titulo="Bloquear el cambio de nombre"
      descripcion={
        usuario
          ? `${nombreCompleto(usuario)} ya no podrá cambiar su nombre ni su apellido. Tendrá que pedirte permiso otra vez.`
          : undefined
      }
    >
      <div className="flex justify-end gap-3">
        <Button variante="fantasma" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button cargando={enviando} onClick={() => usuario && onConfirmar(usuario, onCerrar)}>
          Bloquear cambio de nombre
        </Button>
      </div>
    </Dialog>
  );
}
