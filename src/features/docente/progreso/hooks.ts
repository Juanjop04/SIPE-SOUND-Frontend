import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { progresoApi, progresoKeys } from "./datos";
import type { FiltrosProgreso } from "./tipos";

export function useResumenProgreso(curso: number | null) {
  return useQuery({
    queryKey: progresoKeys.resumen(curso),
    queryFn: () => progresoApi.resumen(curso),
  });
}

/** Solo con un curso elegido; al cambiar de página o de orden se mantiene la anterior. */
export function useMatriz(filtros: FiltrosProgreso) {
  const { curso } = filtros;
  return useQuery({
    queryKey: progresoKeys.matriz(filtros),
    queryFn: () => progresoApi.matriz({ ...filtros, curso: curso ?? 0 }),
    enabled: curso !== null,
    placeholderData: keepPreviousData,
  });
}

export function useProgresoDeEstudiante(id: string | null) {
  return useQuery({
    queryKey: progresoKeys.estudiante(id ?? ""),
    queryFn: () => progresoApi.estudiante(id ?? ""),
    enabled: id !== null,
  });
}
