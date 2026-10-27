import { formatearEspera } from "@/shared/hooks/useCuentaRegresiva";

interface VigenciaCodigoProps {
  /** Segundos que le quedan al código; 0 = ya venció. */
  restante: number;
  /** Se sabe que hay un código en camino (si no, no hay nada que contar). */
  seguimiento: boolean;
}

/** "Tu código vence en 0:42": la cuenta regresiva de la vigencia del código. */
export function VigenciaCodigo({ restante, seguimiento }: VigenciaCodigoProps) {
  if (!seguimiento) return null;
  const vigente = restante > 0;
  return (
    <p
      role="timer"
      aria-live="off"
      className={`font-mono text-sm ${vigente ? "text-muted" : "text-danger"}`}
    >
      {vigente
        ? `Tu código vence en ${formatearEspera(restante)}`
        : "Tu código venció. Pide uno nuevo para continuar."}
    </p>
  );
}
