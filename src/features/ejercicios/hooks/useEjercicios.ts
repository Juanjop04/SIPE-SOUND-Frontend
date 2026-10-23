import { useQuery } from "@tanstack/react-query";
import { TIEMPO_CATALOGO_MS } from "@/shared/api/queryClient.js";
import { ejerciciosApi } from "../api/ejerciciosApi.js";
import { ejerciciosKeys } from "../api/keys.js";
import type { Ejercicio } from "../types";

/** Catálogo de ejercicios (5 min en caché): de aquí salen el listado y el detalle. */
export function useEjercicios() {
  return useQuery<Ejercicio[]>({
    queryKey: ejerciciosKeys.lista(),
    queryFn: ejerciciosApi.listar,
    staleTime: TIEMPO_CATALOGO_MS,
  });
}
