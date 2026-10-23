import { useId, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/shared/lib/cn.js";
import { MensajeError, Skeleton } from "@/shared/ui";

export interface PanelInicioProps {
  titulo: string;
  /** Enlace secundario de la esquina ("Ver todo"). */
  enlace?: { a: string; texto: string };
  /** Estado de los datos de la sección: cada sección carga y falla por separado. */
  cargando?: boolean;
  error?: Error | null;
  onReintentar?: () => void;
  className?: string;
  children?: ReactNode;
}

/** Tarjeta de sección del inicio: surface con borde (contrato 05 §2.1), título y contenido. */
export function PanelInicio(props: PanelInicioProps) {
  const { titulo, enlace, cargando, error, onReintentar, className, children } = props;
  const id = useId();
  let contenido = children;
  if (cargando) contenido = <Skeleton lineas={3} className="h-10 w-full" />;
  else if (error) contenido = <MensajeError mensaje={error.message} onReintentar={onReintentar} />;

  return (
    <section
      aria-labelledby={id}
      className={cn(
        "flex flex-col gap-4 rounded-caja border border-linea bg-surface p-5",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 id={id} className="font-display text-xl font-semibold text-paper">
          {titulo}
        </h2>
        {enlace && (
          <Link to={enlace.a} className="text-sm text-accent hover:underline">
            {enlace.texto}
          </Link>
        )}
      </div>
      {contenido}
    </section>
  );
}
