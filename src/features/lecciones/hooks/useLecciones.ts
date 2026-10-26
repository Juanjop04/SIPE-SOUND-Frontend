import { useQuery } from "@tanstack/react-query";
import { OPCIONES_CATALOGO } from "@/shared/api/queryClient.js";
import { leccionesApi } from "../api/leccionesApi.js";
import { leccionesKeys } from "../api/keys.js";
import type { Leccion } from "../types";

export function useLecciones() {
  return useQuery<Leccion[]>({
    queryKey: leccionesKeys.lista(),
    queryFn: leccionesApi.listar,
    ...OPCIONES_CATALOGO,
  });
}

export function useLeccion(id: number) {
  return useQuery<Leccion>({
    queryKey: leccionesKeys.detalle(id),
    queryFn: () => leccionesApi.obtener(id),
    ...OPCIONES_CATALOGO,
  });
}
