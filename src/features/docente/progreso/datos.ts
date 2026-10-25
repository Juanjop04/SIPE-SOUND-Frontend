import { http } from "@/shared/api/httpClient.js";
import type {
  FiltrosProgreso,
  FiltrosSeries,
  PaginaMatriz,
  ProgresoDeEstudiante,
  ResumenProgreso,
  SeriesProgreso,
} from "./tipos";

/** Estudiantes por página de la matriz (el backend admite hasta 100). */
export const POR_PAGINA_MATRIZ = 50;

export const progresoApi = {
  resumen: (curso: number | null): Promise<ResumenProgreso> =>
    http.get("/docente/progreso", { curso_id: curso ?? undefined }),
  matriz: (filtros: FiltrosProgreso & { curso: number }): Promise<PaginaMatriz> =>
    http.getPaginado("/docente/progreso/matriz", {
      curso_id: filtros.curso,
      q: filtros.q,
      orden: filtros.orden,
      pagina: filtros.pagina,
      por_pagina: POR_PAGINA_MATRIZ,
    }),
  series: (filtros: FiltrosSeries): Promise<SeriesProgreso> =>
    http.get("/docente/progreso/series", {
      curso_id: filtros.curso ?? undefined,
      bloque_id: filtros.bloque ?? undefined,
      dias: filtros.dias,
      estudiantes: filtros.grupo ?? undefined,
    }),
  estudiante: (id: string): Promise<ProgresoDeEstudiante> =>
    http.get(`/docente/progreso/estudiantes/${id}`),
};

export const progresoKeys = {
  todo: ["docente", "progreso"] as const,
  resumen: (curso: number | null) => [...progresoKeys.todo, "resumen", curso] as const,
  matriz: (filtros: FiltrosProgreso) => [...progresoKeys.todo, "matriz", filtros] as const,
  series: (filtros: FiltrosSeries) => [...progresoKeys.todo, "series", filtros] as const,
  estudiante: (id: string) => [...progresoKeys.todo, "estudiante", id] as const,
};
