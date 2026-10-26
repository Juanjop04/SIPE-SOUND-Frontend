import { http } from "@/shared/api/httpClient.js";
import type {
  FiltrosProgreso,
  FiltrosSeries,
  PaginaMatriz,
  ProgresoDeEstudiante,
  ResumenProgreso,
  SeriesProgreso,
} from "./tipos";

/**
 * AAAA-MM-DD. Un backend sin el arreglo de HU-B-503 manda el date como "Mon, 19 Oct 2026 00:00:00
 * GMT" (Flask) y la gráfica de actividad no lo puede leer: se normaliza aquí, en un solo lugar.
 */
export function conFechaIso<T extends { fecha: string }>(dia: T): T {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dia.fecha)) return dia;
  const fecha = new Date(dia.fecha);
  return Number.isNaN(fecha.getTime()) ? dia : { ...dia, fecha: fecha.toISOString().slice(0, 10) };
}

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
  series: async (filtros: FiltrosSeries): Promise<SeriesProgreso> => {
    const series: SeriesProgreso = await http.get("/docente/progreso/series", {
      curso_id: filtros.curso ?? undefined,
      bloque_id: filtros.bloque ?? undefined,
      dias: filtros.dias,
      estudiantes: filtros.grupo ?? undefined,
    });
    return { ...series, actividad_por_dia: series.actividad_por_dia.map(conFechaIso) };
  },
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
