// Validación del código con el mensaje del contrato 08 (HU-F-311). Solo la usa el formulario
// de Mis cursos, que se carga bajo demanda: así zod no entra en el chunk inicial (HU-F-312).
import { codigoCurso } from "@/shared/validacion";

const esquema = codigoCurso();

/** null si es válido; si no, el mensaje del contrato 08. */
export function errorDeCodigo(codigo: string): string | null {
  const resultado = esquema.safeParse(codigo);
  return resultado.success ? null : (resultado.error.issues[0]?.message ?? "Código inválido.");
}
