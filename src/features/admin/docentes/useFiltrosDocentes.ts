import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { LIMITES } from "@/shared/validacion";
import type { EstadoActividad, FiltrosDocentes, OrdenDocentes } from "./tipos";

const ESTADOS: EstadoActividad[] = ["activo", "inactivo", "sin_actividad"];
const ORDENES: OrdenDocentes[] = [
  "nombre",
  "ultima_actividad",
  "-acciones_30d",
  "-cursos",
  "-estudiantes",
];

/** Búsqueda, estado de actividad, orden y página de la tabla de docentes viven en la URL. */
export function useFiltrosDocentes() {
  const [parametros, setParametros] = useSearchParams();
  const filtros: FiltrosDocentes = {
    q: parametros.get("q")?.slice(0, LIMITES.busqueda.max) || undefined,
    estado: ESTADOS.find((e) => e === parametros.get("estado")),
    orden: ORDENES.find((o) => o === parametros.get("orden")) ?? "nombre",
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

  return { filtros, cambiar, hayFiltros: Boolean(filtros.q || filtros.estado) };
}
