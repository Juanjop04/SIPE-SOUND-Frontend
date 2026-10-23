export const leccionesKeys = {
  todas: ["lecciones"],
  detalle: (id) => [...leccionesKeys.todas, "detalle", id],
};
