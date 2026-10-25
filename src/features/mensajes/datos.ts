import { http } from "@/shared/api/httpClient.js";
import type {
  Destinatario,
  FiltrosBandeja,
  Hilo,
  MensajeEnviado,
  NuevoMensaje,
  PaginaBandeja,
} from "./tipos";

export const POR_PAGINA = 20;

interface ConMensaje<T> {
  data: T;
  message: string;
}

export const mensajesApi = {
  bandeja: (filtros: FiltrosBandeja): Promise<PaginaBandeja> =>
    http.getPaginado("/mensajes", { ...filtros, por_pagina: POR_PAGINA }),
  /** Abrir el hilo marca sus mensajes como leídos. */
  hilo: (id: string): Promise<Hilo> => http.get(`/mensajes/hilos/${id}`),
  noLeidos: (): Promise<{ total: number }> => http.get("/mensajes/no-leidos"),
  destinatarios: (q: string | undefined): Promise<Destinatario[]> =>
    http.get("/mensajes/destinatarios", { q }),
  enviar: (mensaje: NuevoMensaje): Promise<ConMensaje<MensajeEnviado>> =>
    http.conMensaje("POST", "/mensajes", mensaje),
  editarHilo: (datos: {
    id: string;
    archivado?: boolean;
    leido?: boolean;
  }): Promise<ConMensaje<unknown>> =>
    http.conMensaje("PATCH", `/mensajes/hilos/${datos.id}`, {
      archivado: datos.archivado,
      leido: datos.leido,
    }),
};

export const mensajesKeys = {
  todo: ["mensajes"] as const,
  bandeja: (filtros: FiltrosBandeja) => [...mensajesKeys.todo, "bandeja", filtros] as const,
  hilo: (id: string) => [...mensajesKeys.todo, "hilo", id] as const,
  noLeidos: () => [...mensajesKeys.todo, "no-leidos"] as const,
  destinatarios: (q: string | undefined) => [...mensajesKeys.todo, "destinatarios", q] as const,
};
