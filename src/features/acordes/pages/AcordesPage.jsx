import { ChordDiagram } from "@/shared/music";
import { useAcordes } from "../hooks/useAcordes.js";

const DIFICULTAD_COLOR = {
  facil: "text-success",
  medio: "text-accent",
  dificil: "text-danger",
};

export default function Acordes() {
  const { data: acordes = [], isPending: cargando, error } = useAcordes();

  return (
    <main className="mx-auto max-w-2xl px-6 py-8">
      <h2 className="mb-1 font-display text-xl font-semibold text-paper">Catalogo de acordes</h2>
      <p className="mb-6 text-sm text-muted">Todos los acordes disponibles en el curso.</p>

      {cargando && <p className="text-muted">Cargando...</p>}
      {error && <p className="text-sm text-danger">{error.message}</p>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {acordes.map((acorde) => (
          <div key={acorde.id} className="rounded-caja bg-surface p-5 text-center">
            <p className="mb-2 font-display text-xl font-semibold text-paper">{acorde.nombre}</p>

            {acorde.diagram ? (
              <ChordDiagram {...acorde.diagram} />
            ) : (
              <p className="py-8 text-xs text-muted">Sin diagrama todavia</p>
            )}

            <p className="mt-2 font-mono text-xs text-muted">{acorde.tipo}</p>
            <p className={`mt-1 text-xs ${DIFICULTAD_COLOR[acorde.dificultad] ?? "text-muted"}`}>
              {acorde.dificultad}
            </p>
          </div>
        ))}
      </div>

      {!cargando && acordes.length === 0 && !error && (
        <p className="text-sm text-muted">Todavia no hay acordes cargados.</p>
      )}
    </main>
  );
}
