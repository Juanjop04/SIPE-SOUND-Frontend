import { cn } from "@/shared/lib/cn.js";
import { ESTADOS, type FiltroEstado } from "../utils/tarjetas";

const PESTANAS: { valor: FiltroEstado; etiqueta: string }[] = [
  { valor: "todos", etiqueta: "Todos" },
  ...ESTADOS.map((e) => ({ valor: e.valor, etiqueta: e.plural })),
];

interface PestanasDeAvanceProps {
  actual: FiltroEstado;
  conteo: Record<FiltroEstado, number>;
  onElegir: (estado: FiltroEstado) => void;
}

/** "Todos 18 · Sin iniciar 9 · En curso 4 · Finalizados 5": el conteo sigue a los demás filtros. */
export function PestanasDeAvance({ actual, conteo, onElegir }: PestanasDeAvanceProps) {
  return (
    <div role="tablist" aria-label="Estado de avance" className="flex flex-wrap gap-x-5 gap-y-1">
      {PESTANAS.map(({ valor, etiqueta }) => (
        <button
          key={valor}
          type="button"
          role="tab"
          aria-selected={actual === valor}
          onClick={() => onElegir(valor)}
          className={cn(
            "flex items-baseline gap-2 border-b-2 py-1 text-sm transition-colors duration-rapida",
            actual === valor
              ? "border-accent text-paper"
              : "border-transparent text-muted hover:text-paper",
          )}
        >
          {etiqueta}
          <span className="font-mono tabular-nums">{conteo[valor]}</span>
        </button>
      ))}
    </div>
  );
}
