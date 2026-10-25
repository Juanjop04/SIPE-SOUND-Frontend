// Funciones puras de las tarjetas de curso del docente (HU-F-505). Las cifras las calcula el backend
// (GET /docente/progreso): aquí solo se une cada curso con lo suyo y se escoge a quién mostrar.
import { textoMotivos, type Curso, type CursoProgreso, type NecesitaApoyo } from "../datos";

/** Estudiantes que se muestran en la tarjeta: los que más necesitan atención. */
export const APOYO_EN_TARJETA = 3;

export interface CursoConProgreso {
  curso: Curso;
  /** null si el curso no viene en el resumen (p. ej. archivado). */
  progreso: CursoProgreso | null;
  apoyo: NecesitaApoyo[];
}

export function unirCursos(
  cursos: Curso[],
  progreso: CursoProgreso[],
  apoyo: NecesitaApoyo[],
): CursoConProgreso[] {
  return cursos.map((curso) => ({
    curso,
    progreso: progreso.find((p) => p.id === curso.id) ?? null,
    apoyo: apoyo.filter((a) => a.curso_id === curso.id),
  }));
}

/** El motivo en texto para la tarjeta: el primero (el backend ordena por urgencia). */
export const motivoPrincipal = (fila: NecesitaApoyo, ahora?: number): string =>
  textoMotivos(fila, ahora)[0] ?? "Necesita apoyo";

/** Enlace a la pestaña de un curso, opcionalmente con un estudiante abierto. */
export function enlaceDeCurso(base: string, pestana: string, estudiante?: string): string {
  const parametros = new URLSearchParams({ pestana });
  if (estudiante) parametros.set("estudiante", estudiante);
  return `${base}?${parametros.toString()}`;
}
