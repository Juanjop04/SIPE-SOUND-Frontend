import type { FormEvent, KeyboardEvent } from "react";
import { Button, MensajeError } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";

interface CampoDeMensajeProps {
  etiqueta: string;
  texto: string;
  onTexto: (texto: string) => void;
  /** Enter (sin Mayús) o el botón. */
  onEnviar: () => void;
  enviando: boolean;
  /** Texto del botón; "Enviar aviso" cuando el destino es un grupo. */
  boton?: string;
  /** Errores que se muestran sobre el campo (el del backend va tal cual). */
  errores?: (string | null | undefined)[];
}

/** Campo de mensaje pegado abajo: Enter envía, Mayús+Enter salta de línea (respuesta y chat nuevo). */
export function CampoDeMensaje({
  etiqueta,
  texto,
  onTexto,
  onEnviar,
  enviando,
  boton = "Enviar",
  errores = [],
}: CampoDeMensajeProps) {
  const alEnviar = (e: FormEvent) => {
    e.preventDefault();
    onEnviar();
  };
  const alTeclear = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      onEnviar();
    }
  };
  return (
    <form noValidate onSubmit={alEnviar} className="border-t border-linea p-3">
      {errores.map((mensaje) => mensaje && <MensajeError key={mensaje} mensaje={mensaje} />)}
      <div className="flex items-end gap-2">
        <textarea
          aria-label={etiqueta}
          placeholder={etiqueta}
          rows={2}
          value={texto}
          maxLength={LIMITES.cuerpoMensaje.max}
          onChange={(e) => onTexto(e.target.value)}
          onKeyDown={alTeclear}
          className="min-h-[44px] flex-1 resize-none rounded-caja border border-linea-fuerte bg-surface px-3 py-2 text-paper placeholder:text-muted focus-visible:border-accent"
        />
        <Button type="submit" cargando={enviando}>
          {boton}
        </Button>
      </div>
      <p className="mt-1 text-xs text-muted">Enter envía · Mayús+Enter, nueva línea</p>
    </form>
  );
}
