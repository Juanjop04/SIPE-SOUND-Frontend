// Código de invitación (HU-F-311): limpieza al escribir o pegar y el pendiente de ?codigo=.
import { codigoCurso, LIMITES } from "@/shared/validacion";

const CLAVE_PENDIENTE = "sipe-codigo-curso";
const esquema = codigoCurso();

/** "k7m2-q9xa " → "K7M2Q9XA": sin espacios ni guiones, en mayúsculas, máximo 8. */
export function limpiarCodigo(texto: string): string {
  return texto.replace(/[\s-]/g, "").toUpperCase().slice(0, LIMITES.codigoCurso.largo);
}

/** null si es válido; si no, el mensaje del contrato 08. */
export function errorDeCodigo(codigo: string): string | null {
  const resultado = esquema.safeParse(codigo);
  return resultado.success ? null : (resultado.error.issues[0]?.message ?? "Código inválido.");
}

/** Guarda ?codigo= hasta completar el acceso; uno inválido se descarta sin avisar. */
export function guardarCodigoPendiente(valor: string | null): void {
  if (!valor) return;
  const codigo = limpiarCodigo(valor);
  if (errorDeCodigo(codigo) !== null) return;
  try {
    sessionStorage.setItem(CLAVE_PENDIENTE, codigo);
  } catch {
    // Sin almacenamiento: el estudiante puede escribir el código en Mis cursos.
  }
}

/** Lee y borra el código pendiente (se usa una sola vez). */
export function tomarCodigoPendiente(): string | null {
  try {
    const codigo = sessionStorage.getItem(CLAVE_PENDIENTE);
    sessionStorage.removeItem(CLAVE_PENDIENTE);
    return codigo;
  } catch {
    return null;
  }
}
