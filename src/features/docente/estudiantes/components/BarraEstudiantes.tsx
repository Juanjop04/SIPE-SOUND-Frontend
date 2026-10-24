import { useEffect, useId, useState } from "react";
import { Button, Input, Select } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import type { OrdenEstudiantes } from "../tipos";
import { ORDENES } from "../utils";

const ESPERA_MS = 300;

interface BarraEstudiantesProps {
  busqueda: string;
  orden: OrdenEstudiantes;
  total: number | null;
  onBuscar: (q: string) => void;
  onOrdenar: (orden: OrdenEstudiantes) => void;
  onExportar: () => void;
}

/** Buscador (con una espera corta antes de ir a la URL), orden, conteo y exportar CSV. */
export function BarraEstudiantes(props: BarraEstudiantesProps) {
  const { busqueda, orden, total, onBuscar, onOrdenar, onExportar } = props;
  const id = useId();
  const [texto, setTexto] = useState(busqueda);

  useEffect(() => {
    if (texto.trim() === busqueda) return undefined;
    const espera = window.setTimeout(() => onBuscar(texto.trim()), ESPERA_MS);
    return () => window.clearTimeout(espera);
  }, [texto, busqueda, onBuscar]);

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex min-w-[14rem] flex-1 flex-col gap-1">
        <label htmlFor={`${id}-q`} className="text-sm text-muted">
          Buscar
        </label>
        <Input
          id={`${id}-q`}
          type="search"
          value={texto}
          maxLength={LIMITES.busqueda.max}
          placeholder="Nombre o correo"
          onChange={(e) => setTexto(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={`${id}-orden`} className="text-sm text-muted">
          Ordenar por
        </label>
        <Select
          id={`${id}-orden`}
          value={orden}
          onChange={(e) => onOrdenar(e.target.value as OrdenEstudiantes)}
        >
          {ORDENES.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.etiqueta}
            </option>
          ))}
        </Select>
      </div>
      <Button variante="secundario" onClick={onExportar} disabled={!total}>
        Exportar CSV
      </Button>
      {total !== null && (
        <p aria-live="polite" className="w-full font-mono text-sm text-muted">
          {total} {total === 1 ? "estudiante" : "estudiantes"}
        </p>
      )}
    </div>
  );
}
