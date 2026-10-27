import { PanelModal, type PanelModalProps } from "./PanelModal";

export type DrawerProps = PanelModalProps & {
  /** "amplio" para detalles con más contenido (p. ej. el estudiante del curso); "medio" (520 px) para editar. */
  ancho?: "normal" | "medio" | "amplio";
};

const ANCHOS = {
  normal: "sm:max-w-md",
  medio: "sm:max-w-[32.5rem]",
  amplio: "sm:max-w-2xl",
} as const;

/** Panel lateral derecho para editar sin cambiar de página (patrón "Atril", contrato 05 §5). */
export function Drawer({ ancho = "normal", ...props }: DrawerProps) {
  return (
    <PanelModal
      {...props}
      className={`m-0 ml-auto h-dvh max-h-dvh w-full max-w-full border-l border-linea bg-surface ${ANCHOS[ancho]}`}
    />
  );
}
