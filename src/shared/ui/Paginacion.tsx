import { Button } from "./Button";

/** `meta` de las respuestas paginadas del backend (contrato 04). */
export interface MetaPaginacion {
  pagina: number;
  por_pagina: number;
  total: number;
}

export interface PaginacionProps {
  meta: MetaPaginacion;
  onPagina: (pagina: number) => void;
}

/** "← Anterior · 1–20 de 45 · Siguiente →" para listados paginados por el backend. */
export function Paginacion({ meta, onPagina }: PaginacionProps) {
  const desde = meta.total === 0 ? 0 : (meta.pagina - 1) * meta.por_pagina + 1;
  const hasta = Math.min(meta.pagina * meta.por_pagina, meta.total);
  return (
    <nav aria-label="Páginas" className="flex items-center justify-between gap-3">
      <Button
        variante="fantasma"
        tamano="sm"
        disabled={meta.pagina <= 1}
        onClick={() => onPagina(meta.pagina - 1)}
      >
        ← Anterior
      </Button>
      <span className="font-mono text-sm text-muted">
        {desde}–{hasta} de {meta.total}
      </span>
      <Button
        variante="fantasma"
        tamano="sm"
        disabled={hasta >= meta.total}
        onClick={() => onPagina(meta.pagina + 1)}
      >
        Siguiente →
      </Button>
    </nav>
  );
}
