import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { progresoKeys } from "@/features/progreso";
import { rutaKeys } from "@/features/ruta";
import { evaluacionesApi } from "../api/evaluacionesApi.js";
import { evaluacionesKeys } from "../api/keys.js";

export function useEvaluacion(id) {
  return useQuery({
    queryKey: evaluacionesKeys.detalle(id),
    queryFn: () => evaluacionesApi.obtener(id),
    enabled: Boolean(id),
  });
}

export function usePresentarIntento(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (respuestas) => evaluacionesApi.presentarIntento(id, respuestas),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: evaluacionesKeys.detalle(id) });
      queryClient.invalidateQueries({ queryKey: rutaKeys.todas });
      queryClient.invalidateQueries({ queryKey: progresoKeys.todo });
    },
  });
}
