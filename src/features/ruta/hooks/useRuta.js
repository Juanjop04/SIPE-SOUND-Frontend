import { useQuery } from "@tanstack/react-query";
import { rutaApi } from "../api/rutaApi.js";
import { rutaKeys } from "../api/keys.js";
import { calcularEstadoBloques } from "../utils/calcularEstadoBloques.js";

// No es catálogo: depende del progreso del estudiante, por eso sin staleTime largo.
export function useRuta(filtros) {
  return useQuery({
    queryKey: rutaKeys.detalle(filtros),
    queryFn: () => rutaApi.obtener(filtros),
    select: calcularEstadoBloques,
  });
}
