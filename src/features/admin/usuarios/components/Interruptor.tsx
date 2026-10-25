import { cn } from "@/shared/lib/cn.js";

interface InterruptorProps {
  activo: boolean;
  /** Qué controla y su estado actual, para lectores de pantalla (p. ej. "Cuenta de Ana"). */
  etiqueta: string;
  onCambiar: () => void;
  disabled?: boolean;
  /** Texto del tooltip nativo. */
  titulo?: string;
}

/** Interruptor encendido/apagado (role="switch"): el estado se ve en la posición y se lee en aria-checked. */
export function Interruptor({ activo, etiqueta, onCambiar, disabled, titulo }: InterruptorProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      aria-label={etiqueta}
      title={titulo ?? etiqueta}
      disabled={disabled}
      onClick={onCambiar}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors duration-rapida disabled:cursor-not-allowed disabled:opacity-50",
        activo ? "border-primary bg-primary" : "border-linea-fuerte bg-surface",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block h-3.5 w-3.5 rounded-full transition-transform duration-rapida",
          activo ? "translate-x-[1.125rem] bg-sobre-primary" : "translate-x-0.5 bg-muted",
        )}
      />
    </button>
  );
}
