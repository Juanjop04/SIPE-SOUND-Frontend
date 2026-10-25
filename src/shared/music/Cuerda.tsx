import { cn } from "@/shared/lib/cn.js";

export type GrosorCuerda = 1 | 2 | 3 | 4 | 5;

export interface CuerdaProps {
  /** Avance de 0 a 100. */
  valor: number;
  /** Nombre accesible: "Avance del bloque 2". */
  etiqueta: string;
  grosor?: GrosorCuerda;
  /** Completado: el relleno pasa de violeta (primary) a verde (success, logro). */
  sonando?: boolean;
  className?: string;
}

const GROSORES: Record<GrosorCuerda, string> = {
  1: "h-px",
  2: "h-0.5",
  3: "h-[3px]",
  // Barras de las tarjetas y del avance (HU-F-322): más gruesas, con relleno degradado.
  4: "h-1.5",
  5: "h-2",
};

// Degradado dentro de la paleta (contrato 05 §6, enmienda HU-F-322): cada tema define sus
// extremos (tokens relleno-* y logro-*), todos ≥ 3:1 frente a la pista ink-2.
const RELLENO = {
  avance: "bg-gradient-to-r from-relleno-inicio to-relleno-fin",
  completo: "bg-gradient-to-r from-logro-inicio to-logro-fin",
};

/** Barra de progreso como una cuerda de guitarra (contrato 05 §1 y §4). */
export function Cuerda({ valor, etiqueta, grosor = 2, sonando = false, className }: CuerdaProps) {
  const avance = Math.min(100, Math.max(0, Math.round(valor)));
  return (
    <div
      role="progressbar"
      aria-label={etiqueta}
      aria-valuenow={avance}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("w-full rounded-full bg-ink-2", GROSORES[grosor], className)}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-panel motion-reduce:transition-none",
          sonando ? RELLENO.completo : RELLENO.avance,
        )}
        // Valor calculado: el único style permitido (contrato 03 §5).
        style={{ width: `${avance}%` }}
      />
    </div>
  );
}
