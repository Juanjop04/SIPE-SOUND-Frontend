export const evaluacionesKeys = {
  todas: ["evaluaciones"],
  detalle: (id) => [...evaluacionesKeys.todas, "detalle", id],
};
