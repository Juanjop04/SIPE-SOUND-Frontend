export type EstadoEvaluacion = "borrador" | "publicada" | "cerrada";

/** Fila de GET /docente/evaluaciones (HU-B-311): `preguntas` es el número de preguntas. */
export interface EvaluacionDocente {
  id: number;
  titulo: string;
  descripcion: string | null;
  curso_id: number | null;
  bloque_id: number | null;
  porcentaje_aprobacion: number;
  intentos_max: number | null;
  fecha_limite: string | null;
  estado: EstadoEvaluacion;
  creado_en: string;
  actualizado_en: string;
  preguntas: number;
}

/** Pregunta con su respuesta correcta (solo en el panel docente). */
export interface PreguntaDocente {
  id: number;
  orden: number;
  enunciado: string;
  opciones: string[];
  respuesta_correcta: number;
}

/** GET /docente/evaluaciones/{id}. */
export interface DetalleEvaluacionDocente extends Omit<EvaluacionDocente, "preguntas"> {
  preguntas: PreguntaDocente[];
  tiene_intentos: boolean;
}

export interface FiltrosEvaluaciones {
  curso_id?: number;
  estado?: EstadoEvaluacion;
}

/** Cuerpo de POST (crear) y PATCH (editar) de una evaluación. */
export interface DatosEvaluacion {
  titulo: string;
  descripcion: string | null;
  porcentaje_aprobacion: number;
  intentos_max: number | null;
  fecha_limite: string | null;
  curso_id?: number;
}

/** Cuerpo de PUT …/preguntas (reemplaza el conjunto completo). */
export interface PreguntaEnvio {
  enunciado: string;
  opciones: string[];
  respuesta_correcta: number;
}

/** GET /docente/evaluaciones/{id}/resultados. */
export interface ResultadosEvaluacion {
  evaluacion_id: number;
  minimo_requerido: number;
  intentos: number;
  estudiantes_que_presentaron: number;
  estudiantes_del_curso: number | null;
  promedio_mejor_puntaje: number | null;
  aprobaron_pct: number | null;
  /** De la más difícil a la más fácil (menor % de aciertos primero). */
  preguntas: { id: number; orden: number; enunciado: string; aciertos_pct: number | null }[];
  estudiantes: {
    estudiante_id: string;
    nombre: string;
    mejor_puntaje: number;
    intentos: number;
    aprobado: boolean;
    ultimo_intento: string;
  }[];
  sin_presentar: { estudiante_id: string; nombre: string }[];
}
