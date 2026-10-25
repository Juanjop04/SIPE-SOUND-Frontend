import { PanelModal, type PanelModalProps } from "./PanelModal";

export type DrawerProps = PanelModalProps & {
  /** "amplio" para detalles con más contenido (p. ej. el estudiante del curso). */
  ancho?: "normal" | "amplio";
};

/** Panel lateral derecho para editar sin cambiar de página (patrón "Atril", contrato 05 §5). */
export function Drawer({ ancho = "normal", ...props }: DrawerProps) {
  return (
    <PanelModal
      {...props}
      className={`m-0 ml-auto h-dvh max-h-dvh w-full max-w-full border-l border-linea ${ancho === "amplio" ? "sm:max-w-2xl" : "sm:max-w-md"}`}
    />
  );
}
