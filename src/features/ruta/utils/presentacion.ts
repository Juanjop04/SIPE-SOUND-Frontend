// Ayudas de presentación de la ruta. NO deciden qué está desbloqueado: eso lo hace el backend.
import type { BloqueRuta } from "../types";

/** % de aprobación por defecto del backend (app/core/constants.py). */
export const PORCENTAJE_APROBACION = 80;

/** Bloque inicial: el primero disponible (aún sin aprobar); si no hay, el primero. */
export function bloqueInicial(bloques: BloqueRuta[]): BloqueRuta | undefined {
  return bloques.find((b) => b.estado === "disponible") ?? bloques[0];
}

/** Índice del último bloque aprobado (-1 si ninguno): hasta ahí "suena" la cuerda. */
export function indiceUltimoAprobado(bloques: BloqueRuta[]): number {
  let ultimo = -1;
  bloques.forEach((bloque, indice) => {
    if (bloque.estado === "aprobado") ultimo = indice;
  });
  return ultimo;
}

/** Marcador de mástil: el bloque cierra su nivel (el siguiente es de otro nivel o no hay). */
export function cierraNivel(bloques: BloqueRuta[], indice: number): boolean {
  const siguiente = bloques[indice + 1];
  return !siguiente || siguiente.nivel !== bloques[indice].nivel;
}

/** "Bloque 3, Acordes mayores, bloqueado": nombre accesible de cada traste. */
export function nombreAccesible(bloque: BloqueRuta): string {
  return `Bloque ${bloque.numero}, ${bloque.titulo}, ${bloque.estado}`;
}
