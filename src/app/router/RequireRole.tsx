import { Outlet } from "react-router-dom";
import { usePerfil } from "@/features/auth";
import { MensajeError, Skeleton } from "@/shared/ui";
import { EstudianteLayout } from "@/app/layouts/EstudianteLayout";
import { SinPermisoPage } from "./PaginasDeError";

/** Va dentro de RequireAuth. El rol sale de GET /me (AuthProvider), nunca del token. */
export function RequireRole({ roles }: { roles: readonly string[] }) {
  const { rol, estaCargando, error } = usePerfil();

  if (estaCargando) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8" aria-busy="true">
        <Skeleton lineas={3} />
      </main>
    );
  }
  if (error) {
    return (
      <EstudianteLayout>
        <main className="mx-auto max-w-2xl px-4 py-8">
          <MensajeError mensaje={error.message} onReintentar={() => window.location.reload()} />
        </main>
      </EstudianteLayout>
    );
  }
  if (!rol || !roles.includes(rol)) {
    return (
      <EstudianteLayout>
        <SinPermisoPage />
      </EstudianteLayout>
    );
  }
  return <Outlet />;
}
