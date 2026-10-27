import { http } from "@/shared/api/httpClient.js";
import type { CursoAdmin, Pagina } from "../cursos/tipos";
import type {
  DocenteActividad,
  EstadoActividad,
  EventoActividad,
  FiltrosDocentes,
  FiltrosLinea,
  ResumenActividad,
} from "./tipos";

export const POR_PAGINA = 20;
/** Máximo que acepta el backend. */
export const MAXIMO = 100;

export const actividadApi = {
  docentes: (
    filtros: Partial<FiltrosDocentes> & { por_pagina?: number },
  ): Promise<Pagina<DocenteActividad>> =>
    http.getPaginado("/admin/docentes/actividad", {
      q: filtros.q,
      estado_actividad: filtros.estado,
      orden: filtros.orden ?? "nombre",
      pagina: filtros.pagina ?? 1,
      por_pagina: filtros.por_pagina ?? POR_PAGINA,
    }),
  resumen: (id: string, dias: number): Promise<ResumenActividad> =>
    http.get(`/admin/docentes/${id}/actividad/resumen`, { dias }),
  linea: (id: string, filtros: FiltrosLinea): Promise<Pagina<EventoActividad>> =>
    http.getPaginado(`/admin/docentes/${id}/actividad`, {
      tipo: filtros.tipo,
      desde: filtros.desde,
      curso_id: filtros.curso,
      pagina: filtros.pagina,
      por_pagina: POR_PAGINA,
    }),
  /** Cursos activos sin docente, para asignarlos desde el detalle de un docente. */
  cursosSinDocenteLista: (): Promise<Pagina<CursoAdmin>> =>
    http.getPaginado("/admin/cursos", { sin_docente: true, estado: "activo", por_pagina: MAXIMO }),
  /** Cuántos cursos activos no tienen docente (solo se lee `meta.total`). */
  cursosSinDocente: (): Promise<Pagina<unknown>> =>
    http.getPaginado("/admin/cursos", { sin_docente: true, estado: "activo", por_pagina: 1 }),
};

export const actividadKeys = {
  todo: ["admin", "actividad-docentes"] as const,
  docentes: (f: object) => [...actividadKeys.todo, "docentes", f] as const,
  resumen: (id: string, dias: number) => [...actividadKeys.todo, "resumen", id, dias] as const,
  linea: (id: string, f: object) => [...actividadKeys.todo, "linea", id, f] as const,
  cifra: (estado: EstadoActividad) => [...actividadKeys.todo, "cifra", estado] as const,
  sinDocente: () => [...actividadKeys.todo, "sin-docente"] as const,
  sinDocenteLista: () => [...actividadKeys.todo, "sin-docente-lista"] as const,
};
