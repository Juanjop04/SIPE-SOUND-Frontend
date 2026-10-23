import { useQuery } from "@tanstack/react-query";
import { rutaApi } from "../api/rutaApi.js";
import { rutaKeys } from "../api/keys.js";
import type { BloqueRuta } from "../types";

/**
 * GET /ruta: bloques con su estado (bloqueado · disponible · aprobado) calculado por el
 * backend. No es catálogo: depende del progreso del estudiante, sin staleTime largo.
 */
export function useRuta(filtros?: { curso_id?: number }) {
  return useQuery<BloqueRuta[]>({
    queryKey: rutaKeys.detalle(filtros),
    queryFn: () => rutaApi.obtener(filtros),
  });
}
