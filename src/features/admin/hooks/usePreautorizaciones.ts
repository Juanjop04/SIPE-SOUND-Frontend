import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { docentesApi, docentesKeys } from "../api/docentesApi";

export function usePreautorizaciones() {
  return useQuery({ queryKey: docentesKeys.todas, queryFn: docentesApi.listar });
}

function useMutacionPreautorizaciones<T>(accion: (email: string) => Promise<T>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: docentesKeys.todas }),
  });
}

export function usePreautorizar() {
  return useMutacionPreautorizaciones(docentesApi.preautorizar);
}

export function useRetirarPreautorizacion() {
  return useMutacionPreautorizaciones(docentesApi.retirar);
}
