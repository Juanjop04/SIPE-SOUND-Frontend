import { useCallback, useId, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChordDiagram, TrasteDivider } from "@/shared/music";
import { EstadoVacio, MensajeError, Select, Skeleton } from "@/shared/ui";
import { PanelAcorde } from "../components/PanelAcorde";
import { useAcordes } from "../hooks/useAcordes";
import type { Acorde } from "../types";
import { agruparPorTipo } from "../utils/agrupar";

const DIFICULTADES = [
  { valor: "facil", etiqueta: "Fácil" },
  { valor: "medio", etiqueta: "Media" },
  { valor: "dificil", etiqueta: "Difícil" },
];

function Reticula({ acordes, onElegir }: { acordes: Acorde[]; onElegir: (a: Acorde) => void }) {
  return (
    <div className="flex flex-col gap-10">
      {agruparPorTipo(acordes).map((grupo, indice) => (
        <section key={grupo.tipo} aria-labelledby={`grupo-${grupo.tipo}`}>
          <TrasteDivider numero={indice + 1} />
          <h2 id={`grupo-${grupo.tipo}`} className="mt-3 font-mono text-sm uppercase text-muted">
            {grupo.titulo}
          </h2>
          <ul className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {grupo.acordes.map((acorde) => (
              <li key={acorde.id}>
                <button
                  type="button"
                  onClick={() => onElegir(acorde)}
                  className="flex w-full flex-col items-center gap-2 rounded-md py-2 transition-colors duration-rapida hover:bg-ink-2"
                >
                  {acorde.diagram ? (
                    <ChordDiagram {...acorde.diagram} />
                  ) : (
                    <span className="py-8 text-xs text-muted">Sin diagrama</span>
                  )}
                  <span className="font-mono text-sm text-paper">{acorde.nombre}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default function AcordesPage() {
  const idFiltro = useId();
  const [parametros, setParametros] = useSearchParams();
  const dificultad = parametros.get("dificultad") ?? "";
  const { data, isPending, error, refetch } = useAcordes();
  const [elegido, setElegido] = useState<Acorde | null>(null);
  const cerrar = useCallback(() => setElegido(null), []);
  const visibles = (data ?? []).filter((a) => !dificultad || a.dificultad === dificultad);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-paper">Acordes</h1>
          <p className="mt-2 text-sm text-muted">
            Toca un acorde para ver en qué lecciones aparece.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor={idFiltro} className="text-sm text-muted">
            Dificultad
          </label>
          <Select
            id={idFiltro}
            value={dificultad}
            className="w-40"
            onChange={(e) =>
              setParametros(e.target.value ? { dificultad: e.target.value } : {}, { replace: true })
            }
          >
            <option value="">Todas</option>
            {DIFICULTADES.map((d) => (
              <option key={d.valor} value={d.valor}>
                {d.etiqueta}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-8" aria-live="polite">
        {isPending && <Skeleton lineas={3} className="h-32 w-full" />}
        {error && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
        {data && visibles.length === 0 && (
          <EstadoVacio
            titulo="No hay acordes con esa dificultad."
            descripcion="Prueba con «Todas»."
          />
        )}
        {visibles.length > 0 && <Reticula acordes={visibles} onElegir={setElegido} />}
      </div>
      <PanelAcorde acorde={elegido} onCerrar={cerrar} />
    </main>
  );
}
