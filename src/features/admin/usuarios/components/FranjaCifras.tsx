import { cn } from "@/shared/lib/cn.js";
import type { EstadoCuenta, TotalesPorEstado } from "../tipos";

const CIFRAS: { estado: EstadoCuenta; etiqueta: string }[] = [
  { estado: "pendiente_verificacion", etiqueta: "Pendientes" },
  { estado: "activa", etiqueta: "Activas" },
  { estado: "suspendida", etiqueta: "Suspendidas" },
];

interface FranjaCifrasProps {
  totales: TotalesPorEstado | undefined;
  seleccionado: EstadoCuenta | undefined;
  onElegir: (estado: EstadoCuenta | null) => void;
}

/** Cifras por estado en una línea (no tarjetas): cada una es un botón que filtra la tabla. */
export function FranjaCifras({ totales, seleccionado, onElegir }: FranjaCifrasProps) {
  return (
    <ul aria-label="Cuentas por estado" className="flex flex-wrap gap-x-8 gap-y-3">
      {CIFRAS.map(({ estado, etiqueta }) => {
        const activa = seleccionado === estado;
        return (
          <li key={estado}>
            <button
              type="button"
              aria-pressed={activa}
              onClick={() => onElegir(activa ? null : estado)}
              className={cn(
                "flex items-baseline gap-2 border-b-2 pb-1 transition-colors duration-rapida",
                activa
                  ? "border-accent text-paper"
                  : "border-transparent text-muted hover:text-paper",
              )}
            >
              <span className="font-mono text-2xl font-semibold tabular-nums">
                {totales ? totales[estado] : "—"}
              </span>
              <span className="text-sm">{etiqueta}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
