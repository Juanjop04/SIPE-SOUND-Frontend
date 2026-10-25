import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { LIMITES } from "@/shared/validacion";
import { estadoDe, ordenDe, type FiltrosEjercicios } from "../utils/tarjetas";

/** Estado de avance, nivel, lección, acorde, búsqueda y orden viven en la URL (contrato 02 §5). */
export function useFiltrosEjercicios() {
  const [parametros, setParametros] = useSearchParams();
  const filtros: FiltrosEjercicios = {
    estado: estadoDe(parametros.get("estado")),
    nivel: parametros.get("nivel") ?? "",
    leccion: parametros.get("leccion") ?? "",
    acorde: parametros.get("acorde") ?? "",
    q: (parametros.get("q") ?? "").slice(0, LIMITES.busqueda.max),
    orden: ordenDe(parametros.get("orden")),
  };

  /** Cambia solo las claves indicadas (null o "" las quita). */
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

  const quitar = useCallback(
    () => cambiar({ estado: null, nivel: null, leccion: null, acorde: null, q: null }),
    [cambiar],
  );

  return { filtros, cambiar, quitar };
}
