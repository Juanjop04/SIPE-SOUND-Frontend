import { PanelModal, type PanelModalProps } from "./PanelModal";

export type DrawerProps = PanelModalProps;

/** Panel lateral derecho para editar sin cambiar de página (patrón "Atril", contrato 05 §5). */
export function Drawer(props: DrawerProps) {
  return (
    <PanelModal
      {...props}
      className="m-0 ml-auto h-dvh max-h-dvh w-full max-w-full border-l border-linea sm:max-w-md"
    />
  );
}
