import { useId, type ReactElement } from "react";
import { cn } from "@/shared/lib/cn.js";

/** Lo que Field entrega al control: id para el label y la ayuda/error asociados. */
export interface PropsControl {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
}

export interface FieldProps {
  etiqueta: string;
  ayuda?: string;
  error?: string;
  className?: string;
  /** Uso: <Field etiqueta="Correo">{(control) => <Input {...control} />}</Field> */
  children: (control: PropsControl) => ReactElement;
}

// Une label + control + ayuda + error (contrato 03 §6): el error nunca es solo color.
export function Field({ etiqueta, ayuda, error, className, children }: FieldProps) {
  const id = useId();
  const idAyuda = `${id}-ayuda`;
  const idError = `${id}-error`;
  const describe = [ayuda ? idAyuda : null, error ? idError : null].filter(Boolean).join(" ");

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-paper">
        {etiqueta}
      </label>
      {children({
        id,
        "aria-describedby": describe || undefined,
        "aria-invalid": error ? true : undefined,
      })}
      {ayuda && (
        <p id={idAyuda} className="text-xs text-muted">
          {ayuda}
        </p>
      )}
      {error && (
        <p id={idError} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
