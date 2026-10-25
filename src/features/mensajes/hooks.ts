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

/** Abrir un hilo lo marca como leído: el contador y la bandeja se vuelven a pedir. */
export function useHilo(id: string | undefined) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: mensajesKeys.hilo(id ?? ""),
    queryFn: async () => {
      const hilo = await mensajesApi.hilo(id ?? "");
      void queryClient.invalidateQueries({ queryKey: mensajesKeys.noLeidos() });
      void queryClient.invalidateQueries({ queryKey: [...mensajesKeys.todo, "bandeja"] });
      return hilo;
    },
    enabled: Boolean(id),
  });
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
