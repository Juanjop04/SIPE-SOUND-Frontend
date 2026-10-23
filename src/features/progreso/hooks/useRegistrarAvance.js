import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rutaKeys } from "@/features/ruta";
import { progresoApi } from "../api/progresoApi.js";
import { progresoKeys } from "../api/keys.js";

const COMPLETADO = { porcentaje: 100, completado: true };

function useRegistrar(registrar) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => registrar(id, COMPLETADO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progresoKeys.todo });
      queryClient.invalidateQueries({ queryKey: rutaKeys.todas });
    },
  });
}

export function useCompletarLeccion() {
  return useRegistrar(progresoApi.registrarLeccion);
}

export function useCompletarEjercicio() {
  return useRegistrar(progresoApi.registrarEjercicio);
}
