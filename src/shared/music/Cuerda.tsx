import { cn } from "@/shared/lib/cn.js";

export type GrosorCuerda = 1 | 2 | 3;

export interface CuerdaProps {
  /** Avance de 0 a 100. */
  valor: number;
  /** Nombre accesible: "Avance del bloque 2". */
  etiqueta: string;
  grosor?: GrosorCuerda;
  /** Completado: la cuerda "suena" y pasa a ámbar (success). */
  sonando?: boolean;
  className?: string;
}

const GROSORES: Record<GrosorCuerda, string> = {
  1: "h-px",
  2: "h-0.5",
  3: "h-[3px]",
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
      className={cn("w-full rounded-full bg-linea", GROSORES[grosor], className)}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width,background-color] duration-panel",
          sonando ? "bg-success" : "bg-paper/55",
        )}
        // Valor calculado: el único style permitido (contrato 03 §5).
        style={{ width: `${avance}%` }}
      />
    </div>
  );
}
