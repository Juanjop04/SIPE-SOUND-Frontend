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
  /** POST /admin/cursos (HU-B-413): sin `docente_id` el curso queda disponible. */
  crear: (datos: {
    nombre: string;
    descripcion: string | null;
    nivel: string;
    docente_id: string | null;
  }): Promise<ConMensaje<unknown>> => http.conMensaje("POST", "/admin/cursos", datos),
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
  /** Asigna (curso sin docente) o reasigna a un docente con la cuenta activa; el docente recibe un correo. */
  reasignar: (datos: { cursoId: number; docenteId: string }): Promise<ConMensaje<unknown>> =>
    http.conMensaje("PATCH", `/admin/cursos/${datos.cursoId}/docente`, {
      docente_id: datos.docenteId,
    }),
  /** El curso queda disponible (sin docente); estudiantes, ruta y evaluaciones se conservan. */
  quitarDocente: (cursoId: number): Promise<ConMensaje<unknown>> =>
    http.conMensaje("DELETE", `/admin/cursos/${cursoId}/docente`),
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
