import { useState } from "react";
import { X } from "lucide-react";
import { ESCRITORIO, useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { Button, Drawer, Field, Select } from "@/shared/ui";
import { RANGO_POR_DEFECTO, RANGOS, type CursoProgreso, type FiltrosSeries } from "../tipos";

const GRUPOS = [
  { valor: "", etiqueta: "Todos" },
  { valor: "al_dia", etiqueta: "Al día" },
  { valor: "sin_actividad", etiqueta: "Sin actividad" },
  { valor: "en_riesgo", etiqueta: "Necesitan apoyo" },
];

type Cambiar = (cambios: Record<string, string | null>) => void;

interface BarraFiltrosProps {
  cursos: CursoProgreso[];
  filtros: FiltrosSeries;
  onCambiar: Cambiar;
}

function Controles({ cursos, filtros, onCambiar }: BarraFiltrosProps) {
  const elegido = cursos.find((c) => c.id === filtros.curso);
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Field etiqueta="Curso">
        {(campo) => (
          <Select
            {...campo}
            value={filtros.curso ?? ""}
            onChange={(e) => onCambiar({ curso: e.target.value || null })}
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
      <Field
        etiqueta="Bloque"
        ayuda={elegido ? undefined : "Elige un curso para filtrar por bloque."}
      >
        {(campo) => (
          <Select
            {...campo}
            disabled={!elegido}
            value={filtros.bloque ?? ""}
            onChange={(e) => onCambiar({ bloque: e.target.value || null })}
          >
            <option value="">Todos los bloques</option>
            {elegido?.bloques.map((b) => (
              <option key={b.bloque_id} value={b.bloque_id}>
                Bloque {b.numero} · {b.titulo}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field etiqueta="Rango">
        {(campo) => (
          <Select
            {...campo}
            value={filtros.dias}
            onChange={(e) => onCambiar({ dias: e.target.value })}
          >
            {RANGOS.map((r) => (
              <option key={r} value={r}>
                Últimos {r} días
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field etiqueta="Grupo">
        {(campo) => (
          <Select
            {...campo}
            value={filtros.grupo ?? ""}
            onChange={(e) => onCambiar({ grupo: e.target.value || null })}
          >
            {GRUPOS.map((g) => (
              <option key={g.valor} value={g.valor}>
                {g.etiqueta}
              </option>
            ))}
          </Select>
        )}
      </Field>
    </div>
  );
}

interface FichaDatos {
  clave: string;
  texto: string;
  quitar: Record<string, null>;
}

/** Un filtro activo como ficha con "×" para quitarlo. */
function Ficha({ texto, onQuitar }: { texto: string; onQuitar: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onQuitar}
        aria-label={`Quitar filtro: ${texto}`}
        className="inline-flex items-center gap-1.5 rounded-full border border-linea-fuerte bg-surface px-3 py-1 text-sm text-paper hover:border-accent"
      >
        {texto}
        <X aria-hidden="true" className="h-3.5 w-3.5 text-muted" />
      </button>
    </li>
  );
}

function fichasActivas({ cursos, filtros }: BarraFiltrosProps): FichaDatos[] {
  const elegido = cursos.find((c) => c.id === filtros.curso);
  const bloque = elegido?.bloques.find((b) => b.bloque_id === filtros.bloque);
  const grupo = GRUPOS.find((g) => g.valor !== "" && g.valor === filtros.grupo);
  const fichas: FichaDatos[] = [];
  if (elegido) fichas.push({ clave: "curso", texto: elegido.nombre, quitar: { curso: null } });
  if (filtros.bloque !== null) {
    const texto = `Bloque ${bloque?.numero ?? filtros.bloque}`;
    fichas.push({ clave: "bloque", texto, quitar: { bloque: null } });
  }
  if (filtros.dias !== RANGO_POR_DEFECTO) {
    fichas.push({ clave: "dias", texto: `Últimos ${filtros.dias} días`, quitar: { dias: null } });
  }
  if (grupo) fichas.push({ clave: "grupo", texto: grupo.etiqueta, quitar: { grupo: null } });
  return fichas;
}

function Fichas(props: BarraFiltrosProps) {
  const fichas = fichasActivas(props);
  if (fichas.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ul className="flex flex-wrap gap-2" aria-label="Filtros activos">
        {fichas.map((f) => (
          <Ficha key={f.clave} texto={f.texto} onQuitar={() => props.onCambiar(f.quitar)} />
        ))}
      </ul>
      <Button
        variante="fantasma"
        tamano="sm"
        onClick={() => props.onCambiar({ curso: null, bloque: null, dias: null, grupo: null })}
      >
        Quitar filtros
      </Button>
    </div>
  );
}

/**
 * Barra única de filtros (curso, bloque, rango y grupo), todos en la URL. En móvil los
 * controles van en un Drawer; las fichas con los filtros activos quedan siempre a la vista.
 */
export function BarraFiltros(props: BarraFiltrosProps) {
  const ancha = useMediaQuery(ESCRITORIO);
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      {ancha ? (
        <Controles {...props} />
      ) : (
        <div>
          <Button variante="secundario" onClick={() => setAbierto(true)}>
            Filtros
          </Button>
          <Drawer abierto={abierto} onCerrar={() => setAbierto(false)} titulo="Filtros">
            <Controles {...props} />
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setAbierto(false)}>Ver resultados</Button>
            </div>
          </Drawer>
        </div>
      )}
      <Fichas {...props} />
    </div>
  );
}
