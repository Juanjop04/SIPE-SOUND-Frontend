import { useCallback } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { LIMITES } from "@/shared/validacion";
import type { FiltroBandeja, FiltrosBandeja } from "./tipos";

export const FILTROS: { valor: FiltroBandeja; etiqueta: string }[] = [
  { valor: "recibidos", etiqueta: "Recibidos" },
  { valor: "enviados", etiqueta: "Enviados" },
  { valor: "no_leidos", etiqueta: "No leídos" },
  { valor: "archivados", etiqueta: "Archivados" },
];

/** Las mismas páginas viven bajo /mensajes (estudiante) y /docente/mensajes (docente y admin). */
export function useRutasMensajes() {
  const { pathname } = useLocation();
  const enAtril = pathname.startsWith(paths.docente.mensajes);
  return {
    bandeja: enAtril ? paths.docente.mensajes : paths.mensajes,
    hilo: (id: string) => (enAtril ? paths.docente.mensaje(id) : paths.mensaje(id)),
  };
}

/** Filtro, búsqueda por asunto y página viven en la URL (enlace compartible). */
export function useFiltrosBandeja() {
  const [parametros, setParametros] = useSearchParams();
  const filtro = FILTROS.find((f) => f.valor === parametros.get("filtro"))?.valor ?? "recibidos";
  const filtros: FiltrosBandeja = {
    filtro,
    q: parametros.get("q")?.slice(0, LIMITES.busqueda.max) || undefined,
    pagina: Math.max(1, Number(parametros.get("pagina")) || 1),
  };

  /** Cambia solo las claves indicadas (null las quita). Un filtro nuevo vuelve a la página 1. */
  const cambiar = useCallback(
    (cambios: Record<string, string | null>) =>
      setParametros(
        (previos) => {
          const nuevos = new URLSearchParams(previos);
          Object.entries(cambios).forEach(([k, v]) => (v ? nuevos.set(k, v) : nuevos.delete(k)));
          if (!("pagina" in cambios)) nuevos.delete("pagina");
          return nuevos;
        },
        { replace: true },
      ),
    [setParametros],
  );

  return { filtros, cambiar, busqueda: parametros.toString() };
}

/** Añade a una ruta los filtros de la bandeja (?filtro=&q=…) para no perderlos al abrir un hilo. */
export function conBusqueda(ruta: string, busqueda: string): string {
  return busqueda ? ruta + "?" + busqueda : ruta;
}
