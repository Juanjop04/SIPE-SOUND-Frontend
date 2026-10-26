import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TIEMPO_CATALOGO_MS } from "@/shared/api/queryClient.js";
import { docenteApi, docenteKeys } from "../datos";
import type { DatosCurso } from "../datos";

export type EstadoCursos = "activo" | "archivado";

export function useCursos(estado: EstadoCursos) {
  return useQuery({
    queryKey: docenteKeys.lista(estado),
    queryFn: () => docenteApi.listarCursos(estado),
  });
}

export function useCurso(id: number) {
  return useQuery({ queryKey: docenteKeys.curso(id), queryFn: () => docenteApi.obtenerCurso(id) });
}

export function useBloquesCatalogo() {
  return useQuery({
    queryKey: docenteKeys.bloques(),
    queryFn: docenteApi.bloquesCatalogo,
    staleTime: TIEMPO_CATALOGO_MS,
  });
}

/** Toda mutación de cursos refresca las listas, el detalle y el resumen del atril. */
function useMutacionCursos<V, R>(accion: (variables: V) => Promise<R>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: docenteKeys.cursos() });
      queryClient.invalidateQueries({ queryKey: docenteKeys.resumen() });
    },
  });
}

export const useCrearCurso = () =>
  useMutacionCursos((datos: DatosCurso) => docenteApi.crearCurso(datos));

export const useEditarCurso = (id: number) =>
  useMutacionCursos((datos: DatosCurso) => docenteApi.editarCurso(id, datos));

export const useArchivarCurso = (id: number) =>
  useMutacionCursos(() => docenteApi.archivarCurso(id));

export const useRegenerarCodigo = (id: number) =>
  useMutacionCursos(() => docenteApi.regenerarCodigo(id));

export const useDefinirRuta = (id: number) =>
  useMutacionCursos((bloques: { bloque_id: number; orden: number }[]) =>
    docenteApi.definirRuta(id, bloques),
  );
