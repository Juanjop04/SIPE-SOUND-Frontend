export type NivelCurso = "principiante" | "intermedio" | "avanzado";

/** GET /docente/resumen (HU-B-310). */
export interface ResumenDocente {
  cursos_activos: number;
  estudiantes: number;
  evaluaciones_publicadas: number;
  intentos_ultimos_7_dias: number;
  sin_actividad_14_dias: {
    estudiante_id: string;
    nombre: string;
    curso_id: number;
    curso: string;
    ultimo_avance: string | null;
  }[];
  actividad_reciente: {
    estudiante: string;
    evaluacion: string;
    puntaje: number;
    creado_en: string;
  }[];
}

/** Fila de GET /docente/cursos. */
export interface Curso {
  id: number;
  nombre: string;
  descripcion: string | null;
  nivel: NivelCurso;
  codigo_invitacion: string;
  archivado_en: string | null;
  creado_en: string;
  estudiantes: number;
  bloques_en_ruta: number;
}

export interface BloqueDeCurso {
  bloque_id: number;
  orden: number;
  titulo: string;
  numero: number;
}

/** GET /docente/cursos/{id}: el curso, su ruta y cuántos estudiantes tiene. */
export interface CursoDetalle extends Omit<Curso, "estudiantes" | "bloques_en_ruta"> {
  ruta: BloqueDeCurso[];
  estudiantes: number;
}

/** GET /bloques (catálogo publicado). */
export interface BloqueCatalogo {
  id: number;
  numero: number;
  titulo: string;
  nivel: string;
}

export interface DatosCurso {
  nombre: string;
  descripcion: string | null;
  nivel: NivelCurso;
}
