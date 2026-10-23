import { forwardRef, type SelectHTMLAttributes } from "react";
import { claseControl, esInvalido } from "./claseControl";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalido?: boolean;
}

/** Select nativo (accesible y con teclado del sistema). Las opciones van como <option> hijos. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { invalido, className, children, ...props },
  ref,
) {
  const marcado = esInvalido(invalido, props["aria-invalid"]);
  return (
    <select
      ref={ref}
      aria-invalid={marcado || undefined}
      className={claseControl(marcado, className)}
      {...props}
    >
      {children}
    </select>
  );
});
