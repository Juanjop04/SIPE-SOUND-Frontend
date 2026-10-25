import type { ReactNode } from "react";
import { Link, Outlet } from "react-router-dom";
import { useSession } from "@/features/auth";
import { UnionPendiente } from "@/features/cursos";
import { AtajoMensajes } from "@/features/mensajes";
import { cn } from "@/shared/lib/cn.js";
import { paths } from "@/shared/config/paths.js";
import { useAtajoDelMenu, useMenuContraido } from "@/shared/hooks/useMenuContraido";
import { BotonContraerMenu } from "./components/BotonContraerMenu";
import { Marca } from "./components/Marca";
import { MenuCuenta } from "./components/MenuCuenta";
import { AvisoSinConexion, SelectorTema } from "@/shared/ui";
import { BarraInferior, BarraLateral, NavEstudiante } from "./components/NavEstudiante";

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
 * Layout del estudiante y del visitante (HU-F-318):
 * - escritorio (≥ 1024 px): barra lateral fija de 240 px y una barra superior solo con la cuenta;
 * - tableta: barra superior con la marca, los destinos como texto y la cuenta;
 * - móvil: barra superior con la marca y la cuenta; los destinos bajan a una barra inferior fija
 *   (el contenido deja su alto más la zona segura del dispositivo).
 */
export function EstudianteLayout({ children }: { children?: ReactNode }) {
  const contraido = useMenuContraido();
  useAtajoDelMenu();
  return (
    <div
      className={cn(
        "min-h-screen bg-ink pb-[calc(4rem+env(safe-area-inset-bottom))] motion-reduce:transition-none sm:pb-0 lg:grid lg:transition-[grid-template-columns] lg:duration-150",
        contraido ? "lg:grid-cols-[64px_1fr]" : "lg:grid-cols-[240px_1fr]",
      )}
    >
      <aside className="hidden border-r border-linea bg-barra lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:gap-8 lg:p-3">
        <div
          className={cn("flex items-center gap-2", contraido ? "flex-col" : "justify-between pl-1")}
        >
          <Marca enBarra compacta={contraido} />
          <BotonContraerMenu contraido={contraido} />
        </div>
        <BarraLateral contraido={contraido} />
      </aside>
      <div className="min-w-0">
        <div className="border-b border-linea bg-ink-2">
          <header className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:justify-end">
            <span className="lg:hidden">
              <Marca />
            </span>
            <NavEstudiante />
            <div className="flex items-center gap-3">
              <SelectorTema compactoEnMovil />
              <AtajoMensajes />
              <Cuenta />
            </div>
          </header>
        </div>
        <AvisoSinConexion />
        {children ?? <Outlet />}
      </div>
      <BarraInferior />
      <UnionPendiente />
    </div>
  );
}
