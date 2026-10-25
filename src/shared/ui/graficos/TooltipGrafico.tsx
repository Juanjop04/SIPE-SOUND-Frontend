interface CargaTooltip {
  payload?: Record<string, unknown>;
}

interface TooltipGraficoProps {
  active?: boolean;
  payload?: readonly CargaTooltip[];
  /** Arma el texto del tooltip a partir de los datos de la barra o punto bajo el cursor. */
  texto: (dato: Record<string, unknown>) => { titulo: string; detalle: string };
}

/** Tooltip con las superficies del sistema (surface-2, borde linea, sin sombra pesada). */
export function TooltipGrafico({ active, payload, texto }: TooltipGraficoProps) {
  const dato = payload?.[0]?.payload;
  if (!active || !dato) return null;
  const { titulo, detalle } = texto(dato);
  return (
    <div
      role="status"
      className="rounded-md border border-linea bg-surface-2 px-3 py-2 text-sm text-paper"
    >
      <p className="font-medium">{titulo}</p>
      <p className="font-mono text-xs text-muted">{detalle}</p>
    </div>
  );
}
