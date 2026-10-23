import { useQuery } from "@tanstack/react-query";
import { progresoApi } from "../api/progresoApi.js";
import { progresoKeys } from "../api/keys.js";

/** GET /progreso/resumen (HU-B-305). */
export interface ResumenProgreso {
  lecciones: { completadas: number; total: number };
  ejercicios: { completados: number; total: number };
  bloques_aprobados: number;
  ultimo_avance: string | null;
}

export function useResumenProgreso() {
  return useQuery<ResumenProgreso>({
    queryKey: progresoKeys.resumen(),
    queryFn: progresoApi.resumen,
  });
}
