import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import Header from "../components/Header.jsx";
import { Card } from "../components/ui/card.jsx";
import { Button } from "../components/ui/button.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { obtenerLecciones, guardarProgreso } from "../lib/api.js";

export default function Home() {
  const [lecciones, setLecciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [hayUsuario, setHayUsuario] = useState(false);
  const [guardadas, setGuardadas] = useState({});

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setHayUsuario(!!data.session);
    });

    obtenerLecciones()
      .then(setLecciones)
      .catch(() => setError("No se pudo conectar con el backend. Esta corriendo?"))
      .finally(() => setCargando(false));
  }, []);

  async function marcarCompletada(leccionId) {
    try {
      await guardarProgreso({ tipo: "leccion", contenido_id: leccionId, porcentaje: 100, completado: true });
      setGuardadas((prev) => ({ ...prev, [leccionId]: "ok" }));
    } catch (err) {
      setGuardadas((prev) => ({ ...prev, [leccionId]: "error" }));
    }
  }

  return (
    <div className="min-h-screen bg-ink">
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-8">
        <h2 className="font-display font-semibold text-paper text-xl mb-4">Lecciones</h2>

        {cargando && <p className="text-muted">Cargando lecciones...</p>}
        {error && <p className="text-danger text-sm">{error}</p>}

        <div className="flex flex-col gap-4">
          {lecciones.map((leccion) => (
            <Card key={leccion.id}>
              {/* El título ahora es un link a /leccion/:id */}
              <Link to={`/leccion/${leccion.id}`}>
                <h3 className="font-medium text-paper text-base mb-1 hover:text-accent transition-colors">
                  Leccion {leccion.numero}: {leccion.titulo}
                </h3>
              </Link>
              <p className="text-muted text-sm mb-2">{leccion.descripcion}</p>
              <p className="font-mono text-xs text-muted/70 mb-3">
                {leccion.nivel} - {leccion.duracion ?? "N/A"}
              </p>

              {hayUsuario ? (
                <div className="flex items-center gap-3">
                  <Button variant="success" onClick={() => marcarCompletada(leccion.id)}>
                    Marcar como completada
                  </Button>
                  {guardadas[leccion.id] === "ok" && (
                    <span className="flex items-center gap-1 text-success text-sm">
                      <Check size={16} aria-hidden="true" /> guardado
                    </span>
                  )}
                  {guardadas[leccion.id] === "error" && (
                    <span className="text-danger text-sm">no se pudo guardar</span>
                  )}
                </div>
              ) : (
                <p className="text-muted text-sm italic">Inicia sesion para guardar tu progreso</p>
              )}
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
