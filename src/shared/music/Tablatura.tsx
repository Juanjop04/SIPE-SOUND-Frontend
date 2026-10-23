import { Fragment, type ReactNode } from "react";
import { cn } from "@/shared/lib/cn.js";

export interface DatoTablatura {
  /** Identidad del dato (bpm, compas, duracion…). */
  clave: string;
  valor: ReactNode;
}

export interface TablaturaProps {
  datos: DatoTablatura[];
  className?: string;
}

/** Datos en mono separados como compases: ♩ 60 BPM │ 4/4 │ 20 min (contrato 05 §4). */
export function Tablatura({ datos, className }: TablaturaProps) {
  return (
    <p
      className={cn("flex flex-wrap items-center gap-x-3 font-mono text-sm text-muted", className)}
    >
      {datos.map((dato, indice) => (
        <Fragment key={dato.clave}>
          {indice > 0 && (
            <span aria-hidden="true" className="text-linea-fuerte">
              │
            </span>
          )}
          <span>{dato.valor}</span>
        </Fragment>
      ))}
    </p>
  );
}
