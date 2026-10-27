import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TIEMPO_CATALOGO_MS } from "@/shared/api/queryClient.js";
import { ROL, useSession } from "@/features/auth";
import { docenteApi, docenteKeys } from "../datos";
import type { DatosCurso } from "../datos";

export type EstadoCursos = "activo" | "archivado";

export function useCursos(estado: EstadoCursos) {
  return useQuery({
    queryKey: docenteKeys.lista(estado),
    queryFn: () => docenteApi.listarCursos(estado),
  });
}

/**
 * ¿Puede crear contenido? Un docente necesita al menos un curso activo asignado por el
 * administrador (HU-F-518); el administrador siempre puede. `cargando` evita avisar antes de saber.
 */
export function useTieneCursoAsignado() {
  const { rol } = useSession();
  const cursos = useCursos("activo");
  if (rol === ROL.admin) return { cargando: false, puede: true };
  return { cargando: cursos.isPending, puede: (cursos.data?.length ?? 0) > 0 };
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
