import { lazy, Suspense } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { ROL, useSession } from "@/features/auth";
import { cargarInicioPage } from "@/features/inicio";
import { cargarRutaPage } from "@/features/ruta";
import { paths } from "@/shared/config/paths.js";
import { Skeleton } from "@/shared/ui";

const InicioPage = lazy(cargarInicioPage);
const RutaPage = lazy(cargarRutaPage);

const Cargando = () => (
  <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
    <Skeleton lineas={4} className="h-24 w-full" />
  </main>
);

/**
 * "/" (HU-F-315): el estudiante con sesión ve su inicio; el visitante, el docente y el admin, la
 * ruta pública. Los enlaces viejos "/?bloque=N" pasan a "/ruta?bloque=N".
 */
export function PaginaRaiz() {
  const [parametros] = useSearchParams();
  const { sesion, rol, estaCargando, estaCargandoPerfil } = useSession();

  const bloque = parametros.get("bloque");
  if (bloque) return <Navigate to={`${paths.ruta}?bloque=${encodeURIComponent(bloque)}`} replace />;
  if (estaCargando || (sesion && estaCargandoPerfil)) return <Cargando />;

  return (
    <Suspense fallback={<Cargando />}>
      {sesion && rol === ROL.estudiante ? <InicioPage /> : <RutaPage />}
    </Suspense>
  );
}
