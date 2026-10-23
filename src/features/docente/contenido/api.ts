import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/shared/api/httpClient.js";
import { TIEMPO_CATALOGO_MS } from "@/shared/api/queryClient.js";
import { docenteApi, docenteKeys } from "../api/docenteApi";
import type {
  ContenidoDocente,
  EstadoContenido,
  FiltrosListado,
  PaginaListado,
  TipoContenido,
} from "./tipos";

type ConMensaje<T> = Promise<{ data: T; message: string }>;
const base = (tipo: TipoContenido) => `/docente/${tipo}`;

// Lecciones y ejercicios comparten el mismo CRUD en el backend (HU-B-309): un solo servicio.
export const contenidoApi = {
  listar: (
    tipo: TipoContenido,
    filtros: FiltrosListado,
  ): Promise<PaginaListado<ContenidoDocente>> =>
    http.getPaginado(base(tipo), { ...filtros, por_pagina: 20 }),
  obtener: (tipo: TipoContenido, id: number): Promise<ContenidoDocente> =>
    http.get(`${base(tipo)}/${id}`),
  crear: (tipo: TipoContenido, datos: object): ConMensaje<ContenidoDocente> =>
    http.conMensaje("POST", base(tipo), datos),
  editar: (tipo: TipoContenido, id: number, datos: object): ConMensaje<ContenidoDocente> =>
    http.conMensaje("PATCH", `${base(tipo)}/${id}`, datos),
  cambiarEstado: (tipo: TipoContenido, id: number, estado: EstadoContenido) =>
    http.conMensaje("PATCH", `${base(tipo)}/${id}/estado`, { estado }),
  eliminar: (tipo: TipoContenido, id: number) => http.conMensaje("DELETE", `${base(tipo)}/${id}`),
};

const contenidoKeys = {
  todo: [...docenteKeys.todo, "contenido"] as const,
  lista: (tipo: TipoContenido, filtros: FiltrosListado) =>
    [...contenidoKeys.todo, tipo, "lista", filtros] as const,
  detalle: (tipo: TipoContenido, id: number) =>
    [...contenidoKeys.todo, tipo, "detalle", id] as const,
};

export function useListadoContenido(tipo: TipoContenido, filtros: FiltrosListado) {
  return useQuery({
    queryKey: contenidoKeys.lista(tipo, filtros),
    queryFn: () => contenidoApi.listar(tipo, filtros),
  });
}

export function useContenido(tipo: TipoContenido, id: number | null) {
  return useQuery({
    queryKey: contenidoKeys.detalle(tipo, id ?? 0),
    queryFn: () => contenidoApi.obtener(tipo, id ?? 0),
    enabled: id !== null,
  });
}

/** Cualquier cambio refresca el contenido del atril y el catálogo que ve el estudiante. */
export function useMutacionContenido<V, R>(accion: (variables: V) => Promise<R>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contenidoKeys.todo });
      queryClient.invalidateQueries({ queryKey: ["lecciones"] });
      queryClient.invalidateQueries({ queryKey: ["ejercicios"] });
      queryClient.invalidateQueries({ queryKey: ["ruta"] });
    },
  });
}

export function useBloques() {
  return useQuery({
    queryKey: docenteKeys.bloques(),
    queryFn: docenteApi.bloquesCatalogo,
    staleTime: TIEMPO_CATALOGO_MS,
  });
}
