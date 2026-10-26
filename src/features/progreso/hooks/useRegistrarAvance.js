import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rutaKeys } from "@/features/ruta";
import { progresoApi } from "../api/progresoApi.js";
import { progresoKeys } from "../api/keys.js";

const COMPLETADO = { porcentaje: 100, completado: true };

function useRegistrar(registrar) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registrar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progresoKeys.todo });
      queryClient.invalidateQueries({ queryKey: rutaKeys.todas });
      // Clave de features/ejercicios (ejerciciosKeys.todos): "mi progreso" de cada tarjeta cambia.
      queryClient.invalidateQueries({ queryKey: ["ejercicios"] });
    },
  });
}

/**
 * mutate(id): PUT /progreso/lecciones/{id} con completado.
 * @returns {import("@tanstack/react-query").UseMutationResult<unknown, Error, number>}
 */
export function useCompletarLeccion() {
  return useRegistrar((id) => progresoApi.registrarLeccion(id, COMPLETADO));
}

/**
 * mutate({ id, mejorBpm? }): PUT /progreso/ejercicios/{id}; mejor_bpm 20–300 (HU-B-305).
 * @returns {import("@tanstack/react-query").UseMutationResult<unknown, Error, { id: number, mejorBpm?: number }>}
 */
export function useCompletarEjercicio() {
  return useRegistrar(({ id, mejorBpm }) =>
    progresoApi.registrarEjercicio(id, {
      ...COMPLETADO,
      ...(mejorBpm === undefined ? {} : { mejor_bpm: mejorBpm }),
    }),
  );
}
