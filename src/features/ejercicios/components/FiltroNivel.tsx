import { useId } from "react";
import { Select } from "@/shared/ui";

const NIVELES = ["principiante", "intermedio", "avanzado"] as const;

interface FiltroNivelProps {
  valor: string;
  onCambiar: (nivel: string) => void;
}

/** Filtro por nivel; el valor vive en la URL (?nivel=), contrato 02 §5. */
export function FiltroNivel({ valor, onCambiar }: FiltroNivelProps) {
  const id = useId();
  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className="text-sm text-muted">
        Nivel
      </label>
      <Select id={id} value={valor} onChange={(e) => onCambiar(e.target.value)} className="w-44">
        <option value="">Todos</option>
        {NIVELES.map((nivel) => (
          <option key={nivel} value={nivel}>
            {nivel}
          </option>
        ))}
      </Select>
    </div>
  );
}
