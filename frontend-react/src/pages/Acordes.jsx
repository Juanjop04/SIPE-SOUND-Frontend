import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import { Card } from "../components/ui/card.jsx";
import { obtenerAcordes } from "../lib/api.js";

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
      <main className="max-w-2xl mx-auto px-6 py-8">
        <h2 className="font-display font-semibold text-paper text-xl mb-1">Catalogo de acordes</h2>
        <p className="text-muted text-sm mb-6">Todos los acordes disponibles en el curso.</p>

        {cargando && <p className="text-muted">Cargando...</p>}
        {error && <p className="text-danger text-sm">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {acordes.map((acorde) => (
            <Card key={acorde.id} className="text-center border-l-0">
              <p className="font-display font-semibold text-paper text-xl">{acorde.nombre}</p>
              <p className="font-mono text-xs text-muted mt-1">{acorde.tipo}</p>
              <p className={`text-xs mt-1 ${DIFICULTAD_COLOR[acorde.dificultad] ?? "text-muted"}`}>
                {acorde.dificultad}
              </p>
              {acorde.descripcion && (
                <p className="text-muted text-xs mt-2">{acorde.descripcion}</p>
              )}
            </Card>
          ))}
        </div>

        {!cargando && acordes.length === 0 && !error && (
          <p className="text-muted text-sm">Todavia no hay acordes cargados.</p>
        )}
      </main>
    </div>
  );
}
