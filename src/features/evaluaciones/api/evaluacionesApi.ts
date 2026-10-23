import { http } from "@/shared/api/httpClient.js";
import type { Evaluacion, Intento, Respuestas } from "../types";

export const evaluacionesApi = {
  obtener: (id: number): Promise<Evaluacion> => http.get(`/evaluaciones/${id}`),
  presentarIntento: (id: number, respuestas: Respuestas): Promise<Intento> =>
    http.post(`/evaluaciones/${id}/intentos`, { respuestas }),
  /** Del más reciente al más antiguo. */
  historial: (id: number): Promise<Intento[]> => http.get(`/evaluaciones/${id}/intentos`),
};

export const evaluacionesKeys = {
  todas: ["evaluaciones"] as const,
  detalle: (id: number) => [...evaluacionesKeys.todas, "detalle", id] as const,
  intentos: (id: number) => [...evaluacionesKeys.todas, "intentos", id] as const,
};
