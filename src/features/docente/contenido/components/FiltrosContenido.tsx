import { useId, useState } from "react";
import { Input, Select } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { useBloques } from "../api";
import type { TipoContenido } from "../tipos";

interface FiltrosContenidoProps {
  tipo: TipoContenido;
  valores: { estado: string; bloque: string; q: string };
  /** Cambia un parámetro de la URL (y vuelve a la página 1). */
  onCambiar: (clave: "estado" | "bloque" | "q", valor: string) => void;
}

const ESTADOS = ["borrador", "publicado", "archivado"];

/** Estado, bloque (solo lecciones) y búsqueda; todo vive en la URL (contrato 02 §5). */
export function FiltrosContenido({ tipo, valores, onCambiar }: FiltrosContenidoProps) {
  const id = useId();
  const bloques = useBloques();
  const [busqueda, setBusqueda] = useState(valores.q);

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor={`${id}-estado`} className="text-xs text-muted">
          Estado
        </label>
        <Select
          id={`${id}-estado`}
          value={valores.estado}
          onChange={(e) => onCambiar("estado", e.target.value)}
          className="w-40"
        >
          <option value="">Todos</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </Select>
      </div>
      {tipo === "lecciones" && (
        <div className="flex flex-col gap-1">
          <label htmlFor={`${id}-bloque`} className="text-xs text-muted">
            Bloque
          </label>
          <Select
            id={`${id}-bloque`}
            value={valores.bloque}
            onChange={(e) => onCambiar("bloque", e.target.value)}
            className="w-56"
          >
            <option value="">Todos</option>
            {(bloques.data ?? []).map((b) => (
              <option key={b.id} value={b.id}>
                {b.numero}. {b.titulo}
              </option>
            ))}
          </Select>
        </div>
      )}
      <form
        role="search"
        className="flex flex-col gap-1"
        onSubmit={(e) => {
          e.preventDefault();
          onCambiar("q", busqueda.trim());
        }}
      >
        <label htmlFor={`${id}-q`} className="text-xs text-muted">
          Buscar (Enter)
        </label>
        <Input
          id={`${id}-q`}
          type="search"
          maxLength={LIMITES.busqueda.max}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-56"
        />
      </form>
    </div>
  );
}
