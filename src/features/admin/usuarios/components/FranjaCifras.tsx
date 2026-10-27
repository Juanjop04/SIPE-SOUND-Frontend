import { cn } from "@/shared/lib/cn.js";
import type { EstadoCuenta, TotalesPorEstado } from "../tipos";

interface Cifra {
  estado: EstadoCuenta | null;
  etiqueta: string;
  /** Color de la cifra: texto en color, no píldoras (el estado también se escribe). */
  color: string;
}

const CIFRAS: Cifra[] = [
  { estado: null, etiqueta: "Todas", color: "text-paper" },
  { estado: "activa", etiqueta: "Activas", color: "text-success" },
  { estado: "pendiente_verificacion", etiqueta: "Pendientes", color: "text-aviso" },
  { estado: "suspendida", etiqueta: "Suspendidas", color: "text-peligro-texto" },
];

interface FranjaCifrasProps {
  totales: TotalesPorEstado | undefined;
  seleccionado: EstadoCuenta | undefined;
  onElegir: (estado: EstadoCuenta | null) => void;
}

function cifraDe(totales: TotalesPorEstado | undefined, estado: EstadoCuenta | null) {
  if (!totales) return "—";
  return estado
    ? totales[estado]
    : totales.activa + totales.pendiente_verificacion + totales.suspendida;
}

/**
 * Filtro por estado. En escritorio, cuatro cifras compactas (botones con aria-pressed); desde
 * 820 px hacia abajo, las mismas cuatro como pestañas subrayadas. Un segundo clic vuelve a "Todas".
 */
export function FranjaCifras({ totales, seleccionado, onElegir }: FranjaCifrasProps) {
  const elegir = (estado: EstadoCuenta | null) => onElegir(estado === seleccionado ? null : estado);
  const esActiva = (estado: EstadoCuenta | null) => (estado ?? undefined) === seleccionado;

  return (
    <>
      <div
        role="group"
        aria-label="Filtrar por estado"
        className="hidden grid-cols-[repeat(auto-fill,minmax(150px,190px))] gap-2 min-[821px]:grid"
      >
        {CIFRAS.map(({ estado, etiqueta, color }) => (
          <button
            key={etiqueta}
            type="button"
            aria-pressed={esActiva(estado)}
            onClick={() => elegir(estado)}
            className={cn(
              "flex min-h-11 items-center gap-2.5 rounded-md border bg-surface px-3.5 py-1.5 text-left transition-colors duration-rapida",
              esActiva(estado)
                ? "border-primary bg-primary/10"
                : "border-linea hover:border-linea-fuerte",
            )}
          >
            <span className={cn("font-mono text-xl font-medium tabular-nums", color)}>
              {cifraDe(totales, estado)}
            </span>
            <span className="text-sm font-medium text-muted">{etiqueta}</span>
          </button>
        ))}
      </div>
      <div
        role="group"
        aria-label="Filtrar por estado"
        className="flex gap-0.5 overflow-x-auto border-b border-linea min-[821px]:hidden"
      >
        {CIFRAS.map(({ estado, etiqueta }) => (
          <button
            key={etiqueta}
            type="button"
            aria-pressed={esActiva(estado)}
            onClick={() => elegir(estado)}
            className={cn(
              "-mb-px flex min-h-11 flex-none items-center gap-2 border-b-2 px-3.5 text-sm transition-colors duration-rapida",
              esActiva(estado)
                ? "border-primary font-semibold text-paper"
                : "border-transparent text-muted hover:text-paper",
            )}
          >
            {etiqueta}
            <span className="font-mono text-xs font-normal text-muted">
              {cifraDe(totales, estado)}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
