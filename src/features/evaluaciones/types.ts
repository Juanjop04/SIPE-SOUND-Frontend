/** Pregunta tal como la ve el estudiante: sin respuesta correcta (HU-B-313). */
export interface Pregunta {
  id: number;
  enunciado: string;
  opciones: string[];
  orden: number;
}

/** GET /evaluaciones/{id}: la evaluación, sus preguntas y el resumen de intentos propios. */
export interface Evaluacion {
  id: number;
  titulo: string;
  descripcion: string | null;
  bloque_id: number | null;
  porcentaje_aprobacion: number;
  intentos_max: number | null;
  preguntas: Pregunta[];
  intentos_realizados: number;
  intentos_restantes: number | null;
  mejor_puntaje: number | null;
  aprobado: boolean;
}

export interface DetallePregunta {
  correcta: boolean;
  respuesta_correcta: number;
}

/** POST /evaluaciones/{id}/intentos (con `detalle`) y GET …/intentos (historial). */
export interface Intento {
  id: string;
  evaluacion_id: number;
  puntaje: number;
  correctas: number;
  total: number;
  aprobado: boolean;
  creado_en: string;
  /** Solo en la respuesta del POST: corrección por pregunta (clave = id de la pregunta). */
  detalle?: Record<string, DetallePregunta>;
  minimo_requerido?: number;
}

/** { [idPregunta]: índice de la opción elegida } — el formato que espera la API. */
export type Respuestas = Record<string, number>;
