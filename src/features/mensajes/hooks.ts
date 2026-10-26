import { useCallback } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/features/auth";
import { mensajesApi, mensajesKeys } from "./datos";
import type { FiltrosBandeja } from "./tipos";

/** El contador se vuelve a pedir cada 60 s (HU-F-407). */
export const INTERVALO_NO_LEIDOS_MS = 60_000;

/**
 * Mensajes sin leer de la persona. Sin sesión no se pide. TanStack Query pausa el intervalo con
 * la pestaña oculta (`refetchIntervalInBackground: false`) y sin conexión (`networkMode: "online"`,
 * HU-F-312), y lo reanuda al volver.
 */
export function useNoLeidos(): number {
  const { usuario } = useSession();
  const consulta = useQuery({
    queryKey: mensajesKeys.noLeidos(),
    queryFn: mensajesApi.noLeidos,
    enabled: Boolean(usuario),
    refetchInterval: INTERVALO_NO_LEIDOS_MS,
    refetchIntervalInBackground: false,
    networkMode: "online",
  });
  return consulta.data?.total ?? 0;
}

export function useBandeja(filtros: FiltrosBandeja) {
  return useQuery({
    queryKey: mensajesKeys.bandeja(filtros),
    queryFn: () => mensajesApi.bandeja(filtros),
    placeholderData: keepPreviousData,
  });
}

/** El hilo abierto se vuelve a consultar cada 15 s con la pestaña visible (HU-F-501). */
export const INTERVALO_HILO_MS = 15_000;

/**
 * Abrir un hilo lo marca como leído en el backend. Se consulta cada 15 s mientras la pestaña esté
 * visible y haya conexión (TanStack Query pausa el intervalo en segundo plano y sin red). Quien lo
 * usa refresca el contador y la bandeja cuando llega algo (`useAvisarLectura`).
 */
export function useHilo(id: string | undefined) {
  return useQuery({
    queryKey: mensajesKeys.hilo(id ?? ""),
    queryFn: () => mensajesApi.hilo(id ?? ""),
    enabled: Boolean(id),
    refetchInterval: INTERVALO_HILO_MS,
    refetchIntervalInBackground: false,
    networkMode: "online",
  });
}

/** Leer un hilo cambia el contador de no leídos y la bandeja: se vuelven a pedir. */
export function useAvisarLectura() {
  const queryClient = useQueryClient();
  return useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: mensajesKeys.noLeidos() });
    void queryClient.invalidateQueries({ queryKey: [...mensajesKeys.todo, "bandeja"] });
  }, [queryClient]);
}

/** Personas, cursos y grupos a los que esta persona puede escribir (el backend decide). */
export function useDestinatarios(q: string | undefined, habilitado = true) {
  return useQuery({
    queryKey: mensajesKeys.destinatarios(q),
    queryFn: () => mensajesApi.destinatarios(q),
    enabled: habilitado,
    placeholderData: keepPreviousData,
  });
}

export function useEnviarMensaje() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mensajesApi.enviar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: mensajesKeys.todo }),
  });
}

export function useEditarHilo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mensajesApi.editarHilo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: mensajesKeys.todo }),
  });
}
