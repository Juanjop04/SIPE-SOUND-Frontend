import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { alternarMenu } from "@/shared/lib/menu";

/** Contrae o expande el menú lateral (también con la tecla "["). Sobre la barra de color. */
export function BotonContraerMenu({ contraido }: { contraido: boolean }) {
  const Icono = contraido ? PanelLeftOpen : PanelLeftClose;
  const nombre = contraido ? "Expandir menú" : "Contraer menú";
  return (
    <button
      type="button"
      onClick={alternarMenu}
      aria-label={nombre}
      aria-expanded={!contraido}
      aria-keyshortcuts="["
      title={`${nombre} ([)`}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-barra-texto-2 transition-colors duration-rapida hover:bg-barra-hover hover:text-barra-texto"
    >
      <Icono size={18} aria-hidden="true" />
    </button>
  );
}
