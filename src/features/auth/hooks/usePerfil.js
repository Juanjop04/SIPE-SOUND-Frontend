import { useQuery } from "@tanstack/react-query";
import { perfilApi, perfilKeys } from "../api/perfilApi.js";
import { useSession } from "./useSession.js";

/** Perfil del usuario actual ({ id, nombre, rol, email… }); sin sesión no se pide. */
export function usePerfil() {
  const { usuario } = useSession();
  return useQuery({
    queryKey: perfilKeys.actual(),
    queryFn: perfilApi.obtener,
    enabled: Boolean(usuario),
  });
}
