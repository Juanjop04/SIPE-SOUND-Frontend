import { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";
import { cn } from "@/shared/lib/cn.js";
import { paths } from "@/shared/config/paths.js";
import { useAtajoDelMenu, useMenuContraido } from "@/shared/hooks/useMenuContraido";
import { AvisoSinConexion, Drawer } from "@/shared/ui";
import { BarraSuperiorAtril } from "./components/BarraSuperiorAtril";
import { BotonContraerMenu } from "./components/BotonContraerMenu";
import { Marca } from "./components/Marca";
import { PanelAtril } from "./components/PanelAtril";

/**
 * "Atril" del docente (contrato 05 §5): barra lateral de 240 px (64 px contraída, y se recuerda)
 * con las secciones, y arriba a la derecha el tema, los mensajes y la cuenta. Contenido sobre ink.
 * Por debajo de lg la barra lateral se abre en un Drawer.
 */
export function DocenteLayout() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const cerrarMenu = useCallback(() => setMenuAbierto(false), []);
  const contraido = useMenuContraido();
  useAtajoDelMenu();

  return (
    <div
      className={cn(
        "min-h-screen bg-ink motion-reduce:transition-none lg:grid lg:transition-[grid-template-columns] lg:duration-150",
        contraido ? "lg:grid-cols-[64px_1fr]" : "lg:grid-cols-[240px_1fr]",
      )}
    >
      <aside className="hidden border-r border-linea bg-barra lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:gap-6 lg:p-3">
        <div
          className={cn("flex items-center gap-2", contraido ? "flex-col" : "justify-between pl-1")}
        >
          <Marca destino={paths.docente.inicio} enBarra compacta={contraido} />
          <BotonContraerMenu contraido={contraido} />
        </div>
        <div className="flex-1">
          <PanelAtril enBarra contraido={contraido} />
        </div>
      </aside>

      <div className="min-w-0">
        <BarraSuperiorAtril onAbrirMenu={() => setMenuAbierto(true)} />
        <Drawer abierto={menuAbierto} onCerrar={cerrarMenu} titulo="Atril">
          <PanelAtril alNavegar={cerrarMenu} />
        </Drawer>
        <AvisoSinConexion />
        <Outlet />
      </div>
    </div>
  );
}
