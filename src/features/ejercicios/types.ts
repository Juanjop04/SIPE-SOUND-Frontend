import type { VideoGuiaDatos } from "@/shared/lib/youtube";

/** GET /ejercicios (HU-B-306). */
export interface Ejercicio {
  id: number;
  leccion_id: number | null;
  nombre: string;
  descripcion: string | null;
  nivel: string;
  bpm_recomendado: number | null;
  compas: string | null;
  duracion_min: number | null;
  acordes: string[] | null;
  pasos: string[] | null;
  /** Video guía de YouTube (HU-B-410); null o ausente si no tiene. */
  video?: VideoGuiaDatos | null;
  /** Mi avance (HU-B-501); solo viene con sesión. */
  mi_progreso?: MiProgresoEjercicio;
}

export type EstadoEjercicio = "sin_iniciar" | "en_curso" | "finalizado";

/** Lo que el backend calcula del avance del estudiante en un ejercicio (HU-B-501). */
export interface MiProgresoEjercicio {
  estado: EstadoEjercicio;
  mejor_bpm: number | null;
  ultimo_registro: string | null;
}
