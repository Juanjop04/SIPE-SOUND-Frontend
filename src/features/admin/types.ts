export type EstadoPreautorizacion = "pendiente" | "aplicada";

/** Fila de GET /admin/docentes/preautorizaciones (HU-B-321). */
export interface Preautorizacion {
  email: string;
  estado: EstadoPreautorizacion;
  creado_en: string;
  usado_en: string | null;
}
