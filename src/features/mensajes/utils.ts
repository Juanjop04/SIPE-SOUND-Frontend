// Funciones puras de la mensajería (HU-F-407).
import { LIMITES } from "@/shared/validacion";
import type { Alcance, Destinatario, NuevoMensaje, Persona } from "./tipos";

/** "Marta Ríos"; sin cuenta (el remitente ya no existe) se dice sin inventar un nombre. */
export function nombreDe(persona: Persona | null): string {
  if (!persona) return "Cuenta eliminada";
  return [persona.nombre, persona.apellido].filter(Boolean).join(" ");
}

/**
 * El asunto de un hilo nuevo es el nombre de quien lo envía (HU-F-508): nadie lo escribe. El
 * backend pide 3 a 120 caracteres; un nombre más corto se completa y uno más largo se recorta.
 */
export function asuntoDeNombre(
  persona: { nombre: string; apellido: string | null } | null,
): string {
  const nombre = persona ? [persona.nombre, persona.apellido].filter(Boolean).join(" ").trim() : "";
  const asunto =
    nombre.length >= LIMITES.asunto.min ? nombre : `Mensaje de ${nombre || "un usuario"}`;
  return asunto.slice(0, LIMITES.asunto.max);
}

/** Valor del <option> del selector: identifica tipo e id sin ambigüedad. */
export const valorDestino = (d: Destinatario) => `${d.tipo}:${d.id}`;

/** Del valor elegido al cuerpo que espera POST /mensajes (el asunto y el texto los pone quien llama). */
export function mensajeParaDestino(
  destino: Destinatario,
  asunto: string,
  cuerpo: string,
): NuevoMensaje {
  if (destino.tipo === "usuario") {
    return { alcance: "usuario", destinatario_id: String(destino.id), asunto, cuerpo };
  }
  if (destino.tipo === "curso") {
    return { alcance: "curso", curso_id: Number(destino.id), asunto, cuerpo };
  }
  return { alcance: destino.id as Alcance, asunto, cuerpo };
}

/**
 * Aviso previo al envío de un grupo ("Este aviso llegará a 28 estudiantes de Guitarra 7A."). Una
 * persona sola no pide confirmación (null). Los grupos no traen su tamaño: se nombran.
 */
export function confirmacionDeGrupo(destino: Destinatario): string | null {
  if (destino.tipo === "usuario") return null;
  if (destino.tipo === "curso") {
    // El detalle del curso es "28 estudiantes".
    const cantidad = Number.parseInt(destino.detalle ?? "", 10);
    return Number.isNaN(cantidad)
      ? `Este aviso llegará a los estudiantes de ${destino.etiqueta}.`
      : `Este aviso llegará a ${cantidad} estudiantes de ${destino.etiqueta}.`;
  }
  return `Este aviso llegará a: ${destino.etiqueta.toLowerCase()}.`;
}

/** Texto de éxito tras enviar: nombra a la persona o dice a cuántas llegó. */
export function textoDeEnvio(destino: Destinatario, destinatarios: number): string {
  if (destino.tipo === "usuario") return `Mensaje enviado a ${destino.etiqueta}.`;
  return `Aviso enviado a ${destinatarios} ${destinatarios === 1 ? "persona" : "personas"}.`;
}
