// Código de invitación (HU-F-311): limpieza al escribir o pegar y el pendiente de ?codigo=.
// Sin zod: este archivo entra en el chunk inicial (AuthLayout, EstudianteLayout) y zod pesa
// ~16 kB gzip (HU-F-312). La validación con mensaje vive en validarCodigo.ts.
import { LIMITES } from "@/shared/validacion";

const CLAVE_PENDIENTE = "sipe-codigo-curso";
const PATRON = new RegExp(`^[${LIMITES.codigoCurso.alfabeto}]{${LIMITES.codigoCurso.largo}}$`);

/** "k7m2-q9xa " → "K7M2Q9XA": sin espacios ni guiones, en mayúsculas, máximo 8. */
export function limpiarCodigo(texto: string): string {
  return texto.replace(/[\s-]/g, "").toUpperCase().slice(0, LIMITES.codigoCurso.largo);
}

/** Guarda ?codigo= hasta completar el acceso; uno inválido se descarta sin avisar. */
export function guardarCodigoPendiente(valor: string | null): void {
  if (!valor) return;
  const codigo = limpiarCodigo(valor);
  if (!PATRON.test(codigo)) return;
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
