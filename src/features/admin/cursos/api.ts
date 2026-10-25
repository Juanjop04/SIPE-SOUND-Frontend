import { http } from "@/shared/api/httpClient.js";
import type {
  CursoAdmin,
  CursoDeDocente,
  DocenteAdmin,
  EstudianteDeCurso,
  FiltrosCursos,
  Pagina,
} from "./tipos";

export const POR_PAGINA = 20;
/** Máximo que acepta el backend: alcanza para elegir a quién reasignar un curso. */
export const MAXIMO_DOCENTES = 100;

interface ConMensaje<T> {
  data: T;
  message: string;
}

export const cursosAdminApi = {
  docentes: (filtros: {
    q?: string;
    pagina: number;
    por_pagina: number;
  }): Promise<Pagina<DocenteAdmin>> => http.getPaginado("/admin/docentes", filtros),
  cursosDeDocente: (id: string): Promise<CursoDeDocente[]> =>
    http.get(`/admin/docentes/${id}/cursos`),
  cursos: (filtros: FiltrosCursos): Promise<Pagina<CursoAdmin>> =>
    http.getPaginado("/admin/cursos", {
      docente_id: filtros.docente,
      estado: filtros.estado,
      q: filtros.q,
      pagina: filtros.pagina,
      por_pagina: POR_PAGINA,
    }),
  estudiantes: (cursoId: number, pagina: number): Promise<Pagina<EstudianteDeCurso>> =>
    http.getPaginado(`/admin/cursos/${cursoId}/estudiantes`, { pagina, por_pagina: POR_PAGINA }),
  /** El curso pasa a otro docente con la cuenta activa; sus estudiantes y evaluaciones se mantienen. */
  reasignar: (datos: { cursoId: number; docenteId: string }): Promise<ConMensaje<unknown>> =>
    http.conMensaje("PATCH", `/admin/cursos/${datos.cursoId}/docente`, {
      docente_id: datos.docenteId,
    }),
  /** Borra la inscripción, no el progreso. El `message` sugiere regenerar el código. */
  retirar: (datos: { cursoId: number; estudianteId: string }): Promise<ConMensaje<null>> =>
    http.conMensaje("DELETE", `/admin/cursos/${datos.cursoId}/estudiantes/${datos.estudianteId}`),
  retirarDeTodos: (usuarioId: string): Promise<ConMensaje<{ revocadas: number }>> =>
    http.conMensaje("DELETE", `/admin/usuarios/${usuarioId}/cursos`),
};

export const cursosAdminKeys = {
  todo: ["admin", "cursos-docentes"] as const,
  docentes: (filtros: { q?: string; pagina: number; por_pagina: number }) =>
    [...cursosAdminKeys.todo, "docentes", filtros] as const,
  cursosDeDocente: (id: string) => [...cursosAdminKeys.todo, "de-docente", id] as const,
  cursos: (filtros: FiltrosCursos) => [...cursosAdminKeys.todo, "cursos", filtros] as const,
  estudiantes: (cursoId: number, pagina: number) =>
    [...cursosAdminKeys.todo, "estudiantes", cursoId, pagina] as const,
};
