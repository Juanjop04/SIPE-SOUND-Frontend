import { Button } from "@/shared/ui";

/** Máximo de cuentas por petición en lote (HU-B-407). */
export const MAXIMO_LOTE = 100;

interface BarraLoteProps {
  cantidad: number;
  ocupada: boolean;
  onPermitir: () => void;
  onBloquear: () => void;
  onLimpiar: () => void;
}

/** Barra fija abajo al elegir cuentas: permiso de nombre en lote. */
export function BarraLote({
  cantidad,
  ocupada,
  onPermitir,
  onBloquear,
  onLimpiar,
}: BarraLoteProps) {
  const demasiadas = cantidad > MAXIMO_LOTE;
  return (
    <div
      data-fijo="abajo"
      className="sticky bottom-0 z-20 -mx-4 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-linea bg-ink-2 px-4 py-3 sm:-mx-8 sm:px-8"
    >
      <p className="text-sm text-paper">
        <span className="font-mono tabular-nums">{cantidad}</span>{" "}
        {cantidad === 1 ? "cuenta elegida" : "cuentas elegidas"}
        {demasiadas && (
          <span className="text-danger"> · Elige {MAXIMO_LOTE} como máximo por vez.</span>
        )}
      </p>
      <div className="flex flex-wrap gap-3">
        <Button variante="fantasma" onClick={onLimpiar}>
          Quitar selección
        </Button>
        <Button variante="secundario" disabled={ocupada || demasiadas} onClick={onBloquear}>
          Bloquear cambio de nombre
        </Button>
        <Button disabled={ocupada || demasiadas} cargando={ocupada} onClick={onPermitir}>
          Permitir cambio de nombre
        </Button>
      </div>
    </div>
  );
}
