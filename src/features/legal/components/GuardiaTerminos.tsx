import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "@/features/auth";
import { paths } from "@/shared/config/paths.js";

// Se pueden leer y aceptar aun con la versión pendiente.
const LIBRES: string[] = [paths.aceptarTerminos, paths.terminos];

/**
 * Raíz del enrutador (HU-F-510): una cuenta con términos pendientes solo ve la pantalla de
 * aceptación (o los términos). El backend ya responde 403 al resto; esto evita ver errores.
 */
export function GuardiaTerminos() {
  const { perfil } = useSession();
  const { pathname, search } = useLocation();
  if (perfil?.terminos_pendientes && !LIBRES.includes(pathname)) {
    const volver = encodeURIComponent(pathname + search);
    return <Navigate to={`${paths.aceptarTerminos}?volver=${volver}`} replace />;
  }
  return <Outlet />;
}
