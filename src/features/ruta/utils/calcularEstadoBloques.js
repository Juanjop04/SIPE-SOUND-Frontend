// Función pura: sin React ni red. El backend decide el estado de cada bloque
// (bloqueado · disponible · aprobado, HU-B-308); aquí se traduce a lo que pinta la vista.
export const ESTADO_BLOQUEADO = "bloqueado";
export const ESTADO_APROBADO = "aprobado";

export function calcularEstadoBloques(bloques = []) {
  return bloques.map((bloque) => ({
    ...bloque,
    desbloqueado: bloque.estado !== ESTADO_BLOQUEADO,
    aprobado: bloque.estado === ESTADO_APROBADO,
    tienePuntaje: bloque.mejor_puntaje !== null && bloque.mejor_puntaje !== undefined,
  }));
}
