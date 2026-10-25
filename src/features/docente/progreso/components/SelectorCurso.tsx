import { Field, Select } from "@/shared/ui";
import type { CursoProgreso } from "../tipos";

/** Curso en la URL (?curso=); sin elegir, la vista de todos los cursos activos. */
export function SelectorCurso({
  cursos,
  valor,
  onCambiar,
}: {
  cursos: CursoProgreso[];
  valor: number | null;
  onCambiar: (curso: string | null) => void;
}) {
  return (
    <div className="max-w-sm">
      <Field etiqueta="Curso">
        {(campo) => (
          <Select
            {...campo}
            value={valor ?? ""}
            onChange={(e) => onCambiar(e.target.value || null)}
          >
            <option value="">Todos mis cursos activos</option>
            {cursos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </Select>
        )}
      </Field>
    </div>
  );
}
