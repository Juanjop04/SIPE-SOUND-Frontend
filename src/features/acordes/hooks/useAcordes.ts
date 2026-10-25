import { useQuery } from "@tanstack/react-query";
import { OPCIONES_CATALOGO } from "@/shared/api/queryClient.js";
import { acordesApi } from "../api/acordesApi.js";
import { acordesKeys } from "../api/keys.js";
import type { Acorde } from "../types";

export function useAcordes() {
  return useQuery<Acorde[]>({
    queryKey: acordesKeys.lista(),
    queryFn: acordesApi.listar,
    ...OPCIONES_CATALOGO,
  });
}
