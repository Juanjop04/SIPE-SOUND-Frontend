import { useEffect, useState } from "react";
import Header from "@/app/layouts/components/Header.jsx";
import { Card } from "@/shared/ui/Card.jsx";
import ChordDiagram from "@/shared/music/ChordDiagram.jsx";
import { obtenerAcordes } from "../api/acordesApi.js";

const DIFICULTAD_COLOR = {
  facil: "text-success",
  medio: "text-accent",
  dificil: "text-danger",
};

export default function Acordes() {
  const [acordes, setAcordes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerAcordes()
      .then(setAcordes)
      .catch(() => setError("No se pudo cargar el catalogo de acordes."))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="min-h-screen bg-ink">
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-8">
        <h2 className="mb-1 font-display text-xl font-semibold text-paper">Catalogo de acordes</h2>
        <p className="mb-6 text-sm text-muted">Todos los acordes disponibles en el curso.</p>

        {cargando && <p className="text-muted">Cargando...</p>}
        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {acordes.map((acorde) => (
            <Card key={acorde.id} className="border-l-0 text-center">
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
            </Card>
          ))}
        </div>

        {!cargando && acordes.length === 0 && !error && (
          <p className="text-sm text-muted">Todavia no hay acordes cargados.</p>
        )}
      </main>
    </div>
  );
}
