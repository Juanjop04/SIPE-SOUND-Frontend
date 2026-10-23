import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./ApiError.js";

// Catálogo (bloques, lecciones, ejercicios, acordes): cambia poco, se cachea 5 min.
export const TIEMPO_CATALOGO_MS = 5 * 60 * 1000;
const REINTENTOS_MAXIMOS = 2;

// Un 4xx no se arregla reintentando (404, 403, validación…); sí la red o un 5xx.
function debeReintentar(intentos, error) {
  if (error instanceof ApiError && error.esErrorDelCliente) return false;
  return intentos < REINTENTOS_MAXIMOS;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: debeReintentar,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
