import { useLecciones } from "@/features/lecciones";
import { useBusquedaDiferida } from "@/shared/hooks/useBusquedaDiferida";
import { Button, Field, Input, Select } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { ORDENES, type FiltrosEjercicios } from "../utils/tarjetas";

const NIVELES = ["principiante", "intermedio", "avanzado"] as const;

interface BarraDeFiltrosProps {
  filtros: FiltrosEjercicios;
  acordes: string[];
  /** Con sesión el orden "Último registro" tiene sentido; sin ella no hay registros. */
  conSesion: boolean;
  hayFiltros: boolean;
  onCambiar: (cambios: Record<string, string | null>) => void;
  onQuitar: () => void;
}

function SelectoresDeCatalogo({
  filtros,
  acordes,
  onCambiar,
}: Pick<BarraDeFiltrosProps, "filtros" | "acordes" | "onCambiar">) {
  const { data: lecciones } = useLecciones();
  return (
    <>
      <Field etiqueta="Nivel">
        {(c) => (
          <Select
            {...c}
            value={filtros.nivel}
            onChange={(e) => onCambiar({ nivel: e.target.value })}
          >
            <option value="">Todos</option>
            {NIVELES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field etiqueta="Lección">
        {(c) => (
          <Select
            {...c}
            value={filtros.leccion}
            onChange={(e) => onCambiar({ leccion: e.target.value })}
          >
            <option value="">Todas</option>
            {(lecciones ?? []).map((l) => (
              <option key={l.id} value={l.id}>
                {String(l.numero).padStart(2, "0")} · {l.titulo}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field etiqueta="Acorde">
        {(c) => (
          <Select
            {...c}
            value={filtros.acorde}
            onChange={(e) => onCambiar({ acorde: e.target.value })}
          >
            <option value="">Todos</option>
            {acordes.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>
        )}
      </Field>
    </>
  );
}

/** Búsqueda por nombre, nivel, lección, acorde y orden (todo en la URL). */
export function BarraDeFiltros({
  filtros,
  acordes,
  conSesion,
  hayFiltros,
  onCambiar,
  onQuitar,
}: BarraDeFiltrosProps) {
  const [texto, setTexto] = useBusquedaDiferida(filtros.q || undefined, (q) => onCambiar({ q }));
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1.5fr_1fr_1fr_auto] lg:items-end">
      <Field etiqueta="Buscar por nombre">
        {(c) => (
          <Input
            {...c}
            type="search"
            value={texto}
            maxLength={LIMITES.busqueda.max}
            autoComplete="off"
            onChange={(e) => setTexto(e.target.value)}
          />
        )}
      </Field>
      <SelectoresDeCatalogo filtros={filtros} acordes={acordes} onCambiar={onCambiar} />
      <Field etiqueta="Ordenar por">
        {(c) => (
          <Select
            {...c}
            value={filtros.orden}
            onChange={(e) =>
              onCambiar({ orden: e.target.value === "recomendado" ? null : e.target.value })
            }
          >
            {ORDENES.filter((o) => conSesion || o.valor !== "ultimo").map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.etiqueta}
              </option>
            ))}
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
