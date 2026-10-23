export const progresoKeys = {
  todo: ["progreso"],
  resumen: () => [...progresoKeys.todo, "resumen"],
  /** @param {number} dias */
  actividad: (dias) => [...progresoKeys.todo, "actividad", dias],
};
