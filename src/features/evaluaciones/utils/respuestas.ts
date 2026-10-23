import type { Pregunta, Respuestas } from "../types";

// Estado local de la página de evaluación (useReducer): solo las respuestas elegidas.
export type AccionRespuestas =
  { tipo: "elegir"; preguntaId: number; opcion: number } | { tipo: "reiniciar" };

export function reducirRespuestas(estado: Respuestas, accion: AccionRespuestas): Respuestas {
  if (accion.tipo === "reiniciar") return {};
  return { ...estado, [String(accion.preguntaId)]: accion.opcion };
}

/** Números (1, 2…) de las preguntas sin responder, en orden. */
export function preguntasFaltantes(preguntas: Pregunta[], respuestas: Respuestas): number[] {
  return preguntas.flatMap((p, i) => (respuestas[String(p.id)] === undefined ? [i + 1] : []));
}

/** "Falta la pregunta 2." · "Faltan las preguntas 2 y 4." · "Faltan las preguntas 1, 3 y 5." */
export function describirFaltantes(numeros: number[]): string {
  if (numeros.length === 0) return "";
  if (numeros.length === 1) return `Falta la pregunta ${numeros[0]}.`;
  const ultimo = numeros.at(-1);
  return `Faltan las preguntas ${numeros.slice(0, -1).join(", ")} y ${ultimo}.`;
}

/** A, B, C, D… para las opciones. */
export function letra(indice: number): string {
  return String.fromCodePoint(65 + indice);
}
