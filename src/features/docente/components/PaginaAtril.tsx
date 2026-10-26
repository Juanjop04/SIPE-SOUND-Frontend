import type { ReactNode } from "react";
import { TrasteDivider } from "@/shared/music";

interface PaginaAtrilProps {
  titulo: string;
  descripcion: string;
  children: ReactNode;
}

/** Encabezado común de las secciones del atril: título, propósito y un traste. */
export function PaginaAtril({ titulo, descripcion, children }: PaginaAtrilProps) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <h1 className="font-display text-3xl font-semibold text-paper">{titulo}</h1>
      <p className="mt-2 max-w-prose text-sm text-muted">{descripcion}</p>
      <TrasteDivider className="my-8" />
      {children}
    </main>
  );
}
