import { cn } from "@/shared/lib/cn.js";
import { FILTROS_RAPIDOS, type FiltroRapido } from "../utils";

/** Todos · Al día · Sin actividad · Necesitan apoyo: el elegido va a la URL (`?estado=`). */
export function FiltrosRapidos({
  actual,
  onElegir,
}: {
  actual: FiltroRapido;
  onElegir: (filtro: FiltroRapido) => void;
}) {
  return (
    <div role="group" aria-label="Filtrar estudiantes" className="flex flex-wrap gap-2">
      {FILTROS_RAPIDOS.map((f) => (
        <button
          key={f.valor}
          type="button"
          aria-pressed={actual === f.valor}
          onClick={() => onElegir(f.valor)}
          className={cn(
            "rounded-caja border px-3 py-1 text-sm transition-colors duration-rapida",
            actual === f.valor
              ? "border-accent bg-surface text-paper"
              : "border-linea text-muted hover:text-paper",
          )}
        >
          {f.etiqueta}
        </button>
      ))}
    </div>
  );
}
