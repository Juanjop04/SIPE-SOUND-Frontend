import type { EstadoBloque } from "@/shared/music";

/** Lección dentro de un bloque de GET /ruta (HU-B-308). */
export interface LeccionRuta {
  id: number;
  numero: number;
  titulo: string;
  duracion_min: number | null;
  /** Del estudiante actual; false sin sesión. */
  completado: boolean;
}

/** Bloque de GET /ruta. El estado lo decide el backend (nunca se recalcula aquí). */
export interface BloqueRuta {
  id: number;
  numero: number;
  titulo: string;
  descripcion: string | null;
  nivel: string;
  orden: number;
  estado: EstadoBloque;
  evaluacion_id: number | null;
  mejor_puntaje: number | null;
  /** Acordes distintos de sus lecciones, máx. 6 (HU-B-324). Ausente si el backend es anterior. */
  acordes?: string[];
  lecciones: LeccionRuta[];
}
