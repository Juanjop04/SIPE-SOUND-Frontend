import { Button, Select } from "@/shared/ui";
import type { RolCuenta } from "../tipos";

/** Máximo de cuentas por petición en lote (HU-B-407). */
export const MAXIMO_LOTE = 100;

interface BarraLoteProps {
  cantidad: number;
  ocupada: boolean;
  onRol: (rol: RolCuenta) => void;
  onActivar: () => void;
  onSuspender: () => void;
  onReenviar: () => void;
  onLimpiar: () => void;
}

/** Sobre la tabla al elegir cuentas: cambiar rol, activar, suspender o reenviar el código. */
export function BarraLote({
  cantidad,
  ocupada,
  onRol,
  onActivar,
  onSuspender,
  onReenviar,
  onLimpiar,
}: BarraLoteProps) {
  const demasiadas = cantidad > MAXIMO_LOTE;
  const bloqueada = ocupada || demasiadas;
  return (
    <div
      role="toolbar"
      aria-label="Acciones para las cuentas elegidas"
      className="flex flex-wrap items-center gap-2.5 border-b border-linea bg-primary/10 px-4 py-3"
    >
      <p className="text-sm font-semibold text-paper">
        <span className="font-mono tabular-nums">{cantidad}</span> seleccionadas
        {demasiadas && (
          <span className="font-normal text-peligro-texto">
            {" "}
            · Elige {MAXIMO_LOTE} como máximo por vez.
          </span>
        )}
      </p>
      <Select
        value=""
        disabled={bloqueada}
        aria-label="Cambiar rol de las cuentas seleccionadas"
        onChange={(e) => e.target.value && onRol(e.target.value as RolCuenta)}
        className="h-9 w-44 py-0"
      >
        <option value="">Cambiar rol a…</option>
        <option value="estudiante">Estudiante</option>
        <option value="docente">Docente</option>
        <option value="admin">Administrador</option>
      </Select>
      <Button variante="fantasma" tamano="sm" disabled={bloqueada} onClick={onActivar}>
        Activar
      </Button>
      <Button variante="fantasma" tamano="sm" disabled={bloqueada} onClick={onSuspender}>
        Suspender
      </Button>
      <Button variante="fantasma" tamano="sm" disabled={bloqueada} onClick={onReenviar}>
        Reenviar código
      </Button>
      <Button variante="fantasma" tamano="sm" className="ml-auto" onClick={onLimpiar}>
        Quitar selección
      </Button>
    </div>
  );
}
