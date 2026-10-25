import { cn } from "@/shared/lib/cn.js";

export interface TrasteDividerProps {
  /** Número de traste en mono a la izquierda (opcional). */
  numero?: number;
  className?: string;
}

/** Separador de 1 px como un traste: sustituye a <hr> y a las tarjetas apiladas. */
export function TrasteDivider({ numero, className }: TrasteDividerProps) {
  return (
    <div role="separator" className={cn("flex items-center gap-3", className)}>
      {numero !== undefined && (
        <span aria-hidden="true" className="font-mono text-xs tabular-nums text-muted">
          {numero}
        </span>
      )}
      <span aria-hidden="true" className="h-px flex-1 bg-linea" />
    </div>
  );
}
