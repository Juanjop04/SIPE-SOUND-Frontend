import type { ReactNode } from "react";

interface SeccionCuentaProps {
  titulo: string;
  /** Aviso de éxito (role="status") encima del contenido de la sección. */
  exito?: string | null;
  /** Botón de la sección: a la derecha en escritorio, debajo en móvil. */
  accion?: ReactNode;
  children?: ReactNode;
}

/** Sección de Mi cuenta: título `font-display` a la izquierda y la acción a la derecha. */
export function SeccionCuenta({ titulo, exito, accion, children }: SeccionCuentaProps) {
  return (
    <section aria-label={titulo} className="flex flex-col gap-4">
      {exito && (
        <p role="status" className="text-sm text-paper">
          {exito}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="font-display text-xl font-semibold text-paper">{titulo}</h2>
        {accion}
      </div>
      {children}
    </section>
  );
}
