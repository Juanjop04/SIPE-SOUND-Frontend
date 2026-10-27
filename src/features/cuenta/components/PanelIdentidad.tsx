import type { Motivo } from "../utils/pasosIdentidad";
import { PasosIdentidad } from "./PasosIdentidad";

interface PanelIdentidadProps {
  motivo: Motivo;
  onCerrar: () => void;
  alTerminar: (motivo: Motivo, mensaje: string) => void;
}

/**
 * Confirmar identidad (contraseña actual → código al correo) y luego hacer el cambio, en un panel
 * dentro de la sección. Se monta solo mientras está abierto: al cerrarlo el estado (y con él el
 * token de reautenticación) se destruye.
 */
export function PanelIdentidad(props: PanelIdentidadProps) {
  return (
    <div className="flex flex-col gap-4 rounded-caja border border-linea bg-surface p-4">
      <PasosIdentidad {...props} />
    </div>
  );
}
