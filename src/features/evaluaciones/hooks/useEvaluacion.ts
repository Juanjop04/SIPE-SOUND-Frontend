import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { progresoKeys } from "@/features/progreso";
import { rutaKeys } from "@/features/ruta";
import { evaluacionesApi, evaluacionesKeys } from "../api/evaluacionesApi";
import type { Respuestas } from "../types";

export function useEvaluacion(id: number) {
  return useQuery({
    queryKey: evaluacionesKeys.detalle(id),
    queryFn: () => evaluacionesApi.obtener(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}

/** Al presentar: se refrescan la evaluación, su historial, la ruta (desbloqueo) y el progreso. */
export function usePresentarIntento(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (respuestas: Respuestas) => evaluacionesApi.presentarIntento(id, respuestas),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: evaluacionesKeys.detalle(id) });
      queryClient.invalidateQueries({ queryKey: evaluacionesKeys.intentos(id) });
      queryClient.invalidateQueries({ queryKey: rutaKeys.todas });
      queryClient.invalidateQueries({ queryKey: progresoKeys.todo });
    },
  });
}

/** Historial de varias evaluaciones en paralelo (no hay un endpoint de historial global). */
export function useHistoriales(ids: number[]) {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: evaluacionesKeys.intentos(id),
      queryFn: () => evaluacionesApi.historial(id),
    })),
  });
}
