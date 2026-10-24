import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { docenteApi, docenteKeys } from "../cursos/datos";
import type { FiltrosEstudiantes } from "./tipos";

/** Página de estudiantes; mientras llega la siguiente se mantiene la anterior (sin parpadeo). */
export function useEstudiantesCurso(cursoId: number, filtros: FiltrosEstudiantes) {
  return useQuery({
    queryKey: docenteKeys.estudiantesPagina(cursoId, filtros),
    queryFn: () => docenteApi.estudiantes(cursoId, filtros),
    placeholderData: keepPreviousData,
  });
}

export function useDetalleEstudiante(cursoId: number, estudianteId: string | null) {
  return useQuery({
    queryKey: docenteKeys.estudiante(cursoId, estudianteId ?? ""),
    queryFn: () => docenteApi.detalleEstudiante(cursoId, estudianteId ?? ""),
    enabled: estudianteId !== null,
  });
}

/** Retirar del curso refresca la lista, el detalle del curso (conteo) y el resumen del atril. */
export function useRetirarEstudiante(cursoId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (estudianteId: string) => docenteApi.retirarEstudiante(cursoId, estudianteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: docenteKeys.curso(cursoId) });
      queryClient.invalidateQueries({ queryKey: docenteKeys.resumen() });
    },
  });
}
