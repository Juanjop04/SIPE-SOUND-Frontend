import { useQuery } from "@tanstack/react-query";
import { OPCIONES_CATALOGO } from "@/shared/api/queryClient.js";
import { ejerciciosApi } from "../api/ejerciciosApi.js";
import { ejerciciosKeys } from "../api/keys.js";
import type { Ejercicio } from "../types";

/** Catálogo de ejercicios (5 min fresco; disponible sin conexión): de aquí salen el listado y el detalle. */
export function useEjercicios() {
  return useQuery<Ejercicio[]>({
    queryKey: ejerciciosKeys.lista(),
    queryFn: ejerciciosApi.listar,
    ...OPCIONES_CATALOGO,
  });
}
