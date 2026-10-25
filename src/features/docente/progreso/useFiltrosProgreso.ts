import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { LIMITES } from "@/shared/validacion";
import { ordenDe } from "./externos";
import type { FiltrosProgreso } from "./tipos";

/** Curso, búsqueda, orden, página y estudiante abierto viven en la URL (enlace compartible). */
export function useFiltrosProgreso() {
  const [parametros, setParametros] = useSearchParams();
  const curso = Number(parametros.get("curso"));
  const filtros: FiltrosProgreso = {
    curso: Number.isInteger(curso) && curso > 0 ? curso : null,
    q: parametros.get("q")?.slice(0, LIMITES.busqueda.max) || undefined,
    orden: ordenDe(parametros.get("orden")),
    pagina: Math.max(1, Number(parametros.get("pagina")) || 1),
  };

  /** Cambia solo las claves indicadas (null las quita). Un filtro nuevo vuelve a la página 1. */
  const cambiar = useCallback(
    (cambios: Record<string, string | null>) =>
      setParametros(
        (previos) => {
          const nuevos = new URLSearchParams(previos);
          Object.entries(cambios).forEach(([k, v]) => (v ? nuevos.set(k, v) : nuevos.delete(k)));
          if (!("pagina" in cambios) && !("estudiante" in cambios)) nuevos.delete("pagina");
          // Otro curso tiene otra ruta: la búsqueda y el orden anteriores ya no aplican.
          if ("curso" in cambios) ["q", "orden"].forEach((k) => nuevos.delete(k));
          return nuevos;
        },
        { replace: true },
      ),
    [setParametros],
  );

  return { filtros, estudianteId: parametros.get("estudiante"), cambiar };
}
