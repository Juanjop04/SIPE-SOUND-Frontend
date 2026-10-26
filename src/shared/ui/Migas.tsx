import { Fragment } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/shared/lib/cn.js";

export interface PasoMiga {
  etiqueta: string;
  /** Sin `a`: es la página actual (el último paso). */
  a?: string;
}

export interface MigasProps {
  pasos: PasoMiga[];
  className?: string;
}

/** "Ruta › Bloque 2 › Cambio entre Em y Am" (HU-F-318): dónde estoy y cómo volver. */
export function Migas({ pasos, className }: MigasProps) {
  return (
    <nav aria-label="Migas" className={cn("font-mono text-sm text-muted", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {pasos.map((paso, indice) => (
          <Fragment key={`${paso.etiqueta}-${indice}`}>
            {indice > 0 && (
              <li aria-hidden="true" className="text-linea-fuerte">
                ›
              </li>
            )}
            <li className="min-w-0">
              {paso.a ? (
                <Link
                  to={paso.a}
                  className="text-accent underline underline-offset-2 hover:decoration-2"
                >
                  {paso.etiqueta}
                </Link>
              ) : (
                <span aria-current="page" className="text-paper">
                  {paso.etiqueta}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
