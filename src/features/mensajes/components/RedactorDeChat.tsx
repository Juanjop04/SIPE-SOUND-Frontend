import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Button, MensajeError } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { useEnviarMensaje } from "../hooks";
import { esquemaRespuesta } from "../schemas";

/** Burbuja provisional del mensaje en camino; si falla queda con "Reintentar". */
export function EnviandoBurbuja({
  texto,
  fallo,
  onReintentar,
}: {
  texto: string;
  fallo: boolean;
  onReintentar: () => void;
}) {
  return (
    <div className="flex flex-col items-end gap-1">
      <p className="max-w-[min(68ch,85%)] whitespace-pre-wrap break-words rounded-caja rounded-br-none border border-primary bg-primary px-3 py-2 text-sobre-primary opacity-70">
        {texto}
      </p>
      {fallo ? (
        <p className="flex items-center gap-2 text-xs text-danger">
          No se envió.
          <button type="button" onClick={onReintentar} className="underline">
            Reintentar
          </button>
        </p>
      ) : (
        <p className="text-xs text-muted">Enviando…</p>
      )}
    </div>
  );
}

interface Props {
  responderA: string;
  /** Lo que se está enviando o falló: lo dibuja la lista, no el campo. */
  onPendiente: (texto: string | null, fallo: boolean) => void;
  onReintento: (reintentar: () => void) => void;
}

/** Campo de respuesta pegado abajo: Enter envía, Mayús+Enter salta de línea. */
export function RedactorDeChat({ responderA, onPendiente, onReintento }: Props) {
  const enviar = useEnviarMensaje();
  const [texto, setTexto] = useState("");
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  const mandar = (cuerpo: string) => {
    onPendiente(cuerpo, false);
    onReintento(() => mandar(cuerpo));
    enviar.mutate(
      { respuesta_a_id: responderA, cuerpo },
      {
        onSuccess: () => onPendiente(null, false),
        onError: () => onPendiente(cuerpo, true),
      },
    );
  };

  const probar = () => {
    const r = esquemaRespuesta.safeParse({ cuerpo: texto });
    if (!r.success) {
      setErrorLocal(r.error.issues[0]?.message ?? "Escribe un mensaje.");
      return;
    }
    setErrorLocal(null);
    setTexto("");
    mandar(r.data.cuerpo);
  };

  const alEnviar = (e: FormEvent) => {
    e.preventDefault();
    probar();
  };
  const alTeclear = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      probar();
    }
  };

  return (
    <form noValidate onSubmit={alEnviar} className="border-t border-linea p-3">
      {/* El backend decide quién responde a quién: su mensaje (403, 429…) se muestra tal cual. */}
      {enviar.error && <MensajeError mensaje={enviar.error.message} />}
      {errorLocal && <MensajeError mensaje={errorLocal} />}
      <div className="flex items-end gap-2">
        <textarea
          aria-label="Escribe tu respuesta"
          placeholder="Escribe tu respuesta"
          rows={2}
          value={texto}
          maxLength={LIMITES.cuerpoMensaje.max}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={alTeclear}
          className="min-h-[44px] flex-1 resize-none rounded-caja border border-linea-fuerte bg-surface px-3 py-2 text-paper placeholder:text-muted focus-visible:border-accent"
        />
        <Button type="submit" cargando={enviar.isPending}>
          Enviar
        </Button>
      </div>
      <p className="mt-1 text-xs text-muted">Enter envía · Mayús+Enter, nueva línea</p>
    </form>
  );
}
