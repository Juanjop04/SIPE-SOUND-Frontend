export const leccionesKeys = {
  todas: ["lecciones"],
  lista: () => [...leccionesKeys.todas, "lista"],
  detalle: (id) => [...leccionesKeys.todas, "detalle", id],
};
