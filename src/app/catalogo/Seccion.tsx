import type { ReactNode } from "react";
import { TrasteDivider } from "@/shared/music";

// Cada componente del catálogo es un "traste": número en mono, título y sus estados.
export function Seccion({
  numero,
  titulo,
  children,
}: {
  numero: number;
  titulo: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`seccion-${numero}`} className="flex flex-col gap-4">
      <TrasteDivider numero={numero} />
      <h2 id={`seccion-${numero}`} className="font-display text-xl font-semibold text-paper">
        {titulo}
      </h2>
      {children}
    </section>
  );
}

/** Una fila por estado: la etiqueta en mono a la izquierda, el ejemplo a la derecha. */
export function Fila({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
      <p className="w-36 shrink-0 font-mono text-xs text-muted">{etiqueta}</p>
      <div className="flex flex-1 flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}
