import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/shared/lib/cn.js";

export interface Pestana {
  id: string;
  etiqueta: string;
  /** Cifra en mono junto a la etiqueta (p. ej. cuántos cursos). */
  contador?: number | string;
  contenido: ReactNode;
}

export interface TabsProps {
  /** Nombre accesible del grupo de pestañas. */
  etiqueta: string;
  pestanas: Pestana[];
  /** Controlado (p. ej. ?pestana= en la URL). Sin onCambiar, las pestañas se manejan solas. */
  activa?: string;
  onCambiar?: (id: string) => void;
  className?: string;
}

// Desplazamiento por tecla (patrón WAI-ARIA Tabs, activación automática).
const MOVIMIENTOS: Record<string, (indice: number, total: number) => number> = {
  ArrowRight: (i, total) => (i + 1) % total,
  ArrowLeft: (i, total) => (i - 1 + total) % total,
  Home: () => 0,
  End: (_i, total) => total - 1,
};

export function Tabs({ etiqueta, pestanas, activa, onCambiar, className }: TabsProps) {
  const base = useId();
  const [propia, setPropia] = useState(pestanas[0]?.id);
  const actual = onCambiar ? (activa ?? pestanas[0]?.id) : propia;
  const botones = useRef<Record<string, HTMLButtonElement | null>>({});

  function seleccionar(id: string) {
    if (onCambiar) onCambiar(id);
    else setPropia(id);
    botones.current[id]?.focus();
  }

  function handleKeyDown(evento: KeyboardEvent<HTMLButtonElement>) {
    const mover = MOVIMIENTOS[evento.key];
    if (!mover) return;
    evento.preventDefault();
    const indice = pestanas.findIndex((p) => p.id === actual);
    seleccionar(pestanas[mover(indice, pestanas.length)].id);
  }

  const visible = pestanas.find((p) => p.id === actual);

  return (
    <div className={className}>
      <div role="tablist" aria-label={etiqueta} className="flex gap-1 border-b border-linea">
        {pestanas.map((pestana) => {
          const seleccionada = pestana.id === actual;
          return (
            <button
              key={pestana.id}
              ref={(el) => {
                botones.current[pestana.id] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-tab-${pestana.id}`}
              aria-selected={seleccionada}
              aria-controls={`${base}-panel-${pestana.id}`}
              tabIndex={seleccionada ? 0 : -1}
              onClick={() => seleccionar(pestana.id)}
              onKeyDown={handleKeyDown}
              className={cn(
                "-mb-px border-b-2 px-3 py-2 text-sm transition-colors duration-rapida",
                seleccionada
                  ? "border-accent text-paper"
                  : "border-transparent text-muted hover:text-paper",
              )}
            >
              {pestana.etiqueta}
              {pestana.contador !== undefined && (
                <span className="ml-2 font-mono text-xs text-muted">{pestana.contador}</span>
              )}
            </button>
          );
        })}
      </div>
      {visible && (
        <div
          role="tabpanel"
          id={`${base}-panel-${visible.id}`}
          aria-labelledby={`${base}-tab-${visible.id}`}
          tabIndex={0}
          className="pt-4"
        >
          {visible.contenido}
        </div>
      )}
    </div>
  );
}
