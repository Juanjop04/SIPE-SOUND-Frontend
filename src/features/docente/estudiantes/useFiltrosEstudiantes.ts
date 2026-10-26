import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { FiltrosEstudiantes } from "./tipos";
import { filtroRapidoDe, ordenDe } from "./utils";

const POR_PAGINA = 20;
/** Con un filtro rápido se pide todo el curso (el backend no filtra por estado) y se filtra aquí. */
const POR_PAGINA_FILTRADA = 100;

/** Búsqueda, orden, página y estudiante abierto viven en la URL (enlace compartible). */
export function useFiltrosEstudiantes() {
  const [parametros, setParametros] = useSearchParams();
  const rapido = filtroRapidoDe(parametros.get("estado"));
  const filtrado = rapido !== "todos";
  const filtros: FiltrosEstudiantes = {
    q: parametros.get("q") || undefined,
    orden: ordenDe(parametros.get("orden")),
    pagina: filtrado ? 1 : Math.max(1, Number(parametros.get("pagina")) || 1),
    por_pagina: filtrado ? POR_PAGINA_FILTRADA : POR_PAGINA,
  };

  /** Cambia solo las claves indicadas (null las quita) y conserva la pestaña activa. */
  const cambiar = useCallback(
    (cambios: Record<string, string | null>) =>
      setParametros(
        (previos) => {
          const nuevos = new URLSearchParams(previos);
          Object.entries(cambios).forEach(([k, v]) => (v ? nuevos.set(k, v) : nuevos.delete(k)));
          return nuevos;
        },
        { replace: true },
      ),
    [setParametros],
  );

  return { filtros, rapido, estudianteId: parametros.get("estudiante"), cambiar };
}
