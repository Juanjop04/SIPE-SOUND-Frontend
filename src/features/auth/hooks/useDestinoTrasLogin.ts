import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { perfilApi, perfilKeys, TIEMPO_PERFIL_MS } from "../api/perfilApi.js";
import { destinoSeguro } from "../utils/destinoSeguro.js";
import { inicioPorRol } from "../utils/roles.js";

/**
 * A dónde ir tras iniciar sesión: el ?volver= si es una ruta interna; si no, según el rol
 * (docente/admin → atril, estudiante → ruta). El rol sale de GET /me y queda en caché.
 */
export function useDestinoTrasLogin() {
  const queryClient = useQueryClient();
  const [parametros] = useSearchParams();
  const volver = parametros.get("volver");

  return useCallback(async () => {
    const perfil = await queryClient
      .fetchQuery({
        queryKey: perfilKeys.actual(),
        queryFn: perfilApi.obtener,
        staleTime: TIEMPO_PERFIL_MS,
      })
      .catch(() => null);
    return destinoSeguro(volver, inicioPorRol(perfil?.rol));
  }, [queryClient, volver]);
}
