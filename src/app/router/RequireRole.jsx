import { Link, Outlet } from "react-router-dom";
import { usePerfil } from "@/features/auth";
import { paths } from "@/shared/config/paths.js";

// Va dentro de RequireAuth. Aún sin uso: lo usarán las rutas del panel docente (HU-F-303).
export function RequireRole({ roles }) {
  const { data: perfil, isPending, error } = usePerfil();

  if (isPending) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-8">
        <p className="text-muted">Cargando...</p>
      </main>
    );
  }
  if (error || !roles.includes(perfil.rol)) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-8">
        <p className="text-sm text-muted">
          No tienes acceso a esta sección.{" "}
          <Link to={paths.inicio} className="text-primary hover:underline">
            Volver al inicio
          </Link>
        </p>
      </main>
    );
  }
  return <Outlet />;
}
