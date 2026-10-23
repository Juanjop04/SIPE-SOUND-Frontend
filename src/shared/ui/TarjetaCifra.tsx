import type { LucideIcon } from "lucide-react";
import { Cuerda } from "@/shared/music";

export interface TarjetaCifraProps {
  /** Ícono lucide decorativo (el dato lo dice la etiqueta). */
  icono: LucideIcon;
  etiqueta: string;
  hecho: number;
  total: number;
}

/**
 * Una cifra real "hecho / total" con su cuerda (contrato 05 §4, enmienda). Nunca se usa para un
 * dato que la API no da: si no hay dato, la tarjeta no existe.
 */
export function TarjetaCifra({ icono: Icono, etiqueta, hecho, total }: TarjetaCifraProps) {
  const avance = total > 0 ? Math.round((Math.min(hecho, total) / total) * 100) : 0;
  return (
    <div className="flex items-center gap-4 rounded-caja border border-linea bg-surface p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-ink-2 text-accent">
        <Icono size={22} aria-hidden />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="text-sm text-muted">{etiqueta}</p>
        <p className="font-mono text-xl tabular-nums text-paper">
          {hecho} <span className="text-base text-muted">/ {total}</span>
        </p>
        <Cuerda
          grosor={4}
          valor={avance}
          etiqueta={`${etiqueta}: ${hecho} de ${total}`}
          sonando={avance === 100}
        />
      </div>
    </div>
  );
}
