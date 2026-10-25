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
}
