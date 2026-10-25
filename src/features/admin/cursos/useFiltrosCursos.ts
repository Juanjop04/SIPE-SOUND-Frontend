import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { LIMITES } from "@/shared/validacion";
import type { FiltrosCursos } from "./tipos";

const ESTADOS = ["activo", "archivado"] as const;

/** Docente, estado, búsqueda y página de /admin/cursos viven en la URL (enlace compartible). */
export function useFiltrosCursos() {
  const [parametros, setParametros] = useSearchParams();
  const estado = ESTADOS.find((e) => e === parametros.get("estado"));
  const filtros: FiltrosCursos = {
    docente: parametros.get("docente") || undefined,
    estado,
    q: parametros.get("q")?.slice(0, LIMITES.busqueda.max) || undefined,
    pagina: Math.max(1, Number(parametros.get("pagina")) || 1),
  };

  /** Cambia solo las claves indicadas (null las quita). Un filtro nuevo vuelve a la página 1. */
  const cambiar = useCallback(
    (cambios: Record<string, string | null>) =>
      setParametros(
        (previos) => {
          const nuevos = new URLSearchParams(previos);
          Object.entries(cambios).forEach(([clave, valor]) =>
            valor ? nuevos.set(clave, valor) : nuevos.delete(clave),
          );
          if (!("pagina" in cambios)) nuevos.delete("pagina");
          return nuevos;
        },
        { replace: true },
      ),
    [setParametros],
  );

  const hayFiltros = Boolean(filtros.docente || filtros.estado || filtros.q);
  return { filtros, cambiar, hayFiltros };
}
