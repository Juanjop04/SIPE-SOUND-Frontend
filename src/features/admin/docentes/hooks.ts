import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { actividadApi, actividadKeys, MAXIMO } from "./api";
import type { EstadoActividad, FiltrosDocentes, FiltrosLinea } from "./tipos";

export function useDocentesActividad(filtros: FiltrosDocentes) {
  return useQuery({
    queryKey: actividadKeys.docentes(filtros),
    queryFn: () => actividadApi.docentes(filtros),
    placeholderData: keepPreviousData,
  });
}

/** Hasta 100 docentes activos para elegir a quién asignar un curso (con su contexto). */
export function useDocentesParaAsignar() {
  const filtros = { orden: "nombre", pagina: 1, por_pagina: MAXIMO } as const;
  return useQuery({
    queryKey: actividadKeys.docentes(filtros),
    queryFn: () => actividadApi.docentes(filtros),
  });
}

/** Docentes en un estado de actividad: solo importa `meta.total`; la lista sirve a "Requieren atención". */
export function useDocentesEnEstado(estado: EstadoActividad) {
  return useQuery({
    queryKey: actividadKeys.cifra(estado),
    queryFn: () =>
      actividadApi.docentes({ estado, orden: "ultima_actividad", pagina: 1, por_pagina: MAXIMO }),
  });
}

export function useCursosSinDocente() {
  return useQuery({ queryKey: actividadKeys.sinDocente(), queryFn: actividadApi.cursosSinDocente });
}

export function useCursosSinDocenteLista() {
  return useQuery({
    queryKey: actividadKeys.sinDocenteLista(),
    queryFn: actividadApi.cursosSinDocenteLista,
  });
}

export function useResumenActividad(id: string, dias: number) {
  return useQuery({
    queryKey: actividadKeys.resumen(id, dias),
    queryFn: () => actividadApi.resumen(id, dias),
    placeholderData: keepPreviousData,
  });
}

export function useLineaDeTiempo(id: string, filtros: FiltrosLinea) {
  return useQuery({
    queryKey: actividadKeys.linea(id, filtros),
    queryFn: () => actividadApi.linea(id, filtros),
    placeholderData: keepPreviousData,
  });
}
