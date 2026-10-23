import { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { paths } from "@/shared/config/paths.js";
import { Button, Drawer } from "@/shared/ui";
import { Marca } from "./components/Marca";
import { PanelAtril } from "./components/PanelAtril";

/**
 * "Atril" del docente (contrato 05 §5): barra lateral ink-2 de 240 px con las secciones;
 * contenido sobre ink. Por debajo de lg la barra lateral se abre en un Drawer.
 */
export function DocenteLayout() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const cerrarMenu = useCallback(() => setMenuAbierto(false), []);

  return (
    <div className="min-h-screen bg-ink lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-linea bg-ink-2 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:gap-8 lg:p-4">
        <Marca destino={paths.docente.inicio} />
        <div className="flex-1">
          <PanelAtril />
        </div>
      </aside>

      <header className="flex h-14 items-center justify-between border-b border-linea px-4 lg:hidden">
        <Marca destino={paths.docente.inicio} />
        <Button variante="fantasma" tamano="sm" onClick={() => setMenuAbierto(true)}>
          <Menu size={18} aria-hidden="true" />
          Menú
        </Button>
      </header>
      <Drawer abierto={menuAbierto} onCerrar={cerrarMenu} titulo="Atril">
        <PanelAtril alNavegar={cerrarMenu} />
      </Drawer>

      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
