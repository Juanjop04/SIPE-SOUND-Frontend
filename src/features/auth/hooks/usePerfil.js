import { useSession } from "./useSession.js";

/** { perfil, rol, estaCargando, error } del usuario actual; los carga AuthProvider (GET /me). */
/** @returns {import("../types").ValorPerfil} */
export function usePerfil() {
  const { perfil, rol, estaCargandoPerfil, errorPerfil } = useSession();
  return { perfil, rol, estaCargando: estaCargandoPerfil, error: errorPerfil };
}
