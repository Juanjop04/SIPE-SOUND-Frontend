import { http } from "@/shared/api/httpClient.js";
import type { BloqueCatalogo, Curso, CursoDetalle, DatosCurso, ResumenDocente } from "../types";

type ConMensaje<T> = Promise<{ data: T; message: string }>;
const CURSOS = "/docente/cursos";

export const docenteApi = {
  resumen: (): Promise<ResumenDocente> => http.get("/docente/resumen"),
  listarCursos: (estado: "activo" | "archivado"): Promise<Curso[]> => http.get(CURSOS, { estado }),
  obtenerCurso: (id: number): Promise<CursoDetalle> => http.get(`${CURSOS}/${id}`),
  crearCurso: (datos: DatosCurso): ConMensaje<Curso> => http.conMensaje("POST", CURSOS, datos),
  editarCurso: (id: number, datos: DatosCurso): ConMensaje<Curso> =>
    http.conMensaje("PATCH", `${CURSOS}/${id}`, datos),
  archivarCurso: (id: number): ConMensaje<Curso> => http.conMensaje("DELETE", `${CURSOS}/${id}`),
  regenerarCodigo: (id: number): ConMensaje<Curso> =>
    http.conMensaje("POST", `${CURSOS}/${id}/codigo`),
  /** Reemplaza la ruta del curso: [{ bloque_id, orden }] con orden 1, 2, 3… */
  definirRuta: (id: number, bloques: { bloque_id: number; orden: number }[]): ConMensaje<unknown> =>
    http.conMensaje("PUT", `${CURSOS}/${id}/bloques`, { bloques }),
  comentar: (cursoId: number, estudianteId: string, mensaje: string): ConMensaje<unknown> =>
    http.conMensaje(
      "POST",
      `${CURSOS}/${cursoId}/estudiantes/${estudianteId}/retroalimentaciones`,
      { mensaje },
    ),
  /** Catálogo global de bloques publicados (para armar la ruta del curso). */
  bloquesCatalogo: (): Promise<BloqueCatalogo[]> => http.get("/bloques"),
};

export const docenteKeys = {
  todo: ["docente"] as const,
  resumen: () => [...docenteKeys.todo, "resumen"] as const,
  cursos: () => [...docenteKeys.todo, "cursos"] as const,
  lista: (estado: string) => [...docenteKeys.cursos(), "lista", estado] as const,
  curso: (id: number) => [...docenteKeys.cursos(), "detalle", id] as const,
  bloques: () => [...docenteKeys.todo, "bloques"] as const,
};
