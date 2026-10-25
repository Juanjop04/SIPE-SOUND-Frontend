import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { obtenerSesion, suscribirSesion } from "@/shared/api/sesion.js";
import { cerrarSesion as cerrarSesionApi } from "../api/authApi";
import { perfilApi, perfilKeys, TIEMPO_PERFIL_MS } from "../api/perfilApi.js";
import { sincronizarCache } from "../utils/sincronizarCache.js";

export const AuthContext = createContext(null);

// Única fuente de la sesión para toda la app (HU-F-204). Se entera de los inicios,
// renovaciones y cierres, también los de otras pestañas, a través de shared/api/sesion.
export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [sesion, setSesion] = useState(null);
  const [estaCargando, setEstaCargando] = useState(true);
  // undefined = todavía no se sabe si había sesión (primera carga).
  const usuarioAnterior = useRef(undefined);

  useEffect(() => {
    let activo = true;
    function aplicar(nueva) {
      if (!activo) return;
      const usuarioId = nueva?.usuario?.id ?? null;
      sincronizarCache(queryClient, usuarioAnterior.current, usuarioId);
      usuarioAnterior.current = usuarioId;
      setSesion(nueva);
      setEstaCargando(false);
    }
    const darDeBaja = suscribirSesion(aplicar);
    obtenerSesion().then(aplicar);
    return () => {
      activo = false;
      darDeBaja();
    };
  }, [queryClient]);

  // Perfil y rol desde GET /me (HU-B-304); sin sesión no se pide.
  const consultaPerfil = useQuery({
    queryKey: perfilKeys.actual(),
    queryFn: perfilApi.obtener,
    enabled: Boolean(sesion),
    staleTime: TIEMPO_PERFIL_MS,
  });
  const perfil = sesion ? (consultaPerfil.data ?? null) : null;
  const estaCargandoPerfil = Boolean(sesion) && consultaPerfil.isPending;
  const errorPerfil = sesion ? consultaPerfil.error : null;

  const cerrarSesion = useCallback(async () => {
    // La sesión local se olvida antes de llamar al backend: aunque la petición falle
    // (sin conexión), en este navegador ya no hay sesión.
    await cerrarSesionApi().catch(() => null);
  }, []);

  const value = useMemo(
    () => ({
      sesion,
      usuario: sesion?.usuario ?? null,
      estaCargando,
      perfil,
      rol: perfil?.rol ?? null,
      estaCargandoPerfil,
      errorPerfil,
      cerrarSesion,
    }),
    [sesion, estaCargando, perfil, estaCargandoPerfil, errorPerfil, cerrarSesion],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
