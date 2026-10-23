import { useQuery } from "@tanstack/react-query";
import { TIEMPO_CATALOGO_MS } from "@/shared/api/queryClient.js";
import { ejerciciosApi } from "../api/ejerciciosApi.js";
import { ejerciciosKeys } from "../api/keys.js";

export function useEjercicios() {
  return useQuery({
    queryKey: ejerciciosKeys.lista(),
    queryFn: ejerciciosApi.listar,
    staleTime: TIEMPO_CATALOGO_MS,
  });
}
