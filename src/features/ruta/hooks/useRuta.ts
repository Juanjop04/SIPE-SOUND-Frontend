import { useQuery, type QueryClient } from "@tanstack/react-query";
import { OPCIONES_SIN_CONEXION } from "@/shared/api/queryClient.js";
import { rutaApi } from "../api/rutaApi.js";
import { rutaKeys } from "../api/keys.js";
import type { BloqueRuta } from "../types";

// Corto a propósito: evita pedirla dos veces (precarga + montaje). Cada avance la invalida.
const TIEMPO_RUTA_MS = 30 * 1000;

/**
 * GET /ruta: bloques con su estado (bloqueado · disponible · aprobado) calculado por el
 * backend. No es catálogo: depende del progreso del estudiante, sin staleTime largo; pero sí
 * se ve sin conexión con lo último descargado (HU-F-312).
 */
export function useRuta(filtros?: { curso_id?: number }) {
  return useQuery<BloqueRuta[]>({
    queryKey: rutaKeys.detalle(filtros),
    queryFn: () => rutaApi.obtener(filtros),
    staleTime: TIEMPO_RUTA_MS,
    ...OPCIONES_SIN_CONEXION,
  });
}

/**
 * Pide la ruta general apenas hay sesión, sin esperar a /me ni al chunk de la página: la usan
 * el inicio y la ruta pública (HU-F-312, LCP en 4G lenta).
 */
export function precargarRuta(queryClient: QueryClient) {
  return queryClient.prefetchQuery({
    queryKey: rutaKeys.detalle(undefined),
    queryFn: () => rutaApi.obtener(undefined),
    staleTime: TIEMPO_RUTA_MS,
    ...OPCIONES_SIN_CONEXION,
  });
}
