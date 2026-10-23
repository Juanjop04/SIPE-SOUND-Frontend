import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "@/features/auth";
import { loginConRegreso } from "@/shared/config/paths.js";

// Sin sesión: a /login?volver=<ruta actual>; al iniciar sesión se regresa aquí.
export function RequireAuth() {
  const { usuario, estaCargando } = useSession();
  const { pathname, search } = useLocation();

  if (estaCargando) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-8">
        <p className="text-muted">Cargando...</p>
      </main>
    );
  }
  if (!usuario) return <Navigate to={loginConRegreso(pathname + search)} replace />;
  return <Outlet />;
}
