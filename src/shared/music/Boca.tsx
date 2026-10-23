import { useId } from "react";
import { cn } from "@/shared/lib/cn.js";

export interface BocaProps {
  /** Avance de 0 a 100. */
  valor: number;
  /** Nombre accesible: "Avance de la ruta". */
  etiqueta: string;
  tamano?: "sm" | "md";
  className?: string;
}

const RADIO = 52;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO;
const TAMANOS = { sm: "w-24", md: "w-36" };

/**
 * Anillo de progreso con forma de la boca de la guitarra (contrato 05 §4): pista ink-2, arco
 * primary y verde (success) al completar; la roseta interior es decorativa. Uno por pantalla.
 */
export function Boca({ valor, etiqueta, tamano = "md", className }: BocaProps) {
  const avance = Math.max(0, Math.min(100, Math.round(valor)));
  const completo = avance === 100;
  const idDegradado = useId();

  return (
    <div
      role="progressbar"
      aria-label={etiqueta}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={avance}
      className={cn("relative aspect-square shrink-0", TAMANOS[tamano], className)}
    >
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
        {/* Arco con el mismo degradado de Cuerda (enmienda HU-F-322); verde al completar. */}
        <defs>
          <linearGradient id={idDegradado} x1="0" y1="0" x2="1" y2="1">
            <stop
              offset="0%"
              className={
                completo
                  ? "[stop-color:rgb(var(--color-success)/0.6)]"
                  : "[stop-color:rgb(var(--color-primary))]"
              }
            />
            <stop
              offset="100%"
              className={
                completo
                  ? "[stop-color:rgb(var(--color-success))]"
                  : "[stop-color:rgb(var(--color-primary-claro))]"
              }
            />
          </linearGradient>
        </defs>
        <circle cx={60} cy={60} r={RADIO} fill="none" className="stroke-ink-2" strokeWidth={10} />
        <circle
          cx={60}
          cy={60}
          r={RADIO}
          fill="none"
          stroke={`url(#${idDegradado})`}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={CIRCUNFERENCIA}
          strokeDashoffset={CIRCUNFERENCIA * (1 - avance / 100)}
        />
        <circle cx={60} cy={60} r={40} fill="none" className="stroke-linea" strokeWidth={1} />
        <circle cx={60} cy={60} r={36} fill="none" className="stroke-linea" strokeWidth={1} />
      </svg>
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center font-mono text-2xl font-medium tabular-nums text-paper"
      >
        {avance}%
      </span>
    </div>
  );
}
