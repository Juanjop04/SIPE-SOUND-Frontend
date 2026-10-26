import { forwardRef, useState, type ChangeEvent, type TextareaHTMLAttributes } from "react";
import { claseControl, esInvalido } from "./claseControl";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalido?: boolean;
  /** Muestra "1.840 / 2000" desde el 80 % de maxLength (contrato 08, regla 6). */
  contador?: boolean;
}

const UMBRAL_CONTADOR = 0.8;
const formato = new Intl.NumberFormat("es-CO");

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalido, contador = false, className, onChange, ...props },
  ref,
) {
  const marcado = esInvalido(invalido, props["aria-invalid"]);
  // Sin `value` (no controlado) el largo se sigue aquí; con `value` manda el padre.
  const [largoPropio, setLargoPropio] = useState(String(props.defaultValue ?? "").length);
  const largo = props.value === undefined ? largoPropio : String(props.value).length;
  const maximo = props.maxLength;

  function handleChange(evento: ChangeEvent<HTMLTextAreaElement>) {
    setLargoPropio(evento.target.value.length);
    onChange?.(evento);
  }

  return (
    <div className="flex flex-col gap-1">
      <textarea
        ref={ref}
        aria-invalid={marcado || undefined}
        className={claseControl(marcado, className)}
        onChange={handleChange}
        {...props}
      />
      {contador && maximo !== undefined && largo >= maximo * UMBRAL_CONTADOR && (
        <p
          className="self-end font-mono text-xs tabular-nums text-muted"
          aria-live={largo >= maximo ? "polite" : "off"}
        >
          {formato.format(largo)} / {formato.format(maximo)}
        </p>
      )}
    </div>
  );
});
