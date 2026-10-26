import { cn } from "@/shared/lib/cn.js";
import type { Persona } from "../tipos";
import { iniciales } from "../utilsChat";

/** Las iniciales en un círculo `surface` (no hay fotos de perfil). Decorativo: el nombre va aparte. */
export function Iniciales({ persona, className }: { persona: Persona | null; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-linea-fuerte bg-surface font-mono text-sm text-paper",
        className,
      )}
    >
      {iniciales(persona)}
    </span>
  );
}
