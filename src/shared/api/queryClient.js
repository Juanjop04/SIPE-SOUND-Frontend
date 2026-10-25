import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./ApiError.js";

// Catálogo (bloques, lecciones, ejercicios, acordes): cambia poco, se cachea 5 min.
export const TIEMPO_CATALOGO_MS = 5 * 60 * 1000;
const REINTENTOS_MAXIMOS = 2;
// Lo descargado se queda en memoria todo el día: sin conexión, volver a una página ya vista la
// muestra desde la caché (HU-F-312). Sin Service Worker, recargar la pestaña sí lo pierde.
const TIEMPO_SIN_CONEXION_MS = 24 * 60 * 60 * 1000;

/**
 * Consultas que deben seguir visibles sin conexión (HU-F-312). offlineFirst: sin red se intenta
 * una vez y los reintentos esperan a que vuelva, sin reemplazar los datos en caché por un error.
 */
export const OPCIONES_SIN_CONEXION = Object.freeze({
  gcTime: TIEMPO_SIN_CONEXION_MS,
  networkMode: /** @type {"offlineFirst"} */ ("offlineFirst"),
});

/** Catálogo (bloques, lecciones, ejercicios, acordes): 5 min fresco y disponible sin conexión. */
export const OPCIONES_CATALOGO = Object.freeze({
  ...OPCIONES_SIN_CONEXION,
  staleTime: TIEMPO_CATALOGO_MS,
});

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
