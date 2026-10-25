import { useBusquedaDiferida } from "@/shared/hooks/useBusquedaDiferida";
import { Button, Field, Input, Select } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { useDocentesParaElegir } from "../hooks";
import type { FiltrosCursos as Filtros } from "../tipos";

interface FiltrosCursosProps {
  filtros: Filtros;
  hayFiltros: boolean;
  onCambiar: (cambios: Record<string, string | null>) => void;
  onQuitar: () => void;
}

/** Docente, estado y búsqueda (nombre del curso, del docente o código). Todo va a la URL. */
export function FiltrosCursos({ filtros, hayFiltros, onCambiar, onQuitar }: FiltrosCursosProps) {
  const [texto, setTexto] = useBusquedaDiferida(filtros.q, (q) => onCambiar({ q }));
  const docentes = useDocentesParaElegir().data?.data ?? [];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1.5fr_1fr_auto] lg:items-end">
      <Field etiqueta="Buscar" ayuda="Curso, docente o código.">
        {(campo) => (
          <Input
            {...campo}
            type="search"
            value={texto}
            maxLength={LIMITES.busqueda.max}
            autoComplete="off"
            onChange={(e) => setTexto(e.target.value)}
          />
        )}
      </Field>
      <Field etiqueta="Docente">
        {(campo) => (
          <Select
            {...campo}
            value={filtros.docente ?? ""}
            onChange={(e) => onCambiar({ docente: e.target.value || null })}
          >
            <option value="">Todos</option>
            {docentes.map((d) => (
              <option key={d.id} value={d.id}>
                {[d.nombre, d.apellido].filter(Boolean).join(" ")}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field etiqueta="Estado">
        {(campo) => (
          <Select
            {...campo}
            value={filtros.estado ?? ""}
            onChange={(e) => onCambiar({ estado: e.target.value || null })}
          >
            <option value="">Todos</option>
            <option value="activo">Activos</option>
            <option value="archivado">Archivados</option>
          </Select>
        )}
      </Field>
      {hayFiltros && (
        <Button variante="fantasma" onClick={onQuitar}>
          Quitar filtros
        </Button>
      )}
    </div>
  );
}
