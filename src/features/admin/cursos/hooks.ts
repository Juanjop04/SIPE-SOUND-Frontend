import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAviso } from "@/shared/ui";
import { cursosAdminApi, cursosAdminKeys, MAXIMO_DOCENTES, POR_PAGINA } from "./api";
import type { FiltrosCursos } from "./tipos";

export function useDocentes(q: string | undefined, pagina: number) {
  const filtros = { q, pagina, por_pagina: POR_PAGINA };
  return useQuery({
    queryKey: cursosAdminKeys.docentes(filtros),
    queryFn: () => cursosAdminApi.docentes(filtros),
    placeholderData: keepPreviousData,
  });
}

/** Hasta 100 docentes para elegir a quién reasignar un curso (el backend solo acepta cuentas activas). */
export function useDocentesParaElegir() {
  const filtros = { pagina: 1, por_pagina: MAXIMO_DOCENTES };
  return useQuery({
    queryKey: cursosAdminKeys.docentes(filtros),
    queryFn: () => cursosAdminApi.docentes(filtros),
  });
}

export function useCursosDeDocente(id: string | null) {
  return useQuery({
    queryKey: cursosAdminKeys.cursosDeDocente(id ?? ""),
    queryFn: () => cursosAdminApi.cursosDeDocente(id ?? ""),
    enabled: Boolean(id),
  });
}

export function useCursos(filtros: FiltrosCursos) {
  return useQuery({
    queryKey: cursosAdminKeys.cursos(filtros),
    queryFn: () => cursosAdminApi.cursos(filtros),
    placeholderData: keepPreviousData,
  });
}

export function useEstudiantesDeCurso(cursoId: number | null, pagina: number) {
  return useQuery({
    queryKey: cursosAdminKeys.estudiantes(cursoId ?? 0, pagina),
    queryFn: () => cursosAdminApi.estudiantes(cursoId ?? 0, pagina),
    enabled: cursoId !== null,
    placeholderData: keepPreviousData,
  });
}

// Tras reasignar o retirar cambian docentes, cursos y estudiantes: se vuelve a pedir todo.
function useAccionConAviso<V, R extends { message: string }>(
  mutationFn: (variables: V) => Promise<R>,
  mensaje: (variables: V, respuesta: R) => string,
) {
  const queryClient = useQueryClient();
  const { avisar } = useAviso();
  return useMutation({
    mutationFn,
    onSuccess: (respuesta, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
      avisar({ mensaje: mensaje(variables, respuesta) });
    },
  });
}

export function useReasignarCurso() {
  return useAccionConAviso(
    (datos: { cursoId: number; docenteId: string; resumen: string }) =>
      cursosAdminApi.reasignar(datos),
    (datos) => datos.resumen,
  );
}

export function useRetirarEstudiante() {
  // El backend añade la sugerencia de regenerar el código del curso.
  return useAccionConAviso(
    (datos: { cursoId: number; estudianteId: string }) => cursosAdminApi.retirar(datos),
    (_, respuesta) => respuesta.message,
  );
}

export function useRetirarDeTodosLosCursos() {
  return useAccionConAviso(
    (usuarioId: string) => cursosAdminApi.retirarDeTodos(usuarioId),
    (_, respuesta) => respuesta.message,
  );
}
