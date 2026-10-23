import { useQuery } from "@tanstack/react-query";
import { TIEMPO_CATALOGO_MS } from "@/shared/api/queryClient.js";
import { leccionesApi } from "../api/leccionesApi.js";
import { leccionesKeys } from "../api/keys.js";

export function useLeccion(id) {
  return useQuery({
    queryKey: leccionesKeys.detalle(id),
    queryFn: () => leccionesApi.obtener(id),
    staleTime: TIEMPO_CATALOGO_MS,
  });
}
