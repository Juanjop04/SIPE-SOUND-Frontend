import { cn } from "@/shared/lib/cn.js";

export interface CifraCompactaProps {
  etiqueta: string;
  valor: number | string | undefined;
  /** Color de la cifra en mono (p. ej. "text-success"); por defecto, texto principal. */
  colorValor?: string;
  /** Con onClick es un botón (filtra o abre algo); sin él, una cifra informativa. */
  onClick?: () => void;
  /** Solo en botones que filtran: la cifra elegida (aria-pressed). */
  activa?: boolean;
  className?: string;
}

const BASE =
  "flex min-h-11 items-center gap-2.5 rounded-md border bg-surface px-3.5 py-1.5 text-left";

/**
 * Cifra compacta de una línea (44 px): el número en mono y su etiqueta. Cuando filtra o abre algo
 * es un <button> con aria-pressed; si no, una cifra sin interacción.
 */
export function CifraCompacta({
  etiqueta,
  valor,
  colorValor = "text-paper",
  onClick,
  activa,
  className,
}: CifraCompactaProps) {
  const contenido = (
    <>
      <span className={cn("font-mono text-xl font-medium tabular-nums", colorValor)}>
        {valor ?? "—"}
      </span>
      <span className="text-sm font-medium text-muted">{etiqueta}</span>
    </>
  );
  if (!onClick) {
    return <div className={cn(BASE, "border-linea", className)}>{contenido}</div>;
  }
  return (
    <button
      type="button"
      aria-pressed={activa}
      onClick={onClick}
      className={cn(
        BASE,
        "transition-colors duration-rapida",
        activa ? "border-primary bg-primary/10" : "border-linea hover:border-linea-fuerte",
        className,
      )}
    >
      {contenido}
    </button>
  );
}
