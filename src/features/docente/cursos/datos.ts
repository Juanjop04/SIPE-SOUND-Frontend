// Punto de acceso de cursos/ al servicio y los tipos del atril (evita imports ../../).
export { docenteApi, docenteKeys } from "../api/docenteApi";
export type {
  BloqueCatalogo,
  BloqueDeCurso,
  Curso,
  CursoDetalle,
  DatosCurso,
  NivelCurso,
} from "../types";
export type { CursoProgreso, NecesitaApoyo } from "../progreso/tipos";
export { nombreCompleto, textoMotivos } from "../progreso/utils";
