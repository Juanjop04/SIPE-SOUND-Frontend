import { forwardRef, type InputHTMLAttributes } from "react";
import { claseControl, esInvalido } from "./claseControl";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Borde danger y aria-invalid. Dentro de Field se deduce del error. */
  invalido?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalido, className, ...props },
  ref,
) {
  const marcado = esInvalido(invalido, props["aria-invalid"]);
  return (
    <input
      ref={ref}
      aria-invalid={marcado || undefined}
      className={claseControl(marcado, className)}
      {...props}
    />
  );
});
