import { cn } from "@/shared/lib/cn.js";
import type { EstadoActividad } from "../tipos";

export const TEXTO_ESTADO: Record<EstadoActividad, string> = {
  activo: "Activo",
  inactivo: "Inactivo",
  sin_actividad: "Sin actividad",
};

// Forma distinta por estado (círculo lleno, anillo, cuadrado): nunca solo color (05 §6).
const FORMA: Record<EstadoActividad, string> = {
  activo: "rounded-full bg-success",
  inactivo: "rounded-full border-2 border-accent",
  sin_actividad: "rounded-none bg-muted",
};

/** Punto + texto del estado de actividad de un docente. */
export function EstadoDeActividad({ estado }: { estado: EstadoActividad }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className={cn("h-2.5 w-2.5 shrink-0", FORMA[estado])} />
      {TEXTO_ESTADO[estado]}
    </span>
  );
}
