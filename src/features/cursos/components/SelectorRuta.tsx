import { useId } from "react";
import { Select } from "@/shared/ui";
import type { MiCurso } from "../api";

interface SelectorRutaProps {
  cursoId: number | null;
  cursos: MiCurso[];
  onElegir: (cursoId: number | null) => void;
}

/** "Ruta general" o la de un curso (HU-F-311). Sin cursos no aparece. */
export function SelectorRuta({ cursoId, cursos, onElegir }: SelectorRutaProps) {
  const id = useId();
  if (cursos.length === 0) return null;
  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className="text-sm text-muted">
        Ruta
      </label>
      <Select
        id={id}
        value={cursoId ?? ""}
        className="w-auto py-1"
        onChange={(e) => onElegir(e.target.value ? Number(e.target.value) : null)}
      >
        <option value="">Ruta general</option>
        {cursos.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </Select>
    </div>
  );
}
