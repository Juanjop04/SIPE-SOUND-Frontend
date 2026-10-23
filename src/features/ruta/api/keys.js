export const rutaKeys = {
  todas: ["ruta"],
  detalle: (filtros) => [...rutaKeys.todas, filtros ?? {}],
};
