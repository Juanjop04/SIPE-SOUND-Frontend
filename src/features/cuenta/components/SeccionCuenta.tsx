import type { ReactNode } from "react";

interface SeccionCuentaProps {
  /** Ancla del índice de secciones (#datos, #correo…). */
  id: string;
  titulo: string;
  descripcion: string;
  /** Aviso de éxito (role="status") encima del contenido de la sección. */
  exito?: string | null;
  children?: ReactNode;
}

/**
 * Sección de Mi cuenta: título y descripción a la izquierda, controles a la derecha. Por debajo
 * de 960 px se apila. El título usa `font-display`; el borde superior separa una de otra.
 */
export function SeccionCuenta({ id, titulo, descripcion, exito, children }: SeccionCuentaProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className="grid scroll-mt-24 gap-4 border-t border-linea py-7 first:border-t-0 first:pt-0 min-[961px]:grid-cols-[15rem_minmax(0,1fr)] min-[961px]:gap-x-8"
    >
      <div>
        <h2 id={`${id}-titulo`} className="font-display text-xl font-semibold text-paper">
          {titulo}
        </h2>
        <p className="mt-1.5 text-sm text-muted">{descripcion}</p>
      </div>
      <div className="flex min-w-0 flex-col gap-4">
        {exito && (
          <p role="status" className="text-sm text-success">
            {exito}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
