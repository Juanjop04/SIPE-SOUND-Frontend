import { lazy, Suspense } from "react";
import { puedeUsarAtril, useSession } from "@/features/auth";
import { Skeleton } from "@/shared/ui";
import { EstudianteLayout } from "./EstudianteLayout";

// El atril solo se descarga si la persona lo usa (los estudiantes nunca lo cargan).
const DocenteLayout = lazy(() =>
  import("./DocenteLayout").then((modulo) => ({ default: modulo.DocenteLayout })),
);

function Esperando() {
  return (
    <main className="mx-auto max-w-prose px-4 py-8" aria-busy="true">
      <Skeleton lineas={3} />
    </main>
  );
}

/** Layout de las páginas de cuenta (HU-F-403): el del rol (atril para docente y admin). */
export function LayoutDeCuenta() {
  const { rol, estaCargandoPerfil } = useSession();
  if (estaCargandoPerfil) return <Esperando />;
  if (!puedeUsarAtril(rol)) return <EstudianteLayout />;
  return (
    <Suspense fallback={<Esperando />}>
      <DocenteLayout />
    </Suspense>
  );
}
