import { useQuery } from "@tanstack/react-query";
import { TIEMPO_CATALOGO_MS } from "@/shared/api/queryClient.js";
import { acordesApi } from "../api/acordesApi.js";
import { acordesKeys } from "../api/keys.js";

export function useAcordes() {
  return useQuery({
    queryKey: acordesKeys.lista(),
    queryFn: acordesApi.listar,
    staleTime: TIEMPO_CATALOGO_MS,
  });
}
