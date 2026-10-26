import { useId, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import { useDialogoNativo } from "./useDialogoNativo";

export interface PanelModalProps {
  abierto: boolean;
  onCerrar: () => void;
  titulo: string;
  descripcion?: string;
  /** Botones al pie (Guardar, Cancelar…). */
  acciones?: ReactNode;
  children?: ReactNode;
}

// Base interna de Dialog y Drawer: mismo comportamiento de foco, distinta forma.
export function PanelModal({
  abierto,
  onCerrar,
  titulo,
  descripcion,
  acciones,
  children,
  className,
}: PanelModalProps & { className: string }) {
  const { ref, atraparFoco } = useDialogoNativo(abierto, onCerrar);
  const idTitulo = useId();
  const idDescripcion = useId();

  return (
    // onKeyDown complementa el foco atrapado de showModal() (Tab no sale del diálogo).
    <dialog
      ref={ref}
      aria-labelledby={idTitulo}
      aria-describedby={descripcion ? idDescripcion : undefined}
      onKeyDown={atraparFoco}
      className={cn("bg-surface-2 p-0 text-paper backdrop:bg-ink/80", className)}
    >
      {abierto && (
        <div className="flex h-full flex-col gap-4 p-6">
          <header className="flex items-start justify-between gap-4">
            <div>
              <h2 id={idTitulo} className="font-display text-xl font-semibold">
                {titulo}
              </h2>
              {descripcion && (
                <p id={idDescripcion} className="mt-1 text-sm text-muted">
                  {descripcion}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onCerrar}
              aria-label="Cerrar"
              className="rounded-md p-1 text-muted transition-colors duration-rapida hover:text-paper"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </header>
          <div className="flex-1 overflow-auto">{children}</div>
          {acciones && <footer className="flex justify-end gap-3">{acciones}</footer>}
        </div>
      )}
    </dialog>
  );
}
