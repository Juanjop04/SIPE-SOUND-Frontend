import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn.js";

export type VarianteBoton = "primario" | "secundario" | "fantasma" | "peligro";
export type TamanoBoton = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBoton;
  tamano?: TamanoBoton;
  /** Deshabilita el botón y lo anuncia como ocupado (aria-busy) mientras se envía algo. */
  cargando?: boolean;
}

// Un nuevo estilo es una entrada del mapa, no un if (contrato 02 §4, "O").
const VARIANTES: Record<VarianteBoton, string> = {
  primario: "bg-primary text-sobre-primary hover:bg-primary-hover",
  secundario: "border border-linea-control text-paper hover:border-primary",
  // Con borde: un texto suelto no dice que se puede pulsar (HU-F-509).
  fantasma: "border border-linea-control text-paper hover:bg-surface-2",
  // Confirmación destructiva del diseño: #DC2626 con texto blanco (hover #B91C1C).
  peligro: "bg-peligro text-sobre-peligro hover:bg-peligro-hover",
};

const TAMANOS: Record<TamanoBoton, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-rapida disabled:cursor-not-allowed disabled:opacity-50";

/**
 * Clases de botón para un <Link>/<a> que debe verse como botón (navega, no ejecuta una acción):
 * así no se anida un <button> dentro de un enlace.
 */
export function claseBoton({
  variante = "primario",
  tamano = "md",
  className,
}: { variante?: VarianteBoton; tamano?: TamanoBoton; className?: string } = {}): string {
  return cn(BASE, VARIANTES[variante], TAMANOS[tamano], className);
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variante = "primario",
    tamano = "md",
    cargando = false,
    disabled,
    type = "button",
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || cargando}
      aria-busy={cargando || undefined}
      className={claseBoton({ variante, tamano, className })}
      {...props}
    >
      {children}
    </button>
  );
});
