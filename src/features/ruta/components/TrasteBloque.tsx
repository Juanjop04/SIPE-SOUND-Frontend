import { forwardRef } from "react";
import { cn } from "@/shared/lib/cn.js";
import { MarcaEstado } from "@/shared/music";
import type { BloqueRuta } from "../types";

/** Cómo suena el tramo de cuerda de este traste respecto al último bloque aprobado. */
export type TramoCuerda = "sonando" | "hastaAqui" | "quieta";

interface TrasteBloqueProps {
  id: string;
  bloque: BloqueRuta;
  seleccionado: boolean;
  /** Marcador de mástil: el bloque cierra un nivel. */
  cierraNivel: boolean;
  horizontal: boolean;
  tramo: TramoCuerda;
  onSeleccionar: () => void;
}

const COLOR = (sonando: boolean) => (sonando ? "bg-suena" : "bg-linea");

// Cada traste dibuja su tramo de cuerda (antes y después de su marca): la cuerda queda ámbar
// exactamente hasta el último bloque aprobado, sin importar la altura de cada traste.
function TramosCuerda({ horizontal, tramo }: { horizontal: boolean; tramo: TramoCuerda }) {
  const antes = tramo !== "quieta";
  const despues = tramo === "sonando";
  const base = "pointer-events-none absolute";
  return horizontal ? (
    <>
      <span aria-hidden="true" className={cn(base, "left-0 top-5 h-0.5 w-[18px]", COLOR(antes))} />
      <span
        aria-hidden="true"
        className={cn(base, "left-[18px] right-0 top-5 h-0.5", COLOR(despues))}
      />
    </>
  ) : (
    <>
      <span
        aria-hidden="true"
        className={cn(base, "left-[17px] top-0 h-1/2 w-0.5", COLOR(antes))}
      />
      <span
        aria-hidden="true"
        className={cn(base, "bottom-0 left-[17px] top-1/2 w-0.5", COLOR(despues))}
      />
    </>
  );
}

// La marca de estado va sobre la cuerda; número en mono y título. Seleccionado: texto paper
// + marca accent de 2 px (a la izquierda en vertical, abajo en horizontal).
export const TrasteBloque = forwardRef<HTMLLIElement, TrasteBloqueProps>(function TrasteBloque(
  { id, bloque, seleccionado, cierraNivel, horizontal, tramo, onSeleccionar },
  ref,
) {
  return (
    // Patrón listbox con aria-activedescendant: el teclado lo maneja la lista (Mastil), las
    // opciones no reciben foco; el clic es la vía de ratón/táctil.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <li
      ref={ref}
      id={id}
      role="option"
      aria-selected={seleccionado}
      onClick={onSeleccionar}
      className={cn(
        "relative flex cursor-pointer select-none",
        horizontal
          ? "w-32 shrink-0 flex-col items-start gap-2 border-r border-linea pr-3"
          : "items-center gap-3 border-b border-linea py-3",
      )}
    >
      <TramosCuerda horizontal={horizontal} tramo={tramo} />
      {/* Nombre desde el contenido: "Bloque 01 <título>, <estado>" incluye el texto visible para el
          control por voz (WCAG 2.5.3, HU-F-312); el estado se lee al final, no en la marca. */}
      <span
        aria-hidden="true"
        className="relative flex h-10 w-9 shrink-0 items-center justify-center"
      >
        <MarcaEstado estado={bloque.estado} className="bg-ink" />
      </span>
      <span
        className={cn(
          "flex min-w-0 flex-col gap-0.5 border-transparent transition-colors duration-rapida",
          horizontal ? "border-b-2 pb-1" : "border-l-2 pl-3",
          seleccionado ? "border-accent text-paper" : "text-muted hover:text-paper",
        )}
      >
        <span className="flex items-center gap-2 font-mono text-xs">
          <span className="sr-only">Bloque </span>
          {String(bloque.numero).padStart(2, "0")}
          {cierraNivel && (
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent/70" />
          )}
        </span>
        <span className={cn("text-sm", horizontal && "line-clamp-2")}>{bloque.titulo}</span>
        <span className="sr-only">, {bloque.estado}</span>
      </span>
    </li>
  );
});
