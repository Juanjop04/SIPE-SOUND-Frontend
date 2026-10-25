import type { ReactNode } from "react";

/**
 * Con el menú contraído, el nombre de cada destino aparece al pasar el mouse o al enfocarlo
 * (no solo en `title`, que el teclado no muestra). El texto sigue en el DOM para lectores de pantalla.
 */
export function EtiquetaFlotante({ texto, children }: { texto: string; children: ReactNode }) {
  return (
    <span className="group relative block">
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 hidden -translate-y-1/2 whitespace-nowrap rounded-md border border-linea bg-surface-2 px-2 py-1 text-xs text-paper group-focus-within:block group-hover:block"
      >
        {texto}
      </span>
    </span>
  );
}
