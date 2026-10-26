import { forwardRef, type ChangeEvent, type ClipboardEvent } from "react";
import { Input, type InputProps } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";

const { largo: LARGO } = LIMITES.codigoVerificacion;
const SOLO_DIGITOS = /\D/g;

// React Hook Form lee el valor del <input> cuando recibe el evento "input": se escribe el valor
// con el setter nativo y se emite ese evento, igual que si la persona lo hubiera tecleado.
const escribirValor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;

/**
 * Campo del código de 6 dígitos. UN solo <input> (no seis cajas: romperían pegar, los lectores
 * de pantalla y el autocompletado del teléfono). Acepta "482 913" al pegar y descarta lo que
 * no sea un dígito al escribir.
 */
export const CampoCodigo = forwardRef<HTMLInputElement, InputProps>(function CampoCodigo(
  { onChange, className, ...props },
  ref,
) {
  function alEscribir(evento: ChangeEvent<HTMLInputElement>) {
    evento.target.value = evento.target.value.replace(SOLO_DIGITOS, "");
    onChange?.(evento);
  }

  // maxLength recortaría "482 913" a "482 91" antes de poder limpiarlo: se limpia al pegar.
  function alPegar(evento: ClipboardEvent<HTMLInputElement>) {
    const digitos = evento.clipboardData.getData("text").replace(SOLO_DIGITOS, "").slice(0, LARGO);
    evento.preventDefault();
    escribirValor?.call(evento.currentTarget, digitos);
    evento.currentTarget.dispatchEvent(new Event("input", { bubbles: true }));
  }

  return (
    <Input
      ref={ref}
      type="text"
      inputMode="numeric"
      autoComplete="one-time-code"
      autoCapitalize="none"
      spellCheck={false}
      maxLength={LARGO}
      placeholder="000000"
      onChange={alEscribir}
      onPaste={alPegar}
      className={`font-mono text-2xl tracking-widest ${className ?? ""}`}
      {...props}
    />
  );
});
