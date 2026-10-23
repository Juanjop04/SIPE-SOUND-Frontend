import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn.js";
import { Button } from "./Button";

// Los tres estados que toda vista con datos debe representar (contrato 03 §4).

// Ids fijos en lugar del índice como key (Sonar S6479).
const IDS_LINEA = ["a", "b", "c", "d", "e", "f", "g", "h"];

export interface SkeletonProps {
  /** Tamaño del bloque (h-4 w-40…). Con `lineas`, el de cada línea. */
  className?: string;
  lineas?: number;
}

/** Marcador de carga. Es decorativo: quien lo usa marca aria-busy en la región. */
export function Skeleton({ className, lineas = 1 }: SkeletonProps) {
  const clase = cn("motion-safe:animate-pulse rounded-md bg-ink-2", className ?? "h-4 w-full");
  if (lineas <= 1) return <div aria-hidden="true" className={clase} />;
  return (
    <div aria-hidden="true" className="flex flex-col gap-2">
      {IDS_LINEA.slice(0, lineas).map((id) => (
        <div key={id} className={clase} />
      ))}
    </div>
  );
}

export interface EstadoVacioProps {
  titulo: string;
  descripcion?: string;
  /** Siguiente paso concreto (contrato 05 §7): un botón o enlace. */
  accion?: ReactNode;
  className?: string;
}

export function EstadoVacio({ titulo, descripcion, accion, className }: EstadoVacioProps) {
  return (
    <div className={cn("py-8", className)}>
      <p className="font-display text-lg font-semibold text-paper">{titulo}</p>
      {descripcion && <p className="mt-1 max-w-prose text-sm text-muted">{descripcion}</p>}
      {accion && <div className="mt-4">{accion}</div>}
    </div>
  );
}

export interface MensajeErrorProps {
  /** Texto ya en español (ApiError.message). */
  mensaje: string;
  onReintentar?: () => void;
  className?: string;
}

export function MensajeError({ mensaje, onReintentar, className }: MensajeErrorProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger",
        className,
      )}
    >
      <p>{mensaje}</p>
      {onReintentar && (
        <Button variante="secundario" tamano="sm" onClick={onReintentar}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
