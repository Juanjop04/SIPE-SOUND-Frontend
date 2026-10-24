import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn.js";
import { LIMITES } from "@/shared/validacion";
import { limpiarCodigo } from "../codigo";

interface CampoCodigoProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> {
  valor: string;
  onCambiar: (codigo: string) => void;
  invalido?: boolean;
}

const CASILLAS = Array.from({ length: LIMITES.codigoCurso.largo }, (_, i) => i);

/**
 * Código de 8 caracteres (HU-F-311): UN solo input accesible (pegar, teclado, lector de pantalla),
 * transparente sobre 8 casillas dibujadas con CSS. Limpia espacios y guiones y pasa a mayúsculas.
 */
export const CampoCodigo = forwardRef<HTMLInputElement, CampoCodigoProps>(function CampoCodigo(
  { valor, onCambiar, invalido = false, className, ...props },
  ref,
) {
  return (
    <div className={cn("group relative w-fit", className)}>
      <div aria-hidden="true" className="flex gap-1.5 sm:gap-2">
        {CASILLAS.map((i) => (
          <span
            key={i}
            className={cn(
              "flex h-12 w-9 items-center justify-center rounded-md border bg-surface font-mono text-xl text-paper sm:h-14 sm:w-11 sm:text-2xl",
              invalido ? "border-danger" : "border-linea-fuerte",
              // La casilla donde va la siguiente letra se marca al enfocar el campo.
              i === Math.min(valor.length, CASILLAS.length - 1) &&
                "group-focus-within:outline group-focus-within:outline-2 group-focus-within:outline-accent",
            )}
          >
            {valor[i] ?? ""}
          </span>
        ))}
      </div>
      <input
        ref={ref}
        {...props}
        value={valor}
        onChange={(e) => onCambiar(limpiarCodigo(e.target.value))}
        maxLength={LIMITES.codigoCurso.largo + 4}
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        inputMode="text"
        aria-invalid={invalido}
        className="absolute inset-0 h-full w-full cursor-text bg-transparent font-mono text-transparent caret-transparent outline-none focus-visible:outline-none"
      />
    </div>
  );
});
