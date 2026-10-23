import { cn } from "@/shared/lib/cn.js";

// Base común de Input, Textarea y Select: borde de control (linea-fuerte, ≥ 3:1) y,
// si el valor es inválido, borde danger. El foco lo pinta el :focus-visible global.
const BASE =
  "w-full rounded-md border bg-ink px-3 py-2 text-sm text-paper transition-colors duration-rapida placeholder:text-muted/70 disabled:cursor-not-allowed disabled:bg-ink-2 disabled:text-muted";

export function claseControl(invalido: boolean, className?: string): string {
  return cn(
    BASE,
    invalido ? "border-danger" : "border-linea-fuerte focus-visible:border-accent",
    className,
  );
}

/** `invalido` explícito o, si viene de Field, el aria-invalid que este conecta. */
export function esInvalido(invalido: boolean | undefined, ariaInvalid: unknown): boolean {
  return invalido ?? (ariaInvalid === true || ariaInvalid === "true");
}
