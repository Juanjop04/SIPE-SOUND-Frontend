import { useEffect, useId, useRef, type KeyboardEvent } from "react";
import { cn } from "@/shared/lib/cn.js";
import type { BloqueRuta } from "../types";
import { cierraNivel, indiceUltimoAprobado } from "../utils/presentacion";
import { TrasteBloque, type TramoCuerda } from "./TrasteBloque";

interface MastilProps {
  bloques: BloqueRuta[];
  seleccionadoId: number;
  onSeleccionar: (id: number) => void;
  /** Móvil: tira horizontal desplazable; escritorio: mástil vertical. */
  horizontal: boolean;
}

// Patrón listbox: el foco queda en la lista y aria-activedescendant señala el bloque.
const SIGUIENTE = ["ArrowDown", "ArrowRight"];
const ANTERIOR = ["ArrowUp", "ArrowLeft"];

function nuevoIndice(tecla: string, actual: number, total: number): number | null {
  if (SIGUIENTE.includes(tecla)) return Math.min(actual + 1, total - 1);
  if (ANTERIOR.includes(tecla)) return Math.max(actual - 1, 0);
  if (tecla === "Home") return 0;
  if (tecla === "End") return total - 1;
  return null;
}

function tramoDe(indice: number, ultimoAprobado: number): TramoCuerda {
  if (indice < ultimoAprobado) return "sonando";
  return indice === ultimoAprobado ? "hastaAqui" : "quieta";
}

/** La ruta como mástil: la cuerda se pinta de ámbar hasta el último bloque aprobado. */
export function Mastil({ bloques, seleccionadoId, onSeleccionar, horizontal }: MastilProps) {
  const base = useId();
  const trastes = useRef<Record<number, HTMLLIElement | null>>({});
  const actual = bloques.findIndex((b) => b.id === seleccionadoId);
  const ultimo = indiceUltimoAprobado(bloques);

  // Tira móvil: desplaza la tira para que el bloque seleccionado quede a la vista.
  useEffect(() => {
    if (!horizontal) return;
    trastes.current[seleccionadoId]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [seleccionadoId, horizontal]);

  function handleKeyDown(evento: KeyboardEvent<HTMLUListElement>) {
    const indice = nuevoIndice(evento.key, actual, bloques.length);
    if (indice === null) return;
    evento.preventDefault();
    onSeleccionar(bloques[indice].id);
  }

  return (
    <div className={cn(horizontal && "overflow-x-auto")}>
      <ul
        role="listbox"
        tabIndex={0}
        aria-label="Bloques de la ruta"
        aria-orientation={horizontal ? "horizontal" : "vertical"}
        aria-activedescendant={`${base}-${seleccionadoId}`}
        onKeyDown={handleKeyDown}
        className={cn("flex", horizontal ? "w-max pb-2" : "flex-col")}
      >
        {bloques.map((bloque, indice) => (
          <TrasteBloque
            key={bloque.id}
            ref={(el) => {
              trastes.current[bloque.id] = el;
            }}
            id={`${base}-${bloque.id}`}
            bloque={bloque}
            seleccionado={bloque.id === seleccionadoId}
            cierraNivel={cierraNivel(bloques, indice)}
            horizontal={horizontal}
            tramo={tramoDe(indice, ultimo)}
            onSeleccionar={() => onSeleccionar(bloque.id)}
          />
        ))}
      </ul>
    </div>
  );
}
