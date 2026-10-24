import { cn } from "@/shared/lib/cn.js";
import type { EstadoVisible } from "../utils/siguientePaso";

// Siempre con texto: el color solo refuerza (WCAG 1.4.1).
const ESTILOS: Record<EstadoVisible, { texto: string; clase: string }> = {
  completado: { texto: "Completado", clase: "border-success text-success" },
  "en-curso": { texto: "En curso", clase: "border-primary-claro text-primary-claro" },
  disponible: { texto: "Disponible", clase: "border-linea-fuerte text-paper" },
  bloqueado: { texto: "Bloqueado", clase: "border-linea text-muted" },
};

export function PildoraEstado({ estado }: { estado: EstadoVisible }) {
  const { texto, clase } = ESTILOS[estado];
  return (
    <span className={cn("w-fit rounded-full border px-2.5 py-0.5 text-xs", clase)}>{texto}</span>
  );
}
