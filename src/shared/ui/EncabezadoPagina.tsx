import type { ReactNode } from "react";
import { Foto, type NombreFoto } from "./Foto";

export interface EncabezadoPaginaProps {
  titulo: string;
  descripcion: string;
  /** Foto decorativa a la derecha (oculta en móvil); el texto nunca va encima de ella. */
  foto: NombreFoto;
  /** Filtros u otras acciones del encabezado. */
  children?: ReactNode;
}

/** Encabezado de catálogo (HU-F-321): tarjeta con título, descripción y filtros, y foto al lado. */
export function EncabezadoPagina({ titulo, descripcion, foto, children }: EncabezadoPaginaProps) {
  return (
    <header className="grid overflow-hidden rounded-caja border border-linea bg-surface sm:grid-cols-[1fr_minmax(0,18rem)]">
      <div className="flex flex-col justify-between gap-5 p-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-paper">{titulo}</h1>
          <p className="mt-2 text-sm text-muted">{descripcion}</p>
        </div>
        {children}
      </div>
      <Foto
        nombre={foto}
        alt=""
        sizes="(min-width: 640px) 18rem, 0px"
        className="hidden h-full sm:block"
      />
    </header>
  );
}
