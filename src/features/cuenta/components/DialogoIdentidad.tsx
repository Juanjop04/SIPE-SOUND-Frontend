import { Dialog } from "@/shared/ui";
import type { Motivo } from "../utils/pasosIdentidad";
import { PasosIdentidad } from "./PasosIdentidad";

const TITULOS: Record<Motivo, string> = {
  contrasena: "Cambiar contraseña",
  correo: "Cambiar correo",
};

interface DialogoIdentidadProps {
  /** null = cerrado. */
  motivo: Motivo | null;
  onCerrar: () => void;
  alTerminar: (motivo: Motivo, mensaje: string) => void;
}

/** Confirmar identidad (contraseña actual → código al correo) y luego hacer el cambio. */
export function DialogoIdentidad({ motivo, onCerrar, alTerminar }: DialogoIdentidadProps) {
  return (
    <Dialog abierto={motivo !== null} onCerrar={onCerrar} titulo={TITULOS[motivo ?? "contrasena"]}>
      {motivo && <PasosIdentidad motivo={motivo} onCerrar={onCerrar} alTerminar={alTerminar} />}
    </Dialog>
  );
}
