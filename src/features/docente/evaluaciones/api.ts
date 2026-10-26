import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/shared/api/httpClient.js";
import { docenteKeys } from "../cursos/datos";
import type {
  DatosEvaluacion,
  DetalleEvaluacionDocente,
  EstadoEvaluacion,
  EvaluacionDocente,
  FiltrosEvaluaciones,
  PreguntaEnvio,
  ResultadosEvaluacion,
} from "./tipos";

type ConMensaje<T> = Promise<{ data: T; message: string }>;
const RAIZ = "/docente/evaluaciones";

export const evaluacionesApi = {
  listar: (filtros: FiltrosEvaluaciones): Promise<EvaluacionDocente[]> => http.get(RAIZ, filtros),
  obtener: (id: number): Promise<DetalleEvaluacionDocente> => http.get(`${RAIZ}/${id}`),
  crear: (datos: DatosEvaluacion): ConMensaje<EvaluacionDocente> =>
    http.conMensaje("POST", RAIZ, datos),
  editar: (id: number, datos: DatosEvaluacion): ConMensaje<EvaluacionDocente> =>
    http.conMensaje("PATCH", `${RAIZ}/${id}`, datos),
  /** Reemplaza el conjunto completo; 422 si ya hay intentos. */
  preguntas: (id: number, preguntas: PreguntaEnvio[]): ConMensaje<unknown> =>
    http.conMensaje("PUT", `${RAIZ}/${id}/preguntas`, { preguntas }),
  estado: (id: number, estado: EstadoEvaluacion): ConMensaje<EvaluacionDocente> =>
    http.conMensaje("PATCH", `${RAIZ}/${id}/estado`, { estado }),
  /** 409 con `sugerencia: cerrar` si tiene intentos. */
  eliminar: (id: number): ConMensaje<null> => http.conMensaje("DELETE", `${RAIZ}/${id}`),
  resultados: (id: number): Promise<ResultadosEvaluacion> => http.get(`${RAIZ}/${id}/resultados`),
};

export const evaluacionesKeys = {
  todo: [...docenteKeys.todo, "evaluaciones"] as const,
  lista: (filtros: FiltrosEvaluaciones) => [...evaluacionesKeys.todo, "lista", filtros] as const,
  detalle: (id: number) => [...evaluacionesKeys.todo, "detalle", id] as const,
  resultados: (id: number) => [...evaluacionesKeys.todo, "resultados", id] as const,
};

export function useEvaluacionesDocente(filtros: FiltrosEvaluaciones) {
  return useQuery({
    queryKey: evaluacionesKeys.lista(filtros),
    queryFn: () => evaluacionesApi.listar(filtros),
  });
}

export function useEvaluacionDocente(id: number | null) {
  return useQuery({
    queryKey: evaluacionesKeys.detalle(id ?? 0),
    queryFn: () => evaluacionesApi.obtener(id ?? 0),
    enabled: id !== null,
  });
}

export function useResultadosEvaluacion(id: number) {
  return useQuery({
    queryKey: evaluacionesKeys.resultados(id),
    queryFn: () => evaluacionesApi.resultados(id),
  });
}

/** Toda escritura refresca listas, detalle y resultados (y el resumen del atril). */
export function useMutacionEvaluacion<V, R>(fn: (variables: V) => Promise<R>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: evaluacionesKeys.todo });
      queryClient.invalidateQueries({ queryKey: docenteKeys.resumen() });
    },
  });
}
