import { cn } from "@/shared/lib/cn.js";

export type EstadoBloque = "bloqueado" | "disponible" | "aprobado";

export interface MarcaEstadoProps {
  estado: EstadoBloque;
  className?: string;
}

// Los mismos símbolos del diagrama de acorde que el estudiante ya lee (contrato 05 §1):
// × cuerda muda = bloqueado · ○ al aire = disponible · ● ámbar = aprobado.
const MARCAS: Record<EstadoBloque, { simbolo: string; clase: string; texto: string }> = {
  bloqueado: { simbolo: "×", clase: "text-muted", texto: "Bloqueado" },
  disponible: { simbolo: "○", clase: "text-paper", texto: "Disponible" },
  aprobado: { simbolo: "●", clase: "text-success", texto: "Aprobado" },
};

export function MarcaEstado({ estado, className }: MarcaEstadoProps) {
  const { simbolo, clase, texto } = MARCAS[estado];
  return (
    <span className={cn("inline-flex w-4 justify-center font-mono", clase, className)}>
      <span aria-hidden="true">{simbolo}</span>
      <span className="sr-only">{texto}</span>
    </span>
  );
}
