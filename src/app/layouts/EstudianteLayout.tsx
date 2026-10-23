import type { ReactNode } from "react";
import { Link, Outlet } from "react-router-dom";
import { useSession } from "@/features/auth";
import { paths } from "@/shared/config/paths.js";
import { Marca } from "./components/Marca";
import { MenuCuenta } from "./components/MenuCuenta";
import { BarraInferior, NavEstudiante } from "./components/NavEstudiante";

function Cuenta() {
  const { usuario, estaCargando } = useSession();
  if (estaCargando) return <span className="w-24" aria-hidden="true" />;
  if (usuario) return <MenuCuenta />;
  return (
    <Link to={paths.login} className="text-sm text-accent hover:underline">
      Iniciar sesión
    </Link>
  );
}

/**
 * Layout del estudiante y del visitante: barra superior de 56 px en ink-2 (capa propia, HU-F-320)
 * con borde inferior; en móvil la navegación baja a una barra fija (el contenido deja espacio con pb-16).
 */
export function EstudianteLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-screen bg-ink pb-16 sm:pb-0">
      <div className="border-b border-linea bg-ink-2">
        <header className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-6 px-4 sm:px-6">
          <Marca />
          <NavEstudiante />
          <Cuenta />
        </header>
      </div>
      {children ?? <Outlet />}
      <BarraInferior />
    </div>
  );
}
