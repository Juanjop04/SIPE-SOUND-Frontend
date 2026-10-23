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
}
