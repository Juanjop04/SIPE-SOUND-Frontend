import { cn } from "@/shared/lib/cn.js";

interface InterruptorProps {
  activo: boolean;
  /** Qué controla y su estado actual, para lectores de pantalla (p. ej. "Cuenta de Ana"). */
  etiqueta: string;
  /** Texto visible junto al interruptor: dice qué estado representa ("Cuenta activa"). */
  texto: string;
  onCambiar: () => void;
  disabled?: boolean;
  /** Texto del tooltip nativo: qué pasa al accionarlo. */
  titulo?: string;
}

/**
 * Interruptor encendido/apagado (role="switch") con su función escrita al lado: el estado se ve
 * en la posición, en el texto y se lee en aria-checked (nunca solo por color ni por posición).
 */
export function Interruptor({
  activo,
  etiqueta,
  texto,
  onCambiar,
  disabled,
  titulo,
}: InterruptorProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      aria-label={etiqueta}
      title={titulo ?? etiqueta}
      disabled={disabled}
      onClick={onCambiar}
      className="inline-flex items-center gap-2 text-left text-xs text-paper disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors duration-rapida",
          activo ? "border-primary bg-primary" : "border-linea-fuerte bg-surface",
        )}
      >
        <span
          className={cn(
            "inline-block h-3.5 w-3.5 rounded-full transition-transform duration-rapida",
            activo ? "translate-x-[1.125rem] bg-sobre-primary" : "translate-x-0.5 bg-muted",
          )}
        />
      </span>
      <span className="whitespace-nowrap">{texto}</span>
    </button>
  );
}
