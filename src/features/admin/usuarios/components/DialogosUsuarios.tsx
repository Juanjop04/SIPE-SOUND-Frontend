import { ApiError } from "@/shared/api/ApiError.js";
import { useEliminarCuenta, useSuspender, useVerificarManual } from "../hooks";
import type { Usuario } from "../tipos";
import { DialogoEliminar } from "./DialogoEliminar";
import { DialogoMotivo } from "./DialogoMotivo";

export type AccionConDialogo = "verificar" | "suspender" | "eliminar";

export interface Pendiente {
  accion: AccionConDialogo;
  usuario: Usuario;
}

const HTTP_CONFLICTO = 409;

/** Los tres diálogos de la página: motivo (verificar, suspender) y eliminar. Solo uno está abierto. */
export function DialogosUsuarios({
  pendiente,
  onCerrar,
}: {
  pendiente: Pendiente | null;
  onCerrar: () => void;
}) {
  const verificar = useVerificarManual();
  const suspender = useSuspender();
  const eliminar = useEliminarCuenta();
  const usuario = pendiente?.usuario;
  const conflicto =
    eliminar.error instanceof ApiError && eliminar.error.statusCode === HTTP_CONFLICTO;

  // Un error de una apertura anterior no debe verse al abrir otra cuenta.
  function cerrar() {
    verificar.reset();
    suspender.reset();
    eliminar.reset();
    onCerrar();
  }

  return (
    <>
      <DialogoMotivo
        abierto={pendiente?.accion === "verificar"}
        titulo="Verificar el correo manualmente"
        descripcion={`Marca como verificado el correo de ${usuario?.email ?? ""} sin el código.`}
        etiquetaBoton="Verificar correo"
        onEnviar={(motivo, alExito) =>
          usuario && verificar.mutate({ usuario, motivo }, { onSuccess: alExito })
        }
        enviando={verificar.isPending}
        error={verificar.error?.message ?? null}
        onCerrar={cerrar}
      />
      <DialogoMotivo
        abierto={pendiente?.accion === "suspender"}
        titulo="Suspender la cuenta"
        descripcion={`${usuario?.email ?? ""} no podrá iniciar sesión y se cerrarán sus sesiones abiertas.`}
        etiquetaBoton="Suspender cuenta"
        onEnviar={(motivo, alExito) =>
          usuario && suspender.mutate({ usuario, motivo }, { onSuccess: alExito })
        }
        enviando={suspender.isPending}
        error={suspender.error?.message ?? null}
        onCerrar={cerrar}
      />
      <DialogoEliminar
        usuario={pendiente?.accion === "eliminar" ? pendiente.usuario : null}
        onEliminar={(cuenta, alExito) => eliminar.mutate(cuenta, { onSuccess: alExito })}
        enviando={eliminar.isPending}
        error={eliminar.error?.message ?? null}
        conflicto={conflicto}
        onCerrar={cerrar}
      />
    </>
  );
}
