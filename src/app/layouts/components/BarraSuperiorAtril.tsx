import { Link } from "react-router-dom";
import { Mail, Menu } from "lucide-react";
import { ContadorNoLeidos } from "@/features/mensajes";
import { paths } from "@/shared/config/paths.js";
import { Button, SelectorTema } from "@/shared/ui";
import { Marca } from "./Marca";
import { MenuCuenta } from "./MenuCuenta";

/**
 * Barra superior del atril (docente y administrador, HU-F-507): a la derecha, tema, mensajes y la
 * cuenta. En móvil suma el botón "Menú" y la marca (el menú lateral es un Drawer).
 */
export function BarraSuperiorAtril({ onAbrirMenu }: { onAbrirMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-linea bg-ink-2 px-4 sm:px-6">
      <div className="flex items-center gap-3 lg:hidden">
        <Button variante="fantasma" tamano="sm" onClick={onAbrirMenu}>
          <Menu size={18} aria-hidden="true" />
          Menú
        </Button>
        <Marca destino={paths.docente.inicio} />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <SelectorTema compactoEnMovil />
        <Link
          to={paths.docente.mensajes}
          className="inline-flex h-10 items-center gap-1 text-muted transition-colors duration-rapida hover:text-paper"
        >
          <Mail size={20} aria-hidden="true" />
          <span className="sr-only">Mensajes</span>
          <ContadorNoLeidos />
        </Link>
        <MenuCuenta variante="atril" />
      </div>
    </header>
  );
}
