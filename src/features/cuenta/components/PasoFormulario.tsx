import type { FormEventHandler, ReactNode } from "react";
import { Button, MensajeError } from "@/shared/ui";

interface PasoFormularioProps {
  /** Instrucción del paso, encima de los campos. */
  instruccion: string;
  /** Aviso de contexto (p. ej. "Vuelve a confirmar tu identidad."). */
  aviso?: string | null;
  etiqueta: string;
  onEnviar: FormEventHandler<HTMLFormElement>;
  onCancelar: () => void;
  enviando: boolean;
  /** Espera tras un 429 (contrato 04 §5). */
  enfriando?: boolean;
  error: string | null;
  children: ReactNode;
}

/** Marco común de los pasos del diálogo: instrucción, campos, error general y botones. */
export function PasoFormulario({
  instruccion,
  aviso,
  etiqueta,
  onEnviar,
  onCancelar,
  enviando,
  enfriando = false,
  error,
  children,
}: PasoFormularioProps) {
  return (
    <form onSubmit={onEnviar} noValidate className="flex flex-col gap-4">
      {aviso && (
        <p role="status" className="text-sm text-paper">
          {aviso}
        </p>
      )}
      <p className="text-sm text-muted">{instruccion}</p>
      {children}
      {error && <MensajeError mensaje={error} />}
      <div className="flex justify-end gap-3">
        <Button variante="fantasma" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button type="submit" cargando={enviando} disabled={enfriando}>
          {etiqueta}
        </Button>
      </div>
    </form>
  );
}
