import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ApiError } from "@/shared/api/ApiError.js";

const ESTADO_VALIDACION = "VALIDACION";

/**
 * Lleva los errores 400 del backend a sus campos (contrato 08, regla 7): cada entrada de
 * ApiError.porCampo cuyo campo existe en el formulario va con setError; el resto se devuelve
 * para el resumen del formulario (role="alert"). Otros errores devuelven su message.
 */
export function aplicarErroresServidor<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  campos: readonly Path<T>[],
): string | null {
  if (!(error instanceof ApiError)) {
    return error instanceof Error ? error.message : "Ocurrió un error inesperado.";
  }
  if (error.status !== ESTADO_VALIDACION || error.errors.length === 0) return error.message;

  const sinCampo: string[] = [];
  for (const [campo, mensaje] of Object.entries(error.porCampo)) {
    if ((campos as readonly string[]).includes(campo)) {
      setError(campo as Path<T>, { type: "server", message: mensaje });
    } else {
      sinCampo.push(mensaje);
    }
  }
  return sinCampo.length > 0 ? sinCampo.join(" ") : null;
}

/** true si el backend pidió esperar (429): el botón queda deshabilitado 60 s. */
export function esDemasiadasSolicitudes(error: unknown): boolean {
  return error instanceof ApiError && error.statusCode === 429;
}
