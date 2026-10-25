import { useQuery } from "@tanstack/react-query";
import { ApiError } from "@/shared/api/ApiError.js";
import { progresoApi } from "../api/progresoApi.js";
import { progresoKeys } from "../api/keys.js";

/** GET /progreso/actividad (HU-B-324). Cuenta registros de avance, no minutos tocados. */
export interface EventoActividad {
  tipo: "leccion" | "ejercicio" | "evaluacion";
  id: number;
  titulo: string;
  bloque_id: number | null;
  fecha: string;
  completado: boolean | null;
  mejor_bpm: number | null;
  puntaje: number | null;
  aprobado: boolean | null;
}

export interface Actividad {
  recientes: EventoActividad[];
  por_dia: { fecha: string; registros: number }[];
  dias_con_practica: number;
}

export const DIAS_ACTIVIDAD = 28;

const noDesplegado = (error: unknown) => error instanceof ApiError && error.statusCode === 404;

/** Con un backend sin HU-B-324 responde 404: no se reintenta y quien lo usa muestra su respaldo. */
export function useActividad(dias = DIAS_ACTIVIDAD) {
  const consulta = useQuery<Actividad>({
    queryKey: progresoKeys.actividad(dias),
    queryFn: () => progresoApi.actividad(dias),
    retry: (intentos, error) => !noDesplegado(error) && intentos < 2,
  });
  return { ...consulta, noDisponible: noDesplegado(consulta.error) };
}
